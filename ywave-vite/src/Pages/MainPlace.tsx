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
import { useStoreApi, useBookmarkApi } from "../hooks/useApi";
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
      {industry && <div>{industry}</div>}
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
  placeName 
}: {
  hasPlaceId: boolean;
  userReviews: any[];
  googleReviews: any[];
  onReviewWrite: () => void;
  isReviewModalOpen: boolean;
  onReviewSubmit: (data: any) => void;
  onCloseReviewModal: () => void;
  placeName: string;
}) => (
  <>
    {/* 방문자 리뷰 섹션 - storeId 기반일 때만 표시 */}
    {!hasPlaceId && (
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
          showWriteButton={true}
          onWriteClick={onReviewWrite}
        />
        <LargeDivider />
      </>
    )}
    
    {/* 구글 방문자 리뷰 섹션 - Google 리뷰가 있을 때 항상 표시 */}
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
    {!hasPlaceId && (
      <ReviewWriteModal
        isOpen={isReviewModalOpen}
        placeName={placeName}
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
  
  const { getStoreDetails } = useStoreApi();
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

  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState<boolean>(false);
  const { createBookmark, deleteBookmark } = useBookmarkApi();

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
        console.log('placeId API 응답 데이터:', data);
        return data;
      } else {
        console.error(`백엔드 placeId API 호출 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('백엔드 placeId API 호출 실패:', error);
    }
    return null;
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

  useEffect(() => {
    if (id) {
      const fetchPlaceDetails = async () => {
        try {
          // 디버깅을 위한 로그 추가
          console.log('MainPlace useEffect 실행');
          console.log('location.state:', location.state);
          console.log('id:', id);
          
          const placeId = location.state?.placeId;
          const fromBookmark = location.state?.from === 'bookmark';
          
          if (placeId && placeId !== "null") {
            console.log('placeId로 데이터 조회 시작:', placeId);
            const backendPlaceDetails = await fetchPlaceDetailsByPlaceId(placeId);
            if (backendPlaceDetails) {
              console.log('백엔드 API 응답 성공:', backendPlaceDetails);
              console.log('가맹점 이름:', backendPlaceDetails.name);
              
              // 백엔드 API에서 받은 데이터로 설정
              setName(backendPlaceDetails.name || "");
              setRating(backendPlaceDetails.rating || 0);
              setDistance("");
              setIndustry(convertCategoryCode(backendPlaceDetails.category) || "기타");
              setAddress(backendPlaceDetails.formattedAddress || "");
              setImages(backendPlaceDetails.photos ? backendPlaceDetails.photos.map((photo: any) => photo.url) : []);
              setLat(backendPlaceDetails.lat || 0);
              setLng(backendPlaceDetails.lng || 0);
              
              setPhoneNumber(backendPlaceDetails.internationalPhoneNumber || "");
              setWebsite(backendPlaceDetails.website || "");
              setWeekdayText(backendPlaceDetails.weekdayText || []);
              
              if (backendPlaceDetails.reviews && backendPlaceDetails.reviews.length > 0) {
                const convertedReviews = backendPlaceDetails.reviews.map((review: any, index: number) => ({
                  id: index.toString(),
                  rating: review.rating || 0,
                  nick: review.authorName || "익명",
                  createdAt: review.time ? new Date(review.time * 1000).toLocaleDateString('ko-KR') : "",
                  reviewText: review.text || "",
                  images: review.photos ? review.photos.map((photo: any) => photo.url) : []
                }));
                setGoogleReviews(convertedReviews);
              } else {
                setGoogleReviews([]);
              }
              
              setUserReviews([]);
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
                  setUserReviews([]);
                  setPhoneNumber("");
                  setWebsite("");
                  setWeekdayText([]);
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
              
              // 백엔드에서 받은 reviews 데이터를 googleReviews로 설정
              if (placeDetails.reviews && placeDetails.reviews.length > 0) {
                const convertedReviews = placeDetails.reviews.map((review: any, index: number) => ({
                  id: index.toString(),
                  rating: review.rating || 0,
                  nick: review.authorName || "익명",
                  createdAt: review.time ? new Date(review.time * 1000).toLocaleDateString('ko-KR') : "",
                  reviewText: review.text || "",
                  images: review.photos ? review.photos.map((photo: any) => photo.url) : []
                }));
                setGoogleReviews(convertedReviews);
              } else {
                setGoogleReviews([]);
              }
              
              setUserReviews([]);
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
  }, [id, getStoreDetails, userLocation, isLoaded, apiKey, location.state]);

  const handleBookmarkClick = (): void => {
    if (isBookmark) {
      // 북마크 해제
      if (id) {
        deleteBookmark(parseInt(id))
          .then(() => {
            setIsBookmark(false);
          })
          .catch((error) => {
            console.error("북마크 삭제 실패:", error);
          });
      }
    } else {
      // 북마크 추가 - 모달 열기
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
    if (!userLocation) {
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
      userLocation.lat,
      userLocation.lng,
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

  const handleReviewSubmit = (reviewData: any) => {
    console.log("리뷰 제출:", reviewData);
    setIsReviewModalOpen(false);
    setVisitVerificationStatus('pending');
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
        onCloseReviewModal={() => setIsReviewModalOpen(false)}
        placeName={name}
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
        storeId={parseInt(id || "0")}
        storeName={name}
        onBookmarkSuccess={handleBookmarkSuccess}
      />
    </PageContainer>
  );
}
