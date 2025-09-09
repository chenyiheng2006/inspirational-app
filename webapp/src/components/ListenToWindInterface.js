import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListenToWindInterface.css';

const ListenToWindInterface = ({ userData }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('倾诉一下');
  const [posts, setPosts] = useState({
    '倾诉一下': [],
    '吐槽一下': [],
    '勇敢表白': [],
    '一瞬美景': []
  });
  const [showPostModal, setShowPostModal] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentContent, setCommentContent] = useState('');

  const tabs = ['倾诉一下', '吐槽一下', '勇敢表白', '一瞬美景'];

  useEffect(() => {
    // 从localStorage加载帖子数据
    const savedPosts = localStorage.getItem('listenToWindPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const savePosts = (newPosts) => {
    setPosts(newPosts);
    localStorage.setItem('listenToWindPosts', JSON.stringify(newPosts));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const submitPost = () => {
    if (!postContent.trim() && selectedFiles.length === 0) return;

    const newPost = {
      id: Date.now(),
      content: postContent.trim(),
      files: selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      })),
      author: isAnonymous ? {
        nickname: `${userData.grade}年级 ${getGenderDisplay()}`,
        isAnonymous: true
      } : {
        nickname: userData.nickname,
        grade: userData.grade,
        class: userData.class,
        name: userData.name,
        isAnonymous: false
      },
      timestamp: new Date().toISOString(),
      comments: []
    };

    const updatedPosts = {
      ...posts,
      [activeTab]: [newPost, ...posts[activeTab]]
    };

    savePosts(updatedPosts);
    setPostContent('');
    setSelectedFiles([]);
    setShowPostModal(false);
    
    // 显示成功提示
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1000);
  };

  const getGenderDisplay = () => {
    // 这里可以根据用户设置返回性别，暂时返回默认值
    return '男';
  };

  const openCommentModal = (post) => {
    setSelectedPost(post);
    setShowCommentModal(true);
  };

  const submitComment = () => {
    if (!commentContent.trim()) return;

    const newComment = {
      id: Date.now(),
      content: commentContent.trim(),
      author: {
        nickname: userData.nickname,
        grade: userData.grade,
        class: userData.class
      },
      timestamp: new Date().toISOString()
    };

    const updatedPosts = { ...posts };
    const postIndex = updatedPosts[activeTab].findIndex(p => p.id === selectedPost.id);
    if (postIndex !== -1) {
      updatedPosts[activeTab][postIndex].comments.push(newComment);
      savePosts(updatedPosts);
    }

    setCommentContent('');
    setShowCommentModal(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return `${Math.floor(diff / 86400000)}天前`;
  };

  const getTabIcon = (tab) => {
    const icons = {
      '倾诉一下': '💭',
      '吐槽一下': '😤',
      '勇敢表白': '💕',
      '一瞬美景': '📸'
    };
    return icons[tab];
  };

  return (
    <div className="listen-to-wind-interface">
      {/* 头部 */}
      <header className="wind-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1>听风说雨</h1>
        <button className="post-btn" onClick={() => setShowPostModal(true)}>
          + 发布
        </button>
      </header>

      {/* 标签页 */}
      <nav className="tab-nav">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="tab-icon">{getTabIcon(tab)}</span>
            <span className="tab-text">{tab}</span>
          </button>
        ))}
      </nav>

      {/* 帖子列表 */}
      <main className="posts-content">
        {posts[activeTab].length > 0 ? (
          <div className="posts-list">
            {posts[activeTab].map(post => (
              <div key={post.id} className="post-item">
                <div className="post-header">
                  <div className="author-info">
                    <div className="author-avatar">
                      {post.author.nickname.charAt(0)}
                    </div>
                    <div className="author-details">
                      <div className="author-name">{post.author.nickname}</div>
                      {!post.author.isAnonymous && (
                        <div className="author-meta">
                          {post.author.grade} {post.author.class}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="post-time">
                    {formatTimestamp(post.timestamp)}
                  </div>
                </div>
                
                {post.content && (
                  <div className="post-content">
                    {post.content}
                  </div>
                )}
                
                {post.files.length > 0 && (
                  <div className="post-files">
                    {post.files.map((file, index) => (
                      <div key={index} className="file-item">
                        {file.type.startsWith('image/') ? (
                          <img src={file.url} alt={file.name} className="post-image" />
                        ) : file.type.startsWith('video/') ? (
                          <video src={file.url} controls className="post-video" />
                        ) : (
                          <div className="file-placeholder">
                            📎 {file.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="post-actions">
                  <button 
                    className="comment-btn"
                    onClick={() => openCommentModal(post)}
                  >
                    💬 留言 ({post.comments.length})
                  </button>
                </div>
                
                {post.comments.length > 0 && (
                  <div className="comments-section">
                    {post.comments.slice(0, 3).map(comment => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-author">
                          {comment.author.nickname}
                        </div>
                        <div className="comment-content">
                          {comment.content}
                        </div>
                        <div className="comment-time">
                          {formatTimestamp(comment.timestamp)}
                        </div>
                      </div>
                    ))}
                    {post.comments.length > 3 && (
                      <button 
                        className="view-more-comments"
                        onClick={() => openCommentModal(post)}
                      >
                        查看全部 {post.comments.length} 条留言
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">{getTabIcon(activeTab)}</div>
            <h3>暂无内容</h3>
            <p>成为第一个在"{activeTab}"版块发布内容的人吧！</p>
          </div>
        )}
      </main>

      {/* 发布帖子模态框 */}
      {showPostModal && (
        <div className="modal-overlay">
          <div className="modal post-modal">
            <h3>发布到 "{activeTab}"</h3>
            
            <textarea
              className="textarea"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`在${activeTab}分享你的想法...`}
            />
            
            <div className="file-upload">
              <label className="upload-btn">
                📎 添加图片/视频
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </label>
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="selected-file">
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="anonymous-option">
              <label>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                匿名发布（只显示年级和性别）
              </label>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn cancel-btn" 
                onClick={() => {
                  setShowPostModal(false);
                  setPostContent('');
                  setSelectedFiles([]);
                  setIsAnonymous(false);
                }}
              >
                取消
              </button>
              <button 
                className="btn submit-btn" 
                onClick={submitPost}
                disabled={!postContent.trim() && selectedFiles.length === 0}
              >
                发布
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 留言模态框 */}
      {showCommentModal && selectedPost && (
        <div className="modal-overlay">
          <div className="modal comment-modal">
            <h3>留言</h3>
            
            <div className="original-post">
              <div className="post-author">{selectedPost.author.nickname}</div>
              <div className="post-content">{selectedPost.content}</div>
            </div>
            
            <div className="comments-list">
              {selectedPost.comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-author">{comment.author.nickname}</div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-time">{formatTimestamp(comment.timestamp)}</div>
                </div>
              ))}
            </div>
            
            <textarea
              className="textarea"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="写下你的留言..."
            />
            
            <div className="modal-actions">
              <button 
                className="btn cancel-btn" 
                onClick={() => {
                  setShowCommentModal(false);
                  setCommentContent('');
                  setSelectedPost(null);
                }}
              >
                取消
              </button>
              <button 
                className="btn submit-btn" 
                onClick={submitComment}
                disabled={!commentContent.trim()}
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {showSuccess && (
        <div className="success-message">
          收到啦！
        </div>
      )}
    </div>
  );
};

export default ListenToWindInterface;