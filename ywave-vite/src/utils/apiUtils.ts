// URL 파라미터 생성 유틸리티
export const createSearchParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });
  return searchParams.toString();
};

// API 에러 메시지 생성
export const createApiErrorMessage = (operation: string, error: unknown): string => {
  if (error instanceof Error) {
    return `${operation} 실패: ${error.message}`;
  }
  return `${operation} 실패`;
};

// API 상태 초기값
export const createInitialApiState = <T>(): { data: T | null; loading: boolean; error: string | null } => ({
  data: null,
  loading: false,
  error: null,
});

// API 상태 업데이트 헬퍼
export const updateApiState = {
  start: <T>(prevState: { data: T | null; loading: boolean; error: string | null }) => ({
    ...prevState,
    loading: true,
    error: null,
  }),
  
  success: <T>(data: T) => ({
    data,
    loading: false,
    error: null,
  }),
  
  error: <T>(error: string) => ({
    data: null,
    loading: false,
    error,
  }),
};
