// 사용자 관련 타입
export interface SignUpRequest {
  email: string;
  password: string;
  nickname: string;
  photoUrl?: string;
  gpsAllowed: boolean;
}

export interface SignUpResponse {
  id: number;
  email: string;
  nickname: string;
  photoUrl?: string;
  gpsAllowed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresInMillis: number;
  user: UserInfo;
}

export interface UserInfo {
  email: string;
}

export interface EmailDuplicateRequest {
  email: string;
}

export interface EmailDuplicateResponse {
  message: string;
  duplicated: boolean;
}

// 가맹점 관련 타입
export interface PopularStoreDto {
  id: number;
  name: string;
  sigungu: string;
  lng: number;
  lat: number;
  distM: number;
  placeId: string | null;
  rating: number;
  userRatingsTotal: number;
  popularityScore: number;
  category: string;
}

export interface NearbyStoreDto {
  id: number;
  name: string;
  sigungu: string;
  lng: number;
  lat: number;
  distM: number;
  placeId: string;
  images?: string[]; // 이미지 필드 추가
  category?: string; // 카테고리 필드 추가
}

export interface PlaceDetailsDto {
  placeId: string;
  name: string;
  formattedAddress: string;
  internationalPhoneNumber?: string;
  lng: number;
  lat: number;
  website?: string;
  googleMapsUri?: string;
  rating?: number;
  weekdayText?: string[];
  photos?: Photo[];
  reviews?: Review[];
  reviewCount?: number;
}

export interface Photo {
  url: string;
  width: number;
  height: number;
}

export interface Review {
  authorName: string;
  rating: number;
  text: string;
  time: number;
}

// AI 관련 타입
export interface EchoRequest {
  prompt: string;
}


