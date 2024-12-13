import React, { useState } from "react";
import axios from "axios";

interface CreateUserProps {
  onClose: () => void;
  onUserCreated: (newUser: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    roles: string;
  }) => void;
}

const CreateUser: React.FC<CreateUserProps> = ({ onClose, onUserCreated }) => {
  const [newUser, setNewUser] = useState({
    username: "",
    first_name: "",
    last_name: "",
    roles: "user",
    password: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const {
        data,
      }: {
        data: {
          id: number;
          username: string;
          first_name: string;
          last_name: string;
          roles: string;
        };
      } = await axios.post("http://localhost:8000/users/", newUser, {
        withCredentials: true,
      });
      onUserCreated(data);
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Failed to create user. Please check the details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Create New User
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={newUser.first_name}
            onChange={(e) =>
              setNewUser({ ...newUser, first_name: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newUser.last_name}
            onChange={(e) =>
              setNewUser({ ...newUser, last_name: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
          <select
            value={newUser.roles}
            onChange={(e) => setNewUser({ ...newUser, roles: e.target.value })}
            className="select select-bordered w-full"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
