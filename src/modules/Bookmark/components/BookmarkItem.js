import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { getFaviconUrl } from '../../../utils/urlHandler';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BookmarkItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 5px var(--shadow-color);
  cursor: pointer;
  transition: all var(--transition-speed);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px var(--shadow-color);
    
    .bookmark-actions {
      opacity: 1;
    }
  }
`;

const BookmarkIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: ${props => props.bgColor || '#f0f0f0'};
  color: ${props => props.textColor || '#333'};
  font-size: 24px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const BookmarkName = styled.div`
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

const BookmarkActions = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  opacity: 0;
  transition: opacity var(--transition-speed);
`;

const BookmarkActionButton = styled.button`
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

const BookmarkItem = ({ bookmark, index, onEdit, onDelete, onClick }) => {
  return (
    <Draggable draggableId={`bookmark-${bookmark.id}`} index={index}>
      {(provided) => (
        <BookmarkItemContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(bookmark.url)}
        >
          <BookmarkIcon>
            {bookmark.icon.length <= 2 ? (
              <span>{bookmark.icon}</span>
            ) : (
              <img 
                src={bookmark.icon} 
                alt={bookmark.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFaviconUrl(bookmark.url);
                }} 
              />
            )}
          </BookmarkIcon>
          <BookmarkName>{bookmark.name}</BookmarkName>
          <BookmarkActions className="bookmark-actions">
            <BookmarkActionButton onClick={(e) => {
              e.stopPropagation();
              onEdit(bookmark);
            }}>
              <EditIcon fontSize="small" />
            </BookmarkActionButton>
            <BookmarkActionButton onClick={(e) => {
              e.stopPropagation();
              onDelete(bookmark.id);
            }}>
              <DeleteIcon fontSize="small" />
            </BookmarkActionButton>
          </BookmarkActions>
        </BookmarkItemContainer>
      )}
    </Draggable>
  );
};

export default BookmarkItem;