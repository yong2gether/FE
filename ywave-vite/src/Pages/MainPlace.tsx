import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { PiBookmarkSimple, PiBookmarkSimpleFill } from "react-icons/pi";
import { placeDatas } from "../Data/PlaceDatas";
import { AiFillStar } from "react-icons/ai";
import ImageGallery from "../Components/ImageComponent/ImageGallery";
import ReviewSection from "../Components/Review/ReviewSection";
import ReviewWriteModal from "../Components/Review/ReviewWriteModal";
import CustomAlert from "../Components/Modal/CustomAlert";
import { useStoreApi, useBookmarkApi, usePreferenceApi } from "../hooks/useApi";
import { useReviewApi } from "../hooks/useApi";
import { calculateDistance, formatDistance } from "../utils/distance";
import { useGoogleMaps } from "../hooks/useGoogleMaps";
import { getAuthToken } from "../utils/authUtils";
import { convertCategoryCode } from "../utils/categoryMapping";
import BookmarkFolderSelectModal from "../Components/Modal/BookmarkFolderSelectModal";


const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  box-sizing: border-box;
  gap: var(--spacing-m);
  user-select: none;
`;

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 24px;
  margin-bottom: 16px;
`;

const BackIcon = styled(BiArrowBack)`
  color: var(--neutral-1000);
  width: 32px;
  height: 32px;
  cursor: pointer;
`;

const PlaceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-xs);
  margin-top: 0;
`;

const NameContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-1000);
  gap: var(--spacing-xs);

  & > svg {
    min-width: 24px;
    min-height: 24px;
    cursor: pointer;
    flex-shrink: 0;
  }
`;

const Name = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
  flex-shrink: 1;
  
  @media (max-width: 768px) {
    max-width: 220px;
  }
  
  @media (max-width: 480px) {
    max-width: 180px;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2xs);
  color: var(--neutral-800);
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Star = styled(AiFillStar)<{ isFill: boolean }>`
  width: 16px;
  height: 16px;
  color: ${({ isFill }) =>
    isFill ? "var(--primary-blue-500)" : "var(--neutral-200)"};
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-2xs);
  color: var(--neutral-800);
  flex-wrap: wrap;
`;


const LargeDivider = styled.div`
  width: calc(100% + 32px);
  height: 5px;
  background: var(--neutral-200);
`;

// 장소 기본 정보 컴포넌트
const PlaceBasicInfo = ({ 
  name, 
  rating, 
  distance, 
  industry, 
  address, 
  isBookmark, 
  onBookmarkClick, 
  renderStars 
}: {
  name: string;
  rating: number;
  distance: string;
  industry: string;
  address: string;
  isBookmark: boolean;
  onBookmarkClick: () => void;
  renderStars: () => React.ReactElement[];
}) => (
  <>
    <NameContainer>
      <Name className="Title__H2">{name}</Name>
      <div 
        onClick={onBookmarkClick}
        style={{
          cursor: 'pointer',
          color: isBookmark ? 'var(--primary-blue-500)' : 'var(--neutral-400)'
        }}
      >
        {isBookmark ? 
          <PiBookmarkSimpleFill style={{width: 24, height: 24}} /> : 
          <PiBookmarkSimple style={{width: 24, height: 24}} />
        }
      </div>
    </NameContainer>

    <RatingContainer>
      <div className="Body__Default">{rating}</div>
      <StarContainer>{renderStars()}</StarContainer>
    </RatingContainer>

    <InfoContainer className="Body__Default">
      {distance && <div>{distance}</div>}
      {distance && <div>|</div>}
      {industry && (
        <div style={{
          maxWidth: 140,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {industry}
        </div>
      )}
      {industry && <div>|</div>}
      <div style={{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '250px'
      }}>{address}</div>
    </InfoContainer>
  </>
);

// 추가 정보 컴포넌트
const AdditionalInfo = ({ 
  phoneNumber, 
  website, 
  weekdayText 
}: {
  phoneNumber: string;
  website: string;
  weekdayText: string[];
}) => {
  if (!phoneNumber && !website && weekdayText.length === 0) return null;
  
  return (
    <InfoContainer className="Body__Default" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--spacing-s)' }}>
      {phoneNumber && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2xs)' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--neutral-700)' }}>전화번호</span>
          <span>{phoneNumber}</span>
        </div>
      )}
      
      {website && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2xs)' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--neutral-700)' }}>🌐</span>
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'var(--primary-blue-500)', textDecoration: 'none' }}
          >
            {website}
          </a>
        </div>
      )}
      
      {weekdayText.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2xs)' }}>
          <span style={{ fontWeight: 'bold', color: 'var(--neutral-700)' }}>영업시간</span>
          {weekdayText.map((text, index) => (
            <div key={index} style={{ fontSize: '0.9em', color: 'var(--neutral-600)' }}>
              {text}
            </div>
          ))}
        </div>
      )}
    </InfoContainer>
  );
};

// 리뷰 섹션 컴포넌트
const ReviewSections = ({ 
  hasPlaceId, 
  userReviews, 
  googleReviews, 
  onReviewWrite, 
  isReviewModalOpen, 
  onReviewSubmit, 
  onCloseReviewModal, 
  placeName, 
  storeId
}: {
  hasPlaceId: boolean;
  userReviews: any[];
  googleReviews: any[];
  onReviewWrite: () => void;
  isReviewModalOpen: boolean;
  onReviewSubmit: (data: any) => void;
  onCloseReviewModal: () => void;
  placeName: string;
  storeId: number;
}) => (
  <>
    {/* 사용자 리뷰 섹션 - 데이터가 있을 때 표시, 작성 버튼은 storeId가 있을 때만 */}
    {userReviews.length > 0 && (
      <>
        <ReviewSection
          title="방문자 리뷰"
          description={
            <>
              해당 장소를 방문하셨나요?<br />
              방문인증을 통해 리뷰를 작성하세요!
            </>
          }
          reviews={userReviews}
          showWriteButton={storeId > 0}
          onWriteClick={onReviewWrite}
        />
        <LargeDivider />
      </>
    )}
    
    {/* 구글 방문자 리뷰 섹션 - Google 리뷰가 있을 때 표시 */}
    {googleReviews.length > 0 && (
      <>
        <ReviewSection
          title="구글 방문자 리뷰"
          description="조금 더 많은 리뷰가 보고 싶으시다면?"
          reviews={googleReviews}
        />
        <LargeDivider />
      </>
    )}

    {/* 리뷰 작성 모달 - storeId 기반일 때만 표시 */}
    {storeId > 0 && (
      <ReviewWriteModal
        isOpen={isReviewModalOpen}
        placeName={placeName}
        storeId={storeId}
        onClose={onCloseReviewModal}
        onSubmit={onReviewSubmit}
      />
    )}
  </>
);

interface MainPlaceProps {
  userLocation?: { lat: number; lng: number } | null;
}

export default function MainPlace({ userLocation: propUserLocation }: MainPlaceProps): React.JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const resolvedStoreId: number = (() => {
    const stateStoreId = (location.state as any)?.storeId;
    if (typeof stateStoreId === 'string' || typeof stateStoreId === 'number') {
      const n = Number(stateStoreId);
      if (!Number.isNaN(n) && n > 0) return n;
    }
    const routeId = id ? Number(id) : 0;
    return Number.isNaN(routeId) ? 0 : routeId;
  })();
  
  const { getStoreDetails, getPlaceDetailsByPlaceId } = useStoreApi();
  const { isLoaded, apiKey } = useGoogleMaps();

  const [name, setName] = useState<string>("");
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [distance, setDistance] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [weekdayText, setWeekdayText] = useState<string[]>([]);
  
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const [googleReviews, setGoogleReviews] = useState<any[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [visitVerificationStatus, setVisitVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  
  const [localUserLocation, setLocalUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const userLocation = propUserLocation || localUserLocation;
  const { getPreferredRegion } = usePreferenceApi();
  const { getMyReviews } = useReviewApi();
  const [preferredLocation, setPreferredLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState<boolean>(false);
  const { createBookmark, deleteBookmark, checkMyBookmarkedStores } = useBookmarkApi();

  // 리뷰 데이터 정규화: 다양한 응답 형태를 UI에서 요구하는 형태로 변환
  const normalizeReviews = (reviews: any[] = []): any[] => {
    return reviews.map((review: any, index: number) => {
      const rating = review.rating ?? review.score ?? 0;
      const nick = review.authorName || review.nickname || review.userNickname || "익명";
      const createdRaw = review.createdAt || review.time;
      let createdAt = "";
      if (typeof createdRaw === 'number') {
        const ts = createdRaw > 1e12 ? createdRaw : createdRaw * 1000;
        createdAt = new Date(ts).toLocaleDateString('ko-KR');
      } else if (typeof createdRaw === 'string') {
        const d = new Date(createdRaw);
        createdAt = isNaN(d.getTime()) ? "" : d.toLocaleDateString('ko-KR');
      }

      let images: string[] = [];
      if (Array.isArray(review.photos)) {
        images = review.photos.map((p: any) => (typeof p === 'string' ? p : p?.url)).filter(Boolean);
      } else if (Array.isArray(review.imgUrls)) {
        images = review.imgUrls.filter((u: any) => typeof u === 'string');
      } else if (Array.isArray(review.imageUrls)) {
        images = review.imageUrls.filter((u: any) => typeof u === 'string');
      }

      const reviewText = review.text || review.content || review.reviewText || "";

      return {
        id: (review.id ?? review.reviewId ?? index).toString(),
        rating,
        nick,
        createdAt,
        reviewText,
        images,
      };
    });
  };

  // 내 리뷰 중 해당 가맹점(storeId) 리뷰만 표시
  const refreshUserReviewsForStore = React.useCallback(async () => {
    if (!resolvedStoreId || resolvedStoreId <= 0) {
      setUserReviews([]);
      return;
    }
    try {
      const response = await getMyReviews();
      if (response && Array.isArray(response.reviews)) {
        const mine = response.reviews.filter((r: any) => Number(r.storeId) === Number(resolvedStoreId));
        setUserReviews(normalizeReviews(mine));
      } else {
        setUserReviews([]);
      }
    } catch (_) {
      setUserReviews([]);
    }
  }, [getMyReviews, resolvedStoreId]);

  // 백엔드 API로 placeId 기반 상세 정보 가져오기 (서비스 훅 사용)
  const fetchPlaceDetailsByPlaceId = async (placeId: string) => {
    try {
      const data = await getPlaceDetailsByPlaceId(placeId);
      return data;
    } catch (error) {
      console.error('placeId 상세 조회 실패:', error);
      return null;
    }
  };

  // placeId를 사용해서 Google Places API로 상세 정보 가져오기 (백업용)
  const fetchGooglePlaceDetails = async (placeId: string) => {
    if (!apiKey || !isLoaded) return null;
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_address,photos,geometry,types,reviews&key=${apiKey}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          return data.result;
        }
      }
    } catch (error) {
      console.error('Google Places API 호출 실패:', error);
    }
    return null;
  };

  // 사용자 현재 위치 가져오기 (Google Geolocation API 사용) - props가 없을 때만 실행
  const getUserLocation = async () => {
    if (propUserLocation) return;
    
    try {
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
        setLocalUserLocation({ lat, lng });
      } else {
        requestBrowserLocation();
      }
    } catch (error) {
      requestBrowserLocation();
    }
  };

  // 브라우저 geolocation으로 위치 요청 (백업) - props가 없을 때만 실행
  const requestBrowserLocation = () => {
    if (propUserLocation) return;
    
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('📍 위치 정보를 가져올 수 없습니다:', error.message);
        },
        options
      );
    }
  };

  useEffect(() => {
    if (!propUserLocation) {
      getUserLocation();
    }
  }, [propUserLocation]);

  // 선호 지역을 기준 위치로 불러옴 (배포 전 임시 정책)
  useEffect(() => {
    const loadPreferred = async () => {
      try {
        const pref = await getPreferredRegion();
        if (pref && pref.lat && pref.lng) {
          setPreferredLocation({ lat: pref.lat, lng: pref.lng });
        }
      } catch (e) {
        // ignore
      }
    };
    loadPreferred();
  }, [getPreferredRegion]);

  useEffect(() => {
    if (id) {
      const fetchPlaceDetails = async () => {
        try {
          // 디버깅을 위한 로그 추가
          console.log('MainPlace useEffect 실행');
          console.log('location.state:', location.state);
          console.log('id:', id);
          
          const rawPlaceId = (location.state as any)?.placeId as unknown;
          const hasValidPlaceId = typeof rawPlaceId === 'string' && rawPlaceId !== 'null' && rawPlaceId.length > 0;
          const fromBookmark = location.state?.from === 'bookmark';
          
          if (hasValidPlaceId) {
            const placeId = rawPlaceId as string;
            console.log('placeId로 데이터 조회 시작:', placeId);
            const backendPlaceDetails = await fetchPlaceDetailsByPlaceId(placeId);
            if (backendPlaceDetails) {
              console.log('백엔드 API 응답 성공:', backendPlaceDetails);
              console.log('가맹점 이름:', backendPlaceDetails.name);
              
              // 백엔드 API에서 받은 데이터로 설정
              setName(backendPlaceDetails.name || "");
              setRating(backendPlaceDetails.rating || 0);
              setDistance("");
              setIndustry(convertCategoryCode(backendPlaceDetails.category || "기타"));
              setAddress(backendPlaceDetails.formattedAddress || "");
              setImages(backendPlaceDetails.photos ? backendPlaceDetails.photos.map((photo: any) => photo.url) : []);
              setLat(backendPlaceDetails.lat || 0);
              setLng(backendPlaceDetails.lng || 0);
              
              setPhoneNumber(backendPlaceDetails.internationalPhoneNumber || "");
              setWebsite(backendPlaceDetails.website || "");
              setWeekdayText(backendPlaceDetails.weekdayText || []);
              
              if (backendPlaceDetails.reviews && backendPlaceDetails.reviews.length > 0) {
                const convertedReviews = normalizeReviews(backendPlaceDetails.reviews);
                setGoogleReviews(convertedReviews);
              } else {
                setGoogleReviews([]);
              }
              // 사용자 리뷰는 내 리뷰에서 필터링해 표시
              await refreshUserReviewsForStore();

              // 북마크 여부: 응답에 없으면 storeId로 일괄 체크
              if (typeof backendPlaceDetails.bookmarked === 'boolean') {
                setIsBookmark(backendPlaceDetails.bookmarked);
              } else if (resolvedStoreId && resolvedStoreId > 0) {
                try {
                  const chk = await checkMyBookmarkedStores([resolvedStoreId]);
                  setIsBookmark(Array.isArray(chk?.storeIds) && chk.storeIds.includes(resolvedStoreId));
                } catch (e) {
                  // ignore
                }
              }
            } else {
              // 백엔드 API 실패 시 Google Places API 사용 (백업)
              if (isLoaded && apiKey) {
                const googlePlaceDetails = await fetchGooglePlaceDetails(placeId);
                if (googlePlaceDetails) {
                  setName(googlePlaceDetails.name || "");
                  setRating(googlePlaceDetails.rating || 0);
                  setDistance("");
                  setIndustry("기타");
                  setAddress(googlePlaceDetails.formatted_address || "");
                  setImages(googlePlaceDetails.photos ? googlePlaceDetails.photos.map((photo: any) => 
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
                  ) : []);
                  setLat(googlePlaceDetails.geometry?.location?.lat || 0);
                  setLng(googlePlaceDetails.geometry?.location?.lng || 0);
                  setGoogleReviews([]);
                  await refreshUserReviewsForStore();
                  setPhoneNumber("");
                  setWebsite("");
                  setWeekdayText([]);

                  // 구글 경로에서도 북마크 여부는 storeId로 체크
                  if (resolvedStoreId && resolvedStoreId > 0) {
                    try {
                      const chk = await checkMyBookmarkedStores([resolvedStoreId]);
                      setIsBookmark(Array.isArray(chk?.storeIds) && chk.storeIds.includes(resolvedStoreId));
                    } catch (e) {
                      // ignore
                    }
                  }
                }
              }
            }
          } else {
            // storeId 기반으로 가맹점 정보 조회
          const placeDetails = await getStoreDetails(parseInt(id));
          if (placeDetails) {
            setName(placeDetails.name || "");
            setRating(placeDetails.rating || 0);
              setDistance("");
              setIndustry(convertCategoryCode(placeDetails.category || "기타"));
            setAddress(placeDetails.formattedAddress || "");
            setImages(placeDetails.photos ? placeDetails.photos.map((photo: any) => photo.url) : []);
            setLat(placeDetails.lat || 0);
            setLng(placeDetails.lng || 0);
              setPhoneNumber("");
              setWebsite("");
              setWeekdayText([]);
              
              // placeDetails.reviews는 구글 리뷰 스키마 → 구글 리뷰로 반영
              if (placeDetails.reviews && placeDetails.reviews.length > 0) {
                const convertedReviews = normalizeReviews(placeDetails.reviews);
                setGoogleReviews(convertedReviews);
              } else {
                setGoogleReviews([]);
              }
              // 사용자 리뷰는 내 리뷰에서 필터링해 표시
              await refreshUserReviewsForStore();
              // 서버에서 북마크 여부 제공됨 (로그인 시)
              if (typeof placeDetails.bookmarked === 'boolean') {
                setIsBookmark(placeDetails.bookmarked);
              }
              
            }
          }
            
            // 사용자 위치가 있으면 거리 계산
          if (userLocation && lat && lng) {
              const distanceInMeters = calculateDistance(
                userLocation.lat,
                userLocation.lng,
              lat,
              lng
              );
              setDistance(formatDistance(distanceInMeters));
          }
        } catch (error) {
          console.error('가맹점 상세 정보 조회 실패:', error);
          const place = placeDatas.find((place) => place.id === id);
          if (place) {
            setName(place.name);
            setIsBookmark(place.bookmark);
            setRating(place.rating);
            setDistance(place.distance);
            setIndustry(place.industry);
            setAddress(place.address);
            setImages(place.images ?? []);
            setPhoneNumber("");
            setWebsite("");
            setWeekdayText([]);
          }
        }
      };
      
      fetchPlaceDetails();
    }
  }, [id, getStoreDetails, userLocation, isLoaded, apiKey, location.state, refreshUserReviewsForStore]);

  const handleBookmarkClick = (): void => {
    if (!resolvedStoreId || resolvedStoreId <= 0) {
      console.warn('유효한 storeId가 없어 북마크를 처리할 수 없습니다.');
      setAlertConfig({ isOpen: true, title: '처리 불가', message: '이 장소의 storeId가 없어 북마크를 처리할 수 없습니다.', type: 'warning' });
      return;
    }

    if (isBookmark) {
      deleteBookmark(resolvedStoreId)
        .then(() => {
          setIsBookmark(false);
          // 북마크 폴더에서 진입한 경우, 목록 반영을 위해 뒤로 이동
          if ((location.state as any)?.from === 'bookmark') {
            navigate(-1);
          }
        })
        .catch((error) => {
          console.error('북마크 삭제 실패:', error);
          setAlertConfig({ isOpen: true, title: '실패', message: '북마크 삭제에 실패했습니다.', type: 'error' });
        });
    } else {
      setIsBookmarkModalOpen(true);
    }
  };

  const handleBookmarkSuccess = () => {
    setIsBookmark(true);
  };

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setAlertConfig({ isOpen: true, title, message, type });
  };

  const handleReviewWrite = (): void => {
    // 배포 전까지: 선호 지역을 기준으로 방문 인증 진행
    const baseLocation = preferredLocation || userLocation;

    // storeId 없으면(placeId 기반 진입) 리뷰 작성 불가
    if (!resolvedStoreId || resolvedStoreId <= 0) {
      showAlert("리뷰 작성 불가", "이 화면은 placeId 기반 조회입니다. 해당 가맹점의 리뷰 작성은 지원되지 않습니다.", "info");
      return;
    }

    if (!baseLocation) {
      if (navigator.geolocation) {
        const options = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocalUserLocation({ lat: latitude, lng: longitude });
            setTimeout(() => handleReviewWrite(), 100);
          },
          (error) => {
            console.log('📍 위치 권한이 거부되었습니다:', error.message);
            showAlert("위치 권한 필요", "리뷰 작성을 위해서는 위치 권한이 필요합니다.\n브라우저 설정에서 위치 권한을 허용해주세요.", "warning");

          },
          options
        );
        return;
      } else {
        showAlert("브라우저 지원 안됨", "이 브라우저는 위치 서비스를 지원하지 않습니다.", "error");
        setVisitVerificationStatus('failed');
        return;
      }
    }

    if (!lat || !lng) {
      showAlert("위치 정보 없음", "장소 위치 정보가 없습니다.", "error");
      setVisitVerificationStatus('failed');
      return;
    }

    const distanceInMeters = calculateDistance(
      baseLocation.lat,
      baseLocation.lng,
      lat,
      lng
    );

    if (distanceInMeters > 500) {
      showAlert("방문인증 실패", `방문인증이 불가능합니다.\n현재 위치에서 ${formatDistance(distanceInMeters)} 떨어져 있습니다.\n장소 근처(500m 이내)에서 시도해주세요.`, "warning");
      setVisitVerificationStatus('failed');
      return;
    }

    setVisitVerificationStatus('verified');
    setIsReviewModalOpen(true);
  };

  const refreshStoreDetails = React.useCallback(async () => {
    if (!resolvedStoreId || resolvedStoreId <= 0) return;
    try {
      const refreshed = await getStoreDetails(resolvedStoreId);
      if (refreshed) {
        setName(refreshed.name || name);
        setRating(refreshed.rating || 0);
        setIndustry(convertCategoryCode(refreshed.category || "기타"));
        setAddress(refreshed.formattedAddress || address);
        setImages(refreshed.photos ? refreshed.photos.map((p: any) => p.url) : []);
        setLat(refreshed.lat || lat);
        setLng(refreshed.lng || lng);
        // refreshed.reviews는 구글 리뷰이므로 구글 리뷰 갱신
        if (Array.isArray(refreshed.reviews)) {
          setGoogleReviews(normalizeReviews(refreshed.reviews));
        }
        // 사용자 리뷰는 내 리뷰에서 필터링
        await refreshUserReviewsForStore();
      }
    } catch (_) {
      // ignore
    }
  }, [resolvedStoreId, getStoreDetails, name, address, lat, lng, refreshUserReviewsForStore]);

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      // placeId 기반에서는 작성 자체가 열리지 않지만, 이중 가드
      if (!resolvedStoreId || resolvedStoreId <= 0) {
        setIsReviewModalOpen(false);
        setVisitVerificationStatus('pending');
        return;
      }
      // 리뷰 작성 후 상세 재조회로 최신 리뷰/메타 반영
      await refreshStoreDetails();
    } catch (e) {
      // ignore fetch failure, UI는 기존 데이터 유지
    } finally {
      setIsReviewModalOpen(false);
      setVisitVerificationStatus('pending');
    }
  };

  const renderStars = () => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= Math.round(rating) ? (
          <Star key={`filled-${i}`} isFill={true} />
        ) : (
          <Star key={`empty-${i}`} isFill={false} />
        )
      );
    }
    return stars;
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <BackIcon onClick={() => {
          if (location.state?.from === 'map') {
            // 지도에서 들어온 경우 원래 마커 위치로 돌아가기
            navigate(`/map?lat=${location.state.lat}&lng=${location.state.lng}`);
          } else if (location.state?.from === 'bookmark') {
            navigate(-1);
          } else if (location.state?.from === 'main') {
            navigate('/main');
          } else {
            navigate('/');
          }
        }} />
      </HeaderContainer>
      
      <PlaceContainer>
        <PlaceBasicInfo
          name={name}
          rating={rating}
          distance={distance}
          industry={industry}
          address={address}
          isBookmark={isBookmark}
          onBookmarkClick={handleBookmarkClick}
          renderStars={renderStars}
        />
        
        {/* 데이터 소스 표시 */}
        {location.state?.placeId && (
          <div style={{
            fontSize: '0.8em', 
            color: 'var(--neutral-500)', 
            backgroundColor: 'var(--neutral-100)', 
            borderRadius: '4px',
            alignSelf: 'flex-start'
          }}>
            Google Places 정보
          </div>
        )}

        <ImageGallery images={images} altText="가게 이미지" />
        
        <AdditionalInfo
          phoneNumber={phoneNumber}
          website={website}
          weekdayText={weekdayText}
        />
      </PlaceContainer>

      <LargeDivider />
      
      <ReviewSections
        hasPlaceId={!!location.state?.placeId}
        userReviews={userReviews}
        googleReviews={googleReviews}
        onReviewWrite={handleReviewWrite}
        isReviewModalOpen={isReviewModalOpen}
        onReviewSubmit={handleReviewSubmit}
        onCloseReviewModal={async () => {
          // 모달 닫힐 때도 최신 데이터 재조회
          await refreshStoreDetails();
          setIsReviewModalOpen(false);
        }}
        placeName={name}
        storeId={parseInt(id || "0")}
      />

      <CustomAlert
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
      
      <BookmarkFolderSelectModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
        storeId={resolvedStoreId}
        storeName={name}
        onBookmarkSuccess={handleBookmarkSuccess}
      />
    </PageContainer>
  );
}
