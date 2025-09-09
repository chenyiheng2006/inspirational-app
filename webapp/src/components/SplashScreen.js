import React, { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  const [currentQuote, setCurrentQuote] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  
  const quotes = [
    "Nothing is impossible.",
    "明天会更好。",
    "相信自己。"
  ];

  useEffect(() => {
    // 随机选择一条语句
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuoteIndex(randomIndex);
    setCurrentQuote(quotes[randomIndex]);

    // 2.5秒后完成启动画面
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="quote-container">
        <h1 className="quote-text">{currentQuote}</h1>
      </div>
    </div>
  );
};

export default SplashScreen;