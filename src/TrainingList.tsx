import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { deleteTraining, fetchCustomers, fetchTrainings, saveTraining } from "./api";
import "./styles.css";



import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";



Modal.setAppElement("#root");

const baseUrl = "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/";

type Customer = {
  id: number;
  firstname: string;
  lastname: string;
};

type Training = {
  id?: number;
  date: string;
  duration: number;
  activity: string;
  customer?: Customer;
};

const TrainingList = () => {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainingForm, setTrainingForm] = useState({
    id: undefined as number | undefined,
    date: new Date(),
    activity: "",
    duration: 0,
    customerLink: ""
  });
  const [customerList, setCustomerList] = useState<Customer[]>([]);

  useEffect(() => {
    fetchTrainingsData();
    fetchCustomerListData();
  }, []);

  const fetchTrainingsData = async () => {
    try {
      const data = await fetchTrainings();
      setTrainings(data);
    } catch (error) {
      console.error("Error fetching trainings", error);
    }
  };

  const fetchCustomerListData = async () => {
    try {
      const data = await fetchCustomers();
      setCustomerList(data);
    } catch (error) {
      console.error("Error fetching customer list", error);
    }
  };

  const handleAddClick = () => {
    setTrainingForm({ id: undefined, date: new Date(), activity: "", duration: 0, customerLink: "" });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id?: number) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this training session?")) {
      try {
        await deleteTraining(id);
        fetchTrainingsData();
      } catch (error) {
        console.error("Error deleting training", error);
      }
    }
  };

  const handleSaveTraining = async () => {
    const payload = {
      date: trainingForm.date.toISOString(),
      activity: trainingForm.activity,
      duration: trainingForm.duration,
      customer: trainingForm.customerLink
    };

    try {
      await saveTraining(payload);
      setIsModalOpen(false);
      fetchTrainingsData();
    } catch (error) {
      console.error("Error saving training", error);
    }
  };

  const columns: ColDef[] = useMemo(() => [
    {
      headerName: "Date",
      field: "date",
      flex: 1,
      valueFormatter: (params) => dayjs(params.value).format("DD.MM.YYYY HH:mm"),
      sortable: true,
      comparator: (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(), // Sort dates chronologically
      filter: true,
    },
    {
      headerName: "Activity",
      field: "activity",
      sortable: true,
      filter: true,
      flex: 1,
      comparator: (a: string, b: string) => a.localeCompare(b), // Alphabetical sorting
    },
    {
      headerName: "Duration (min)",
      field: "duration",
      sortable: true,
      filter: true,
      flex: 1,
      comparator: (a: number, b: number) => a - b, // Numerical sorting (low to high)
    },
    {
      headerName: "Customer",
      flex: 2,
      valueGetter: (params: any) => {
        const cust = params.data.customer;
        return cust ? `${cust.firstname} ${cust.lastname}` : "N/A";
      },
      sortable: true,
      comparator: (a: string, b: string) => a.localeCompare(b), // Alphabetical sorting
    },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1,
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => (
        <>
          <button onClick={() => handleDeleteClick(params.data.id)} className="action-button">Delete</button>
        </>
      )
    }
  ], []);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Training Sessions</h1>
        <button onClick={handleAddClick} className="action-button">Add Training</button>
        {!isModalOpen && (<div className="ag-theme-alpine grid-container">
          <AgGridReact
            rowData={trainings}
            columnDefs={columns}
            animateRows={true}
            rowHeight={70}
          />
        </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} overlayClassName="modal-overlay" className="modal">
        <div className="modal-content">
          <h2 className="modal-title">{trainingForm.id ? "Edit Training" : "Add Training"}</h2>
          <div className="modal-field">
            <label className="modal-label">Date:</label>
            <DatePicker
              selected={trainingForm.date}
              onChange={(date) => setTrainingForm({ ...trainingForm, date: date || new Date() })}
              showTimeSelect
              dateFormat="yyyy-MM-dd HH:mm"
              timeFormat="HH:mm"
              className="modal-input"
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Activity:</label>
            <input
              type="text"
              placeholder="Enter activity"
              value={trainingForm.activity}
              onChange={(e) => setTrainingForm({ ...trainingForm, activity: e.target.value })}
              className="modal-input"
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Duration (min):</label>
            <input
              type="number"
              placeholder="0"
              value={trainingForm.duration}
              onChange={(e) => setTrainingForm({ ...trainingForm, duration: +e.target.value })}
              className="modal-input"
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Customer:</label>
            <select
              title="Select customer"
              name="customer"
              value={
                trainingForm.customerLink
                  ? trainingForm.customerLink.split("/").pop() || ""
                  : ""
              }
              onChange={(e) =>
                setTrainingForm({
                  ...trainingForm,
                  customerLink: `${baseUrl}customers/${e.target.value}`,
                })
              }
              className="modal-input"
            >
              <option value="">Select customer</option>
              {customerList.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.firstname} {cust.lastname}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-actions">
            <button onClick={handleSaveTraining} className="modal-button save-button">Save</button>
            <button onClick={() => setIsModalOpen(false)} className="modal-button cancel-button">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TrainingList;
