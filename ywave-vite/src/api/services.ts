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
  SetPreferredRegionRequest,
  RegionResponse,
  UpdatePreferredCategoriesRequest,
  MessageResponse,
  CreateBookmarkGroupRequest,
  CreateBookmarkGroupResponse,
  UpdateBookmarkGroupRequest,
  UpdateBookmarkGroupResponse,
  DeleteBookmarkGroupRequest,
  DeleteBookmarkGroupResponse,
  BookmarkedGroupsResponse,
  UserReviewsResponse,
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

// 선호도 설정 관련 API
export const preferenceApi = {
  // 선호 지역 설정
  setPreferredRegion: async (data: SetPreferredRegionRequest): Promise<RegionResponse> => {
    return apiClient.post<RegionResponse>('/api/v1/preferences/regions', data);
  },

  // 선호 지역 조회
  getPreferredRegion: async (): Promise<RegionResponse> => {
    return apiClient.get<RegionResponse>('/api/v1/preferences/regions');
  },

  // 선호 카테고리 설정
  setPreferredCategories: async (data: UpdatePreferredCategoriesRequest): Promise<MessageResponse> => {
    return apiClient.post<MessageResponse>('/api/v1/preferences/categories', data);
  },

  // 선호 카테고리 조회
  getPreferredCategories: async (): Promise<string[]> => {
    return apiClient.get<string[]>('/api/v1/preferences/categories');
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
};

// 북마크 그룹 관련 API
export const bookmarkApi = {
  // 북마크 그룹 생성
  createBookmarkGroup: async (data: CreateBookmarkGroupRequest): Promise<CreateBookmarkGroupResponse> => {
    return apiClient.post<CreateBookmarkGroupResponse>('/api/v1/mypage/bookmarks/groups', data);
  },

  // 북마크 그룹 목록 조회
  getBookmarkGroups: async (): Promise<BookmarkedGroupsResponse> => {
    return apiClient.get<BookmarkedGroupsResponse>('/api/v1/mypage/bookmarks/groups');
  },

  // 북마크 그룹 수정
  updateBookmarkGroup: async (groupId: number, data: UpdateBookmarkGroupRequest): Promise<UpdateBookmarkGroupResponse> => {
    return apiClient.put<UpdateBookmarkGroupResponse>(`/api/v1/mypage/bookmarks/groups/${groupId}`, data);
  },

  // 북마크 그룹 삭제
  deleteBookmarkGroup: async (data: DeleteBookmarkGroupRequest): Promise<DeleteBookmarkGroupResponse> => {
    return apiClient.delete<DeleteBookmarkGroupResponse>('/api/v1/mypage/bookmarks/groups', data);
  },
};

// 리뷰 관련 API
export const reviewApi = {
  // 내가 쓴 리뷰 조회
  getMyReviews: async (): Promise<UserReviewsResponse> => {
    return apiClient.get<UserReviewsResponse>('/api/v1/mypage/reviews');
  },
};

// AI 관련 API
// API 초기화 함수
export const initializeApi = () => {
  // 저장된 토큰 복원
  userApi.restoreToken();
};