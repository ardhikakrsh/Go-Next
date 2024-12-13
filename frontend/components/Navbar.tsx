"use client";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { login } from "../store/user";
import { cookies } from "next/headers";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function Nav() {
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    const data = localStorage.getItem("user");
    // @ts-ignore
    const user = JSON.parse(data)?.user;
    if (user && user.roles === "user") {
      dispatch(login(user));
    }
  }, []);
  console.log(user);
  const logout = async () => {
    const res = await axios.post(
      "http://localhost:8000/auth/logout",
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("user");
    dispatch(login(null));
    router.push("/login");
  };
  return (
    <div className="navbar bg-base-100 shadow-md rounded-xl">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl ">Cuti Manajemen 📆</a>
      </div>
      <div className="flex">
        {user ? (
          <div className="flex gap-4 items-center">
            <p className="font-bold">
              {user.first_name} {user.last_name}
            </p>
            <button onClick={logout} className="btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href={"/login"} className="btn">
              Login
            </Link>
            <Link href={"/signup"} className="btn">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
