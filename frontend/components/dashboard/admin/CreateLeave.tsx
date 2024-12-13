import React, { useState } from "react";
import axios from "axios";

interface CreateLeaveProps {
  onClose: () => void;
  onLeaveCreated: (newLeave: any) => void;
}

const CreateLeave: React.FC<CreateLeaveProps> = ({
  onClose,
  onLeaveCreated,
}) => {
  const [newLeave, setNewLeave] = useState({
    type: "sakit",
    detail: "",
    time_start: "",
    time_end: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/leaves/",
        {
          type: newLeave.type,
          detail: newLeave.detail,
          time_start: new Date(newLeave.time_start).toISOString(),
          time_end: new Date(newLeave.time_end).toISOString(),
        },
        { withCredentials: true }
      );
      onLeaveCreated(data);
      onClose();
    } catch (error) {
      console.error("Error creating leave:", error);
      alert("Failed to create leave. Please check the details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-black p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Create New Leave
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <select
            value={newLeave.type}
            onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
            className="select select-bordered w-full"
          >
            <option value="sakit">Sakit</option>
            <option value="absen">Absen</option>
            <option value="liburan">Liburan</option>
          </select>

          <textarea
            placeholder="Leave Description"
            value={newLeave.detail}
            onChange={(e) =>
              setNewLeave({ ...newLeave, detail: e.target.value })
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
                value={newLeave.time_start}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, time_start: e.target.value })
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
                value={newLeave.time_end}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, time_end: e.target.value })
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeave;
