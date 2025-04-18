import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "./styles.css";

ModuleRegistry.registerModules([AllCommunityModule]);
Modal.setAppElement("#root");

type Customer = {
  id: number;
  name: string;
  email: string;
  trainings: { date: string; activity: string; duration: number }[];
};

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const gridRef = useRef<AgGridReact<Customer>>(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    setCustomers([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        trainings: [
          { date: "2025-10-01T10:00:00", activity: "Running", duration: 30 },
          { date: "2025-10-02T12:00:00", activity: "Swimming", duration: 45 },
        ],
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        trainings: [
          { date: "2025-11-01T09:00:00", activity: "Cycling", duration: 60 },
          { date: "2025-11-03T14:00:00", activity: "Yoga", duration: 40 },
        ],
      },
    ]);
  }, []);

  const handleAddCustomer = () => {
    setCurrentCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== id));
    }
  };

  const handleSaveCustomer = (customer: Customer) => {
    if (currentCustomer) {
      setCustomers(customers.map(c => (c.id === currentCustomer.id ? customer : c)));
    } else {
      setCustomers([...customers, { ...customer, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  const [columnDefs] = useState<ColDef<Customer>[]>([
    { field: "name", headerName: "Name", sortable: true, filter: true, flex: 2 },
    { field: "email", headerName: "Email", sortable: true, filter: true, flex: 2 },
    {
      headerName: "Edit",
      field: "actionEdit",
      flex: 1,
      cellRenderer: (params: any) => (
        <button onClick={() => handleEditCustomer(params.data)} className="action-button">
          Edit
        </button>
      ),
    },
    {
      headerName: "Delete",
      field: "actionDelete",
      flex: 1,
      cellRenderer: (params: any) => (
        <button onClick={() => handleDeleteCustomer(params.data.id)} className="action-button">
          Delete
        </button>
      ),
    },
    {
      headerName: "Trainings",
      field: "actionTrainings",
      flex: 1,
      cellRenderer: (params: any) => (
        <button
          onClick={() => {
            navigate(`/trainings/${params.data.id}`, {
              state: { trainings: params.data.trainings, customer: params.data },
            });
          }}
          className="action-button"
        >
          View Trainings
        </button>
      ),
    },
  ]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Customer List</h1>
        <button onClick={handleAddCustomer} className="action-button">
          Add Customer
        </button>
        {!isModalOpen && (
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
              rowHeight={50}
            />
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        overlayClassName="modal-overlay"
        contentClassName="modal-content"
      >
        <CustomerForm
          customer={currentCustomer}
          onSave={handleSaveCustomer}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

const CustomerForm = ({
  customer,
  onSave,
  onCancel,
}: {
  customer: Customer | null;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}) => {
  const [name, setName] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");

  const handleSubmit = () => {
    onSave({ id: customer?.id || 0, name, email, trainings: customer?.trainings || [] });
  };

  return (
    <div>
      <h2>{customer ? "Edit Customer" : "Add Customer"}</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CustomerList;