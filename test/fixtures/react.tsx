// @ts-nocheck
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  active: boolean;
};

type UserCardProps = {
  user: User;
  onSelect: (user: User) => void;
};

const API_URL = "/api/users";

function UserCard({ user, onSelect }: UserCardProps) {
  const handleClick = () => {
    onSelect(user);
  };

  return (
    <article className="user-card">
      <header>
        <h2>{user.name}</h2>
        <span>{user.active ? "Active" : "Inactive"}</span>
      </header>

      <p>{user.email}</p>

      <button
        type="button"
        onClick={handleClick}
        disabled={!user.active}
      >
        View Profile
      </button>
    </article>
  );
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to load users");
        }

        const data: User[] = await response.json();

        setUsers(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error"
        );
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const handleSelect = (user: User) => {
    console.log(`Selected user: ${user.name}`);
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  if (error) {
    return (
      <div role="alert">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <main>
      <h1>User Directory</h1>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <section>
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onSelect={handleSelect}
            />
          ))}
        </section>
      )}
    </main>
  );
}