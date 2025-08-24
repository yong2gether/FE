  import React, { useEffect, useState } from "react";
  import styled from "styled-components";
  import { useNavigate } from "react-router-dom";
  import { BiArrowBack } from "react-icons/bi";
  import PublicDropdown from "../../Components/PublicDropdown";
  import LargeButton from "../../Components/Button/LargeButton";
  import DeleteTag from "../../Components/DeleteTag";
  import ConfirmModal from "../../Components/Modal/ConfirmModal";

  const PageContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
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
    gap: var(--spacing-3xl);
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

  interface Option {
    index: number;
    value: string;
  }

  interface RegionData {
    id: number;
    value: string;
  }

  export default function CategoryRegion(): React.JSX.Element {
    const navigate = useNavigate();
    const [selectCity, setSelectCity] = useState<Option | null>(null);
    const [selectGu, setSelectGu] = useState<Option | null>(null);
    const [selectDong, setSelectDong] = useState<Option | null>(null);
    const [selectRegions, setSelectRegions] = useState<RegionData[]>([]);
    const [showExitModal, setShowExitModal] = useState<boolean>(false);

    const nickname = "상현";
    const cityOptions: Option[] = [
      { index: 0, value: "서울특별시" },
      { index: 1, value: "부산광역시" },
      { index: 2, value: "인천광역시" },
      { index: 3, value: "대구광역시" },
      { index: 4, value: "광주광역시" },
      { index: 5, value: "대전광역시" },
      { index: 6, value: "울산광역시" },
      { index: 7, value: "세종특별자치시" },
      { index: 8, value: "경기도" },
      { index: 9, value: "강원도" },
      { index: 10, value: "충청북도" },
      { index: 11, value: "충청남도" },
      { index: 12, value: "전라북도" },
      { index: 13, value: "전라남도" },
      { index: 14, value: "경상북도" },
      { index: 15, value: "경상남도" },
      { index: 16, value: "제주특별자치도" },
    ];

    const guOptions: Option[] = [
      { index: 0, value: "강남구" },
      { index: 1, value: "강동구" },
      { index: 2, value: "강북구" },
      { index: 3, value: "강서구" },
      { index: 4, value: "관악구" },
      { index: 5, value: "광진구" },
      { index: 6, value: "구로구" },
      { index: 7, value: "금천구" },
      { index: 8, value: "노원구" },
      { index: 9, value: "도봉구" },
      { index: 10, value: "동대문구" },
      { index: 11, value: "동작구" },
      { index: 12, value: "마포구" },
      { index: 13, value: "서대문구" },
      { index: 14, value: "서초구" },
      { index: 15, value: "성동구" },
      { index: 16, value: "성북구" },
      { index: 17, value: "송파구" },
      { index: 18, value: "양천구" },
      { index: 19, value: "영등포구" },
      { index: 20, value: "용산구" },
      { index: 21, value: "은평구" },
      { index: 22, value: "종로구" },
      { index: 23, value: "중구" },
      { index: 24, value: "중랑구" },
    ];

    const dongOptions: Option[] = [
      { index: 0, value: "강남동" },
      { index: 1, value: "개포동" },
      { index: 2, value: "논현동" },
      { index: 3, value: "대치동" },
      { index: 4, value: "도곡동" },
      { index: 5, value: "삼성동" },
      { index: 6, value: "세곡동" },
      { index: 7, value: "수서동" },
      { index: 8, value: "신사동" },
      { index: 9, value: "압구정동" },
      { index: 10, value: "역삼동" },
      { index: 11, value: "일원동" },
      { index: 12, value: "청담동" },
    ];

    useEffect(() => {
      if (selectCity && selectGu && selectDong) {
        const newRegion: RegionData = {
          id: Date.now(),
          value: `${selectCity.value} ${selectGu.value} ${selectDong.value}`,
        };

        setSelectRegions((prevRegions) => [...prevRegions, newRegion]);

        setSelectCity(null);
        setSelectGu(null);
        setSelectDong(null);
      }
    }, [selectDong]);

    const handleDeleteRegion = (clickId: number): void => {
      setSelectRegions(selectRegions.filter((region) => region.id !== clickId));
    };

    const handleBack = () => {
      // 첫 로그인 사용자의 경우 뒤로 가기 시 확인 모달 표시
      setShowExitModal(true);
    };

    const handleConfirmExit = () => {
      setShowExitModal(false);
      navigate("/login");
    };

    const handleCancelExit = () => {
      setShowExitModal(false);
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
            <DropdownContainer>
              <PublicDropdown
                options={cityOptions}
                placeholder="시/도"
                value={selectCity}
                onChange={setSelectCity}
              />
              <PublicDropdown
                options={guOptions}
                placeholder="시/구/군"
                value={selectGu}
                onChange={setSelectGu}
              />
              <PublicDropdown
                options={dongOptions}
                placeholder="동/읍/면"
                value={selectDong}
                onChange={setSelectDong}
              />
            </DropdownContainer>
            <RegionContainer>
              {selectRegions.map((region) => (
                <DeleteTag
                  key={region.id}
                  content={<>{region.value}</>}
                  color={"var(--primary-blue-600)"}
                  onClick={() => handleDeleteRegion(region.id)}
                />
              ))}
            </RegionContainer>
          </ContentContainer>
          <ButtonContainer>
            <LargeButton
              buttonText="다음"
              onClick={() => navigate("/category/industry")}
            />
          </ButtonContainer>
        </PageContainer>
        
        {/* 뒤로 가기 확인 모달 */}
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
