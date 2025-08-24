import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiSolidUserCircle } from "react-icons/bi";
import PencilButton from "../../Components/Button/PencilButton";
import { industries } from "../../Data/Industries";
import LargeButton from "../../Components/Button/LargeButton";
import DeleteTag from "../../Components/DeleteTag";
import LargeReviewBox from "../../Components/Review/LargeReviewBox";
import ReviewStatusDisplay from "../../Components/Review/ReviewStatusDisplay";
import { convertCategoryCodes } from "../../utils/categoryMapping";
import { useUserApi, usePreferenceApi, useReviewApi } from "../../hooks/useApi";

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

const TabContainer = styled.div`
  width: calc(100% + 32px);
  margin: 0 -16px;
  display: flex;
`;

const Tab = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 12px 24px;
  color: var(--neutral-600);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    color: var(--primary-blue-600);
  }

  ${(props) =>
    props.$isActive &&
    css`
      color: var(--primary-blue-500);
      border-bottom-color: var(--primary-blue-500);
    `}
`;

const TabContent = styled.div`
  width: 100%;
`;

interface IndustryData {
  id: number;
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
  const [openMoreId, setOpenMoreId] = useState<string | number | null>(null);
  const [myReviews, setMyReviews] = useState<any[]>([]);

  const { logout } = useUserApi();
  const { getPreferredCategories, getPreferredRegion } = usePreferenceApi();
  const { getMyReviews, myReviewsState } = useReviewApi();

  const nick = "닉네임";

  useEffect(() => {
    const fetchPreferredCategories = async () => {
      try {
        const preferredCategories = await getPreferredCategories();
        if (preferredCategories && preferredCategories.length > 0) {
          const koreanCategories = convertCategoryCodes(preferredCategories);
          const userIndustries = industries.filter((industry: IndustryData) =>
            koreanCategories.includes(industry.name)
          );
          setSelectIndustries(userIndustries);
        } else {
          setSelectIndustries([]);
        }
      } catch (error) {
        setSelectIndustries([]);
      }
    };

    fetchPreferredCategories();
  }, [getPreferredCategories]);

  useEffect(() => {
    const fetchPreferredRegion = async () => {
      try {
        const regionData = await getPreferredRegion();
        if (regionData && regionData.sido && regionData.sigungu) {
          const regionName = regionData.dong 
            ? `${regionData.sido} ${regionData.sigungu} ${regionData.dong}`
            : `${regionData.sido} ${regionData.sigungu}`;
          setSelectRegions([regionName]);
        } else {
          setSelectRegions([]);
        }
      } catch (error) {
        setSelectRegions([]);
      }
    };

    fetchPreferredRegion();
  }, [getPreferredRegion]);

  useEffect(() => {
    if (activeTab === "reviews") {
      const fetchMyReviews = async () => {
        try {
          const response = await getMyReviews();
          if (response && response.reviews) {
            setMyReviews(response.reviews);
          } else {
            setMyReviews([]);
          }
        } catch (error) {
          setMyReviews([]);
        }
      };

      fetchMyReviews();
    }
  }, [activeTab, getMyReviews]);

  const handleDeleteRegion = (deleteRegion: string): void => {
    setSelectRegions((prev) =>
      prev.filter((region) => region !== deleteRegion)
    );
  };

  const handleDeleteIndustry = (deleteIndustry: number): void => {
    setSelectIndustries((prev) =>
      prev.filter((industry) => industry.id !== deleteIndustry)
    );
  };

  const handleTabClick = (tab: "preferences" | "reviews") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleMoreClick = (id: string | number) => {
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
      <TabContainer>
        <Tab
          className="Title__H6"
          $isActive={activeTab === "preferences"}
          onClick={() => handleTabClick("preferences")}
        >
          선호도 설정
        </Tab>
        <Tab
          className="Title__H6"
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
                {selectRegions.length > 0 ? (
                  <IndustryList>
                    {selectRegions.map((region) => (
                      <DeleteTag
                        key={region}
                        content={<div>{region}</div>}
                        color={"var(--neutral-1000)"}
                        isFix={true}
                        onClick={() => handleDeleteRegion(region)}
                      />
                    ))}
                  </IndustryList>
                ) : (
                  <div className="Body__Default" style={{ color: 'var(--neutral-500)', textAlign: 'center', padding: '20px' }}>
                    설정된 선호 지역이 없습니다.<br />
                    카테고리 설정에서 선호하는 지역을 선택해주세요.
                  </div>
                )}
              </CategorySection>
              <CategorySection>
                <SectionTitle className="Title__H5">업종</SectionTitle>
                {selectIndustries.length > 0 ? (
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
                ) : (
                  <div className="Body__Default" style={{ color: 'var(--neutral-500)', textAlign: 'center', padding: '20px' }}>
                    설정된 선호 카테고리가 없습니다.<br />
                    카테고리 설정에서 선호하는 업종을 선택해주세요.
                  </div>
                )}
              </CategorySection>
            </Category>
            <LargeButton
              buttonText="변경하기"
              onClick={() => navigate("/category/region", { state: { from: 'mypage' } })}
            />
          </CategoryContainer>
        )}
        {activeTab === "reviews" && (
          <ReviewContainer>
            {myReviewsState.loading ? (
              <ReviewStatusDisplay type="loading" />
            ) : myReviewsState.error ? (
              <ReviewStatusDisplay type="error" subMessage={myReviewsState.error} />
            ) : myReviews.length === 0 ? (
              <ReviewStatusDisplay type="empty" />
            ) : (
              myReviews.map((review, i) => (
                <>
                  <LargeReviewBox
                    key={review.reviewId}
                    {...review}
                    isMoreOpen={openMoreId == review.reviewId}
                    onMoreClick={handleMoreClick}
                  />
                  {i < myReviews.length - 1 && <Divider />}
                </>
              ))
            )}
          </ReviewContainer>
        )}
      </TabContent>
    </PageContainer>
  );
}
