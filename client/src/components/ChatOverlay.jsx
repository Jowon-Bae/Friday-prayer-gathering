import React, { useState, useEffect, useRef } from 'react';
import './ChatOverlay.css';

export default function ChatOverlay({ socket, role }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!socket) return;

        const handleHistory = (history) => {
            setMessages(history);
        };

        const handleNewMessage = (msg) => {
            setMessages(prev => [...prev, msg]);
            if (!isOpen) {
                setUnreadCount(prev => prev + 1);
            }
        };

        socket.on('chat_history', handleHistory);
        socket.on('chat_message', handleNewMessage);

        return () => {
            socket.off('chat_history', handleHistory);
            socket.off('chat_message', handleNewMessage);
        };
    }, [socket, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
            scrollToBottom();
        }
    }, [isOpen, messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        socket.emit('send_chat', {
            text: inputValue.trim(),
            role: role
        });
        setInputValue('');
    };

    // Use formatting for display based on timestamp
    const formatTime = (isoString) => {
        const d = new Date(isoString);
        let h = d.getHours();
        let m = d.getMinutes();
        const ampm = h >= 12 ? '오후' : '오전';
        h = h % 12;
        h = h ? h : 12;
        m = m < 10 ? '0' + m : m;
        return `${ampm} ${h}:${m}`;
    };

    return (
        <>
            {/* Floating Action Button */}
            <button className={`chat-fab ${isOpen ? 'open' : ''}`} onClick={toggleChat}>
                {isOpen ? '✕' : '💬'}
                {!isOpen && unreadCount > 0 && (
                    <span className="chat-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {/* Chat Drawer/Overlay */}
            <div className={`chat-overlay ${isOpen ? 'active' : ''}`}>
                <div className="chat-header">
                    <h2>팀 채팅방</h2>
                    <button className="chat-close" onClick={toggleChat}>✕</button>
                </div>

                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <div className="chat-empty">메시지가 없습니다.</div>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.role === role;
                            return (
                                <div key={msg.id || idx} className={`chat-bubble-wrapper ${isMe ? 'mine' : 'theirs'}`}>
                                    {!isMe && <div className="chat-role">{msg.role}</div>}
                                    <div className="chat-bubble-row">
                                        <div className={`chat-bubble ${isMe ? 'mine' : 'theirs'}`}>
                                            {msg.text}
                                        </div>
                                        <div className="chat-time">{formatTime(msg.timestamp)}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={sendMessage}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        className="chat-input"
                    />
                    <button type="submit" className="chat-send-btn">전송</button>
                </form>
            </div>

            {/* Backdrop to close when clicking outside */}
            {isOpen && <div className="chat-backdrop" onClick={toggleChat}></div>}
        </>
    );
}
