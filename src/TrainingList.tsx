import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { useLocation } from "react-router-dom";
import "./styles.css";

Modal.setAppElement("#root");

const TrainingList = ({ onUpdateTrainings }: { onUpdateTrainings: (trainings: any[]) => void }) => {
  const location = useLocation();
  const { trainings: initialTrainings, customer } = location.state || {};
  const [trainings, setTrainings] = useState(initialTrainings || []);
  const [customerName, setCustomerName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTraining, setNewTraining] = useState({
    date: new Date(),
    activity: "",
    duration: 0,
  });

  useEffect(() => {
    setCustomerName(customer ? customer.name : "Unknown Customer");
  }, [customer]);

  const handleAddTraining = () => {
    setIsModalOpen(true);
  };

  const handleDeleteTraining = (index: number) => {
    if (window.confirm("Are you sure you want to delete this training?")) {
      const updatedTrainings = trainings.filter((_, i) => i !== index);
      setTrainings(updatedTrainings);
      onUpdateTrainings(updatedTrainings);
    }
  };

  const handleSaveTraining = () => {
    setIsModalOpen(false);
    const updatedTrainings = [...trainings, newTraining];
    setTrainings(updatedTrainings);
    onUpdateTrainings(updatedTrainings);
    setNewTraining({ date: new Date(), activity: "", duration: 0 });
  };

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
    {
      headerName: "Actions",
      field: "",
      cellRenderer: (params: { node: any }) => (
        <button onClick={() => handleDeleteTraining(params.node.rowIndex)} className="action-button">
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Training List for {customerName}</h1>
        <button onClick={handleAddTraining} className="action-button">
          Add Training
        </button>
        {!isModalOpen && (
          <div className="ag-theme-alpine grid-container">
            <AgGridReact rowData={trainings} columnDefs={columns} rowSelection="single" animateRows={true} />
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <div>
          <h2>Add Training</h2>
          <DatePicker
            selected={newTraining.date}
            onChange={(date) => setNewTraining({ ...newTraining, date: date || new Date() })}
          />
          <input
            type="text"
            placeholder="Activity"
            value={newTraining.activity}
            onChange={(e) => setNewTraining({ ...newTraining, activity: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duration (min)"
            value={newTraining.duration}
            onChange={(e) => setNewTraining({ ...newTraining, duration: +e.target.value })}
          />
          <button onClick={handleSaveTraining}>Save</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default TrainingList;
