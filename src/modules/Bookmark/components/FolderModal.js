import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

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

const FolderModal = ({ isOpen, onClose, onSave, folder = null }) => {
  const [name, setName] = useState('');
  
  // 初始化表单数据
  useEffect(() => {
    if (folder) {
      setName(folder.name);
    } else {
      setName('');
    }
  }, [folder, isOpen]);
  
  // 处理表单输入变化
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  
  // 保存文件夹
  const handleSave = () => {
    if (!name.trim()) {
      alert('请填写文件夹名称');
      return;
    }
    
    onSave({
      name: name.trim()
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{folder ? '编辑文件夹' : '添加文件夹'}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <FormGroup>
          <Label>名称</Label>
          <Input 
            type="text" 
            value={name} 
            onChange={handleNameChange} 
            placeholder="文件夹名称"
          />
        </FormGroup>
        
        <ButtonGroup>
          <Button className="secondary" onClick={onClose}>取消</Button>
          <Button className="primary" onClick={handleSave}>保存</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

export default FolderModal;