"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import Nav from "../../components/dashboard/admin/Nav";
import { use, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import RequestTable from "../../components/dashboard/admin/RequestTable";

export default function Home() {
  const { user } = useSelector((state: any) => state.user);
  const router = useRouter();
  useEffect(() => {
    const { user } = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.roles !== "admin") {
      router.push("/login");
    }
  }, []);

  return (
    <Nav>
      <div className="flex flex-col gap-10 items-center">
        <div className="flex flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-center">
            Admin Dashboard,{" "}
            <span className="text-blue-700">{user?.first_name}</span> 👋🏻
          </h1>
          <h2 className="text-xl font-normal text-center">
            User Leave Requests
          </h2>
        </div>
        {/* Table of Leave Requests */}
        <RequestTable />
      </div>
    </Nav>
  );
}
