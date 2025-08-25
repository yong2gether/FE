/**
 * 북마크 관련 타입 정의
 */

export interface BookmarkFolder {
  id: string;
  unicode: string; // 이모지 unified 코드
  title: string;
  placeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookmarkPlace {
  id: string;
  folderId: string;
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
  addedAt: Date;
}

export interface BookmarkData {
  folders: BookmarkFolder[];
  places: BookmarkPlace[];
}

// 북마크 폴더 생성 요청
export interface CreateFolderRequest {
  title: string;
  unicode: string;
}

// 북마크 폴더 수정 요청
export interface UpdateFolderRequest {
  id: string;
  title?: string;
  unicode?: string;
}

// 북마크 장소 추가 요청
export interface AddPlaceToFolderRequest {
  folderId: string;
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: string;
}
