import { createSlice } from "@reduxjs/toolkit";

export interface LeaveDTO {
  id: number;
  type: string;
  firstName: string;
  status: "requested" | "approved" | "rejected";
  time_start: string;
  time_end: string;
  detail: string;
  created_at: string;
  updated_at: string;
  leave_day: number;
}
export interface LeaveReponseWithCountDTO {
  leave: LeaveDTO[];
  count_sick: number;
  count_business: number;
  count_vacation: number;
}

export interface LeaveState {
  leave: LeaveDTO[]; // Change from LeaveDTO[] | null to always be an array
}

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    leave: [], // Initialize as an empty array, not null
  } as LeaveState,
  reducers: {
    setLeave: (state, action) => {
      state.leave = action.payload || []; // Ensure payload is an array
    },
    addLeave: (state, action) => {
      state.leave.push(action.payload);
    },
  },
});

export const { setLeave, addLeave } = leaveSlice.actions;
export default leaveSlice.reducer;
