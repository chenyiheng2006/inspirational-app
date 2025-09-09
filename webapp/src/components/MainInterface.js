import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainInterface.css';

const MainInterface = ({ userData, updateUserData, onLogout }) => {
  const navigate = useNavigate();
  const [isBottomBarVisible, setIsBottomBarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 向下滚动，隐藏底部栏
        setIsBottomBarVisible(false);
      } else {
        // 向上滚动，显示底部栏
        setIsBottomBarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleExit = () => {
    if (window.confirm('确定要退出软件吗？')) {
      onLogout();
    }
  };

  const getAvatarDisplay = () => {
    if (userData.avatar) {
      return <img src={userData.avatar} alt="头像" />;
    }
    return userData.nickname.charAt(0).toUpperCase();
  };

  return (
    <div className="main-interface">
      {/* 顶部导航栏 */}
      <header className="top-navbar">
        <div className="user-info">
          <div className="avatar" onClick={() => navigate('/settings')}>
            {getAvatarDisplay()}
          </div>
          <div className="user-details">
            <div className="nickname">{userData.nickname}</div>
            <div className="grade-class">{userData.grade} {userData.class}</div>
            <div className="score">积分: {userData.score}</div>
          </div>
        </div>
        <button className="exit-btn" onClick={handleExit}>
          退出
        </button>
      </header>

      {/* 主内容区域 */}
      <main className="main-content">
        <div className="welcome-section">
          <h1>欢迎回来，{userData.nickname}！</h1>
          <p>今天也要加油哦～</p>
        </div>

        {/* 功能展示区域 */}
        <div className="feature-showcase">
          <div className="showcase-card">
            <h3>📝 备忘录</h3>
            <p>记录重要事项，高效管理时间</p>
          </div>
          <div className="showcase-card">
            <h3>🌟 听风说雨</h3>
            <p>分享心情，记录美好瞬间</p>
          </div>
          <div className="showcase-card">
            <h3>👥 找搭子</h3>
            <p>结识志同道合的朋友</p>
          </div>
        </div>

        {/* 占位内容，用于测试滚动效果 */}
        <div className="placeholder-content">
          <h2>更多功能敬请期待</h2>
          <div className="content-blocks">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="content-block">
                <h3>功能模块 {i}</h3>
                <p>这里是一些示例内容，用于展示滚动效果。当你向下滚动时，底部功能栏会自动隐藏，让界面更加清爽。</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 底部功能栏 */}
      <nav className={`bottom-navbar ${isBottomBarVisible ? 'visible' : 'hidden'}`}>
        <div className="nav-item" onClick={() => handleNavigation('/memo')}>
          <div className="nav-icon">📝</div>
          <span>备忘录</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigation('/listen-to-wind')}>
          <div className="nav-icon">🌟</div>
          <span>听风说雨</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigation('/find-partner')}>
          <div className="nav-icon">👥</div>
          <span>找搭子</span>
        </div>
        <div className="nav-item" onClick={() => handleNavigation('/settings')}>
          <div className="nav-icon">⚙️</div>
          <span>设置</span>
        </div>
        <div className="nav-item" onClick={handleExit}>
          <div className="nav-icon">🚪</div>
          <span>退出</span>
        </div>
      </nav>
    </div>
  );
};

export default MainInterface;