import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { placeDatas } from "../Data/PlaceDatas";
import { PiBookmarkSimple, PiBookmarkSimpleFill } from "react-icons/pi";
import { AiFillStar } from "react-icons/ai";
import PencilButton from "../Components/PencilButton";
import SmallReviewBox from "../Components/SmallReviewBox";

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

const PlaceContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-xs);
  margin-top: 52px;
`;

const NameContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--neutral-1000);

  & > svg {
    min-width: 24px;
    min-height: 24px;
    cursor: pointer;
  }
`;

const Name = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

const ImageContainer = styled.div`
  width: calc(100% + 16px);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--spacing-2xs);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const ImageItem = styled.img`
  width: 138px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
`;

const LargeDivider = styled.div`
  width: calc(100% + 32px);
  height: 5px;
  background: var(--neutral-200);
`;

const ReviewContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-m);
`;

const DescriptionContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const ReviewDescription = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: var(--spacing-2xs);
  color: var(--neutral-700);

  .Title__H4 {
    color: var(--neutral-1000);
  }
`;

const SmallDivider = styled.div`
  width: 100%;
  height: 1px;
  background: var(--neutral-200);
`;

interface Review {
  nick: string;
  rating: number;
  createdAt: string;
  reviewText: string;
}

export default function MainPlace(): React.JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState<string>("");
  const [isBookmark, setIsBookmark] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0.0);
  const [distance, setDistance] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (id) {
      const place = placeDatas.find((place) => place.id === id);
      if (place) {
        setName(place.name);
        setIsBookmark(place.bookmark);
        setRating(place.rating);
        setDistance(place.distance);
        setIndustry(place.industry);
        setAddress(place.address);
        setImages(place.images ?? []);
        setReviews(place.reviews ?? []);
      }
    }
  }, []);

  const handleBookmarkClick = () => {
    setIsBookmark((prev) => !prev);
  };

  const handleReviewWrite = () => {
    navigate("/mypage/review", {
      state: {
        name,
        rating: 0.0,
        reviewText: "",
      },
    });
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
      <PlaceContainer>
        <NameContainer>
          <Name className="Title__H3">{name}</Name>
          {isBookmark ? (
            <PiBookmarkSimpleFill onClick={handleBookmarkClick} />
          ) : (
            <PiBookmarkSimple onClick={handleBookmarkClick} />
          )}
        </NameContainer>

        <RatingContainer>
          <div className="Body__Default">{rating}</div>
          <StarContainer>{renderStars()}</StarContainer>
        </RatingContainer>

        <InfoContainer className="Body__Default">
          <div>{distance}</div>
          <div>|</div>
          <div>{industry}</div>
          <div>|</div>
          <div>{address}</div>
        </InfoContainer>

        {images && images.length > 0 && (
          <ImageContainer>
            {images.map((image, index) => (
              <ImageItem
                key={index}
                src={image}
                alt={`리뷰 이미지 ${index + 1}`}
              />
            ))}
          </ImageContainer>
        )}
      </PlaceContainer>
      <LargeDivider />
      <ReviewContainer>
        <DescriptionContainer>
          <ReviewDescription>
            <div className="Title__H4">방문자 리뷰</div>
            <div className="Body__Default">
              해당 장소를 방문하셨나요? <br />
              방문인증을 통해 리뷰를 작성하세요!
            </div>
          </ReviewDescription>
          <PencilButton
            buttonText="리뷰 작성하기"
            onClick={handleReviewWrite}
          />
        </DescriptionContainer>
        {reviews.map((review, i) => (
          <>
            <SmallReviewBox
              key={i}
              id={i.toString()}
              {...review}
              images={images}
            />
            {i < reviews.length - 1 && <SmallDivider />}
          </>
        ))}
      </ReviewContainer>
      <LargeDivider />
      <ReviewContainer>
        <DescriptionContainer>
          <ReviewDescription>
            <div className="Title__H4">구글 방문자 리뷰</div>
            <div className="Body__Default">
              조금 더 많은 리뷰가 보고 싶으시다면?
            </div>
          </ReviewDescription>
        </DescriptionContainer>
        {reviews.map((review, i) => (
          <>
            <SmallReviewBox
              key={i}
              id={i.toString()}
              {...review}
              images={images}
            />
            {i < reviews.length - 1 && <SmallDivider />}
          </>
        ))}
      </ReviewContainer>
    </PageContainer>
  );
}
