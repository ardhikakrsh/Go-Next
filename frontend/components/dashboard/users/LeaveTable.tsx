"use client";

import React, { use, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { LeaveDTO, setLeave } from "../../../store/leave";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LeaveTable() {
  const { leave } = useSelector((state: any) => state.leave);
  const { user } = useSelector((state: any) => state.user);
  const router = useRouter();

  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchLeave = async () => {
        try {
          const { data } = await axios.get("http://localhost:8000/leaves/me", {
            withCredentials: true,
          });
          dispatch(setLeave(data));
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            router.push("/login");
          } else {
            console.error("Error fetching leave:", error);
          }
        }
      };
      if (!!!user) {
        fetchLeave();
      }
    }
  }, []);
  return (
    <div className="overflow-x-auto">
      <table className="table bg-base-100 overflow-hidden shadow-md text-zinc-300 text-center">
        {/* head */}
        <thead>
          <tr className="text-lg text-white bg-base-300">
            <th></th>
            <th>Jenis</th>
            <th>Jumlah Hari Cuti</th>
            <th>Mulai Cuti</th>
            <th>Akhir Cuti</th>
            <th>Deskripsi</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="text-md font-normal">
          {leave.leave_responses &&
            leave.leave_responses.map((item: LeaveDTO, index: number) => {
              let typeLabel = "";
              if (item.type == "sakit") {
                typeLabel = "Sakit";
              } else if (item.type == "absen") {
                typeLabel = "Absen";
              } else if (item.type == "liburan") {
                typeLabel = "Liburan";
              }

              let statusColor = "";
              let statusLabel = "";
              let icon = "";

              if (item.status === "requested") {
                statusColor = "bg-blue-600";
                statusLabel = "Requested";
                icon = "⏳";
              } else if (item.status === "approved") {
                statusColor = "bg-green-600";
                statusLabel = "Approved";
                icon = "✔️";
              } else if (item.status === "rejected") {
                statusColor = "bg-red-600";
                statusLabel = "Rejected";
                icon = "❌";
              }

              let date = new Date(item.created_at);
              // let newDate =
              //   date.getDate() +
              //   "/" +
              //   (date.getMonth() + 1) +
              //   "/" +
              //   date.getFullYear();

              let startDate = new Date(item.time_start);
              let newStartDate =
                startDate.getDate() +
                "/" +
                (startDate.getMonth() + 1) +
                "/" +
                startDate.getFullYear();

              let endDate = new Date(item.time_end);
              let newEndDate =
                endDate.getDate() +
                "/" +
                (endDate.getMonth() + 1) +
                "/" +
                endDate.getFullYear();

              return (
                <tr key={index} className="">
                  <td>{index + 1}</td>
                  <td>
                    <p>{typeLabel}</p>
                  </td>
                  <td>{item.leave_day}</td>
                  <td>{newStartDate}</td>
                  <td>{newEndDate}</td>
                  <td>{item.detail}</td>
                  <td>
                    <span
                      className={`${statusColor} rounded-full text-white px-4 py-2 font-medium inline-block text-center`}
                      style={{ width: "125px" }}
                    >
                      {icon} {statusLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
