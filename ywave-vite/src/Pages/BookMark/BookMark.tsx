import React, { useState, useCallback, useMemo, useEffect } from "react";
import styled from "styled-components";
import BottomSheet from "../../Components/BottomSheet";
import { useNavigate, useLocation } from "react-router-dom";
import FolderList from "../../Components/BookMarkFolder/FolderList";
import PencilButton from "../../Components/Button/PencilButton";
import { useBookmarkApi } from "../../hooks/useApi";
import { useStoreApi } from "../../hooks/useApi";
import { GoogleMap} from "@react-google-maps/api";
import { useGoogleMaps } from "../../hooks/useGoogleMaps";
import MapList from "../../Components/MapList/MapList";

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
  const { getBookmarkGroups, deleteBookmarkGroup, deleteBookmark } = useBookmarkApi();
  const { getStoreDetails } = useStoreApi();

  // 폴더 목록 상태
  const [folders, setFolders] = useState<any[]>([]);
  const [allBookmarkPlaces, setAllBookmarkPlaces] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // 바텀 시트 상태
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(true);
  const [openMoreId, setOpenMoreId] = useState<string | null>(null);
  const [sheetRatio, setSheetRatio] = useState<number>(0);

  // 마커 상세정보 바텀시트 상태
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  // Google Maps API 훅 사용
  const { isLoaded, loadError } = useGoogleMaps();

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

        // 모든 북마크 장소 수집 (stores는 storeId 배열)
        const allPlaces: any[] = [];
        
        for (const group of response.groups) {
          if (group.stores && Array.isArray(group.stores)) {
            // 각 storeId에 대해 상세 정보 조회
            for (const storeId of group.stores) {
              try {
                const numericStoreId = Number(storeId);
                console.log(`Store ${numericStoreId} 상세 정보 조회 중...`);
                const storeDetail = await getStoreDetails(numericStoreId);
                if (storeDetail) {
                  allPlaces.push({
                    ...storeDetail,
                    groupId: group.groupId,
                    groupName: group.groupName,
                    iconUrl: group.iconUrl
                  });
                }
              } catch (error) {
                console.error(`Store ${storeId} 상세 정보 조회 실패:`, error);
                // 실패한 경우 기본 정보로 생성
                allPlaces.push({
                  id: storeId,
                  storeId: storeId,
                  name: `Store ${storeId}`,
                  lat: 37.5665,
                  lng: 126.978,
                  groupId: group.groupId,
                  groupName: group.groupName,
                  iconUrl: group.iconUrl
                });
              }
            }
          }
        }
        
        setAllBookmarkPlaces(allPlaces);
        console.log("전체 북마크 장소 개수:", allPlaces.length);
        console.log("생성된 장소 데이터:", allPlaces);
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
  }, [getBookmarkGroups, getStoreDetails]);

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

  const handleMoreClick = useCallback((id: string | number | null): void => {
    if (id === null) return;
    setOpenMoreId((prev) => (prev === id.toString() ? null : id.toString()));
  }, []);

  const handleFolderClick = useCallback(
    (id: string, unicode: string, title: string): void => {
      navigate("/bookmark/detail", { state: { id, unicode, title } });
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

  // 북마크 장소들을 지도에 표시할 데이터
  const bookmarkPlaces = useMemo(() => {
    if (!allBookmarkPlaces) return [];

    console.log("allBookmarkPlaces 원본 데이터:", allBookmarkPlaces);
    
    const mappedPlaces = allBookmarkPlaces.map((place) => {
      const sidNum = Number(place.storeId ?? place.id);
      return ({
      id: Number.isFinite(sidNum) ? String(sidNum) : (place.id?.toString?.() ?? ''),
      storeId: Number.isFinite(sidNum) ? sidNum : undefined,
      placeId: place.placeId,
      name: place.name || place.storeName || `Store ${place.storeId ?? place.id}`,
      address: place.roadAddress || place.formattedAddress || place.address || "",
      lat: place.lat || 37.5665,
      lng: place.lng || 126.978,
      unicode: place.iconUrl || "1f4c1",
      rating: place.rating ?? 0,
      images: (place.photos?.map((ph: any) => ph.url)) || (place.thumbnailUrl ? [place.thumbnailUrl] : []),
      groupId: place.groupId,
      groupName: place.groupName
    })});
    
    console.log("매핑된 bookmarkPlaces:", mappedPlaces);
    return mappedPlaces;
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

  // 마커 클릭 시 바로 상세 페이지로 이동 (북마크 컨텍스트)
  const handleMarkerClick = useCallback((place: any) => {
    console.log("마커 클릭됨:", place);
    const sid = (place.storeId ?? place.id);
    const sidStr = sid ? String(sid) : undefined;

    if (place.placeId) {
      navigate(`/main/place/${sidStr ?? '0'}`, {
        state: { from: 'bookmark', placeId: place.placeId }
      });
      return;
    }

    if (sidStr) {
      navigate(`/main/place/${sidStr}`, {
        state: { from: 'bookmark' }
      });
    }
  }, [navigate]);

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

      {/* 마커 상세정보 바텀시트 */}
      <BottomSheet
        isOpen={isDetailSheetOpen}
        onClose={() => setIsDetailSheetOpen(false)}
        snapPoints={[0.4, 0.7]}
        initialSnapIndex={0}
        bottomOffsetPx={0}
        showOverlay={true}
        dismissible={true}
      >
        <BottomSheetContainer>
          {selectedPlace && (
            <>
              <TitleContainer>
                <div className="Title__H2">{selectedPlace.name}</div>
              </TitleContainer>
              
              <MapList
                name={selectedPlace.name}
                bookmark={true}
                rating={selectedPlace.rating || 0}
                address={selectedPlace.formattedAddress || selectedPlace.address || "주소 정보 없음"}
                category={selectedPlace.category || "기타"}
                images={selectedPlace.photos?.map((photo: any) => photo.url) || []}
                distance="북마크된 장소"
                storeId={(selectedPlace.storeId ?? selectedPlace.id)?.toString()}
                placeId={selectedPlace.placeId}
                from={'bookmark'}
              />
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={() => {
                    const sid = (selectedPlace.storeId ?? selectedPlace.id)?.toString();
                    if (sid) {
                      navigate(`/main/place/${sid}`, {
                        state: { from: 'bookmark' }
                      });
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: 'var(--primary-blue-500)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  상세보기
                </button>
                <button
                  onClick={async () => {
                    const sid = (selectedPlace.storeId ?? selectedPlace.id);
                    if (sid) {
                      try {
                        await deleteBookmark(Number(sid));
                        alert("북마크가 삭제되었습니다.");
                        setIsDetailSheetOpen(false);
                        fetchBookmarkGroups();
                      } catch (error) {
                        console.error("북마크 삭제 실패:", error);
                        alert("북마크 삭제에 실패했습니다.");
                      }
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    backgroundColor: 'var(--neutral-200)',
                    color: 'var(--neutral-700)',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  북마크 삭제
                </button>
              </div>
            </>
          )}
        </BottomSheetContainer>
      </BottomSheet>
    </PageContainer>
  );
}
