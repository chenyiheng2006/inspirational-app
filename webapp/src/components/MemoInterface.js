import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MemoInterface.css';

const MemoInterface = ({ userData }) => {
  const navigate = useNavigate();
  const [memos, setMemos] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMemoText, setNewMemoText] = useState('');
  const [editingMemo, setEditingMemo] = useState(null);

  useEffect(() => {
    // 从localStorage加载备忘录
    const savedMemos = localStorage.getItem('memos');
    if (savedMemos) {
      setMemos(JSON.parse(savedMemos));
    }
  }, []);

  const saveMemos = (newMemos) => {
    setMemos(newMemos);
    localStorage.setItem('memos', JSON.stringify(newMemos));
  };

  const addMemo = () => {
    if (newMemoText.trim()) {
      const newMemo = {
        id: Date.now(),
        text: newMemoText.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      const updatedMemos = [...memos, newMemo];
      saveMemos(updatedMemos);
      setNewMemoText('');
      setShowAddModal(false);
    }
  };

  const toggleMemo = (id) => {
    const updatedMemos = memos.map(memo =>
      memo.id === id ? { ...memo, completed: !memo.completed } : memo
    );
    saveMemos(updatedMemos);
  };

  const deleteMemo = (id) => {
    if (window.confirm('确定要删除这个备忘录吗？')) {
      const updatedMemos = memos.filter(memo => memo.id !== id);
      saveMemos(updatedMemos);
    }
  };

  const startEdit = (memo) => {
    setEditingMemo(memo);
    setNewMemoText(memo.text);
    setShowAddModal(true);
  };

  const saveEdit = () => {
    if (newMemoText.trim() && editingMemo) {
      const updatedMemos = memos.map(memo =>
        memo.id === editingMemo.id ? { ...memo, text: newMemoText.trim() } : memo
      );
      saveMemos(updatedMemos);
      setEditingMemo(null);
      setNewMemoText('');
      setShowAddModal(false);
    }
  };

  const cancelEdit = () => {
    setEditingMemo(null);
    setNewMemoText('');
    setShowAddModal(false);
  };

  // 拖拽排序功能
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== dropIndex) {
      const newMemos = [...memos];
      const draggedMemo = newMemos[dragIndex];
      newMemos.splice(dragIndex, 1);
      newMemos.splice(dropIndex, 0, draggedMemo);
      saveMemos(newMemos);
    }
  };

  // 分类显示未完成和已完成的备忘录
  const incompleteMemos = memos.filter(memo => !memo.completed);
  const completedMemos = memos.filter(memo => memo.completed);

  return (
    <div className="memo-interface">
      {/* 头部 */}
      <header className="memo-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← 返回
        </button>
        <h1>备忘录</h1>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          + 添加
        </button>
      </header>

      {/* 备忘录列表 */}
      <main className="memo-content">
        {/* 未完成的备忘录 */}
        {incompleteMemos.length > 0 && (
          <section className="memo-section">
            <h2>待完成 ({incompleteMemos.length})</h2>
            <div className="memo-list">
              {incompleteMemos.map((memo, index) => (
                <div
                  key={memo.id}
                  className={`memo-item ${memo.completed ? 'completed' : ''}`}
                  draggable={!memo.completed}
                  onDragStart={(e) => handleDragStart(e, memos.indexOf(memo))}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, memos.indexOf(memo))}
                >
                  <div className="memo-checkbox">
                    <input
                      type="checkbox"
                      checked={memo.completed}
                      onChange={() => toggleMemo(memo.id)}
                    />
                  </div>
                  <div className="memo-text" onClick={() => startEdit(memo)}>
                    {memo.text}
                  </div>
                  <div className="memo-actions">
                    <button className="edit-btn" onClick={() => startEdit(memo)}>
                      ✏️
                    </button>
                    <button className="delete-btn" onClick={() => deleteMemo(memo.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 已完成的备忘录 */}
        {completedMemos.length > 0 && (
          <section className="memo-section">
            <h2>已完成 ({completedMemos.length})</h2>
            <div className="memo-list">
              {completedMemos.map((memo) => (
                <div key={memo.id} className="memo-item completed">
                  <div className="memo-checkbox">
                    <input
                      type="checkbox"
                      checked={memo.completed}
                      onChange={() => toggleMemo(memo.id)}
                    />
                  </div>
                  <div className="memo-text">{memo.text}</div>
                  <div className="memo-actions">
                    <button className="delete-btn" onClick={() => deleteMemo(memo.id)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 空状态 */}
        {memos.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>暂无备忘录</h3>
            <p>点击右上角的"添加"按钮创建你的第一个备忘录吧！</p>
          </div>
        )}
      </main>

      {/* 添加/编辑备忘录模态框 */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingMemo ? '编辑备忘录' : '添加备忘录'}</h3>
            <textarea
              className="textarea"
              value={newMemoText}
              onChange={(e) => setNewMemoText(e.target.value)}
              placeholder="输入备忘录内容..."
              autoFocus
            />
            <div className="modal-actions">
              <button className="btn cancel-btn" onClick={cancelEdit}>
                取消
              </button>
              <button 
                className="btn save-btn" 
                onClick={editingMemo ? saveEdit : addMemo}
                disabled={!newMemoText.trim()}
              >
                {editingMemo ? '保存' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoInterface;