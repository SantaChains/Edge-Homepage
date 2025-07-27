import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { getFaviconUrl } from '../../../utils/urlHandler';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--background-color);
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: var(--text-color);
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--background-color);
  color: var(--text-color);
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &.primary {
    background-color: var(--primary-color);
    color: white;
    
    &:hover {
      background-color: #3a7bc8;
    }
  }
  
  &.secondary {
    background-color: var(--card-background);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const IconOptions = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
`;

const IconOption = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 4px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const EmojiPicker = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 10px;
  padding: 5px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
`;

const EmojiButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: block;
  padding: 8px;
  background-color: var(--card-background);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const ImagePreview = styled.div`
  width: 100%;
  height: 100px;
  margin-top: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

// 常用表情符号列表
const commonEmojis = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✌️', '🤞',
  '🧠', '👁️', '👀', '👂', '👃', '👄', '👶', '👦', '👧', '👨',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈',
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🏓',
  '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓',
  '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
  '⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '📷', '📸',
  '📚', '📖', '🔖', '📑', '🗂️', '📂', '📁', '📰', '🗞️', '📓',
  '🎮', '🕹️', '🎲', '♟️', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼',
  '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️',
  '🛒', '🛍️', '🧳', '🌂', '☂️', '🧵', '🧶', '👓', '🕶️', '👔'
];

const BookmarkModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  bookmark = null, 
  folders = [] 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
    folderId: ''
  });
  
  const [iconType, setIconType] = useState('favicon'); // favicon, emoji, image
  const [selectedEmoji, setSelectedEmoji] = useState('🔖');
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  // 初始化表单数据
  useEffect(() => {
    if (bookmark) {
      setFormData({
        name: bookmark.name,
        url: bookmark.url,
        icon: bookmark.icon,
        folderId: bookmark.folderId || ''
      });
      
      // 确定图标类型
      if (bookmark.icon.startsWith('data:image') || bookmark.icon.startsWith('http') || bookmark.icon.startsWith('file:')) {
        setIconType('image');
        setImagePreview(bookmark.icon);
      } else if (bookmark.icon.length <= 2) {
        setIconType('emoji');
        setSelectedEmoji(bookmark.icon);
      } else {
        setIconType('favicon');
      }
    } else {
      setFormData({
        name: '',
        url: '',
        icon: '',
        folderId: ''
      });
      setIconType('favicon');
      setSelectedEmoji('🔖');
      setImagePreview('');
    }
  }, [bookmark, isOpen]);
  
  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 处理URL变化，自动获取网站图标
  const handleUrlChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      url: value
    }));
    
    if (iconType === 'favicon' && value) {
      const faviconUrl = getFaviconUrl(value);
      setFormData(prev => ({
        ...prev,
        icon: faviconUrl
      }));
    }
  };
  
  // 处理图标类型变化
  const handleIconTypeChange = (type) => {
    setIconType(type);
    
    // 根据类型设置默认图标
    if (type === 'emoji') {
      setFormData(prev => ({
        ...prev,
        icon: selectedEmoji
      }));
    } else if (type === 'favicon') {
      if (formData.url) {
        const faviconUrl = getFaviconUrl(formData.url);
        setFormData(prev => ({
          ...prev,
          icon: faviconUrl
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          icon: ''
        }));
      }
    } else if (type === 'image') {
      setFormData(prev => ({
        ...prev,
        icon: imagePreview || ''
      }));
    }
  };
  
  // 处理表情符号选择
  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setFormData(prev => ({
      ...prev,
      icon: emoji
    }));
  };
  
  // 处理图片文件选择
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setFormData(prev => ({
          ...prev,
          icon: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 保存书签
  const handleSave = () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      alert('请填写完整信息');
      return;
    }
    
    onSave({
      ...formData,
      name: formData.name.trim(),
      url: formData.url.trim(),
      folderId: formData.folderId || null
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{bookmark ? '编辑书签' : '添加书签'}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <FormGroup>
          <Label>名称</Label>
          <Input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="书签名称"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>URL</Label>
          <Input 
            type="text" 
            name="url" 
            value={formData.url} 
            onChange={handleUrlChange} 
            placeholder="https://example.com"
          />
        </FormGroup>
        
        <FormGroup>
          <Label>文件夹</Label>
          <Select 
            name="folderId" 
            value={formData.folderId} 
            onChange={handleInputChange}
          >
            <option value="">根目录</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>图标</Label>
          <IconOptions>
            <IconOption 
              active={iconType === 'favicon'} 
              onClick={() => handleIconTypeChange('favicon')}
            >
              <LinkIcon />
            </IconOption>
            <IconOption 
              active={iconType === 'emoji'} 
              onClick={() => handleIconTypeChange('emoji')}
            >
              <EmojiEmotionsIcon />
            </IconOption>
            <IconOption 
              active={iconType === 'image'} 
              onClick={() => handleIconTypeChange('image')}
            >
              <ImageIcon />
            </IconOption>
          </IconOptions>
          
          {iconType === 'emoji' && (
            <EmojiPicker>
              {commonEmojis.map(emoji => (
                <EmojiButton 
                  key={emoji} 
                  onClick={() => handleEmojiSelect(emoji)}
                  style={{ 
                    backgroundColor: selectedEmoji === emoji ? 'rgba(0, 0, 0, 0.1)' : 'transparent' 
                  }}
                >
                  {emoji}
                </EmojiButton>
              ))}
            </EmojiPicker>
          )}
          
          {iconType === 'image' && (
            <>
              <FileInputLabel>
                选择图片
                <FileInput 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </FileInputLabel>
              
              {imagePreview && (
                <ImagePreview>
                  <img src={imagePreview} alt="预览" />
                </ImagePreview>
              )}
            </>
          )}
        </FormGroup>
        
        <ButtonGroup>
          <Button className="secondary" onClick={onClose}>取消</Button>
          <Button className="primary" onClick={handleSave}>保存</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default BookmarkModal;