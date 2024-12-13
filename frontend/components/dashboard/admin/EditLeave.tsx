import React, { useState, useEffect } from "react";
import axios from "axios";

interface EditLeaveProps {
  leave: any;
  onClose: () => void;
  onLeaveUpdated: (updatedLeave: any) => void;
}

const EditLeave: React.FC<EditLeaveProps> = ({
  leave,
  onClose,
  onLeaveUpdated,
}) => {
  const [editedLeave, setEditedLeave] = useState({
    type: leave.type,
    detail: leave.detail,
    time_start: new Date(leave.time_start).toISOString().split("T")[0],
    time_end: new Date(leave.time_end).toISOString().split("T")[0],
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:8000/leaves/${leave.id}`,
        {
          type: editedLeave.type,
          detail: editedLeave.detail,
          time_start: new Date(editedLeave.time_start).toISOString(),
          time_end: new Date(editedLeave.time_end).toISOString(),
        },
        { withCredentials: true }
      );
      onLeaveUpdated(data);
      onClose();
    } catch (error) {
      console.error("Error updating leave:", error);
      alert("Failed to update leave. Please check the details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Edit Leave
        </h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <select
            value={editedLeave.type}
            onChange={(e) =>
              setEditedLeave({ ...editedLeave, type: e.target.value })
            }
            className="select select-bordered w-full"
          >
            <option value="sakit">Sakit</option>
            <option value="absen">Absen</option>
            <option value="liburan">Liburan</option>
          </select>

          <textarea
            placeholder="Leave Description"
            value={editedLeave.detail}
            onChange={(e) =>
              setEditedLeave({ ...editedLeave, detail: e.target.value })
            }
            className="textarea textarea-bordered w-full"
            required
          />

          <div className="flex space-x-2">
            <div className="w-full">
              <label className="label">
                <span className="label-text">Start Date</span>
              </label>
              <input
                type="date"
                value={editedLeave.time_start}
                onChange={(e) =>
                  setEditedLeave({ ...editedLeave, time_start: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="w-full">
              <label className="label">
                <span className="label-text">End Date</span>
              </label>
              <input
                type="date"
                value={editedLeave.time_end}
                onChange={(e) =>
                  setEditedLeave({ ...editedLeave, time_end: e.target.value })
                }
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

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

export default EditLeave;
