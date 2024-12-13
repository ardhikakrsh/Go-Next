
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user";
import leaveSlice from "./leave";

export default configureStore({
    reducer: {
        user: userSlice,
        leave: leaveSlice
    },
});