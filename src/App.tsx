import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import './App.css';

const socket: Socket = io(process.env.SOCKET_HOST as string);

type AppState = {
  connectedUsers: number[];
};

function App() {
  const [connectedUsers, setConnectedUsers] = useState<AppState['connectedUsers']>([]);

  useEffect(() => {
    socket.connect();

    socket.on('connected', (data) => {
      setConnectedUsers((prevUsers) => [...prevUsers, data.id]);
    });

    socket.on('disconnected', (data) => {
      setConnectedUsers((prevUsers) =>
        prevUsers.filter((id) => id !== data.id)
      );
    });

    return () => {
      socket.disconnect();
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
