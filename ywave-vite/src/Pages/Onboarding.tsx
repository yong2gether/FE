import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../Images/Landing.svg";
import Onboarding1 from "../Images/Onboarding/Onboarding1.svg";
import Onboarding2 from "../Images/Onboarding/Onboarding2.svg";
import Onboarding3 from "../Images/Onboarding/Onboarding3.svg";

interface Slide {
  title: string;
  description: string;
  image: string;
}

interface SliderContainerProps {
  currentSlide: number;
  dragOffset: number;
  isDragging: boolean;
}

interface IndicatorProps {
  isActive: boolean;
}

const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background-image: url(${BackgroundImage});
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-2xl);
  padding: 60px 16px 0px;
  user-select: none;
`;

const IndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
`;

const Indicator = styled.div<IndicatorProps>`
  width: 10px;
  height: 10px;
  border-radius: 100px;
  background-color: ${(props) =>
    props.isActive ? "var(--primary-blue-400)" : "var(--neutral-100)"};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const SliderWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const SliderContainer = styled.div<SliderContainerProps>`
  display: flex;
  height: 100%;
  transition: ${(props) =>
    props.isDragging ? "none" : "transform 0.3s ease-out"};
  transform: translateX(
    calc(
      -${(props) => props.currentSlide * 100}% + ${(props) => (props.isDragging ? props.dragOffset : 0)}px
    )
  );
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const Slide = styled.div`
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-3xl);
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-m);
  color: var(--neutral-100);
`;

const Description = styled.div`
  white-space: pre-line;
  text-align: center;
`;

const ContentContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  padding: 0px 16px;
  position: absolute;
  bottom: 62px;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.5s ease-in;

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }
`;

const StartButton = styled.div`
  width: 100%;
  min-width: 200px;
  min-height: auto;
  background-color: var(--neutral-100);
  border: 1.5px solid var(--primary-blue-500);
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  color: var(--primary-blue-500);
  cursor: pointer;
  padding: 12px 0px;
  text-align: center;
  white-space: nowrap;

  &:hover {
    background-color: var(--neutral-200);
  }

  &:active {
    background-color: var(--neutral-300);
  }
`;

export default function Onboarding(): React.JSX.Element {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const slides: Slide[] = [
    {
      title: "Y:Wave만의 가맹점 지도",
      description: "주변 가맹점의 위치와 정보를\n지도에서 한 눈에",
      image: Onboarding1,
    },
    {
      title: "똑똑한 AI 가맹점 큐레이션",
      description:
        "설정한 지역과 카테고리를 분석해\n나에게 꼭 맞는 가맹점만 골라서 추천",
      image: Onboarding2,
    },
    {
      title: "방문 인증된 진짜 리뷰 시스템",
      description:
        "실제 사용자와 구글 리뷰를 통합해 방문 인증까지,\n믿을 수 있는 가맹점 정보",
      image: Onboarding3,
    },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.clientX);
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const offset = e.clientX - dragStart;
    setDragOffset(offset);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const offset = e.touches[0].clientX - dragStart;
    setDragOffset(offset);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const threshold = 50;
    if (dragOffset > threshold && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (dragOffset < -threshold && currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleMouseUp = () => handleEnd();
    const handleMouseLeave = () => handleEnd();

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDragging, dragOffset, currentSlide]);

  useEffect(() => {
    if (currentSlide === slides.length - 1) {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShowButton(false);
    }
  }, [currentSlide, slides.length]);

  const handleStartButtonClick = () => {
    navigate("/login");
  };

  return (
    <PageContainer>
      <IndicatorContainer>
        {slides.map((_, index) => (
          <Indicator
            key={index}
            isActive={currentSlide === index}
            onClick={() => goToSlide(index)}
          />
        ))}
      </IndicatorContainer>

      <SliderWrapper>
        <SliderContainer
          ref={containerRef}
          currentSlide={currentSlide}
          dragOffset={dragOffset}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
        >
          {slides.map((slide, index) => (
            <Slide key={index}>
              <TitleContainer>
                <div className="Display__Small">{slide.title}</div>
                <Description className="Body__Large">
                  {slide.description}
                </Description>
              </TitleContainer>
              <ContentContainer>
                <img
                  src={slide.image}
                  alt={`${slide.title} 화면`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </ContentContainer>
            </Slide>
          ))}
        </SliderContainer>
      </SliderWrapper>

      <ButtonContainer className={showButton ? "visible" : ""}>
        <StartButton className="Title__H4" onClick={handleStartButtonClick}>
          시작하기
        </StartButton>
      </ButtonContainer>
    </PageContainer>
  );
}
