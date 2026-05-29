import {
  useEffect,
  useState
} from 'react';

import { useParams }
from 'react-router-dom';

const API = 'http://localhost:8080';

export default function Room() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyId, setReplyId] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [editId, setEditId] = useState('');
  const [editText, setEditText] = useState('');

  useEffect(() => {
    loadCurrentUser();
    loadMessages();
    const timer = setInterval(loadMessages, 3000);
    return () => clearInterval(timer);
  }, []);

  async function loadCurrentUser() {
    const res = await fetch(`${API}/me`, { credentials: 'include' });
    const data = await res.json();
    if (data.username) setCurrentUser(data.username);
  }

  async function loadMessages() {
    const response = await fetch(`${API}/messages/${roomId}`, { credentials: 'include' });
    const data = await response.json();
    if (Array.isArray(data)) { setMessages(data);
    } else { setMessages([]); }
  }

  async function sendMessage(event) {
    event.preventDefault();
    await fetch(`${API}/send-message`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId, text })
    });
    setText('');
    loadMessages();
  }

  async function sendReply(messageId) {
    await fetch(`${API}/reply/${messageId}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: replyText })
    });
    setReplyText('');
    setReplyId('');
    loadMessages();
  }

  async function saveEdit(messageId) {
    await fetch(`${API}/message/${messageId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: editText })
    });
    setEditId('');
    setEditText('');
    loadMessages();
  }

  async function deleteMessage(messageId) {
    await fetch(`${API}/message/${messageId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    loadMessages();
  }

  async function voteMessage(messageId, vote) {
    await fetch(`${API}/message/${messageId}/vote`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote })
    });
    loadMessages();
  }

  async function voteReply(messageId, replyIndex, vote) {
    await fetch(`${API}/message/${messageId}/reply/${replyIndex}/vote`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vote })
    });
    loadMessages();
  }

  return (
    <div>
      <button onClick={() => { window.location.href = '/home'; }}>← Back to Rooms</button>
      <h1>Room {roomId}</h1>

      {
        messages.map((message) => (
          <div className="message" key={message._id}>
            <b>{message.username}</b>

            {editId === message._id ? (
              <div>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(message._id)}>Save</button>
                <button onClick={() => setEditId('')}>Cancel</button>
              </div>
            ) : (
              <p>{message.text}</p>
            )}

            <span>
              <button onClick={() => voteMessage(message._id, 'up')}>👍 {message.thumbsUp}</button>
              <button onClick={() => voteMessage(message._id, 'down')}>👎 {message.thumbsDown}</button>
            </span>

            {currentUser === message.username && editId !== message._id && (
              <span>
                <button onClick={() => { setEditId(message._id); setEditText(message.text); }}>Edit</button>
                <button onClick={() => deleteMessage(message._id)}>Delete</button>
              </span>
            )}

            {
              message.replies.map((reply, index) => (
                <div className="reply" key={index}>
                  <b>{reply.username}</b>
                  <p>{reply.text}</p>
                  <span>
                    <button onClick={() => voteReply(message._id, index, 'up')}>👍 {reply.thumbsUp}</button>
                    <button onClick={() => voteReply(message._id, index, 'down')}>👎 {reply.thumbsDown}</button>
                  </span>
                </div>
              ))
            }

            {
              replyId === message._id ? (
                <div>
                  <input value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                  <button onClick={() => sendReply(message._id)}>Reply</button>
                </div>
              ) : (
                <button onClick={() => setReplyId(message._id)}>Reply</button>
              )
            }
          </div>
        ))
      }

      <form onSubmit={sendMessage}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <button>Send</button>
      </form>
    </div>
  );
}
