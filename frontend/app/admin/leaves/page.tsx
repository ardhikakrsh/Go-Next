"use client";

import Image from "next/image";
import { Inter } from "next/font/google";
import Nav from "../../../components/dashboard/admin/Nav";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import LeaveTable from "../../../components/dashboard/admin/LeaveTable";

export default function Leaves() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const { user } = useSelector((state: any) => state.user);
  const router = useRouter();
  useEffect(() => {
    const { user } = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.roles !== "admin") {
      router.push("/login");
    }
    if (!sessionStorage.getItem("hasReloaded")) {
      sessionStorage.setItem("hasReloaded", "true"); // Tandai bahwa reload sudah dilakukan
      window.location.reload(); // Reload halaman sekali
    }
  }, []);

  return (
    <Nav>
      <div className="flex flex-col gap-10 items-center">
        <div className="flex flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-center mb-6">
            Leave Management
            <span className="text-blue-700"></span> 👋🏻
          </h1>
          {/* Table of Leave User */}
          <LeaveTable />
        </div>
      </div>
    </Nav>
  );
}
