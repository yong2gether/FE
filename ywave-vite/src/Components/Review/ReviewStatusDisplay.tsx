import React from "react";
import styled from "styled-components";

const StatusContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const StatusMessage = styled.div`
  margin-bottom: 8px;
`;

const StatusSubMessage = styled.div`
  margin-top: 8px;
`;

interface ReviewStatusDisplayProps {
  type: 'loading' | 'error' | 'empty';
  message?: string;
  subMessage?: string;
}

export default function ReviewStatusDisplay({ type, message, subMessage }: ReviewStatusDisplayProps) {
  const getDefaultContent = () => {
    switch (type) {
      case 'loading':
        return {
          message: '리뷰를 불러오는 중...',
          className: 'Body__MediumLarge',
          color: 'var(--neutral-500)'
        };
      case 'error':
        return {
          message: message || '리뷰 조회에 실패했습니다',
          className: 'Body__MediumLarge',
          color: 'var(--error-400)'
        };
      case 'empty':
        return {
          message: '아직 작성한 리뷰가 없습니다',
          subMessage: '장소를 방문하고 리뷰를 작성해보세요!',
          className: 'Body__MediumLarge',
          color: 'var(--neutral-500)'
        };
      default:
        return {
          message: '',
          className: 'Body__MediumLarge',
          color: 'var(--neutral-500)'
        };
    }
  };

  const content = getDefaultContent();

  return (
    <StatusContainer style={{ color: content.color }}>
      <StatusMessage className={content.className}>
        {content.message}
      </StatusMessage>
      {content.subMessage && (
        <StatusSubMessage className="Body__Small">
          {content.subMessage}
        </StatusSubMessage>
      )}
      {type === 'error' && subMessage && (
        <StatusSubMessage className="Body__Small" style={{ marginTop: '8px' }}>
          {subMessage}
        </StatusSubMessage>
      )}
    </StatusContainer>
  );
}
