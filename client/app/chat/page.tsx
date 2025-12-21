"use client";

import { useState } from "react";
import { ChatUser } from "../../types/chat"; // Adjust the path as necessary
import { UserList } from "../../components/chat/UserList"; // Adjusted path based on the directory structure
import { ChatStats } from "../../components/chat/ChatStats";

export default function ChatPage() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [username, setUsername] = useState("");

  const addUser = () => {
    if (!username.trim()) return;

    setUsers(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: username,
        messagesCount: 0,
        online: true,
      },
    ]);

    setUsername("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Team Chat
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border px-3 py-2 w-full"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Add user to chat"
        />
        <button
          className="bg-black text-white px-4"
          onClick={addUser}
        >
          Add
        </button>
      </div>

      <ChatStats users={users} />
      <UserList users={users} />
    </div>
  );
}
