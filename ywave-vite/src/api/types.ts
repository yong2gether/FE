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

export interface UpdateProfileRequest {
  nickname: string;
  password: string;
}

export interface UpdateProfileResponse {
  message: string;
  success?: boolean;
  nickname?: string;
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
  placeId: string;
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
  bookmarked?: boolean;
  category?: string;
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
  photos?: Photo[];
}

// 선호도 설정 관련 타입
export interface SetPreferredRegionRequest {
  sido: string;
  sigungu: string;
  dong?: string;
}

export interface RegionResponse {
  sido: string;
  sigungu: string;
  dong?: string;
  lat: number;
  lng: number;
}

export interface UpdatePreferredCategoriesRequest {
  categoryIds: number[];
}

export interface MessageResponse {
  message: string;
}

// 북마크 그룹 관련 타입
export interface CreateBookmarkGroupRequest {
  groupName: string;
  iconUrl: string;
}

export interface CreateBookmarkGroupResponse {
  message: string;
  group: CreatedBookmarkGroupDto;
}

export interface CreatedBookmarkGroupDto {
  groupId: number;
  groupName: string;
  iconUrl: string;
}

export interface UpdateBookmarkGroupRequest {
  groupName?: string;
  iconUrl?: string;
}

export interface UpdateBookmarkGroupResponse {
  message: string;
  group: UpdatedBookmarkGroupDto;
}

export interface UpdatedBookmarkGroupDto {
  groupId: number;
  groupName: string;
  iconUrl: string;
}

export interface BookmarkGroupDetailDto {
  groupId: number;
  groupName: string;
  isDefault: boolean;
  iconUrl: string;
  stores: BookmarkedStoreDto[];
}

export interface BookmarkedGroupsResponse {
  message: string;
  groups: BookmarkGroupDetailDto[];
}

export interface BookmarkedStoreDto {
  storeId: number;
  storeName: string;
  category: string;
  roadAddress: string;
  lat: number;
  lng: number;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  thumbnailUrl?: string;
}

export interface DeleteBookmarkGroupRequest {
  groupId: number;
}

export interface DeleteBookmarkGroupResponse {
  message: string;
  deletedGroupId: number;
}

export interface BookmarkGroupDto {
  groupId: number;
  groupName: string;
  iconUrl: string;
  isDefault: boolean;
  stores: number[];
}

export interface BookmarkedGroupResponse {
  message: string;
  group: BookmarkGroupDto;
}

// 리뷰 관련 타입
export interface ReviewItem {
  reviewId: number;
  storeId: number;
  storeName: string;
  content: string;
  rating: number;
  createdAt: string;
}

export interface UserReviewsResponse {
  message: string;
  reviews: ReviewItem[];
}

// AI 관련 타입
export interface EchoRequest {
  prompt: string;
}


