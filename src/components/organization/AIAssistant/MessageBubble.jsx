import React from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  const styles = {
    wrapper: {
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
    },
    bubble: {
      maxWidth: '85%',
      padding: '12px 16px',
      borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
      fontSize: '14px',
      lineHeight: '1.6',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      background: isUser
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : '#f3f4f6',
      color: isUser ? 'white' : '#111827',
      boxShadow: isUser
        ? '0 4px 12px rgba(118,75,162,0.3)'
        : '0 1px 3px rgba(0,0,0,0.1)',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      flexShrink: 0,
      background: isUser ? '#ede9fe' : '#dbeafe',
      marginLeft: isUser ? '8px' : '0',
      marginRight: isUser ? '0' : '8px',
      alignSelf: 'flex-end',
    },
    timestamp: {
      fontSize: '11px',
      color: '#9ca3af',
      marginTop: '4px',
      textAlign: isUser ? 'right' : 'left',
    },
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.wrapper}>
      {!isUser && <div style={styles.avatar}>🤖</div>}
      <div>
        <div style={styles.bubble}>{message.content}</div>
        <div style={styles.timestamp}>{formatTime()}</div>
      </div>
      {isUser && <div style={styles.avatar}>👤</div>}
    </div>
  );
};

export default MessageBubble;