import { useState, useEffect, useCallback } from 'react';
import { BookmarkFolder, BookmarkPlace, CreateFolderRequest, UpdateFolderRequest, AddPlaceToFolderRequest } from '../types/bookmark';

const STORAGE_KEY = 'ywave_bookmarks';

export const useBookmark = () => {
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [places, setPlaces] = useState<BookmarkPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 로컬 스토리지에서 데이터 로드
  const loadFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setFolders(data.folders || []);
        setPlaces(data.places || []);
      }
    } catch (error) {
      console.error('북마크 데이터 로드 실패:', error);
    }
  }, []);

  // 로컬 스토리지에 데이터 저장
  const saveToStorage = useCallback((newFolders: BookmarkFolder[], newPlaces: BookmarkPlace[]) => {
    try {
      const data = {
        folders: newFolders,
        places: newPlaces,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('북마크 데이터 저장 실패:', error);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // 폴더 생성
  const createFolder = useCallback((request: CreateFolderRequest): BookmarkFolder => {
    const newFolder: BookmarkFolder = {
      id: Date.now().toString(),
      unicode: request.unicode,
      title: request.title,
      placeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const newFolders = [...folders, newFolder];
    setFolders(newFolders);
    saveToStorage(newFolders, places);
    
    return newFolder;
  }, [folders, places, saveToStorage]);

  // 폴더 수정
  const updateFolder = useCallback((request: UpdateFolderRequest): BookmarkFolder | null => {
    const folderIndex = folders.findIndex(f => f.id === request.id);
    if (folderIndex === -1) return null;

    const updatedFolder: BookmarkFolder = {
      ...folders[folderIndex],
      ...(request.title && { title: request.title }),
      ...(request.unicode && { unicode: request.unicode }),
      updatedAt: new Date()
    };

    const newFolders = [...folders];
    newFolders[folderIndex] = updatedFolder;
    setFolders(newFolders);
    saveToStorage(newFolders, places);
    
    return updatedFolder;
  }, [folders, places, saveToStorage]);

  // 폴더 삭제
  const deleteFolder = useCallback((folderId: string): boolean => {
    const newFolders = folders.filter(f => f.id !== folderId);
    const newPlaces = places.filter(p => p.folderId !== folderId);
    
    setFolders(newFolders);
    setPlaces(newPlaces);
    saveToStorage(newFolders, newPlaces);
    
    return true;
  }, [folders, places, saveToStorage]);

  // 폴더에 장소 추가
  const addPlaceToFolder = useCallback((request: AddPlaceToFolderRequest): BookmarkPlace => {
    const newPlace: BookmarkPlace = {
      id: Date.now().toString(),
      folderId: request.folderId,
      placeId: request.placeId,
      name: request.name,
      address: request.address,
      lat: request.lat,
      lng: request.lng,
      category: request.category,
      addedAt: new Date()
    };

    const newPlaces = [...places, newPlace];
    setPlaces(newPlaces);
    
    // 폴더의 장소 수 업데이트
    const newFolders = folders.map(folder => 
      folder.id === request.folderId 
        ? { ...folder, placeCount: folder.placeCount + 1, updatedAt: new Date() }
        : folder
    );
    setFolders(newFolders);
    
    saveToStorage(newFolders, newPlaces);
    
    return newPlace;
  }, [folders, places, saveToStorage]);

  // 폴더에서 장소 제거
  const removePlaceFromFolder = useCallback((placeId: string): boolean => {
    const place = places.find(p => p.id === placeId);
    if (!place) return false;

    const newPlaces = places.filter(p => p.id !== placeId);
    setPlaces(newPlaces);
    
    // 폴더의 장소 수 업데이트
    const newFolders = folders.map(folder => 
      folder.id === place.folderId 
        ? { ...folder, placeCount: Math.max(0, folder.placeCount - 1), updatedAt: new Date() }
        : folder
    );
    setFolders(newFolders);
    
    saveToStorage(newFolders, newPlaces);
    
    return true;
  }, [folders, places, saveToStorage]);

  // 특정 폴더의 장소들 가져오기
  const getPlacesByFolder = useCallback((folderId: string): BookmarkPlace[] => {
    return places.filter(p => p.folderId === folderId);
  }, [places]);

  // 특정 폴더 가져오기
  const getFolderById = useCallback((folderId: string): BookmarkFolder | undefined => {
    return folders.find(f => f.id === folderId);
  }, [folders]);

  return {
    folders,
    places,
    isLoading,
    createFolder,
    updateFolder,
    deleteFolder,
    addPlaceToFolder,
    removePlaceFromFolder,
    getPlacesByFolder,
    getFolderById,
    loadFromStorage
  };
};
