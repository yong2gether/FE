const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private userId: number | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  setUserId(id: number) {
    this.userId = id;
  }

  clearToken() {
    this.token = null;
    this.userId = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Y-Wave-App/1.0',
      'Accept': 'application/json',
    };

    // X-USER-ID 헤더 추가 (필요한 API에서 사용)
    if (this.userId) {
      headers['X-USER-ID'] = this.userId.toString();
    }

    // options.headers가 있으면 추가
    if (options.headers) {
      if (Array.isArray(options.headers)) {
        // [string, string][] 형태인 경우
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        // Record<string, string> 형태인 경우
        Object.assign(headers, options.headers);
      }
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    // 재시도 로직 (최대 3번)
    const maxRetries = 3;
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 API 요청 시도 ${attempt}/${maxRetries}: ${endpoint}`);
        
        const response = await fetch(url, config);
        
        if (!response.ok) {
          // 403 오류일 때는 재시도
          if (response.status === 403 && attempt < maxRetries) {
            console.log(`⚠️ 403 오류 발생, ${attempt}초 후 재시도...`);
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            continue;
          }
          
          
          
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        console.log(`✅ API 요청 성공: ${endpoint}`);
        
        // 응답이 JSON이 아닐 수 있음
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          return await response.json();
        }
        
        return await response.text() as T;
      } catch (error) {
        lastError = error as Error;
        console.error(`❌ API 요청 실패 (시도 ${attempt}/${maxRetries}):`, error);
        
        // 마지막 시도가 아니면 잠시 대기 후 재시도
        if (attempt < maxRetries) {
          const delay = attempt * 1000; // 1초, 2초, 3초
          console.log(`⏳ ${delay}ms 후 재시도...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // 모든 재시도 실패
    console.error(`💥 모든 재시도 실패: ${endpoint}`);
    throw lastError;
  }

  // 토큰 만료 처리
  private handleTokenExpiration() {
    // 토큰 제거
    this.clearToken();
    
    // 로컬 스토리지에서도 토큰 제거
    localStorage.removeItem('accessToken');
    
    // 로그인 페이지로 리다이렉트 (현재 페이지가 로그인 페이지가 아닌 경우)
    if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
      console.log("🔄 로그인 페이지로 리다이렉트...");
      window.location.href = '/login';
    }
  }

  // GET 요청
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT 요청
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE 요청
  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
