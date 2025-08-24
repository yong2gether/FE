import { useLoadScript } from "@react-google-maps/api";
import { useEffect } from "react";

// 모든 페이지에서 공통으로 사용할 기본 설정
const DEFAULT_LIBRARIES: ("places")[] = ["places"];

export const useGoogleMaps = (onError?: (message: string) => void) => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? "";
  
  // LoadScript가 이미 로드했으므로 useLoadScript 사용
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: DEFAULT_LIBRARIES,
    // CSP 에러 방지를 위한 추가 옵션
    version: "weekly",
    language: "ko",
    region: "KR",
  });

  // CSP 에러 감지 및 처리
  useEffect(() => {
    if (loadError) {
      console.error('❌ Google Maps API 로드 실패:', loadError);
      
      // CSP 에러인 경우 사용자에게 안내
      if (loadError.message.includes('CSP') || 
          loadError.message.includes('blocked') || 
          loadError.message.includes('ERR_BLOCKED_BY_CLIENT')) {
        console.warn('⚠️ CSP 정책으로 인해 Google Maps API가 차단되었습니다.');
        console.warn('💡 광고 차단기나 개인정보 보호 확장 프로그램을 비활성화해주세요.');
        
        // 사용자에게 알림 표시 (선택사항)
        if (typeof window !== 'undefined' && onError) {
          onError('Google Maps API가 차단되었습니다.\n광고 차단기나 개인정보 보호 확장 프로그램을 비활성화해주세요.');
        }
      }
    }
  }, [loadError]);

  return { isLoaded, loadError, apiKey };
};
