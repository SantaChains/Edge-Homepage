import React from 'react';
import styled from 'styled-components';

// 图标导入
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ChecklistIcon from '@mui/icons-material/Checklist';
import NoteIcon from '@mui/icons-material/Note';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import NewspaperIcon from '@mui/icons-material/Newspaper';

const ModuleSwitchContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin: 20px 0;
  padding: 0 20px;
`;

const ModuleButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.active ? 'var(--module-active-background, var(--primary-color))' : 'var(--module-background, transparent)'};
  color: ${props => props.active ? 'white' : 'var(--module-text, var(--text-color))'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--module-border, transparent)'};
  
  &:hover {
    background-color: ${props => props.active ? 'var(--module-active-background, var(--primary-color))' : 'var(--module-hover-background, rgba(0, 0, 0, 0.05))'};
    transform: translateY(-3px);
    box-shadow: 0 5px 15px var(--shadow-color);
  }
  
  svg {
    font-size: 24px;
    margin-bottom: 5px;
    color: ${props => props.active ? 'white' : 'var(--icon-color, var(--text-color))'};
  }
`;

const ModuleLabel = styled.span`
  font-size: 14px;
  font-weight: ${props => props.active ? '500' : 'normal'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
`;

const ModuleSwitch = ({ activeModule, onModuleChange }) => {
  const modules = [
    { id: 'calendar', label: '日历', icon: <CalendarMonthIcon /> },
    { id: 'bookmark', label: '书签', icon: <BookmarkIcon /> },
    { id: 'todo', label: '待办', icon: <ChecklistIcon /> },
    { id: 'note', label: '笔记', icon: <NoteIcon /> },
    { id: 'quote', label: '一语', icon: <FormatQuoteIcon /> },
    { id: 'news', label: '新闻', icon: <NewspaperIcon /> }
  ];
  
  return (
    <ModuleSwitchContainer>
      {modules.map(module => (
        <ModuleButton
          key={module.id}
          active={activeModule === module.id}
          onClick={() => onModuleChange(module.id)}
        >
          {module.icon}
          <ModuleLabel active={activeModule === module.id}>{module.label}</ModuleLabel>
        </ModuleButton>
      ))}
    </ModuleSwitchContainer>
  );
};

export default ModuleSwitch;