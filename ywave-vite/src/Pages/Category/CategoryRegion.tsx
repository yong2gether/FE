import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import PublicDropdown from "../../Components/PublicDropdown";
import LargeButton from "../../Components/Button/LargeButton";
import DeleteTag from "../../Components/DeleteTag";
import ConfirmModal from "../../Components/Modal/ConfirmModal";
import { usePreferenceApi } from "../../hooks/useApi";
import { SetPreferredRegionRequest } from "../../api/types";

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  min-height: 100vh;
  box-sizing: border-box;
  user-select: none;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: var(--spacing-xl);
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  margin-top: 44px;
  gap: 60px;
`;

const BackIcon = styled(BiArrowBack)`
  color: var(--neutral-1000);
  width: 32px;
  height: 32px;
`;

const Title = styled.h1`
  color: var(--neutral-1000);

  & > span {
    color: var(--primary-blue-500);
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: var(--spacing-m);
`;

const RegionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: var(--spacing-m);
  color: var(--primary-blue-600);
`;

const ButtonContainer = styled.div`
  margin: var(--spacing-3xl) 0px var(--spacing-xl) 0px;
  width: 100%;
`;

const InfoMessage = styled.div`
  text-align: center;
  color: var(--neutral-600);
  font-size: 14px;
  padding: 16px;
`;

interface Option {
  index: number;
  value: string;
}

interface RegionDataItem {
  sido: string;
  sigungu: string;
  dong: string;
}

interface RegionData {
  id: number;
  value: string;
}

// RegionData.tsx에서 실제 지역 데이터 가져오기
import regionData from "../../Data/RegionData";

// 지역 데이터 (RegionData.tsx에서 가져온 실제 데이터)
const regionDataItems: RegionDataItem[] = regionData.gyeonggi_do;

interface DropdownProps {
  options: Option[];
  placeholder: string;
  value: Option | null;
  onChange: (option: Option | null) => void;
}

const RegionDropdown: React.FC<DropdownProps> = ({ options, placeholder, value, onChange }) => (
  <PublicDropdown
    options={options}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

const RegionSelector: React.FC<{
  selectCity: Option | null;
  selectGu: Option | null;
  selectDong: Option | null;
  onCityChange: (city: Option | null) => void;
  onGuChange: (gu: Option | null) => void;
  onDongChange: (dong: Option | null) => void;
  disabled: boolean;
  cityOptions: Option[];
  guOptions: Option[];
  dongOptions: Option[];
}> = ({ selectCity, selectGu, selectDong, onCityChange, onGuChange, onDongChange, disabled, cityOptions, guOptions, dongOptions }) => (
  <DropdownContainer>
    <RegionDropdown
      options={cityOptions}
      placeholder="시/도"
      value={disabled ? null : selectCity}
      onChange={onCityChange}
    />
    <RegionDropdown
      options={guOptions}
      placeholder="시/구/군"
      value={disabled ? null : selectGu}
      onChange={onGuChange}
    />
    <RegionDropdown
      options={dongOptions}
      placeholder="동/읍/면"
      value={disabled ? null : selectDong}
      onChange={onDongChange}
    />
  </DropdownContainer>
);

const SelectedRegions: React.FC<{
  regions: RegionData[];
  onDelete: (id: number) => void;
}> = ({ regions, onDelete }) => (
  <>
    <RegionContainer>
      {regions.map((region) => (
        <DeleteTag
          key={region.id}
          content={<>{region.value}</>}
          color={"var(--primary-blue-600)"}
          onClick={() => onDelete(region.id)}
        />
      ))}
    </RegionContainer>
    {regions.length >= 1 && (
      <InfoMessage>
        지역은 하나만 선택할 수 있습니다. 다른 지역을 선택하려면 기존 지역을 삭제해주세요.
      </InfoMessage>
    )}
  </>
);

// 기본 시/도 옵션 (고정)
const cityOptions: Option[] = Array.from(new Set(regionDataItems.map(item => item.sido)))
  .map((sido, index) => ({ index, value: sido }));

// 시/구/군 및 동/읍/면 옵션을 동적으로 생성하는 함수
const getGuOptions = (selectedCity: Option | null): Option[] => {
  if (!selectedCity) return [];
  return Array.from(new Set(regionDataItems
    .filter(item => item.sido === selectedCity.value)
    .map(item => item.sigungu)))
    .map((sigungu, index) => ({ index, value: sigungu }));
};

const getDongOptions = (selectedCity: Option | null, selectedGu: Option | null): Option[] => {
  if (!selectedCity || !selectedGu) return [];
  return Array.from(new Set(regionDataItems
    .filter(item => item.sido === selectedCity.value && item.sigungu === selectedGu.value)
    .map(item => item.dong)))
    .map((dong, index) => ({ index, value: dong }));
};

export default function CategoryRegion(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectCity, setSelectCity] = useState<Option | null>(null);
  const [selectGu, setSelectGu] = useState<Option | null>(null);
  const [selectDong, setSelectDong] = useState<Option | null>(null);
  const [selectRegions, setSelectRegions] = useState<RegionData[]>([]);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { setPreferredRegion, setRegionState } = usePreferenceApi();

  const nickname = "상현";
  const isRegionSelected = selectRegions.length >= 1;

  // 동적으로 시/구/군 및 동/읍/면 옵션 생성
  const guOptions: Option[] = getGuOptions(selectCity);
  const dongOptions: Option[] = getDongOptions(selectCity, selectGu);

  useEffect(() => {
    if (selectCity && selectGu && selectDong) {
      if (isRegionSelected) return;

      const newRegion: RegionData = {
        id: Date.now(),
        value: `${selectCity.value} ${selectGu.value} ${selectDong.value}`,
      };

      setSelectRegions([newRegion]);
      setSelectCity(null);
      setSelectGu(null);
      setSelectDong(null);
    }
  }, [selectDong, isRegionSelected]);

  const handleDeleteRegion = (clickId: number): void => {
    setSelectRegions(selectRegions.filter((region) => region.id !== clickId));
  };

  const handleBack = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    // 마이페이지에서 온 경우 마이페이지로, 그 외에는 로그인 페이지로
    const fromMypage = location.state?.from === 'mypage';
    if (fromMypage) {
      navigate("/mypage");
    } else {
      navigate("/login");
    }
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleSaveRegion = async () => {
    if (!selectRegions.length) return;
    
    const regionValue = selectRegions[0].value;
    const parts = regionValue.split(' ');
    
    if (parts.length < 2) return;
    
    const requestData: SetPreferredRegionRequest = {
      sido: parts[0],
      sigungu: parts[1],
      dong: parts[2] || undefined
    };

    try {
      setIsSubmitting(true);
      const response = await setPreferredRegion(requestData);
      
      if (response) {
        // 지역 설정 성공 후 다음 페이지로 이동
        navigate("/category/industry");
      }
    } catch (error) {
      console.error('지역 설정 실패:', error);
      // 에러 처리 (사용자에게 알림 등)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageContainer>
        <ContentContainer>
          <TitleContainer>
            <BackIcon onClick={handleBack} />
            <Title className="Title__H1">
              반갑습니다 {nickname}님! <br />
              주로 <span>어느 위치</span>의 <br />
              지역 화폐 가맹점을 <br />
              방문하시나요?
            </Title>
          </TitleContainer>
          
          <RegionSelector
            selectCity={selectCity}
            selectGu={selectGu}
            selectDong={selectDong}
            onCityChange={(city) => !isRegionSelected && setSelectCity(city)}
            onGuChange={(gu) => !isRegionSelected && setSelectGu(gu)}
            onDongChange={(dong) => !isRegionSelected && setSelectDong(dong)}
            disabled={isRegionSelected}
            cityOptions={cityOptions}
            guOptions={guOptions}
            dongOptions={dongOptions}
          />
          
          <SelectedRegions
            regions={selectRegions}
            onDelete={handleDeleteRegion}
          />
        </ContentContainer>
        
        <ButtonContainer>
                  <LargeButton
          buttonText="다음"
          onClick={handleSaveRegion}
          disabled={!isRegionSelected || isSubmitting}
        />
        </ButtonContainer>
      </PageContainer>
      
      <ConfirmModal
        isOpen={showExitModal}
        title="설정을 완료하지 않고 나가시겠습니까?"
        message="현재까지 선택한 지역 설정이 저장되지 않습니다."
        confirmText="나가기"
        cancelText="계속 설정하기"
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </>
  );
}
