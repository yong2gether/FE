import React, { useState, useRef } from "react";
import styled from "styled-components";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PiX, PiPlus, PiTrash } from "react-icons/pi";
import CustomAlert from "../Modal/CustomAlert";

interface ReviewWriteModalProps {
  isOpen: boolean;
  placeName: string;
  onClose: () => void;
  onSubmit: (reviewData: ReviewData) => void;
  mode?: 'create' | 'edit';
  initialData?: ReviewData;
}

interface ReviewData {
  rating: number;
  images: File[];
  content: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
  padding: 0;
  
  @media (min-width: 768px) {
    align-items: center;
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 0;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  max-width: 90vw;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  
  @media (min-width: 768px) {
    max-width: 480px;
    padding: 24px;
    max-height: 85vh;
  }
  
  @media (max-width: 480px) {
    padding: 20px 16px;
    max-height: 90vh;
    border-radius: 16px 16px 0 0;
    margin: 0;
    width: 100%;
    max-width: none;
    transform: translateY(0);
    animation: slideUp 0.3s ease-out;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-1000);
  
  @media (max-width: 480px) {
    font-size: 20px;
    text-align: center;
    margin-bottom: 8px;
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--neutral-100);
  border: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--neutral-200);
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const PlaceName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: var(--neutral-700);
  margin-bottom: 16px;
  
  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: 20px;
    text-align: center;
    padding: 0 8px;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--neutral-1000);
  margin-bottom: 12px;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 480px) {
    gap: 12px;
    justify-content: center;
    padding: 16px 0;
  }
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.1);
  }
  
  @media (max-width: 480px) {
    padding: 4px;
  }
`;

const Star = styled.div<{ $isFilled: boolean }>`
  width: 24px;
  height: 24px;
  color: ${({ $isFilled }) =>
    $isFilled ? "var(--primary-blue-500)" : "var(--neutral-300)"};
    
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

const RatingText = styled.div`
  font-size: 14px;
  color: var(--neutral-600);
  margin-left: 8px;
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed var(--neutral-300);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;

  &:hover {
    border-color: var(--primary-blue-500);
    background: var(--primary-blue-alpha-10);
  }
  
  @media (min-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 20px 16px;
    border-radius: 8px;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const UploadIcon = styled.div`
  font-size: 24px;
  color: var(--neutral-500);
  margin-bottom: 8px;
`;

const UploadText = styled.div`
  font-size: 14px;
  color: var(--neutral-600);
  margin-bottom: 4px;
`;

const UploadSubtext = styled.div`
  font-size: 12px;
  color: var(--neutral-500);
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 10px;
  margin-top: 16px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: 8px;
    margin-top: 12px;
  }
`;

const ImagePreviewItem = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  
  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    border-radius: 6px;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 3px;
  right: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 9px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
  }
  
  @media (min-width: 768px) {
    top: 4px;
    right: 4px;
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
  
  @media (max-width: 480px) {
    top: 2px;
    right: 2px;
    width: 16px;
    height: 16px;
    font-size: 8px;
  }
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--primary-blue-500);
  }

  &::placeholder {
    color: var(--neutral-500);
  }
  
  @media (min-width: 768px) {
    min-height: 120px;
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    min-height: 80px;
    padding: 10px;
    border-radius: 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
  
  @media (min-width: 768px) {
    margin-top: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 16px;
  }
`;

const Button = styled.button<{ $isPrimary?: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
   
  ${({ $isPrimary }) => $isPrimary ? `
    background: var(--primary-blue-500);
    color: white;
    
    &:hover {
      background: var(--primary-blue-600);
      transform: translateY(-1px);
    }
  ` : `
    background: var(--neutral-100);
    color: var(--neutral-700);
    border: 1px solid var(--neutral-200);
    
    &:hover {
      background: var(--neutral-200);
    }
  `}
  
  @media (max-width: 480px) {
    padding: 16px 20px;
    font-size: 16px;
    min-height: 48px;
  }
`;

export default function ReviewWriteModal({
  isOpen,
  placeName,
  onClose,
  onSubmit,
  mode = 'create',
  initialData,
}: ReviewWriteModalProps): React.JSX.Element | null {
  const [rating, setRating] = useState<number>(initialData?.rating || 0);
  const [images, setImages] = useState<File[]>(initialData?.images || []);
  const [content, setContent] = useState<string>(initialData?.content || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  if (!isOpen) return null;

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = files.filter(file => 
      file.type.startsWith('image/') && 
      !images.some(img => img.name === file.name)
    );
    
    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleImageDelete = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const showAlert = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setAlertConfig({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const handleSubmit = () => {
    if (rating === 0) {
      showAlert("별점 선택 필요", "별점을 선택해주세요.", "warning");
      return;
    }

    if (content.trim() === "") {
      showAlert("리뷰 내용 필요", "리뷰 내용을 작성해주세요.", "warning");
      return;
    }

    // 이미지 개수 제한 (선택사항)
    if (images.length > 10) {
      showAlert("이미지 개수 제한", "사진은 최대 10장까지 업로드할 수 있습니다.", "warning");
      return;
    }

    onSubmit({
      rating,
      images,
      content: content.trim(),
    });
  };

  const handleClose = () => {
    setRating(initialData?.rating || 0);
    setImages(initialData?.images || []);
    setContent(initialData?.content || "");
    onClose();
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      return (
        <StarButton key={starNumber} onClick={() => handleStarClick(starNumber)}>
          <Star $isFilled={starNumber <= rating}>
            {starNumber <= rating ? <AiFillStar /> : <AiOutlineStar />}
          </Star>
        </StarButton>
      );
    });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="Title__H4">
            {mode === 'edit' ? '리뷰 수정' : '리뷰 작성'}
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <PiX />
          </CloseButton>
        </ModalHeader>

        <PlaceName className="Body__Default">{placeName}</PlaceName>

        <Section>
          <SectionTitle className="Body__MediumDefault">별점</SectionTitle>
          <RatingContainer>
            {renderStars()}
            <RatingText className="Body__Default">
              {rating > 0 ? `${rating}점` : "별점을 선택해주세요"}
            </RatingText>
          </RatingContainer>
        </Section>

        <Section>
          <SectionTitle className="Body__MediumDefault">사진</SectionTitle>
          <ImageUploadContainer onClick={() => fileInputRef.current?.click()}>
            <UploadIcon>
              <PiPlus />
            </UploadIcon>
            <UploadText className="Body__Default">사진을 추가해주세요</UploadText>
            <UploadSubtext className="Body__Small">
              여러 장의 사진을 선택할 수 있습니다
            </UploadSubtext>
          </ImageUploadContainer>
          
          <HiddenInput
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />

          {images.length > 0 && (
            <ImagePreviewContainer>
              {images.map((image, index) => (
                <ImagePreviewItem key={index}>
                  <ImagePreview
                    src={URL.createObjectURL(image)}
                    alt={`업로드된 이미지 ${index + 1}`}
                  />
                  <DeleteButton onClick={() => handleImageDelete(index)}>
                    <PiTrash />
                  </DeleteButton>
                </ImagePreviewItem>
              ))}
            </ImagePreviewContainer>
          )}
        </Section>

        <Section>
          <SectionTitle className="Body__MediumDefault">리뷰 내용</SectionTitle>
          <ContentTextarea
            placeholder="이 장소에 대한 리뷰를 작성해주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={500}
          />
        </Section>

        <ButtonContainer>
          <Button onClick={handleClose}>
            취소
          </Button>
          <Button $isPrimary onClick={handleSubmit}>
            {mode === 'edit' ? '리뷰 수정' : '리뷰 등록'}
          </Button>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
}
