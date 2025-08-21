import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TitleLogo from "../Images/TitleLogo2.svg";
import { placeDatas } from "../Data/PlaceDatas";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import RecommendBox from "../Components/RecommendBox";
import PlaceBox from "../Components/PlaceBox";

const PageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 16px;
  min-height: 100vh;
  box-sizing: border-box;
  gap: var(--spacing-3xl);
  user-select: none;
`;

const RecommendContainer = styled.div`
  width: calc(100% + 32px);
  margin: 28px -16px 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-m);
  padding: 16px 16px 28px 16px;
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
  justify-content: center;
  gap: var(--spacing-m);
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
  const [isRecommend, setIsRecommend] = useState<boolean>(false);
  const [start, setStart] = useState<number>(0);
  const VISIBLE = 2;
  const total = placeDatas.length;
  const nick = "닉네임";

  useEffect(() => {
    setIsRecommend(true);
  }, []);

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
        {placeDatas.map((place) => (
          <PlaceBox
            key={place.id}
            {...place}
            onClick={() => {
              navigate(`/main/place/${place.id}`);
            }}
          />
        ))}
      </Content>
    </PageContainer>
  );
}
