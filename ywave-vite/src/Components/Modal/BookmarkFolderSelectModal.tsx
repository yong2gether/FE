import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { unifiedToEmoji } from "../../utils/emojiToMarker";
import { useBookmarkApi } from "../../hooks/useApi";

interface BookmarkFolderSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
  storeName: string;
  onBookmarkSuccess?: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
`;

const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-m);
  min-height: 100%;
  position: relative;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: var(--spacing-l);
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-1000);
  margin-bottom: 8px;
`;

const Subtitle = styled.div`
  font-size: 14px;
  color: var(--neutral-600);
`;

const FolderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);
  width: 100%;
  flex: 1;
  max-height: 300px;
  overflow-y: auto;
`;

const FolderItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid var(--neutral-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--primary-blue-300);
    background-color: var(--primary-blue-50);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const FolderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-m);
  flex: 1;
`;

const FolderIcon = styled.div`
  font-size: 24px;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FolderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
  flex: 1;
  min-width: 0;
`;

const FolderName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: var(--neutral-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FolderCount = styled.div`
  font-size: 14px;
  color: var(--neutral-600);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--neutral-500);
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button<{ $isPrimary?: boolean }>`
  flex: 1;
  padding: 14px 20px;
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
    }
  ` : `
    background: var(--neutral-100);
    color: var(--neutral-700);
    border: 1px solid var(--neutral-200);
    
    &:hover {
      background: var(--neutral-200);
    }
  `}
`;

export default function BookmarkFolderSelectModal({
  isOpen,
  onClose,
  storeId,
  storeName,
  onBookmarkSuccess
}: BookmarkFolderSelectModalProps): React.JSX.Element | null {
  const [folders, setFolders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getBookmarkGroups, createBookmark } = useBookmarkApi();

  // 디버깅 로그
  console.log("BookmarkFolderSelectModal render:", { isOpen, storeId, storeName });

  // 북마크 폴더 목록 조회
  useEffect(() => {
    if (isOpen) {
      console.log("모달 열림, 폴더 목록 조회 시작");
      fetchBookmarkFolders();
    }
  }, [isOpen]);

  const fetchBookmarkFolders = async () => {
    try {
      setIsLoading(true);
      console.log("북마크 폴더 API 호출 시작");
      const response = await getBookmarkGroups();
      console.log("북마크 폴더 API 응답:", response);
      if (response && response.groups) {
        setFolders(response.groups);
        console.log("폴더 목록 설정 완료:", response.groups.length);
      }
    } catch (error) {
      console.error("북마크 폴더 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderSelect = async (folderId: number) => {
    try {
      console.log("폴더 선택됨:", folderId);
      await createBookmark(storeId, { groupId: folderId });
      console.log("북마크 생성 성공");
      onBookmarkSuccess?.();
      onClose();
    } catch (error) {
      console.error("북마크 생성 실패:", error);
    }
  };

  if (!isOpen) {
    console.log("모달 닫힘 상태");
    return null;
  }

  console.log("모달 렌더링:", { folders: folders.length, isLoading });

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ContentContainer>
          <TitleContainer>
            <Title className="Title__H4">북마크 폴더 선택</Title>
            <Subtitle className="Body__Medium">
              "{storeName}"을(를) <br/>저장할 폴더를 선택해주세요
            </Subtitle>
          </TitleContainer>
          
          {isLoading ? (
            <EmptyMessage>
              <div className="Body__MediumLarge">
                폴더 목록을 불러오는 중...
              </div>
            </EmptyMessage>
          ) : folders.length === 0 ? (
            <EmptyMessage>
              <div className="Body__MediumLarge" style={{ marginBottom: '8px' }}>
                북마크 폴더가 없습니다
              </div>
              <div className="Body__Small">
                먼저 북마크 폴더를 생성해주세요
              </div>
            </EmptyMessage>
          ) : (
            <FolderListContainer>
              {folders.map((folder) => (
                <FolderItem
                  key={folder.groupId}
                  onClick={() => handleFolderSelect(folder.groupId)}
                >
                  <FolderInfo>
                    <FolderIcon>
                      {unifiedToEmoji(folder.iconUrl)}
                    </FolderIcon>
                    <FolderDetails>
                      <FolderName className="Body__MediumLarge">
                        {folder.groupName}
                      </FolderName>
                      <FolderCount className="Body__Small">
                        저장된 장소: {folder.stores.length}개
                      </FolderCount>
                    </FolderDetails>
                  </FolderInfo>
                </FolderItem>
              ))}
            </FolderListContainer>
          )}
          
          <ButtonContainer>
            <Button onClick={onClose}>
              취소
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </ModalContent>
    </ModalOverlay>
  );
}
