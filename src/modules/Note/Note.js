import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { saveToStorage, getFromStorage } from '../../utils/storage';
import { format } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';

// 图标导入
import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete'; // 暂时未使用
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const NoteContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--card-background);
  box-shadow: 0 2px 5px var(--shadow-color);
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const NoteListContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const NoteCard = styled.div`
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 5px var(--shadow-color);
  padding: 15px;
  cursor: pointer;
  transition: all var(--transition-speed);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px var(--shadow-color);
  }
`;

const NoteTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NotePreview = styled.div`
  font-size: 14px;
  color: var(--text-secondary-color);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  margin-bottom: 10px;
`;

const NoteDate = styled.div`
  font-size: 12px;
  color: var(--text-secondary-color);
  text-align: right;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-color);
  opacity: 0.7;
  grid-column: 1 / -1;
`;

const EditorContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: var(--card-background);
  box-shadow: 0 2px 5px var(--shadow-color);
`;

const EditorTitleInput = styled.input`
  flex: 1;
  margin: 0 15px;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 16px;
`;

const EditorContent = styled.textarea`
  flex: 1;
  padding: 20px;
  border: none;
  resize: none;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 16px;
  line-height: 1.6;
  
  &:focus {
    outline: none;
  }
`;

const Note = () => {
  // 状态
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // 初始化数据
  useEffect(() => {
    const savedNotes = getFromStorage('homepage-notes', []);
    setNotes(savedNotes);
  }, []);
  
  // 创建新笔记
  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: '新笔记',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTitle(newNote.title);
    setContent(newNote.content);
    setCurrentNote(newNote);
    setIsEditing(true);
  };
  
  // 打开笔记
  const openNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCurrentNote(note);
    setIsEditing(true);
  };
  
  // 返回笔记列表
  const backToList = () => {
    setIsEditing(false);
    setCurrentNote(null);
    setTitle('');
    setContent('');
  };
  
  // 保存笔记
  const saveNote = () => {
    const now = new Date().toISOString();
    
    let updatedNotes;
    
    if (currentNote && currentNote.id) {
      // 更新现有笔记
      const updatedNote = {
        ...currentNote,
        title: title.trim() || '无标题',
        content,
        updatedAt: now
      };
      
      updatedNotes = notes.map(note => 
        note.id === currentNote.id ? updatedNote : note
      );
      
      setCurrentNote(updatedNote);
    } else {
      // 创建新笔记
      const newNote = {
        id: Date.now(),
        title: title.trim() || '无标题',
        content,
        createdAt: now,
        updatedAt: now
      };
      
      updatedNotes = [...notes, newNote];
      setCurrentNote(newNote);
    }
    
    setNotes(updatedNotes);
    saveToStorage('homepage-notes', updatedNotes);
    
    // 显示保存成功提示
    alert('笔记已保存');
  };
  
  // 删除笔记
  const deleteNote = (id) => {
    if (window.confirm('确定要删除这个笔记吗？')) {
      const updatedNotes = notes.filter(note => note.id !== id);
      setNotes(updatedNotes);
      saveToStorage('homepage-notes', updatedNotes);
      
      if (currentNote && currentNote.id === id) {
        backToList();
      }
    }
  };
  
  // 处理标题变化
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  
  // 处理内容变化
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  
  // 按更新时间排序笔记
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.updatedAt) - new Date(a.updatedAt)
  );
  
  // 格式化日期
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  };
  
  if (isEditing) {
    return (
      <EditorContainer>
        <EditorHeader>
          <ActionButton onClick={backToList} title="返回">
            <ArrowBackIcon />
          </ActionButton>
          <EditorTitleInput 
            value={title} 
            onChange={handleTitleChange} 
            placeholder="笔记标题"
          />
          <ActionButton onClick={saveNote} title="保存">
            <SaveIcon />
          </ActionButton>
        </EditorHeader>
        
        <EditorContent 
          value={content} 
          onChange={handleContentChange} 
          placeholder="在这里输入笔记内容..."
          autoFocus
        />
      </EditorContainer>
    );
  }
  
  return (
    <NoteContainer>
      <NoteHeader>
        <HeaderTitle>笔记</HeaderTitle>
        <ActionButtons>
          <ActionButton onClick={createNewNote} title="新建笔记">
            <AddIcon />
          </ActionButton>
        </ActionButtons>
      </NoteHeader>
      
      <NoteListContainer>
        {sortedNotes.map(note => (
          <NoteCard key={note.id} onClick={() => openNote(note)}>
            <NoteTitle>{note.title}</NoteTitle>
            <NotePreview>{note.content}</NotePreview>
            <NoteDate>{formatDate(note.updatedAt)}</NoteDate>
          </NoteCard>
        ))}
        
        {notes.length === 0 && (
          <EmptyState>
            <p>暂无笔记，点击右上角添加</p>
          </EmptyState>
        )}
      </NoteListContainer>
    </NoteContainer>
  );
};

export default Note;