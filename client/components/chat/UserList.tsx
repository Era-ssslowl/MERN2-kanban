import { ChatUser } from "../../types/chat"; // Adjust the path as necessary

export function UserList({ users }: { users: ChatUser[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {users.map(user => (
        <li
          key={user.id}
          className="border p-2 flex justify-between"
        >
          <span>
            {user.name}
            {user.online && " 🟢"}
          </span>
          <span>
            messages: {user.messagesCount}
          </span>
        </li>
      ))}
    </ul>
  );
}
