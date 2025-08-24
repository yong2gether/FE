import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";
import PencilButton from "../../Components/Button/PencilButton";
import { industries } from "../../Data/Industries";
import LargeButton from "../../Components/Button/LargeButton";
import DeleteTag from "../../Components/DeleteTag";
import LargeReviewBox from "../../Components/Review/LargeReviewBox";
import { placeDatas } from "../../Data/PlaceDatas";
import { useUserApi } from "../../hooks/useApi";

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  gap: var(--spacing-l);
  user-select: none;
`;

const UserWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
`;

const ImageContainer = styled.div`
  width: 48px;
  height: 48px;

  & > svg {
    width: 100%;
    height: 100%;
    color: var(--neutral-200);
  }
`;

const Logout = styled.div`
  color: var(--neutral-300);
  margin-right: 16px;
  cursor: pointer;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
`;

const TabContainer = styled.div`
  width: calc(100% + 32px);
  margin: 0 -16px;
  display: flex;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: var(--neutral-600);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary-blue-600);
  }
  
  ${props =>
    props.$isActive &&
    css`
      color: var(--primary-blue-500);
      border-bottom-color: var(--primary-blue-500);
    `}
`;

const TabContent = styled.div`
  width: 100%;
`;

const CategoryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 64px;
`;

const Category = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2xl);
`;

const CategorySection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-m);
`;

const SectionTitle = styled.div`
  align-self: flex-start;
`;

const IndustryList = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-m);
  flex-wrap: wrap;
`;

const Industry = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const ReviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-m);
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: var(--neutral-200);
`;

interface IndustryData {
  id: string;
  icon: (props: { size: number }) => React.ReactElement;
  name: string;
  size?: number;
}

export default function Mypage(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabUrl = searchParams.get("tab") as "preferences" | "reviews" | null;
  const [activeTab, setActiveTab] = useState<"preferences" | "reviews">(
    tabUrl || "preferences"
  );
  const [selectRegions, setSelectRegions] = useState<string[]>([]);
  const [selectIndustries, setSelectIndustries] = useState<IndustryData[]>([]);
  const [openMoreId, setOpenMoreId] = useState<string | null>(null);

  const { logout } = useUserApi();

  const nick = "닉네임";

  const RegionDatas = React.useMemo(
    () => [
      "용인시 처인구 모현읍",
      "창원시 마산회구 양덕2동",
      "서울특별시 동대문구 휘경1동",
    ],
    []
  );

  const IndustryDatas = React.useMemo(
    () => ["restaurant", "cafe", "convenience"],
    []
  );

  useEffect(() => {
    setSelectRegions(RegionDatas);
    setSelectIndustries(
      industries.filter((industry: IndustryData) =>
        IndustryDatas.some((industryId) => industryId === industry.id)
      )
    );
  }, [RegionDatas, IndustryDatas]);

  const handleDeleteRegion = (deleteRegion: string): void => {
    setSelectRegions((prev) =>
      prev.filter((region) => region !== deleteRegion)
    );
  };

  const handleDeleteIndustry = (deleteIndustry: string): void => {
    setSelectIndustries((prev) =>
      prev.filter((industry) => industry.id !== deleteIndustry)
    );
  };

  const handleTabClick = (tab: "preferences" | "reviews") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleMoreClick = (id: string) => {
    setOpenMoreId((prev) => (prev === id ? null : id));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <PageContainer>
      <UserWrapper>
        <UserContainer className="Title__H4">
          <ImageContainer>
            <BiSolidUserCircle />
          </ImageContainer>
          {nick}님
        </UserContainer>
        <Logout className="Body__MediumSmall" onClick={handleLogout}>
          로그아웃
        </Logout>
      </UserWrapper>
      <PencilButton
        buttonText="프로필 편집하기"
        onClick={() => navigate("/mypage/profile")}
        isFill={true}
      />
      <Content>
        <TabContainer>
          <Tab
            $isActive={activeTab === "preferences"}
            onClick={() => handleTabClick("preferences")}
          >
            선호도 설정
          </Tab>
          <Tab
            $isActive={activeTab === "reviews"}
            onClick={() => handleTabClick("reviews")}
          >
            내 리뷰
          </Tab>
        </TabContainer>
        <TabContent>
          {activeTab === "preferences" && (
            <CategoryContainer>
              <Category>
                <CategorySection>
                  <SectionTitle className="Title__H5">위치</SectionTitle>
                  {selectRegions.map((region, index) => (
                    <DeleteTag
                      key={index}
                      content={<>{region}</>}
                      color={"var(--neutral-1000)"}
                      onClick={() => handleDeleteRegion(region)}
                    />
                  ))}
                </CategorySection>
                <CategorySection>
                  <SectionTitle className="Title__H5">업종</SectionTitle>
                  <IndustryList>
                    {selectIndustries.map((industry) => (
                      <DeleteTag
                        key={industry.id}
                        content={
                          <Industry key={industry.id}>
                            {industry.icon({ size: industry.size || 16 })}
                            {industry.name}
                          </Industry>
                        }
                        color={"var(--neutral-1000)"}
                        isFix={true}
                        onClick={() => handleDeleteIndustry(industry.id)}
                      />
                    ))}
                  </IndustryList>
                </CategorySection>
              </Category>
              <LargeButton
                buttonText="변경하기"
                onClick={() => navigate("/category/region")}
              />
            </CategoryContainer>
          )}
          {activeTab === "reviews" && (
            <ReviewContainer>
              {placeDatas.map((review, i) => (
                <>
                  <LargeReviewBox
                    key={review.id}
                    {...review}
                    isMoreOpen={openMoreId == review.id}
                    onMoreClick={handleMoreClick}
                  />
                  {i < placeDatas.length - 1 && <Divider />}
                </>
              ))}
            </ReviewContainer>
          )}
        </TabContent>
      </Content>
    </PageContainer>
  );
}
