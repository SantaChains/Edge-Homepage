import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { saveToStorage, getFromStorage } from '../../utils/storage';
import axios from 'axios';
import xml2js from 'xml2js';

// 图标导入
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import LinkIcon from '@mui/icons-material/Link';

const NewsContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const NewsHeader = styled.div`
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

const BackButton = styled.button`
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
  margin-right: 15px;
  
  &:hover {
    background-color: #3a7bc8;
  }
`;

const SourcesContainer = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: 10px 20px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--background-color);
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--border-color);
    border-radius: 4px;
  }
`;

const SourceButton = styled.button`
  background-color: ${props => props.active ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: none;
  border-radius: 20px;
  padding: 8px 15px;
  margin-right: 10px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--primary-color)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  svg {
    font-size: 16px;
  }
`;

const AddSourceButton = styled.button`
  background-color: var(--card-background);
  color: var(--primary-color);
  border: 1px dashed var(--primary-color);
  border-radius: 20px;
  padding: 8px 15px;
  margin-right: 10px;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const NewsContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NewsItem = styled.a`
  display: block;
  padding: 15px;
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 2px 5px var(--shadow-color);
  cursor: pointer;
  text-decoration: none;
  color: var(--text-color);
  transition: all var(--transition-speed);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px var(--shadow-color);
  }
  
  &:visited {
    opacity: 0.7;
  }
`;

const NewsTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const NewsDate = styled.div`
  font-size: 12px;
  color: var(--text-secondary-color);
  margin-top: 5px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-color);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #e53935;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-color);
  opacity: 0.7;
`;

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
  max-width: 500px;
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
  
  &.danger {
    background-color: #e53935;
    color: white;
    
    &:hover {
      background-color: #c62828;
    }
  }
`;

const SourcesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const SourceItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: var(--card-background);
  border-radius: 4px;
  border-left: 3px solid ${props => props.type === 'rss' ? '#ff9800' : '#2196f3'};
`;

const SourceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SourceName = styled.div`
  font-weight: 500;
`;

const SourceUrl = styled.div`
  font-size: 12px;
  color: var(--text-secondary-color);
  word-break: break-all;
`;

const SourceActions = styled.div`
  display: flex;
  gap: 5px;
`;

const ActionIconButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary-color);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--primary-color);
  }
  
  &.delete:hover {
    color: #e53935;
  }
`;

// 代理服务器URL，用于解决跨域问题
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://crossorigin.me/'
];

const News = () => {
  // 状态
  const [sources, setSources] = useState([]);
  const [activeSource, setActiveSource] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: 'rss'
  });
  
  // 初始化数据
  useEffect(() => {
    const savedSources = getFromStorage('homepage-news-sources', []);
    setSources(savedSources);
    
    if (savedSources.length > 0) {
      setActiveSource(savedSources[0]);
    }
  }, []);
  
  // 当活动源变化时，加载新闻
  useEffect(() => {
    if (activeSource) {
      loadNews(activeSource);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSource]);
  
  // 加载新闻
  const loadNews = async (source) => {
    setLoading(true);
    setError(null);
    setNewsItems([]);
    
    try {
      if (source.type === 'rss') {
        await loadRssNews(source);
      } else {
        await loadHtmlNews(source);
      }
    } catch (err) {
      console.error('加载新闻失败:', err);
      setError(`加载失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 加载RSS新闻
  const loadRssNews = async (source) => {
    let lastError = null;
    
    // 尝试所有代理服务器
    for (const proxy of CORS_PROXIES) {
      try {
        console.log(`尝试使用代理: ${proxy} 加载: ${source.url}`);
        
        const response = await axios.get(`${proxy}${encodeURIComponent(source.url)}`, {
          headers: {
            'Accept': 'application/rss+xml, application/xml, text/xml, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const xmlData = response.data;
        
        // 解析XML
        const parsePromise = new Promise((resolve, reject) => {
          xml2js.parseString(xmlData, { 
            explicitArray: false,
            ignoreAttrs: false,
            trim: true,
            normalize: true,
            normalizeTags: false,
            mergeAttrs: true,
            explicitRoot: false
          }, (err, result) => {
            if (err) {
              console.error('XML解析错误:', err);
              reject(new Error('解析RSS失败'));
              return;
            }
            resolve(result);
          });
        });
        
        const parsedResult = await parsePromise;
        processRssResult(parsedResult);
        return; // 成功处理，直接返回
        
      } catch (error) {
        console.error(`使用代理 ${proxy} 加载失败:`, error);
        lastError = error;
      }
    }
    
    // 所有代理都失败了
    throw lastError || new Error('加载RSS失败: 所有代理服务器都失败了');
  };
  
  // 处理RSS解析结果
  const processRssResult = (result) => {
    let items = [];
    
    try {
      // 处理不同的RSS格式
      if (result.rss && result.rss.channel) {
        // 标准RSS 2.0
        const channel = Array.isArray(result.rss.channel) ? result.rss.channel[0] : result.rss.channel;
        const channelItems = channel.item || [];
        const itemsArray = Array.isArray(channelItems) ? channelItems : [channelItems];
        
        items = itemsArray.map(item => ({
          title: extractTextContent(item.title) || '无标题',
          link: extractTextContent(item.link) || '#',
          date: item.pubDate ? new Date(extractTextContent(item.pubDate)) : new Date(),
          description: extractTextContent(item.description) || ''
        }));
      } else if (result.feed && result.feed.entry) {
        // Atom格式
        const entries = Array.isArray(result.feed.entry) ? result.feed.entry : [result.feed.entry];
        
        items = entries.map(entry => ({
          title: extractTextContent(entry.title) || '无标题',
          link: extractLinkFromEntry(entry) || '#',
          date: entry.updated ? new Date(extractTextContent(entry.updated)) : 
                entry.published ? new Date(extractTextContent(entry.published)) : new Date(),
          description: extractTextContent(entry.summary || entry.content) || ''
        }));
      }
      
      // 辅助函数：从各种可能的格式中提取文本内容
      function extractTextContent(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) {
          if (value.length === 0) return '';
          if (typeof value[0] === 'string') return value[0];
          if (value[0] && value[0]._) return value[0]._;
        }
        if (typeof value === 'object' && value._) return value._;
        return '';
      }
      
      // 辅助函数：从entry对象中提取链接
      function extractLinkFromEntry(entry) {
        if (!entry.link) return '';
        if (typeof entry.link === 'string') return entry.link;
        if (Array.isArray(entry.link)) {
          for (const link of entry.link) {
            if (typeof link === 'string') return link;
            if (link.$ && link.$.href) return link.$.href;
          }
        }
        if (entry.link.$ && entry.link.$.href) return entry.link.$.href;
        return '';
      }
      
      setNewsItems(items);
    } catch (parseError) {
      console.error('RSS内容解析错误:', parseError);
      throw new Error('RSS内容解析失败');
    }
  };
  
  // 加载HTML新闻
  const loadHtmlNews = async (source) => {
    let lastError = null;
    
    // 尝试所有代理服务器
    for (const proxy of CORS_PROXIES) {
      try {
        console.log(`尝试使用代理: ${proxy} 加载HTML: ${source.url}`);
        const response = await axios.get(`${proxy}${encodeURIComponent(source.url)}`);
        const htmlData = response.data;
        
        if (htmlData) {
          // 创建一个临时的DOM元素来解析HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlData, 'text/html');
          
          // 尝试找到新闻标题
          const headings = Array.from(doc.querySelectorAll('h1, h2, h3, .title, .headline, article header') || []);
          
          const items = headings.map(heading => {
            // 尝试找到链接
            let link = '#';
            const linkElement = heading.querySelector('a') || heading.closest('a');
            if (linkElement && linkElement.href) {
              // 处理相对URL
              if (linkElement.href.startsWith('/')) {
                const url = new URL(source.url);
                link = `${url.protocol}//${url.host}${linkElement.href}`;
              } else {
                link = linkElement.href;
              }
            }
            
            return {
              title: heading.textContent.trim(),
              link,
              date: new Date(),
              description: ''
            };
          }).filter(item => item.title);
          
          if (items.length > 0) {
            setNewsItems(items);
            return;
          }
        }
      } catch (proxyError) {
        console.error(`使用代理 ${proxy} 加载HTML失败:`, proxyError);
        lastError = proxyError;
      }
    }
    
    throw lastError || new Error('加载HTML失败: 所有代理服务器都失败了');
  };
  
  // 打开添加源模态框
  const openAddSourceModal = () => {
    setEditingSource(null);
    setFormData({
      name: '',
      url: '',
      type: 'rss'
    });
    setShowModal(true);
  };
  
  // 打开编辑源模态框
  const openEditSourceModal = (source) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      url: source.url,
      type: source.type
    });
    setShowModal(true);
  };
  
  // 关闭模态框
  const closeModal = () => {
    setShowModal(false);
    setEditingSource(null);
  };
  
  // 打开源列表模态框
  const openSourcesModal = () => {
    setShowSourcesModal(true);
  };
  
  // 关闭源列表模态框
  const closeSourcesModal = () => {
    setShowSourcesModal(false);
  };
  
  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 保存源
  const saveSource = () => {
    if (!formData.name.trim() || !formData.url.trim()) {
      alert('请填写完整信息');
      return;
    }
    
    const newSource = {
      id: editingSource ? editingSource.id : Date.now(),
      name: formData.name.trim(),
      url: formData.url.trim(),
      type: formData.type
    };
    
    let updatedSources;
    
    if (editingSource) {
      // 编辑现有源
      updatedSources = sources.map(source => 
        source.id === editingSource.id ? newSource : source
      );
    } else {
      // 添加新源
      updatedSources = [...sources, newSource];
    }
    
    setSources(updatedSources);
    saveToStorage('homepage-news-sources', updatedSources);
    
    // 如果是第一个源，或者是新添加的源，自动设为活动源
    if (sources.length === 0 || !editingSource) {
      setActiveSource(newSource);
    }
    
    // 关闭所有模态框
    closeModal();
    closeSourcesModal();
  };
  
  // 删除源
  const deleteSource = (id) => {
    if (window.confirm('确定要删除这个新闻源吗？')) {
      const updatedSources = sources.filter(source => source.id !== id);
      setSources(updatedSources);
      saveToStorage('homepage-news-sources', updatedSources);
      
      // 如果删除的是当前活动源，切换到第一个源
      if (activeSource && activeSource.id === id) {
        if (updatedSources.length > 0) {
          setActiveSource(updatedSources[0]);
        } else {
          setActiveSource(null);
          setNewsItems([]);
        }
      }
      
      // 如果是在源列表模态框中删除，不关闭模态框
      if (!showSourcesModal) {
        closeModal();
      }
    }
  };
  
  // 返回主页
  const goBack = () => {
    window.history.back();
  };
  
  return (
    <NewsContainer>
      <NewsHeader>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BackButton onClick={goBack} title="返回">
            <ArrowBackIcon />
          </BackButton>
          <HeaderTitle>新闻</HeaderTitle>
        </div>
      </NewsHeader>
      
      <SourcesContainer>
        {sources.map(source => (
          <SourceButton 
            key={source.id} 
            active={activeSource && activeSource.id === source.id}
            onClick={() => setActiveSource(source)}
          >
            {source.type === 'rss' ? <RssFeedIcon /> : <LinkIcon />}
            {source.name}
          </SourceButton>
        ))}
        
        <AddSourceButton onClick={openSourcesModal}>
          <AddIcon />
          管理源
        </AddSourceButton>
      </SourcesContainer>
      
      <NewsContent>
        {loading ? (
          <LoadingState>加载中...</LoadingState>
        ) : error ? (
          <ErrorState>{error}</ErrorState>
        ) : newsItems.length > 0 ? (
          <NewsList>
            {newsItems.map((item, index) => (
              <NewsItem key={index} href={item.link} target="_blank" rel="noopener noreferrer">
                <NewsTitle>{item.title}</NewsTitle>
                {item.date && (
                  <NewsDate>
                    {item.date.toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </NewsDate>
                )}
              </NewsItem>
            ))}
          </NewsList>
        ) : activeSource ? (
          <EmptyState>
            <p>没有找到新闻</p>
          </EmptyState>
        ) : (
          <EmptyState>
            <p>请添加新闻源</p>
          </EmptyState>
        )}
      </NewsContent>
      
      {/* 添加/编辑源模态框 */}
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editingSource ? '编辑新闻源' : '添加新闻源'}</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            <FormGroup>
              <Label>名称</Label>
              <Input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="新闻源名称"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>类型</Label>
              <Select 
                name="type" 
                value={formData.type} 
                onChange={handleInputChange}
              >
                <option value="rss">RSS 订阅</option>
                <option value="html">网页</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label>URL</Label>
              <Input 
                type="text" 
                name="url" 
                value={formData.url} 
                onChange={handleInputChange} 
                placeholder={formData.type === 'rss' ? 'RSS 订阅地址' : '网页地址'}
              />
            </FormGroup>
            
            <ButtonGroup>
              {editingSource && (
                <Button 
                  className="danger" 
                  onClick={() => deleteSource(editingSource.id)}
                >
                  删除
                </Button>
              )}
              <Button className="secondary" onClick={closeModal}>取消</Button>
              <Button className="primary" onClick={saveSource}>保存</Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
      
      {/* 源列表模态框 */}
      {showSourcesModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>管理新闻源</ModalTitle>
              <CloseButton onClick={closeSourcesModal}>&times;</CloseButton>
            </ModalHeader>
            
            <Button className="primary" onClick={openAddSourceModal} style={{ width: '100%' }}>
              <AddIcon /> 添加新闻源
            </Button>
            
            <SourcesList>
              {sources.map(source => (
                <SourceItem key={source.id} type={source.type}>
                  <SourceInfo>
                    {source.type === 'rss' ? <RssFeedIcon /> : <LinkIcon />}
                    <div>
                      <SourceName>{source.name}</SourceName>
                      <SourceUrl>{source.url}</SourceUrl>
                    </div>
                  </SourceInfo>
                  <SourceActions>
                    <ActionIconButton onClick={() => openEditSourceModal(source)}>
                      <EditIcon fontSize="small" />
                    </ActionIconButton>
                    <ActionIconButton 
                      className="delete" 
                      onClick={() => deleteSource(source.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </ActionIconButton>
                  </SourceActions>
                </SourceItem>
              ))}
              
              {sources.length === 0 && (
                <EmptyState>
                  <p>暂无新闻源</p>
                </EmptyState>
              )}
            </SourcesList>
            
            <ButtonGroup>
              <Button className="secondary" onClick={closeSourcesModal}>关闭</Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </NewsContainer>
  );
};

export default News;