import React from "react";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  roles: string;
}

type Props = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
};

const UserTable: React.FC<Props> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table bg-base-100 overflow-hidden shadow-md text-zinc-300 text-center">
        <thead>
          <tr className="text-lg text-white bg-base-300">
            <th>ID</th>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-md font-normal">
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.roles}</td>
              <td>
                <button
                  onClick={() => onEdit(user)}
                  className="btn btn-sm btn-warning mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(user.id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
