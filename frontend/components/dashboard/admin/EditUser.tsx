import React, { useState, useEffect } from "react";
import axios from "axios";

interface EditUserProps {
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    roles: string;
  };
  onClose: () => void;
  onUserUpdated: (updatedUser: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    roles: string;
  }) => void;
}

const EditUser: React.FC<EditUserProps> = ({
  user,
  onClose,
  onUserUpdated,
}) => {
  const [editedUser, setEditedUser] = useState({
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    roles: user.roles,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:8000/users/${user.id}`,
        {
          username: editedUser.username,
          first_name: editedUser.firstName,
          last_name: editedUser.lastName,
          roles: editedUser.roles,
        },
        { withCredentials: true }
      );
      onUserUpdated(data);
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please check the details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Edit User
        </h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={editedUser.username}
            onChange={(e) =>
              setEditedUser({ ...editedUser, username: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={editedUser.firstName}
            onChange={(e) =>
              setEditedUser({ ...editedUser, firstName: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={editedUser.lastName}
            onChange={(e) =>
              setEditedUser({ ...editedUser, lastName: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
          <select
            value={editedUser.roles}
            onChange={(e) =>
              setEditedUser({ ...editedUser, roles: e.target.value })
            }
            className="select select-bordered w-full"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn">
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
