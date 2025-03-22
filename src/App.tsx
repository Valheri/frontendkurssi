import "./App.css";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import { useState } from "react";

function App() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
  };

  return (
    <>
      <h1>Date</h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        
        <DatePicker
          label="Select a date"
          value={selectedDate}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
        />
      </LocalizationProvider>
    </>
  );
}
export default App;