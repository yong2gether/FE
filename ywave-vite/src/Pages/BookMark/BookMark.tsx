import React, { useState, useCallback, useMemo, useEffect } from "react";
import styled from "styled-components";
import BottomSheet from "../../Components/BottomSheet";
import { useNavigate, useLocation } from "react-router-dom";
import FolderList from "../../Components/BookMarkFolder/FolderList";
import PencilButton from "../../Components/Button/PencilButton";
import { useBookmarkApi } from "../../hooks/useApi";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { createEmojiMarker } from "../../utils/emojiToMarker";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const MapBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const BottomSheetContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-m);
  min-height: 100%;
  position: relative;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-1000);
  flex-shrink: 0;
`;

const defaultCenter = { lat: 37.5665, lng: 126.978 };

export default function BookMark(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { getBookmarkGroups, getGroupsState, deleteBookmarkGroup } =
    useBookmarkApi();

  // 폴더 목록 상태
  const [folders, setFolders] = useState<any[]>([]);
  const [allBookmarkPlaces, setAllBookmarkPlaces] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // 바텀 시트 상태
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(true);
  const [openMoreId, setOpenMoreId] = useState<string | null>(null);
  const [sheetRatio, setSheetRatio] = useState<number>(0);

  // Google Maps API 훅 사용
  const { isLoaded, loadError, apiKey } = useGoogleMaps();

  // 폴더 목록 조회
  const fetchBookmarkGroups = useCallback(async () => {
    try {
      console.log("북마크 그룹 조회 시작...");
      const response = await getBookmarkGroups();
      console.log("북마크 그룹 조회 응답:", response);

      if (response && response.groups) {
        console.log("폴더 개수:", response.groups.length);
        console.log("첫 번째 폴더 구조:", response.groups[0]);
        setFolders(response.groups);

        // 모든 북마크 장소 수집
        const allPlaces: any[] = [];
        response.groups.forEach((group: any) => {
          if (group.stores) {
            allPlaces.push(...group.stores);
          }
        });
        setAllBookmarkPlaces(allPlaces);
        console.log("전체 북마크 장소 개수:", allPlaces.length);
      } else {
        console.log("응답에 groups가 없음:", response);
        setFolders([]);
        setAllBookmarkPlaces([]);
      }
    } catch (error) {
      console.error("북마크 그룹 조회 실패:", error);
      setFolders([]);
      setAllBookmarkPlaces([]);
    }
  }, [getBookmarkGroups]);

  useEffect(() => {
    fetchBookmarkGroups();
  }, [fetchBookmarkGroups]);

  // 폴더 삭제
  const deleteFolder = useCallback(
    async (folderId: string | number | null) => {
      if (folderId === null || isDeleting) return;

      try {
        setIsDeleting(true);

        console.log("북마크 폴더 삭제 시작...");
        const response = await deleteBookmarkGroup({
          groupId: Number(folderId),
        });
        console.log("북마크 그룹 삭제 응답:", response);

        // 로컬 상태에서도 제거
        setFolders((prev) =>
          prev.filter(
            (folder) =>
              (folder.groupId?.toString() || folder.id?.toString()) !==
              folderId.toString()
          )
        );

        // 전체 북마크 장소에서도 해당 그룹의 장소들 제거
        setAllBookmarkPlaces((prev) =>
          prev.filter(
            (place) => place.groupId?.toString() !== folderId.toString()
          )
        );

        // More 메뉴 닫기
        setOpenMoreId(null);
      } catch (error) {
        console.error("북마크 그룹 삭제 실패:", error);
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteBookmarkGroup, isDeleting]
  );

  // 북마크 장소들을 지도에 표시할 데이터
  const bookmarkPlaces = useMemo(() => {
    if (!allBookmarkPlaces) return [];

    return allBookmarkPlaces.map((place) => ({
      id: place.id,
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      unicode: "1f4c1", // 기본 폴더 이모지
    }));
  }, [allBookmarkPlaces]);

  // 지도 중심점 계산
  const mapCenter = useMemo(() => {
    if (bookmarkPlaces.length === 0) return defaultCenter;

    // 모든 장소의 평균 위치 계산
    const avgLat =
      bookmarkPlaces.reduce((sum, place) => sum + place.lat, 0) /
      bookmarkPlaces.length;
    const avgLng =
      bookmarkPlaces.reduce((sum, place) => sum + place.lng, 0) /
      bookmarkPlaces.length;

    return { lat: avgLat, lng: avgLng };
  }, [bookmarkPlaces]);

  const handleMoreClick = useCallback((id: string | number | null): void => {
    if (id === null) return;
    setOpenMoreId((prev) => (prev === id.toString() ? null : id.toString()));
  }, []);

  const handleFolderClick = useCallback(
    (unicode: string, title: string): void => {
      navigate("/bookmark/detail", { state: { unicode, title } });
    },
    [navigate]
  );

  const handleFolderDelete = useCallback(
    (folderId: string): void => {
      if (window.confirm("정말로 이 폴더를 삭제하시겠습니까?")) {
        deleteFolder(folderId);
        setOpenMoreId(null);
      }
    },
    [deleteFolder]
  );

  const handleProgressChange = useCallback((ratio: number) => {
    setSheetRatio(ratio);
  }, []);

  // BookMarkAdd에서 돌아왔을 때 새로고침
  useEffect(() => {
    if (location.state?.refresh) {
      console.log("북마크 폴더 새로고침 시작");
      fetchBookmarkGroups();
      // 상태 초기화 (replace로 현재 URL의 state를 제거)
      navigate("/bookmark", { replace: true });
    }
  }, [location.state?.refresh, navigate, fetchBookmarkGroups]);

  return (
    <PageContainer>
      <MapBackground>
        <MapContainer>
          {isLoaded && !loadError && (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={mapCenter}
              zoom={12}
              options={{
                clickableIcons: false,
                disableDefaultUI: true,
                zoomControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }],
                  },
                  { featureType: "transit", stylers: [{ visibility: "off" }] },
                ],
              }}
            >
              {bookmarkPlaces.map((place) => (
                <Marker
                  key={place.id}
                  position={{ lat: place.lat, lng: place.lng }}
                  icon={createEmojiMarker(place.unicode, {
                    size: 40,
                    backgroundColor: "#ffffff",
                    borderColor: "#1976d2",
                    borderWidth: 3,
                  })}
                  title={place.name}
                />
              ))}
            </GoogleMap>
          )}
        </MapContainer>
      </MapBackground>

      <BottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        snapPoints={[0.25, 0.7, 0.95]}
        initialSnapIndex={0}
        bottomOffsetPx={0}
        showOverlay={false}
        dismissible={false}
        onProgressChange={handleProgressChange}
      >
        <BottomSheetContainer>
          <TitleContainer>
            <div className="Title__H2">즐겨찾기</div>
            <PencilButton
              buttonText="새 목록 추가하기"
              onClick={() => navigate("/bookmark/add")}
            />
          </TitleContainer>

          <FolderList
            folders={folders}
            openMoreId={openMoreId}
            onMoreClick={handleMoreClick}
            onFolderClick={handleFolderClick}
            onFolderDelete={handleFolderDelete}
          />
        </BottomSheetContainer>
      </BottomSheet>
    </PageContainer>
  );
}
