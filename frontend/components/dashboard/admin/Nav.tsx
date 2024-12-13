"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "../../../store/user";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { ReactNode } from "react";

function Nav({ children }: { children: ReactNode }) {
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("user");
    const parsedUser = JSON.parse(data || "{}")?.user;
    if (parsedUser && parsedUser.roles === "admin") {
      dispatch(login(parsedUser));
    }
  }, [dispatch]);
  const logout = async () => {
    await axios.post(
      "http://localhost:8000/auth/logout",
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("user");
    dispatch(login(null));
    router.push("/login");
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex h-screen bg-base-200">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "w-64" : "w-20"
          } bg-base-300 h-full transition-all duration-300 shadow-lg flex flex-col`}
        >
          <div className="flex flex-col gap-3 justify-center p-4">
            <button
              className="btn btn-ghost text-white w-full"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? "❮" : "❯"}
            </button>
            <button>
              <Link href="/admin" className="btn btn-ghost w-full">
                {isSidebarOpen ? "Incoming Leaves" : "📩"}
              </Link>
            </button>
            <button>
              <Link href="/admin/leaves" className="btn btn-ghost w-full">
                {isSidebarOpen ? "Leaves Management" : "📝"}
              </Link>
            </button>
            <button>
              <Link href="/admin/users" className="btn btn-ghost w-full">
                {isSidebarOpen ? "Users Management" : "🗂️"}
              </Link>
            </button>
            <button onClick={logout} className="btn btn-error w-full">
              {isSidebarOpen ? "Logout" : "🔓"}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-base-100 shadow-md">
            <div className="flex-1">
              <a className="btn btn-ghost normal-case text-xl ">
                Cuti Manajemen 📆
              </a>
            </div>
            <div className="flex">
              {user ? (
                <div className="flex gap-4 items-center">
                  <p className="font-bold">
                    {user.first_name} {user.last_name}
                  </p>
                  <button onClick={logout} className="btn">
                    logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link href={"/login"} className="btn">
                    login
                  </Link>
                  <Link href={"/signup"} className="btn">
                    Signup
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6 pt-24">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
