import React from "react";
import styled from "styled-components";
import SmallReviewBox from "./SmallReviewBox";
import PencilButton from "../Button/PencilButton";

interface ReviewSectionProps {
  title: string;
  description: string | React.ReactNode;
  reviews: any[];
  showWriteButton?: boolean;
  onWriteClick?: () => void;
}

const Container = styled.div`
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

const EmptyMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: var(--neutral-500);
  font-size: 14px;
`;

export default function ReviewSection({
  title,
  description,
  reviews,
  showWriteButton = false,
  onWriteClick,
}: ReviewSectionProps) {
  return (
    <Container>
      <DescriptionContainer>
        <ReviewDescription>
          <div className="Title__H4">{title}</div>
          <div className="Body__Default">{description}</div>
        </ReviewDescription>
        {showWriteButton && onWriteClick && (
          <PencilButton
            buttonText="리뷰 작성하기"
            onClick={onWriteClick}
          />
        )}
      </DescriptionContainer>
      
      {reviews && reviews.length > 0 ? (
        reviews.map((review, i) => (
          <React.Fragment key={i}>
            <SmallReviewBox
              id={i.toString()}
              {...review}
            />
            {i < reviews.length - 1 && <SmallDivider />}
          </React.Fragment>
        ))
      ) : (
        <EmptyMessage>
          아직 {title.toLowerCase()}가 없습니다.
        </EmptyMessage>
      )}
    </Container>
  );
}
