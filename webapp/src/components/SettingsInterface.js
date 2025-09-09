import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsInterface.css';

const SettingsInterface = ({ userData, updateUserData }) => {
  const navigate = useNavigate();
  const [editingField, setEditingField] = useState(null);
  const [tempValues, setTempValues] = useState({});
  const [showSuccess, setShowSuccess] = useState('');

  const settingsFields = [
    { key: 'avatar', label: '头像', type: 'file', points: 10 },
    { key: 'nickname', label: '昵称', type: 'text', points: 10 },
    { key: 'grade', label: '年级', type: 'select', points: 10, options: ['高一', '高二', '高三'] },
    { key: 'class', label: '班级', type: 'text', points: 10 },
    { key: 'name', label: '姓名', type: 'text', points: 10 },
    { key: 'isAnonymous', label: '默认匿名发布', type: 'checkbox', points: 0 }
  ];

  const startEdit = (field) => {
    setEditingField(field.key);
    setTempValues({ [field.key]: userData[field.key] || '' });
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValues({});
  };

  const saveEdit = (field) => {
    const newValue = tempValues[field.key];
    const oldValue = userData[field.key];
    
    // 检查是否有实际更改
    if (newValue !== oldValue) {
      // 如果是新的设置且有积分奖励
      if (field.points > 0 && (!oldValue || oldValue === '')) {
        updateUserData({
          [field.key]: newValue,
          score: userData.score + field.points
        });
        showSuccessMessage(`设置成功！获得 ${field.points} 积分奖励！`);
      } else {
        updateUserData({ [field.key]: newValue });
        showSuccessMessage('设置已保存！');
      }
    }
    
    setEditingField(null);
    setTempValues({});
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newValue = event.target.result;
        const oldValue = userData[field.key];
        
        if (field.points > 0 && (!oldValue || oldValue === '')) {
          updateUserData({
            [field.key]: newValue,
            score: userData.score + field.points
          });
          showSuccessMessage(`头像设置成功！获得 ${field.points} 积分奖励！`);
        } else {
          updateUserData({ [field.key]: newValue });
          showSuccessMessage('头像已更新！');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const showSuccessMessage = (message) => {
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(''), 2000);
  };

  const getFieldValue = (field) => {
    if (editingField === field.key) {
      return tempValues[field.key];
    }
    return userData[field.key] || '';
  };

  const getFieldDisplay = (field) => {
    const value = userData[field.key];
    
    if (field.key === 'avatar') {
      if (value) {
        return <img src={value} alt="头像" className="avatar-preview" />;
      }
      return <div className="avatar-placeholder">未设置头像</div>;
    }
    
    if (field.key === 'isAnonymous') {
      return value ? '开启' : '关闭';
    }
    
    return value || '未设置';
  };

  const hasValue = (field) => {
    const value = userData[field.key];
    return value && value !== '';
  };

  const getTotalCompletedSettings = () => {
    return settingsFields.filter(field => 
      field.points > 0 && hasValue(field)
    ).length;
  };

  const getTotalPossiblePoints = () => {
    return settingsFields.reduce((total, field) => total + field.points, 0);
  };

  return (
    <div className="settings-interface">
      {/* 头部 */}
      <header className="settings-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1>个人设置</h1>
        <div className="completion-status">
          {getTotalCompletedSettings()}/{settingsFields.filter(f => f.points > 0).length}
        </div>
      </header>

      {/* 积分展示 */}
      <div className="score-section">
        <div className="score-card">
          <div className="score-icon">🏆</div>
          <div className="score-info">
            <div className="score-number">{userData.score}</div>
            <div className="score-label">总积分</div>
          </div>
          <div className="score-progress">
            <div className="progress-text">
              完善度: {Math.round((userData.score / getTotalPossiblePoints()) * 100)}%
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(userData.score / getTotalPossiblePoints()) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 设置项列表 */}
      <main className="settings-content">
        <div className="settings-list">
          {settingsFields.map(field => (
            <div key={field.key} className="setting-item">
              <div className="setting-header">
                <div className="setting-label">
                  {field.label}
                  {field.points > 0 && !hasValue(field) && (
                    <span className="points-badge">+{field.points}分</span>
                  )}
                  {hasValue(field) && (
                    <span className="completed-badge">✓</span>
                  )}
                </div>
                {editingField !== field.key && (
                  <button 
                    className="edit-btn"
                    onClick={() => startEdit(field)}
                  >
                    编辑
                  </button>
                )}
              </div>

              <div className="setting-content">
                {editingField === field.key ? (
                  <div className="setting-edit">
                    {field.type === 'text' && (
                      <input
                        type="text"
                        className="input"
                        value={getFieldValue(field)}
                        onChange={(e) => setTempValues({
                          ...tempValues,
                          [field.key]: e.target.value
                        })}
                        placeholder={`请输入${field.label}`}
                        autoFocus
                      />
                    )}
                    
                    {field.type === 'select' && (
                      <select
                        className="input"
                        value={getFieldValue(field)}
                        onChange={(e) => setTempValues({
                          ...tempValues,
                          [field.key]: e.target.value
                        })}
                      >
                        <option value="">请选择{field.label}</option>
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                    
                    {field.type === 'checkbox' && (
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={getFieldValue(field)}
                          onChange={(e) => setTempValues({
                            ...tempValues,
                            [field.key]: e.target.checked
                          })}
                        />
                        {getFieldValue(field) ? '开启匿名模式' : '关闭匿名模式'}
                      </label>
                    )}
                    
                    <div className="edit-actions">
                      <button className="btn cancel-btn" onClick={cancelEdit}>
                        取消
                      </button>
                      <button 
                        className="btn save-btn" 
                        onClick={() => saveEdit(field)}
                        disabled={field.type === 'text' && !tempValues[field.key]?.trim()}
                      >
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="setting-display">
                    {field.type === 'file' ? (
                      <div className="file-setting">
                        {getFieldDisplay(field)}
                        <label className="upload-btn">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, field)}
                            style={{ display: 'none' }}
                          />
                          {hasValue(field) ? '更换头像' : '上传头像'}
                        </label>
                      </div>
                    ) : (
                      <div className="field-value">
                        {getFieldDisplay(field)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 积分说明 */}
        <div className="points-info">
          <h3>🎯 积分获取说明</h3>
          <ul>
            <li>首次设置头像：+10分</li>
            <li>首次设置昵称：+10分</li>
            <li>首次设置年级：+10分</li>
            <li>首次设置班级：+10分</li>
            <li>首次设置姓名：+10分</li>
            <li>完善所有信息可获得总计50分！</li>
          </ul>
        </div>

        {/* 其他操作 */}
        <div className="other-actions">
          <button 
            className="action-btn danger-btn"
            onClick={() => {
              if (window.confirm('确定要清除所有数据吗？此操作不可恢复！')) {
                localStorage.clear();
                updateUserData({
                  avatar: null,
                  nickname: '用户',
                  grade: '高一',
                  class: '1班',
                  name: '张三',
                  score: 0,
                  isAnonymous: false
                });
                showSuccessMessage('数据已清除！');
              }
            }}
          >
            🗑️ 清除所有数据
          </button>
        </div>
      </main>

      {/* 成功提示 */}
      {showSuccess && (
        <div className="success-message">
          {showSuccess}
        </div>
      )}
    </div>
  );
};

export default SettingsInterface;