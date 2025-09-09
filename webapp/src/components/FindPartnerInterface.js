import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './FindPartnerInterface.css';

const FindPartnerInterface = ({ userData }) => {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const messagesEndRef = useRef(null);

  const chatRooms = [
    { id: 'basketball', name: '篮球', icon: '🏀', description: '篮球爱好者聚集地' },
    { id: 'skateboard', name: '滑板', icon: '🛹', description: '滑板技巧交流' },
    { id: 'music', name: '音乐', icon: '🎵', description: '音乐分享与讨论' },
    { id: 'study', name: '学习', icon: '📚', description: '学习交流互助' },
    { id: 'gaming', name: '游戏', icon: '🎮', description: '游戏搭子寻找' },
    { id: 'photography', name: '摄影', icon: '📷', description: '摄影技巧分享' }
  ];

  useEffect(() => {
    // 从localStorage加载聊天记录
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    // 滚动到最新消息
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedRoom]);

  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('chatMessages', JSON.stringify(newMessages));
  };

  const sendMessage = () => {
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedRoom) return;

    const message = {
      id: Date.now(),
      content: newMessage.trim(),
      files: selectedFiles.map(file => ({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file)
      })),
      author: {
        nickname: userData.nickname,
        grade: userData.grade,
        class: userData.class,
        avatar: userData.avatar
      },
      timestamp: new Date().toISOString()
    };

    const updatedMessages = {
      ...messages,
      [selectedRoom]: [...(messages[selectedRoom] || []), message]
    };

    saveMessages(updatedMessages);
    setNewMessage('');
    setSelectedFiles([]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRoomMessages = (roomId) => {
    return messages[roomId] || [];
  };

  const getLastMessage = (roomId) => {
    const roomMessages = getRoomMessages(roomId);
    if (roomMessages.length === 0) return '暂无消息';
    const lastMsg = roomMessages[roomMessages.length - 1];
    if (lastMsg.content) {
      return lastMsg.content.length > 20 ? 
        lastMsg.content.substring(0, 20) + '...' : 
        lastMsg.content;
    }
    if (lastMsg.files.length > 0) {
      return lastMsg.files[0].type.startsWith('image/') ? '[图片]' : '[文件]';
    }
    return '暂无消息';
  };

  const getUnreadCount = (roomId) => {
    // 这里可以实现未读消息计数逻辑
    return Math.floor(Math.random() * 5); // 示例：随机未读数
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (selectedRoom) {
    const room = chatRooms.find(r => r.id === selectedRoom);
    const roomMessages = getRoomMessages(selectedRoom);

    return (
      <div className="chat-room">
        {/* 聊天室头部 */}
        <header className="chat-header">
          <button 
            className="back-btn" 
            onClick={() => setSelectedRoom(null)}
          >
            ← 返回
          </button>
          <div className="room-info">
            <span className="room-icon">{room.icon}</span>
            <span className="room-name">{room.name}</span>
          </div>
          <div className="room-members">
            在线 {Math.floor(Math.random() * 50) + 10}
          </div>
        </header>

        {/* 消息列表 */}
        <main className="messages-container">
          <div className="messages-list">
            {roomMessages.length > 0 ? (
              roomMessages.map(message => (
                <div key={message.id} className="message-item">
                  <div className="message-avatar">
                    {message.author.avatar ? (
                      <img src={message.author.avatar} alt="头像" />
                    ) : (
                      message.author.nickname.charAt(0)
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-author">
                        {message.author.nickname}
                      </span>
                      <span className="message-meta">
                        {message.author.grade} {message.author.class}
                      </span>
                      <span className="message-time">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    {message.content && (
                      <div className="message-text">
                        {message.content}
                      </div>
                    )}
                    {message.files.length > 0 && (
                      <div className="message-files">
                        {message.files.map((file, index) => (
                          <div key={index} className="message-file">
                            {file.type.startsWith('image/') ? (
                              <img 
                                src={file.url} 
                                alt={file.name} 
                                className="message-image" 
                              />
                            ) : file.type.startsWith('video/') ? (
                              <video 
                                src={file.url} 
                                controls 
                                className="message-video" 
                              />
                            ) : (
                              <div className="file-placeholder">
                                📎 {file.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-messages">
                <div className="empty-icon">{room.icon}</div>
                <h3>欢迎来到{room.name}聊天室！</h3>
                <p>开始聊天，认识新朋友吧～</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* 消息输入区 */}
        <footer className="message-input-area">
          {selectedFiles.length > 0 && (
            <div className="selected-files-preview">
              {selectedFiles.map((file, index) => (
                <div key={index} className="selected-file-item">
                  <span>{file.name}</span>
                  <button 
                    onClick={() => setSelectedFiles(files => 
                      files.filter((_, i) => i !== index)
                    )}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="input-row">
            <label className="file-btn">
              📎
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </label>
            <textarea
              className="message-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息... (Shift+Enter换行)"
              rows="1"
            />
            <button 
              className="send-btn"
              onClick={sendMessage}
              disabled={!newMessage.trim() && selectedFiles.length === 0}
            >
              发送
            </button>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="find-partner-interface">
      {/* 头部 */}
      <header className="partner-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1>找搭子</h1>
        <div className="online-count">
          在线 {Math.floor(Math.random() * 200) + 100}
        </div>
      </header>

      {/* 聊天室列表 */}
      <main className="rooms-content">
        <div className="rooms-list">
          {chatRooms.map(room => {
            const unreadCount = getUnreadCount(room.id);
            return (
              <div 
                key={room.id} 
                className="room-item"
                onClick={() => setSelectedRoom(room.id)}
              >
                <div className="room-icon-large">
                  {room.icon}
                </div>
                <div className="room-details">
                  <div className="room-header">
                    <h3 className="room-name">{room.name}</h3>
                    {unreadCount > 0 && (
                      <span className="unread-badge">{unreadCount}</span>
                    )}
                  </div>
                  <p className="room-description">{room.description}</p>
                  <div className="room-last-message">
                    {getLastMessage(room.id)}
                  </div>
                </div>
                <div className="room-arrow">
                  →
                </div>
              </div>
            );
          })}
        </div>

        <div className="tips-section">
          <h3>💡 聊天小贴士</h3>
          <ul>
            <li>保持友善，尊重他人</li>
            <li>分享有趣的话题和经验</li>
            <li>找到志同道合的朋友</li>
            <li>遵守聊天室规则</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default FindPartnerInterface;