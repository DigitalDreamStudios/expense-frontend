import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

const socket: Socket = io(process.env.SOCKET_HOST || 'http://localhost:3000'); // Provide a default URL if SOCKET_HOST is not defined.

function App() {
  const [connectedUsers, setConnectedUsers] = useState<number[]>([]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect(); // Clean up the socket connection when the component unmounts.
    };
  }, []);

  useEffect(() => {
    const handleConnected = (data: { id: number }) => {
      setConnectedUsers((prevUsers) => [...prevUsers, data.id]);
    };

    const handleDisconnected = (data: { id: number }) => {
      setConnectedUsers((prevUsers) =>
        prevUsers.filter((id) => id !== data.id)
      );
    };

    const handleConnectedUsers = (users: number[]) => {
      setConnectedUsers(users);
    };

    socket.on('connected', handleConnected);
    socket.on('disconnected', handleDisconnected);

    // Listen for updates on the list of connected users.
    socket.on('connectedUsers', handleConnectedUsers);

    return () => {
      socket.off('connected', handleConnected);
      socket.off('disconnected', handleDisconnected);
      socket.off('connectedUsers', handleConnectedUsers);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-6 py-4 text-center bg-white rounded shadow-md">
        <h1 className="mb-2 text-3xl font-semibold">Connected Users</h1>
        <p className="text-xl">IDs: {connectedUsers.join(', ')}</p>
      </div>
    </div>
  );
}

export default App;
