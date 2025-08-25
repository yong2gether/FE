import { useEffect } from "react";
import styled from "styled-components";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ImageModalProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  flex-direction: column;
`;

const Image = styled.img`
  max-width: 95vw;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 4px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Navigation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 16px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 20px;
  padding: 12px;
  border-radius: 50%;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Counter = styled.div`
  color: white;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
`;

export default function ImageModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext
}: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen) {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'ArrowLeft') {
          onPrevious();
        } else if (e.key === 'ArrowRight') {
          onNext();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrevious, onNext]);

  if (!isOpen || images.length === 0) return null;

  return (
    <Modal isOpen={isOpen}>
      <CloseButton onClick={onClose}>
        <IoClose />
      </CloseButton>
      
      <Navigation>
        <NavButton 
          onClick={onPrevious} 
          disabled={currentIndex === 0}
        >
          <IoChevronBack />
        </NavButton>
        
        <NavButton 
          onClick={onNext} 
          disabled={currentIndex === images.length - 1}
        >
          <IoChevronForward />
        </NavButton>
      </Navigation>
      
      <Image 
        src={images[currentIndex]} 
        alt={`이미지 ${currentIndex + 1}`}
      />
      
      <Counter>
        {currentIndex + 1} / {images.length}
      </Counter>
    </Modal>
  );
}
