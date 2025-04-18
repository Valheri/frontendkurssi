import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./styles.css"; // Import shared CSS

const TrainingList = () => {
  const { customerId } = useParams();
  const [trainings, setTrainings] = useState<{ date: string; activity: string; duration: number }[]>([]);
  const [customerName, setCustomerName] = useState<string>("");

  useEffect(() => {
    if (customerId === "1") setCustomerName("John Doe");
    else if (customerId === "2") setCustomerName("Jane Smith");

    setTrainings([
      { date: "2025-10-01T10:00:00", activity: "Running", duration: 30 },
      { date: "2025-10-02T12:00:00", activity: "Swimming", duration: 45 },
    ]);
  }, [customerId]);

  const columns: ColDef[] = [
    {
      headerName: "Date",
      flex: 1,
      field: "date",
      valueFormatter: (params) => dayjs(params.value).format("DD.MM.YYYY HH:mm"),
      sortable: true,
      filter: true,
    },
    { headerName: "Activity", field: "activity", sortable: true, filter: true },
    { headerName: "Duration (min)", field: "duration", sortable: true, filter: true },
  ];

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Training List for {customerName}</h1>
        <div className="ag-theme-alpine grid-container">
          <AgGridReact
            rowData={trainings}
            columnDefs={columns}
            rowSelection="single"
            animateRows={true}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingList;
