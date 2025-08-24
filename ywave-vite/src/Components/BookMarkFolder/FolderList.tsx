import React from "react";
import styled from "styled-components";
import FolderBox from "./FolderBox";

const FolderListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-m);
  width: 100%;
`;

interface Folder {
  groupId?: number;
  id?: number;
  iconUrl?: string;
  unicode?: string;
  groupName?: string;
  name?: string;
  stores?: any[];
}

interface FolderListProps {
  folders: Folder[];
  openMoreId: string | null;
  onMoreClick: (id: string | number | null) => void;
  onFolderClick: (unicode: string, title: string) => void;
  onFolderDelete: (folderId: string) => void;
}

export default function FolderList({
  folders,
  openMoreId,
  onMoreClick,
  onFolderClick,
  onFolderDelete
}: FolderListProps): React.JSX.Element {
  if (folders.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 20px',
        color: 'var(--neutral-500)'
      }}>
        <div className="Body__MediumLarge" style={{ marginBottom: '8px' }}>
          아직 북마크 폴더가 없습니다
        </div>
        <div className="Body__Small">
          새 목록 추가하기 버튼을 눌러 첫 번째 폴더를 만들어보세요!
        </div>
      </div>
    );
  }

  return (
    <FolderListContainer>
      {folders.map((folder, index) => {
        const folderIcon = folder.iconUrl || folder.unicode || '1f4c1';
        const folderId = folder.groupId?.toString() || folder.id?.toString() || `folder-${index}`;
        const folderTitle = folder.groupName || folder.name || `폴더 ${index + 1}`;
        
        return (
          <React.Fragment key={folderId}>
            <FolderBox
              id={folderId}
              unicode={folderIcon}
              title={folderTitle}
              placeCount={folder.stores ? folder.stores.length : 0}
              isMoreOpen={openMoreId === folderId}
              onMoreClick={() => onMoreClick(folderId)}
              onClick={() => onFolderClick(folderIcon, folderTitle)}
              onDelete={() => onFolderDelete(folderId)}
            />
            {index < folders.length - 1 && (
              <div style={{height: 1, background: "var(--neutral-200)", width: "100%"}} />
            )}
          </React.Fragment>
        );
      })}
    </FolderListContainer>
  );
}
