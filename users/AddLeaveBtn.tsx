import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setLeave } from "@/store/leave";
import TypeSelector from "./TypeSelector";
import FirstComponent from "./FirstComponent";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 14,
  borderRadius: "10px",
  p: 4,
};

export default function AddLeaveBtn() {
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [type, setType] = React.useState("");
  const [detail, setDetail] = React.useState("");
  const dispatch = useDispatch();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleButton = async (e: React.SyntheticEvent) => {
    try {
      e.preventDefault();
      const reqBody = {
        type: type,
        detail: detail,
        time_start: startDate?.toISOString(),
        time_end: endDate?.toISOString(),
      };

      // Submit new leave
      await axios.post("http://localhost:8000/leaves", reqBody, {
        withCredentials: true,
      });

      // Fetch the updated leave data after submission
      const { data } = await axios.get("http://localhost:8000/leaves/me", {
        withCredentials: true,
      });

      // Update the leave state in Redux store
      dispatch(setLeave(data));

      // Close modal after success
      handleClose();
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        className="text-lg bg-green-500 text-white font-normal"
      >
        Tambahkan Cuti
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 600 }}>
          <div className="flex flex-col gap-5">
            <h2 id="parent-modal-title" className="font-medium text-xl">
              Tambahkan Informasi Cuti
            </h2>
            <div className="flex flex-col gap-5">
              <TypeSelector type={type} setType={setType} />
              {/* ts ignore */}
              <FirstComponent
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                startDate={startDate}
              />
              <div className="max-w-full">
                <Box component="form" noValidate autoComplete="on">
                  <TextField
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    className="w-full"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                </Box>
              </div>
            </div>
            <button className="btn btn-accent" onClick={handleButton}>
              Submit
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
