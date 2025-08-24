import React, { useState } from "react";
import styled from "styled-components";
import ReviewWriteModal from "./Review/ReviewWriteModal";
import LargeButton from "./Button/LargeButton";

const DemoContainer = styled.div`
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
`;

const DemoTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: var(--neutral-1000);
  margin-bottom: 16px;
  text-align: center;
`;

const DemoDescription = styled.p`
  font-size: 16px;
  color: var(--neutral-700);
  margin-bottom: 24px;
  text-align: center;
  line-height: 1.5;
`;

const PlaceInfo = styled.div`
  background: var(--neutral-100-2);
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const PlaceName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-1000);
  margin-bottom: 8px;
`;

const PlaceAddress = styled.div`
  font-size: 14px;
  color: var(--neutral-600);
`;

const ReviewDataDisplay = styled.div`
  background: var(--neutral-100);
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
`;

const ReviewDataTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--neutral-1000);
  margin-bottom: 16px;
`;

const ReviewDataItem = styled.div`
  margin-bottom: 12px;
`;

const ReviewDataLabel = styled.span`
  font-weight: 500;
  color: var(--neutral-700);
  margin-right: 8px;
`;

const ReviewDataValue = styled.span`
  color: var(--neutral-1000);
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const ImagePreview = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid var(--neutral-200);
`;

export default function ReviewWriteModalDemo(): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitReview = (data: any) => {
    setReviewData(data);
    setIsModalOpen(false);
    console.log("리뷰 데이터:", data);
  };

  return (
    <DemoContainer>
      <DemoTitle>리뷰 작성 모달 데모</DemoTitle>
      <DemoDescription>
        방문인증 후 리뷰 작성을 위한 모달창입니다. 별점, 사진 업로드, 리뷰 내용을 포함합니다.
      </DemoDescription>

      <PlaceInfo>
        <PlaceName>스타벅스 강남점</PlaceName>
        <PlaceAddress>서울특별시 강남구 테헤란로 123</PlaceAddress>
      </PlaceInfo>

      <LargeButton
        buttonText="리뷰 작성하기"
        onClick={handleOpenModal}
      />

      <ReviewWriteModal
        isOpen={isModalOpen}
        placeName="스타벅스 강남점"
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
      />

      {reviewData && (
        <ReviewDataDisplay>
          <ReviewDataTitle>제출된 리뷰 데이터</ReviewDataTitle>
          
          <ReviewDataItem>
            <ReviewDataLabel>별점:</ReviewDataLabel>
            <ReviewDataValue>{reviewData.rating}점</ReviewDataValue>
          </ReviewDataItem>
          
          <ReviewDataItem>
            <ReviewDataLabel>리뷰 내용:</ReviewDataLabel>
            <ReviewDataValue>{reviewData.content}</ReviewDataValue>
          </ReviewDataItem>
          
          <ReviewDataItem>
            <ReviewDataLabel>업로드된 이미지:</ReviewDataLabel>
            <ReviewDataValue>{reviewData.images.length}장</ReviewDataValue>
            {reviewData.images.length > 0 && (
              <ImagePreviewContainer>
                {reviewData.images.map((image: File, index: number) => (
                  <ImagePreview
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`이미지 ${index + 1}`}
                  />
                ))}
              </ImagePreviewContainer>
            )}
          </ReviewDataItem>
        </ReviewDataDisplay>
      )}
    </DemoContainer>
  );
}
