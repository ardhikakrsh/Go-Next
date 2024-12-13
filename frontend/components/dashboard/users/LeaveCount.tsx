import React, { useEffect } from "react";
import { useSelector } from "react-redux";

export default function LeaveCount() {
  const { leave } = useSelector((state: any) => state.leave);
  return (
    <div className="flex flex-row gap-10 justify-center text-center">
      <div className="p-10 w-56 h-56 bg-red-500 grid items-center rounded-md shadow-md">
        <div className="flex flex-col gap-5 font-normal text-white text-xl">
          <h3>Cuti Sakit</h3>
          <h3>{leave.count_sick}</h3>
          <h3>Jumlah</h3>
        </div>
      </div>
      <div className="p-10 w-60 h-56 bg-yellow-500 grid items-center rounded-md shadow-md">
        <div className="flex flex-col gap-5 font-normal text-white text-xl">
          <h3>Cuti Absen</h3>
          <h3>{leave.count_business}</h3>
          <h3>Jumlah</h3>
        </div>
      </div>
      <div className="p-10 w-56 h-56 bg-blue-500 grid items-center rounded-md shadow-md">
        <div className="flex flex-col gap-5 font-normal text-white text-xl">
          <h3>Cuti Liburan</h3>
          <h3>{leave.count_vacation}</h3>
          <h3>jumlah</h3>
        </div>
      </div>
    </div>
  );
}
