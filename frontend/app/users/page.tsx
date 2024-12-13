"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import Navbar from "../../components/Navbar";
import { use, useEffect, useState } from "react";
import LeaveCount from "../../components/dashboard/users/LeaveCount";
import AddLeaveBtn from "../../components/dashboard/users/AddLeaveBtn";
import LeaveTable from "../../components/dashboard/users/LeaveTable";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useSelector((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    const { user } = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.roles !== "user") {
      router.push("/login");
    }
  }, []);
  return (
    <div className="p-2 flex flex-col gap-10 items-center">
      <Navbar />
      <div className="flex flex-col gap-10 w-8/12">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-center">
            Welcome <span className="text-blue-700">{user?.first_name}</span> 👋🏻
          </h1>
          <h1 className="text-xl font-normal text-center">
            Riwayat Total Cuti
          </h1>
        </div>
        <LeaveCount />
        <AddLeaveBtn />
        <LeaveTable />
      </div>
    </div>
  );
}
