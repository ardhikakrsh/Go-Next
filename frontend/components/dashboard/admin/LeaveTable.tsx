"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { LeaveDTO, setLeave } from "../../../store/leave";
import { useRouter } from "next/navigation";
import CreateLeave from "./CreateLeave";
import EditLeave from "./EditLeave";

export default function LeaveTable() {
  const { leave = [] } = useSelector((state: any) => state.leave);
  const { user } = useSelector((state: any) => state.user);
  const router = useRouter();

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [editLeave, setEditLeave] = useState<LeaveDTO | null>(null);

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

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this leave request?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8000/leaves/${id}`, {
          withCredentials: true,
        });
        dispatch(setLeave(leave.filter((item: LeaveDTO) => item.id !== id)));
      } catch (error) {
        console.error("Error deleting leave:", error);
        alert("Failed to delete leave request.");
      }
    }
  };

  const handleEditClick = (leaveItem: LeaveDTO) => {
    setEditLeave({ ...leaveItem });
  };

  const handleUpdateLeave = (updatedLeave: LeaveDTO) => {
    dispatch(
      setLeave(
        leave.map((item: LeaveDTO) =>
          item.id === updatedLeave.id ? updatedLeave : item
        )
      )
    );
  };

  return (
    <div>
      {/* <button
        onClick={() => setCreateModalOpen(true)}
        className="btn btn-primary w-fit text-sm px-4 py-2 mb-4"
      >
        Create Leave
      </button> */}

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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="text-md font-normal">
            {leave.map((item: LeaveDTO, index: number) => {
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
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.firstName || "N/A"}</td>
                  <td>
                    <p>{typeLabel}</p>
                  </td>
                  <td>{item.leave_day}</td>
                  <td>{newStartDate}</td>
                  <td>{newEndDate}</td>
                  <td>{item.detail}</td>
                  <td>
                    <span className={statusColor}>
                      {statusLabel} {icon}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="btn btn-sm btn-warning"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && (
        <CreateLeave
          onClose={() => setCreateModalOpen(false)}
          onLeaveCreated={(newLeave) =>
            dispatch(setLeave([...leave, newLeave]))
          }
        />
      )}

      {editLeave && (
        <EditLeave
          leave={editLeave}
          onClose={() => setEditLeave(null)}
          onLeaveUpdated={handleUpdateLeave}
        />
      )}
    </div>
  );
}
