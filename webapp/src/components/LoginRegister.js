import React, { useState } from 'react';
import './LoginRegister.css';

const LoginRegister = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [registerType, setRegisterType] = useState('email'); // 'email' or 'phone'
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    verificationCode: ''
  });
  const [errors, setErrors] = useState({});
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 表单验证
  const validateForm = () => {
    const newErrors = {};

    if (isLogin) {
      // 登录验证
      if (registerType === 'email' && !formData.email) {
        newErrors.email = '请输入邮箱';
      } else if (registerType === 'email' && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = '邮箱格式不正确';
      }

      if (registerType === 'phone' && !formData.phone) {
        newErrors.phone = '请输入手机号';
      } else if (registerType === 'phone' && !/^1[3-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = '手机号格式不正确';
      }

      if (!formData.password) {
        newErrors.password = '请输入密码';
      }
    } else {
      // 注册验证
      if (registerType === 'email' && !formData.email) {
        newErrors.email = '请输入邮箱';
      } else if (registerType === 'email' && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = '邮箱格式不正确';
      }

      if (registerType === 'phone' && !formData.phone) {
        newErrors.phone = '请输入手机号';
      } else if (registerType === 'phone' && !/^1[3-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = '手机号格式不正确';
      }

      if (!formData.password) {
        newErrors.password = '请输入密码';
      } else if (formData.password.length < 6) {
        newErrors.password = '密码长度至少6位';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '请确认密码';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次密码输入不一致';
      }

      if (!formData.nickname) {
        newErrors.nickname = '请输入昵称';
      }

      if (!formData.verificationCode) {
        newErrors.verificationCode = '请输入验证码';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 发送验证码
  const sendVerificationCode = () => {
    if (registerType === 'email' && !formData.email) {
      setErrors({ email: '请先输入邮箱' });
      return;
    }
    if (registerType === 'phone' && !formData.phone) {
      setErrors({ phone: '请先输入手机号' });
      return;
    }

    // 模拟发送验证码
    setIsCodeSent(true);
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCodeSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 模拟验证码（实际项目中应该是后端发送）
    const mockCode = '123456';
    setTimeout(() => {
      alert(`验证码已发送${registerType === 'email' ? '到邮箱' : '到手机'}：${mockCode}`);
    }, 1000);
  };

  // 提交表单
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isLogin) {
      // 登录逻辑
      const userData = {
        email: registerType === 'email' ? formData.email : '',
        phone: registerType === 'phone' ? formData.phone : '',
        nickname: formData.nickname || '用户',
      };
      
      onLogin(userData);
    } else {
      // 注册逻辑
      if (formData.verificationCode !== '123456') {
        setErrors({ verificationCode: '验证码错误' });
        return;
      }

      const userData = {
        email: registerType === 'email' ? formData.email : '',
        phone: registerType === 'phone' ? formData.phone : '',
        nickname: formData.nickname,
      };

      // 注册成功后直接登录
      onLogin(userData);
    }
  };

  // 输入框变化处理
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="login-register-container">
      <div className="form-wrapper">
        <div className="form-header">
          <h1 className="app-title">🌟 励志软件</h1>
          <p className="app-subtitle">让每一天都充满正能量</p>
        </div>

        <div className="tab-switcher">
          <button 
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            登录
          </button>
          <button 
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* 注册方式选择 */}
          <div className="register-type-switcher">
            <button
              type="button"
              className={`type-btn ${registerType === 'email' ? 'active' : ''}`}
              onClick={() => setRegisterType('email')}
            >
              📧 邮箱{isLogin ? '登录' : '注册'}
            </button>
            <button
              type="button"
              className={`type-btn ${registerType === 'phone' ? 'active' : ''}`}
              onClick={() => setRegisterType('phone')}
            >
              📱 手机{isLogin ? '登录' : '注册'}
            </button>
          </div>

          {/* 邮箱输入 */}
          {registerType === 'email' && (
            <div className="form-group">
              <input
                type="email"
                placeholder="请输入邮箱地址"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`form-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          )}

          {/* 手机输入 */}
          {registerType === 'phone' && (
            <div className="form-group">
              <input
                type="tel"
                placeholder="请输入手机号"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`form-input ${errors.phone ? 'error' : ''}`}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          )}

          {/* 密码输入 */}
          <div className="form-group">
            <input
              type="password"
              placeholder="请输入密码"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`form-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* 注册时的额外字段 */}
          {!isLogin && (
            <>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="请确认密码"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="请输入昵称"
                  value={formData.nickname}
                  onChange={(e) => handleInputChange('nickname', e.target.value)}
                  className={`form-input ${errors.nickname ? 'error' : ''}`}
                />
                {errors.nickname && <span className="error-text">{errors.nickname}</span>}
              </div>

              <div className="form-group verification-group">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                  className={`form-input verification-input ${errors.verificationCode ? 'error' : ''}`}
                />
                <button
                  type="button"
                  className="verification-btn"
                  onClick={sendVerificationCode}
                  disabled={isCodeSent}
                >
                  {isCodeSent ? `${countdown}s` : '获取验证码'}
                </button>
                {errors.verificationCode && <span className="error-text">{errors.verificationCode}</span>}
              </div>
            </>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? '立即登录' : '注册并登录'}
          </button>

          {isLogin && (
            <div className="login-options">
              <button type="button" className="forgot-password">
                忘记密码？
              </button>
            </div>
          )}
        </form>

        <div className="form-footer">
          <p>继续使用即表示您同意我们的<span className="link">服务条款</span>和<span className="link">隐私政策</span></p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;