import { ChatUser } from "../../types/chat"; // Adjusted the import path

export function ChatStats({ users }: { users: ChatUser[] }) {
  const totalMessages = users.reduce(
    (sum, u) => sum + u.messagesCount,
    0
  );

  const onlineCount = users.filter(u => u.online).length;

  return (
    <div className="border p-3 mb-4 flex justify-between">
      <span>Users: {users.length}</span>
      <span>Online: {onlineCount}</span>
      <span>Messages: {totalMessages}</span>
    </div>
  );
}
