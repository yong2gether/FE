import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TitleLogo from "../../Images/TitleLogo2.svg";
import { placeDatas } from "../../Data/PlaceDatas";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import RecommendBox from "../../Components/RecommendBox";
import SmallPlaceBox from "../../Components/PlaceBox/SmallPlaceBox";
import { useStoreApi } from "../../hooks/useApi";
import { PopularStoreDto } from "../../api/types";

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
  gap: 7px;
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

export default function Main(): React.JSX.Element {
  const navigate = useNavigate();
  const { getPopularStores } = useStoreApi();
  
  const [isRecommend, setIsRecommend] = useState<boolean>(false);
  const [start, setStart] = useState<number>(0);
  const [popularStores, setPopularStores] = useState<PopularStoreDto[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const VISIBLE = 2;
  const total = placeDatas.length;
  const nick = "닉네임";

  // 사용자 현재 위치 가져오기 (Google Geolocation API 사용)
  const getUserLocation = async () => {
    try {
      // Google Geolocation API 사용
      const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          considerIp: true,
          wifiAccessPoints: [],
          cellTowers: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        const { lat, lng } = data.location;
        setUserLocation({ lat, lng });
      } else {
        // Google API 실패 시 브라우저 geolocation으로 대체
        requestBrowserLocation();
      }
    } catch (error) {
      // Google API 에러 시 브라우저 geolocation으로 대체
      requestBrowserLocation();
    }
  };

  // 브라우저 geolocation으로 위치 요청 (백업)
  const requestBrowserLocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5분
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('📍 위치 정보를 가져올 수 없습니다:', error.message);
        },
        options
      );
    }
  };

  useEffect(() => {
    setIsRecommend(true);
    getUserLocation();
  }, []);

  // 사용자 위치가 변경될 때마다 인기 가게 목록 재조회
  useEffect(() => {
    if (userLocation) {
      fetchPopularStores();
    }
  }, [userLocation]);

  const fetchPopularStores = async () => {
    if (!userLocation) return;
    
    try {
      setIsLoadingPopular(true);
      const stores = await getPopularStores({
        lng: userLocation.lng,
        lat: userLocation.lat,
        radius: 2000, // 2km 반경
        limit: 30
      });
      setPopularStores(stores);
    } catch (error) {
      console.error('인기 가게 목록 조회 실패:', error);
    } finally {
      setIsLoadingPopular(false);
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
      <RecommendContainer>
        <TitleLogoImage src={TitleLogo} alt="Title Logo" />
        <TitleContainer>
          <Title className="Title__H3">오늘의 추천</Title>
          <TitleDetail className="Body__Large">
            {isRecommend ? (
              <>
                <>
                  {nick}님의 취향을 기반으로 <br />
                  AI가 장소를 추천해드려요
                </>
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
                  navigate(`/main/place/${place.id}`);
                }}
              />
            ))}
          </RecommendBoxContainer>
        )}
      </RecommendContainer>
      <Content>
        <ContentTitle className="Body__MediumLarge">
          요즘 처인구민들은 어디갈까? <br />
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
                industry={store.category}
                address={store.sigungu}
                images={[]} // API에서 이미지 정보가 없으므로 빈 배열
                bookmark={false}
                onClick={() => {
                  navigate(`/main/place/${store.id}`);
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
    </PageContainer>
  );
}
