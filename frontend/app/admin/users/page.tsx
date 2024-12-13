"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Nav from "../../../components/dashboard/admin/Nav";
import CreateUser from "../../../components/dashboard/admin/CreateUser";
import EditUser from "../../../components/dashboard/admin/EditUser";
import UserTable from "../../../components/dashboard/admin/UserTable";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  roles: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { user } = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.roles !== "admin") {
      router.push("/login");
      return;
    }
    fetchUsers();
    if (!sessionStorage.getItem("hasReloaded")) {
      sessionStorage.setItem("hasReloaded", "true"); // Tandai bahwa reload sudah dilakukan
      window.location.reload(); // Reload halaman sekali
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/users/", {
        withCredentials: true,
      });
      setUsers(data as User[]);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch users.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/users/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log("Delete response:", response); // Debugging log
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  };

  const handleEditClick = (user: User) => {
    setEditUser({ ...user });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setEditUser(null);
  };

  return (
    <Nav>
      <div className="flex flex-col gap-10 items-center">
        <div className="flex flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-center">
            User Management
            <span className="text-blue-700"></span> 👋🏻
          </h1>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="btn btn-primary w-fit text-sm px-4 py-2 mt-4"
          >
            Create User
          </button>

          <UserTable
            users={users}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />

          {isCreateModalOpen && (
            <CreateUser
              onClose={() => setCreateModalOpen(false)}
              onUserCreated={(newUser) =>
                setUsers((prev) => [...prev, newUser])
              }
            />
          )}

          {editUser && (
            <EditUser
              user={editUser}
              onClose={() => setEditUser(null)}
              onUserUpdated={handleUpdateUser}
            />
          )}
        </div>
      </div>
    </Nav>
  );
};

export default UserManagement;
