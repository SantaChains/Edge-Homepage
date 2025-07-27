import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { saveToStorage, getFromStorage } from '../../utils/storage';
import { handleUrlChange } from '../../utils/urlHandler';

// 组件导入
import BookmarkItem from './components/BookmarkItem';
import FolderItem from './components/FolderItem';
import BookmarkModal from './components/BookmarkModal';
import FolderModal from './components/FolderModal';

// 图标导入
import AddIcon from '@mui/icons-material/Add';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

const BookmarkContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const BookmarkHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BookmarkTitle = styled.h2`
  margin: 0;
  font-size: 24px;
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

const BookmarkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 20px;
`;

const FolderContent = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
`;

const FolderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const FolderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-color);
  opacity: 0.7;
`;

const Bookmark = () => {
  // 状态
  const [bookmarks, setBookmarks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // add, edit
  const [currentFolder, setCurrentFolder] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  // 初始化数据
  useEffect(() => {
    const savedBookmarks = getFromStorage('homepage-bookmarks', []);
    const savedFolders = getFromStorage('homepage-bookmark-folders', []);
    setBookmarks(savedBookmarks);
    setFolders(savedFolders);
  }, []);
  
  // 打开添加书签模态框
  const openAddBookmarkModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setShowBookmarkModal(true);
  };
  
  // 打开编辑书签模态框
  const openEditBookmarkModal = (bookmark) => {
    setModalMode('edit');
    setEditingItem(bookmark);
    setShowBookmarkModal(true);
  };
  
  // 打开添加文件夹模态框
  const openAddFolderModal = () => {
    setModalMode('add');
    setEditingItem(null);
    setShowFolderModal(true);
  };
  
  // 打开编辑文件夹模态框
  const openEditFolderModal = (folder) => {
    setModalMode('edit');
    setEditingItem(folder);
    setShowFolderModal(true);
  };
  
  // 关闭模态框
  const closeBookmarkModal = () => {
    setShowBookmarkModal(false);
  };
  
  const closeFolderModal = () => {
    setShowFolderModal(false);
  };
  
  // 保存书签
  const saveBookmark = (formData) => {
    // 处理URL格式
    const processedUrl = handleUrlChange(formData.url);
    
    const newBookmark = {
      id: editingItem ? editingItem.id : Date.now(),
      name: formData.name,
      url: processedUrl || formData.url,
      icon: formData.icon,
      folderId: formData.folderId
    };
    
    let updatedBookmarks;
    
    if (modalMode === 'edit') {
      // 编辑现有书签
      updatedBookmarks = bookmarks.map(item => 
        item.id === editingItem.id ? newBookmark : item
      );
    } else {
      // 添加新书签
      updatedBookmarks = [...bookmarks, newBookmark];
    }
    
    setBookmarks(updatedBookmarks);
    saveToStorage('homepage-bookmarks', updatedBookmarks);
    closeBookmarkModal();
  };
  
  // 保存文件夹
  const saveFolder = (formData) => {
    const newFolder = {
      id: editingItem ? editingItem.id : Date.now(),
      name: formData.name
    };
    
    let updatedFolders;
    
    if (modalMode === 'edit') {
      // 编辑现有文件夹
      updatedFolders = folders.map(item => 
        item.id === editingItem.id ? newFolder : item
      );
    } else {
      // 添加新文件夹
      updatedFolders = [...folders, newFolder];
    }
    
    setFolders(updatedFolders);
    saveToStorage('homepage-bookmark-folders', updatedFolders);
    closeFolderModal();
  };
  
  // 删除书签
  const deleteBookmark = (id) => {
    if (window.confirm('确定要删除这个书签吗？')) {
      const updatedBookmarks = bookmarks.filter(item => item.id !== id);
      setBookmarks(updatedBookmarks);
      saveToStorage('homepage-bookmarks', updatedBookmarks);
    }
  };
  
  // 删除文件夹
  const deleteFolder = (id) => {
    if (window.confirm('删除文件夹将会把文件夹内的书签移动到根目录，确定要删除吗？')) {
      // 更新书签，将该文件夹内的书签移动到根目录
      const updatedBookmarks = bookmarks.map(bookmark => {
        if (bookmark.folderId === id) {
          return { ...bookmark, folderId: null };
        }
        return bookmark;
      });
      
      const updatedFolders = folders.filter(folder => folder.id !== id);
      
      setBookmarks(updatedBookmarks);
      setFolders(updatedFolders);
      saveToStorage('homepage-bookmarks', updatedBookmarks);
      saveToStorage('homepage-bookmark-folders', updatedFolders);
      
      // 如果当前正在查看被删除的文件夹，则返回根目录
      if (currentFolder === id) {
        setCurrentFolder(null);
      }
    }
  };
  
  // 打开书签链接
  const openBookmark = (url) => {
    window.open(url, '_blank');
  };
  
  // 切换文件夹
  const toggleFolder = (folderId) => {
    setCurrentFolder(currentFolder === folderId ? null : folderId);
  };
  
  // 处理拖放结束
  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    
    // 如果没有目标位置或者位置没有变化，不做任何处理
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    if (type === 'bookmark') {
      // 处理书签拖放
      const bookmarkId = parseInt(draggableId.replace('bookmark-', ''));
      const bookmark = bookmarks.find(b => b.id === bookmarkId);
      
      if (!bookmark) return;
      
      // 更新书签的文件夹ID
      const targetFolderId = destination.droppableId === 'root' ? null : parseInt(destination.droppableId.replace('folder-', ''));
      
      const updatedBookmarks = bookmarks.map(b => {
        if (b.id === bookmarkId) {
          return { ...b, folderId: targetFolderId };
        }
        return b;
      });
      
      setBookmarks(updatedBookmarks);
      saveToStorage('homepage-bookmarks', updatedBookmarks);
    }
  };
  
  // 过滤根目录书签（不在任何文件夹中）
  const rootBookmarks = bookmarks.filter(bookmark => !bookmark.folderId);
  
  // 获取当前文件夹中的书签
  const folderBookmarks = bookmarks.filter(bookmark => bookmark.folderId === currentFolder);
  
  // 获取当前文件夹信息
  const currentFolderInfo = folders.find(folder => folder.id === currentFolder);
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <BookmarkContainer>
        <BookmarkHeader>
          <BookmarkTitle>书签</BookmarkTitle>
          <ActionButtons>
            <ActionButton onClick={openAddFolderModal} title="添加文件夹">
              <CreateNewFolderIcon />
            </ActionButton>
            <ActionButton onClick={openAddBookmarkModal} title="添加书签">
              <AddIcon />
            </ActionButton>
          </ActionButtons>
        </BookmarkHeader>
        
        {/* 根目录书签和文件夹 */}
        <Droppable droppableId="root" type="bookmark">
          {(provided) => (
            <BookmarkGrid ref={provided.innerRef} {...provided.droppableProps}>
              {rootBookmarks.map((bookmark, index) => (
                <BookmarkItem 
                  key={bookmark.id}
                  bookmark={bookmark}
                  index={index}
                  onEdit={openEditBookmarkModal}
                  onDelete={deleteBookmark}
                  onClick={openBookmark}
                />
              ))}
              
              {folders.map((folder) => (
                <FolderItem 
                  key={folder.id}
                  folder={folder}
                  isActive={currentFolder === folder.id}
                  onToggle={toggleFolder}
                  onEdit={openEditFolderModal}
                  onDelete={deleteFolder}
                />
              ))}
              
              {provided.placeholder}
              
              {rootBookmarks.length === 0 && folders.length === 0 && (
                <EmptyState>
                  <p>暂无书签，点击右上角添加</p>
                </EmptyState>
              )}
            </BookmarkGrid>
          )}
        </Droppable>
        
        {/* 文件夹内容 */}
        {currentFolder && currentFolderInfo && (
          <Droppable droppableId={`folder-${currentFolder}`} type="bookmark">
            {(provided) => (
              <FolderContent>
                <FolderHeader>
                  <FolderTitle>
                    {currentFolderInfo.name}
                  </FolderTitle>
                </FolderHeader>
                
                <BookmarkGrid ref={provided.innerRef} {...provided.droppableProps}>
                  {folderBookmarks.map((bookmark, index) => (
                    <BookmarkItem 
                      key={bookmark.id}
                      bookmark={bookmark}
                      index={index}
                      onEdit={openEditBookmarkModal}
                      onDelete={deleteBookmark}
                      onClick={openBookmark}
                    />
                  ))}
                  
                  {provided.placeholder}
                  
                  {folderBookmarks.length === 0 && (
                    <EmptyState>
                      <p>文件夹为空，拖动书签到此处或点击右上角添加</p>
                    </EmptyState>
                  )}
                </BookmarkGrid>
              </FolderContent>
            )}
          </Droppable>
        )}
        
        {/* 模态框 */}
        <BookmarkModal 
          isOpen={showBookmarkModal}
          onClose={closeBookmarkModal}
          onSave={saveBookmark}
          bookmark={editingItem}
          folders={folders}
        />
        
        <FolderModal 
          isOpen={showFolderModal}
          onClose={closeFolderModal}
          onSave={saveFolder}
          folder={editingItem}
        />
      </BookmarkContainer>
    </DragDropContext>
  );
};

export default Bookmark;