import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import "./styles.css";

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
    fetchTrainings();
    fetchCustomerList();
  }, []);

  const fetchTrainings = async () => {
    try {
      const res = await fetch(`${baseUrl}gettrainings`);
      const data = await res.json();
      setTrainings(data);
    } catch (error) {
      console.error("Error fetching trainings", error);
    }
  };

  const fetchCustomerList = async () => {
    try {
      const res = await fetch(`${baseUrl}customers`);
      const data = await res.json();
      const fetched = data._embedded.customers.map((cust: any) => {
        const parts = cust._links.self.href.split('/');
        return { ...cust, id: Number(parts[parts.length - 1]) };
      });
      setCustomerList(fetched);
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
        await fetch(`${baseUrl}trainings/${id}`, { method: "DELETE" });
        fetchTrainings();
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

      await fetch(`${baseUrl}trainings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      setIsModalOpen(false);
      fetchTrainings();
    } catch (error) {
      console.error("Error saving training", error);
    }
  };
  // useMemo is used to memoize the columns definition
  // to avoid unnecessary re-renders and improve performance
  const columns: ColDef[] = useMemo(() => [
    {
      headerName: "Date",
      field: "date",
      flex: 1,
      valueFormatter: (params) => dayjs(params.value).format("DD.MM.YYYY HH:mm"),
      sortable: true,
      filter: true
    },
    { headerName: "Activity", field: "activity", sortable: true, filter: true, flex: 1 },
    { headerName: "Duration (min)", field: "duration", sortable: true, filter: true, flex: 1 },
    {
      headerName: "Customer",
      flex: 2,
      valueGetter: (params: any) => {
        const cust = params.data.customer;
        return cust ? `${cust.firstname} ${cust.lastname}` : "N/A";
      }
    },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1,
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
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} overlayClassName="modal-overlay">
        <div>
          <h2>{trainingForm.id ? "Edit Training" : "Add Training"}</h2>
          <div>
            <label>Date:</label>
            <DatePicker selected={trainingForm.date} onChange={(date) => setTrainingForm({ ...trainingForm, date: date || new Date() })} showTimeSelect dateFormat="yyyy-MM-dd HH:mm" />
          </div>
          <div>
            <label>Activity:</label>
            <input type="text" placeholder="Enter activity" value={trainingForm.activity} onChange={(e) => setTrainingForm({ ...trainingForm, activity: e.target.value })} />
          </div>
          <div>
            <label>Duration (min):</label>
            <input type="number" placeholder="0" value={trainingForm.duration} onChange={(e) => setTrainingForm({ ...trainingForm, duration: +e.target.value })} />
          </div>
          <div>
            <label>Customer:</label>
            <select
            name="customer"
              value={
                trainingForm.customerLink
                  ? trainingForm.customerLink.split("/").pop() || ""
                  : ""
              }
              onChange={(e) =>
                setTrainingForm({
                  ...trainingForm,
                  customerLink: `${baseUrl}customers/${e.target.value}`
                })
              }
            >
              <option value="">Select customer</option>
              {customerList.map((cust) => (
                <option key={cust.id} value={cust.id}>
                  {cust.firstname} {cust.lastname}
                </option>
              ))}
            </select>
          </div>
          <button onClick={handleSaveTraining}>Save</button>
          <button onClick={() => setIsModalOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default TrainingList;
