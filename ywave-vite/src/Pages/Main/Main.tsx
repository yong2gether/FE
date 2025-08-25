import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TitleLogo from "../../Images/TitleLogo2.svg";
import { placeDatas } from "../../Data/PlaceDatas";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useNavigate, NavigateFunction } from "react-router-dom";
import RecommendBox from "../../Components/RecommendBox";
import SmallPlaceBox from "../../Components/PlaceBox/SmallPlaceBox";
import { useStoreApi, usePreferenceApi, useUserApi } from "../../hooks/useApi";
import { PopularStoreDto } from "../../api/types";
import { getAuthToken } from "../../utils/authUtils";
import { convertCategoryCode } from "../../utils/categoryMapping";

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  box-sizing: border-box;
  gap: var(--spacing-3xl);
  user-select: none;
`;

const RecommendContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-m);
  padding: 24px 16px 16px 16px;
  border-radius: 0 0 30px 30px;
  box-shadow: 0px 6px 15px 0px rgba(0, 0, 0, 0.2);
  background: linear-gradient(
    140deg,
    rgba(171, 218, 255, 0.15) 0%,
    rgba(4, 143, 255, 0.15) 100%
  );
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-xs);
`;

const TitleLogoImage = styled.img`
  width: 135px;
`;

const Title = styled.div`
  color: var(--primary-blue-1000);
`;

const TitleDetail = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  color: var(--neutral-700);

  svg {
    cursor: pointer;
  }
`;

const IconContainer = styled.div<{ isHidden: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2xs);
  color: var(--neutral-1000);
  visibility: ${(props) => (props.isHidden ? "hidden" : "visible")};
`;

const RecommendBoxContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-m);
  padding: 16px;
  box-sizing: border-box;
`;

const PopularStoresContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);
`;

const ContentTitle = styled.div`
  align-self: flex-start;
  color: var(--neutral-800);

  span {
    color: var(--neutral-1000);
  }

  .Highlight {
    color: var(--primary-blue-500);
  }
`;

// 추천 섹션 컴포넌트
const RecommendSection = ({ 
  isRecommend, 
  nick, 
  total, 
  VISIBLE, 
 
  showPrev, 
  showNext, 
  visiblePlaces, 
  navigate 
}: {
  isRecommend: boolean;
  nick: string;
  total: number;
  VISIBLE: number;
  start: number;
  showPrev: () => void;
  showNext: () => void;
  visiblePlaces: any[];
  navigate: NavigateFunction;
}) => (
  <RecommendContainer>
    <TitleLogoImage src={TitleLogo} alt="Title Logo" />
    <TitleContainer>
      <Title className="Title__H3">오늘의 추천</Title>
      <TitleDetail className="Body__Large">
        {isRecommend ? (
          <>
            {nick}님의 취향을 기반으로 <br />
            AI가 장소를 추천해드려요
            <IconContainer isHidden={total <= VISIBLE}>
              <AiOutlineLeft onClick={showPrev} />
              <AiOutlineRight onClick={showNext} />
            </IconContainer>
          </>
        ) : (
          <>
            잠시만 기다려주세요 <br />
            Y:Wave가 열심히 좋아하실 <br />
            장소를 찾고 있어요!
          </>
        )}
      </TitleDetail>
    </TitleContainer>
    {isRecommend && (
      <RecommendBoxContainer>
        {visiblePlaces.map((place) => (
          <RecommendBox
            key={place.id}
            image={
              place.images?.[0] ||
              "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&h=300&fit=crop"
            }
            name={place.name}
            rating={place.rating}
            onClick={() => {
              navigate(`/main/place/${place.id}`, { state: { from: 'main' } });
            }}
          />
        ))}
      </RecommendBoxContainer>
    )}
  </RecommendContainer>
);

// 인기 가게 섹션 컴포넌트
const PopularStoresSection = ({ 
  userRegion, 
  isLoadingPopular, 
  popularStores, 
  navigate 
}: {
  userRegion: string;
  isLoadingPopular: boolean;
  popularStores: PopularStoreDto[];
  navigate: (path: string, state?: any) => void;
}) => (
  <Content>
    <ContentTitle className="Body__MediumLarge">
      요즘 {userRegion || '처인구'}민들은 어디갈까? <br />
      <span className="Title__H3">
        <span className="Highlight">실제로 많이 간 곳</span>만 모았어요
      </span>
    </ContentTitle>
    {isLoadingPopular ? (
      <div className="Body__Default" style={{ textAlign: 'center', color: 'var(--neutral-500)' }}>
        인기 가게를 불러오는 중...
      </div>
    ) : popularStores.length > 0 ? (
      <PopularStoresContainer>
        {popularStores.map((store) => (
          <SmallPlaceBox
            key={store.id}
            name={store.name}
            rating={store.rating}
            distance={`${Math.round(store.distM)}m`}
            industry={convertCategoryCode(store.category)}
            address={store.sigungu}
            images={(store as any).images || []}
            bookmark={false}
            storeId={store.id.toString()}
            onClick={() => {
              if (store.placeId) {
                navigate(`/main/place/${store.placeId}`, { 
                  state: { 
                    storeId: store.id,
                    placeId: store.placeId,
                    storeData: store,
                    from: 'main'
                  } 
                });
              } else {
                navigate(`/main/place/${store.id}`, { 
                  state: { 
                    storeId: store.id,
                    storeData: store,
                    from: 'main'
                  } 
                });
              }
            }}
          />
        ))}
      </PopularStoresContainer>
    ) : (
      <div className="Body__Default" style={{ textAlign: 'center', color: 'var(--neutral-500)' }}>
        인기 가게 정보를 불러올 수 없습니다.
      </div>
    )}
  </Content>
);

export default function Main(): React.JSX.Element {
  const navigate = useNavigate();
  const { getPopularStores, getRecommendations, getStoreDetails } = useStoreApi();
  const { getPreferredRegion } = usePreferenceApi();
  const { getProfile } = useUserApi();
  
  const [isRecommend, setIsRecommend] = useState<boolean>(false);
  const [start, setStart] = useState<number>(0);
  const [popularStores, setPopularStores] = useState<PopularStoreDto[]>([]);
  const [recommendedStores, setRecommendedStores] = useState<any[]>([]);
  const [isLoadingRecommend, setIsLoadingRecommend] = useState<boolean>(true);
  const [isLoadingPopular, setIsLoadingPopular] = useState<boolean>(true);
  const [nickname, setNickname] = useState<string>("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userRegion, setUserRegion] = useState<string>("");
  
  const VISIBLE = 2;
  const total = placeDatas.length;


  // 백엔드 API로 placeId 기반 상세 정보 가져오기
  const fetchPlaceDetailsByPlaceId = async (placeId: string) => {
    try {
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`https://ywave.site/api/v1/places/${placeId}/details`, {
        method: 'GET',
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error(`백엔드 placeId API 호출 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('백엔드 placeId API 호출 실패:', error);
    }
    return null;
  };

  useEffect(() => {
    setIsRecommend(true);
  }, []);

  // 프로필 조회하여 닉네임 가져오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setNickname(profile.nickname);
      } catch (error) {
        console.error("프로필 조회 실패:", error);
        setNickname("사용자");
      }
    };
    
    fetchProfile();
  }, [getProfile]);

  // 지역 설정 기반 기본 위치 설정
  useEffect(() => {
    const setDefaultLocationFromPreferences = async () => {
      try {
        const regionData = await getPreferredRegion();
        if (regionData && regionData.lat && regionData.lng) {
          setUserLocation({ lat: regionData.lat, lng: regionData.lng });
          
          // 지역명 설정 (시/도 시/구/군 동/읍/면)
          const regionString = `${regionData.sido} ${regionData.sigungu}${regionData.dong ? ` ${regionData.dong}` : ''}`;
          setUserRegion(regionString);
        }
      } catch (error) {
        console.log("지역 설정 조회 실패:", error);
      }
    };

    setDefaultLocationFromPreferences();
  }, [getPreferredRegion]);

  // 사용자 위치가 변경될 때마다 인기 가게 목록 재조회
  useEffect(() => {
    if (userLocation) {
      fetchPopularStores();
      fetchRecommendations();
    }
  }, [userLocation]);

  const fetchPopularStores = async () => {
    if (!userLocation) return;
    
    try {
      setIsLoadingPopular(true);
      const stores = await getPopularStores({
        lng: userLocation.lng,
        lat: userLocation.lat,
        radius: 2000,
        limit: 200
      });
      
      // placeId가 있는 가맹점들만 필터링
      const storesWithPlaceId = stores.filter(store => store.placeId);
      
      if (storesWithPlaceId.length > 0) {
        // placeId가 있는 가맹점들의 백엔드 API 상세 정보 가져오기
        const enhancedStores = await Promise.all(
          storesWithPlaceId.map(async (store) => {
            const placeDetails = await fetchPlaceDetailsByPlaceId(store.placeId!);
            if (placeDetails) {
              return {
                ...store,
                rating: placeDetails.rating || store.rating,
                userRatingsTotal: placeDetails.reviewCount || store.userRatingsTotal,
                images: placeDetails.photos ? placeDetails.photos.map((photo: any) => photo.url) : []
              };
            }
            return store;
          })
        );
        setPopularStores(enhancedStores);
      } else {
        setPopularStores([]);
      }
    } catch (error) {
      console.error('인기 가게 목록 조회 실패:', error);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  // 추천 API로 id 받아 상세 조회 후 메인 카드 구성
  const fetchRecommendations = async () => {
    try {
      setIsLoadingRecommend(true);
      const recs = await getRecommendations(5);
      // 각 추천 id로 상세 조회
      const detailed = await Promise.all(
        recs.map(async (r: any) => {
          const detail = await getStoreDetails(Number(r.id));
          return {
            id: r.id,
            name: detail.name || r.name,
            rating: detail.rating || 0,
            userRatingsTotal: detail.reviewCount || 0,
            images: detail.photos ? detail.photos.map((p: any) => p.url) : [],
            sigungu: r.sigungu || '',
            distM: 0,
            category: detail.category || '기타'
          } as any;
        })
      );
      setRecommendedStores(detailed);
    } catch (e) {
      console.error('추천 조회 실패:', e);
      setRecommendedStores([]);
    } finally {
      setIsLoadingRecommend(false);
    }
  };

  const showPrev = () => {
    if (total <= VISIBLE) return;
    setStart((prev) => (prev - VISIBLE + total) % total);
  };

  const showNext = () => {
    if (total <= VISIBLE) return;
    setStart((prev) => (prev + VISIBLE) % total);
  };

  const visiblePlaces = Array.from(
    { length: Math.min(VISIBLE, total) },
    (_, i) => placeDatas[(start + i) % total]
  );

  return (
    <PageContainer>
      <RecommendSection
        isRecommend={!isLoadingRecommend && recommendedStores.length > 0}
        nick={nickname}
        total={recommendedStores.length}
        VISIBLE={recommendedStores.length}
        start={start}
        showPrev={showPrev}
        showNext={showNext}
        visiblePlaces={recommendedStores}
        navigate={navigate}
      />
      <PopularStoresSection
        userRegion={userRegion}
        isLoadingPopular={isLoadingPopular}
        popularStores={popularStores}
        navigate={navigate}
      />
    </PageContainer>
  );
}
