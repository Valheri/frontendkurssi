import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css"; // Import shared CSS

ModuleRegistry.registerModules([AllCommunityModule]);

type Customer = {
  id: number;
  name: string;
  email: string;
};

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const gridRef = useRef<AgGridReact<Customer>>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCustomers([
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ]);
  }, []);

  const [columnDefs] = useState<ColDef<Customer>[]>([
    { field: "name", headerName: "Name", sortable: true, filter: true, flex: 2 },
    { field: "email", headerName: "Email", sortable: true, filter: true, flex: 2 },
    {
      field: "id",
      headerName: "Actions",
      flex: 1,
      cellRenderer: (params) => (
        <button onClick={() => navigate(`/trainings/${params.value}`)} className="action-button">
          View Trainings
        </button>
      ),
    },
  ]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Customer List</h1>
        <div className="ag-theme-alpine grid-container" style={{ height: "70vh" }}>
          <AgGridReact
            ref={gridRef}
            rowData={customers}
            columnDefs={columnDefs}
            rowSelection="single"
            animateRows={true}
            defaultColDef={{
              flex: 1,
              resizable: true,
            }}
            rowHeight={40} // Set row height to accommodate the button
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
