import { useEffect, useState } from 'react';

export default function Home() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => { loadRooms(); }, []);

  async function loadRooms() {
    const response = await fetch('http://localhost:8080/rooms', { credentials: 'include' });
    const data = await response.json();
    setRooms(data);
  }

  async function createRoom() {
    const response = await fetch('http://localhost:8080/create-room', { method: 'POST', credentials: 'include' });
    const data = await response.json();
    window.location.href = '/room/' + data.roomId;
  }

  async function logout() {
    await fetch('http://localhost:8080/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Chatrooms</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <button onClick={createRoom}>Create Room</button>
      <br /><br />

      {
        rooms.map((room) => (
          <div
            className="room"
            key={room.roomId}
            onClick={() => { window.location.href = '/room/' + room.roomId; }}
          >
            {room.roomId}
          </div>
        ))
      }
    </div>
  );
}
