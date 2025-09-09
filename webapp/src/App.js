import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import LoginRegister from './components/LoginRegister';
import MainInterface from './components/MainInterface';
import MemoInterface from './components/MemoInterface';
import ListenToWindInterface from './components/ListenToWindInterface';
import FindPartnerInterface from './components/FindPartnerInterface';
import SettingsInterface from './components/SettingsInterface';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    email: '',
    phone: '',
    avatar: null,
    nickname: '用户',
    grade: '高一',
    class: '1班',
    name: '张三',
    score: 0,
    isAnonymous: false
  });

  useEffect(() => {
    // 从localStorage加载用户数据和登录状态
    const savedUserData = localStorage.getItem('userData');
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
    
    if (savedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const updateUserData = (newData) => {
    const updatedData = { ...userData, ...newData };
    setUserData(updatedData);
    localStorage.setItem('userData', JSON.stringify(updatedData));
  };

  const handleLogin = (loginData) => {
    setUserData(prev => ({ ...prev, ...loginData }));
    setIsLoggedIn(true);
    localStorage.setItem('userData', JSON.stringify({ ...userData, ...loginData }));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!isLoggedIn) {
    return <LoginRegister onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainInterface userData={userData} updateUserData={updateUserData} onLogout={handleLogout} />} />
          <Route path="/memo" element={<MemoInterface userData={userData} />} />
          <Route path="/listen-to-wind" element={<ListenToWindInterface userData={userData} />} />
          <Route path="/find-partner" element={<FindPartnerInterface userData={userData} />} />
          <Route path="/settings" element={<SettingsInterface userData={userData} updateUserData={updateUserData} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;