"use client";

import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LeaveDTO, setLeave } from "../../../store/leave";
import { useRouter } from "next/navigation";

export default function RequestTable() {
  const { leave } = useSelector((state: any) => state.leave);
  const { user } = useSelector((state: any) => state.user);
  const router = useRouter();

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllLeaves = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/leaves/", {
          withCredentials: true,
        });
        dispatch(setLeave(data));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
        } else {
          console.error("Error fetching all leaves:", error);
        }
      }
    };
    fetchAllLeaves();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await axios.put(`http://localhost:8000/leaves/accept/${id}`, null, {
        withCredentials: true,
      });
      // Refresh the leaves after approval
      const { data } = await axios.get("http://localhost:8000/leaves/", {
        withCredentials: true,
      });
      dispatch(setLeave(data));
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await axios.put(`http://localhost:8000/leaves/reject/${id}`, null, {
        withCredentials: true,
      });
      // Refresh the leaves after declining
      const { data } = await axios.get("http://localhost:8000/leaves/", {
        withCredentials: true,
      });
      dispatch(setLeave(data));
    } catch (error) {
      console.error("Error declining leave:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table bg-base-100 overflow-hidden shadow-md text-zinc-300 text-center">
        <thead>
          <tr className="text-lg text-white bg-base-300">
            <th>No</th>
            <th>Nama</th>
            <th>Jenis</th>
            <th>Jumlah Hari Cuti</th>
            <th>Mulai Cuti</th>
            <th>Akhir Cuti</th>
            <th>Deskripsi</th>
            <th>Request</th>
          </tr>
        </thead>
        <tbody className="text-md font-normal">
          {leave && leave.length > 0 ? (
            leave.map((item: LeaveDTO, index: number) => {
              let typeLabel =
                item.type === "sakit"
                  ? "Sakit"
                  : item.type === "absen"
                  ? "Absen"
                  : "Liburan";

              let statusColor =
                item.status === "requested"
                  ? "rounded-full text-white bg-blue-600 py-1 px-3"
                  : item.status === "approved"
                  ? "rounded-full text-white bg-green-600 py-1 px-3"
                  : "rounded-full text-white bg-red-600 py-1 px-3";

              let statusLabel =
                item.status === "requested"
                  ? "Requested"
                  : item.status === "approved"
                  ? "Approved"
                  : "Rejected";

              let icon =
                item.status === "requested"
                  ? "⏳"
                  : item.status === "approved"
                  ? "✔️"
                  : "❌";

              let startDate = new Date(item.time_start);
              let newStartDate = `${startDate.getDate()}/${
                startDate.getMonth() + 1
              }/${startDate.getFullYear()}`;

              let endDate = new Date(item.time_end);
              let newEndDate = `${endDate.getDate()}/${
                endDate.getMonth() + 1
              }/${endDate.getFullYear()}`;

              return (
                <tr key={item.id} className="">
                  <td>{index + 1}</td>
                  <td>{item.firstName || "N/A"}</td>
                  <td>
                    <p>{typeLabel}</p>
                  </td>
                  <td>{item.leave_day}</td>
                  <td>{newStartDate}</td>
                  <td>{newEndDate}</td>
                  <td>{item.detail}</td>
                  <td className="flex gap-2 justify-center">
                    {item.status === "requested" ? (
                      <>
                        <button
                          className="bg-green-600 text-white py-1 px-2 rounded"
                          onClick={() => handleApprove(item.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-600 text-white py-1 px-2 rounded"
                          onClick={() => handleDecline(item.id)}
                        >
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className={`${statusColor}`}>
                        {icon} {statusLabel}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8}>No leave requests found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
