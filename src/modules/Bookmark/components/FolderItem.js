import React from 'react';
import styled from 'styled-components';
import FolderIcon from '@mui/icons-material/Folder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const FolderItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  background-color: ${props => props.isActive ? 'rgba(74, 144, 226, 0.1)' : 'var(--card-background)'};
  border-radius: 8px;
  box-shadow: 0 2px 5px var(--shadow-color);
  cursor: pointer;
  transition: all var(--transition-speed);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px var(--shadow-color);
    
    .folder-actions {
      opacity: 1;
    }
  }
`;

const FolderIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--primary-color);
  color: white;
  font-size: 24px;
`;

const FolderName = styled.div`
  font-size: 14px;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const FolderActions = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  opacity: 0;
  transition: opacity var(--transition-speed);
`;

const FolderActionButton = styled.button`
  background-color: var(--card-background);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px var(--shadow-color);
  
  svg {
    font-size: 14px;
  }
  
  &:hover {
    background-color: var(--primary-color);
    color: white;
  }
`;

const FolderItem = ({ folder, isActive, onToggle, onEdit, onDelete }) => {
  return (
    <FolderItemContainer isActive={isActive} onClick={() => onToggle(folder.id)}>
      <FolderIconWrapper>
        <FolderIcon />
      </FolderIconWrapper>
      <FolderName>{folder.name}</FolderName>
      <FolderActions className="folder-actions">
        <FolderActionButton onClick={(e) => {
          e.stopPropagation();
          onEdit(folder);
        }}>
          <EditIcon fontSize="small" />
        </FolderActionButton>
        <FolderActionButton onClick={(e) => {
          e.stopPropagation();
          onDelete(folder.id);
        }}>
          <DeleteIcon fontSize="small" />
        </FolderActionButton>
      </FolderActions>
    </FolderItemContainer>
  );
};

export default FolderItem;