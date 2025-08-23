import React, { useState } from "react";
import styled from "styled-components";
import ImageModal from "./ImageModal";

interface ImageGalleryProps {
  images: string[];
  altText?: string;
}

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ImageItem = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  cursor: pointer;
  border: 1px solid var(--neutral-200);
`;

export default function ImageGallery({ images, altText = "이미지" }: ImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // 이미지가 없으면 렌더링하지 않음
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <Container>
        {images.map((image, index) => (
          <ImageItem
            key={index}
            src={image}
            alt={`${altText} ${index + 1}`}
            onClick={() => openModal(index)}
          />
        ))}
      </Container>

      <ImageModal
        isOpen={isModalOpen}
        images={images}
        currentIndex={currentIndex}
        onClose={closeModal}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
    </>
  );
}
