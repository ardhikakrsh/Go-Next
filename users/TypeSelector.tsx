import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function TypeSelector({ type, setType }: any) {
  const handleChange = (event: SelectChangeEvent) => {
    setType(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Jenis Cuti</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={type}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={"absen"}>Absen</MenuItem>
          <MenuItem value={"sakit"}>Sakit</MenuItem>
          <MenuItem value={"liburan"}>Liburan</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
