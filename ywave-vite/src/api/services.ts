import apiClient from './client';
import {
  SignUpRequest,
  SignUpResponse,
  LoginRequest,
  LoginResponse,
  EmailDuplicateRequest,
  EmailDuplicateResponse,
  PopularStoreDto,
  NearbyStoreDto,
  PlaceDetailsDto,
  EchoRequest,
} from './types';
import { createSearchParams } from '../utils/apiUtils';

// 사용자 관련 API
export const userApi = {
  // 회원가입
  signup: async (data: SignUpRequest): Promise<SignUpResponse> => {
    return apiClient.post<SignUpResponse>('/api/v1/signup', data);
  },

  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/api/v1/login', data);
    // 로그인 성공 시 토큰 저장
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      localStorage.setItem('accessToken', response.accessToken);
    }
    return response;
  },

  // 이메일 중복 확인
  checkEmailDuplicate: async (data: EmailDuplicateRequest): Promise<EmailDuplicateResponse> => {
    return apiClient.post<EmailDuplicateResponse>('/api/v1/duplicate/email', data);
  },

  // 로그아웃
  logout: () => {
    apiClient.clearToken();
    localStorage.removeItem('accessToken');
  },

  // 토큰 복원 (앱 시작 시)
  restoreToken: () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      apiClient.setToken(token);
    }
  },
};

// 가맹점 관련 API
export const storeApi = {
  // 인기 가맹점 조회
  getPopularStores: async (params: {
    lng: number;
    lat: number;
    radius?: number;
    limit?: number;
    categories?: string;
    q?: string;
  }): Promise<PopularStoreDto[]> => {
    const searchParams = createSearchParams(params);
    return apiClient.get<PopularStoreDto[]>(`/api/v1/stores/popular?${searchParams}`);
  },

  // 주변 가맹점 조회
  getNearbyStores: async (params: {
    lng: number;
    lat: number;
    radius?: number;
    limit?: number;
    q?: string;
  }): Promise<NearbyStoreDto[]> => {
    const searchParams = createSearchParams(params);
    return apiClient.get<NearbyStoreDto[]>(`/api/v1/stores/nearby?${searchParams}`);
  },

  // 가맹점 상세 정보 조회 (storeId)
  getStoreDetails: async (storeId: number): Promise<PlaceDetailsDto> => {
    return apiClient.get<PlaceDetailsDto>(`/api/v1/stores/${storeId}/details`);
  },

  // 가맹점 상세 정보 조회 (placeId)
  getPlaceDetails: async (placeId: string): Promise<PlaceDetailsDto> => {
    return apiClient.get<PlaceDetailsDto>(`/api/v1/places/${placeId}/details`);
  },
};

// AI 관련 API
export const aiApi = {
  // ChatGPT 연결 테스트
  echo: async (data: EchoRequest): Promise<any> => {
    return apiClient.post('/api/v1/ai/echo', data);
  },

  // AI 서버 상태 확인
  ping: async (): Promise<string> => {
    return apiClient.get<string>('/api/v1/ai/ping');
  },
};

// API 초기화 함수
export const initializeApi = () => {
  // 저장된 토큰 복원
  userApi.restoreToken();
  
  // API 서버 상태 확인
  aiApi.ping().catch(error => {
    console.warn('AI 서버 연결 실패:', error);
  });
};
