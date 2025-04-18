import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "./styles.css";

ModuleRegistry.registerModules([AllCommunityModule]);
Modal.setAppElement("#root");

const baseUrl = "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/";

type Customer = {
  id: number;
  firstname: string;
  lastname: string;
  streetaddress: string;
  postcode: string;
  city: string;
  email: string;
  phone: string;
  _links: {
    self: { href: string };
    customer: { href: string };
    trainings: { href: string };
  };
};

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const gridRef = useRef<AgGridReact<Customer>>(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${baseUrl}customers`);
      const data = await res.json();
      const fetched = data._embedded.customers.map((cust: any) => {
        const parts = cust._links.self.href.split('/');
        return { ...cust, id: Number(parts[parts.length - 1]) };
      });
      setCustomers(fetched);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const handleAddCustomer = () => {
    setCurrentCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await fetch(`${baseUrl}customers/${id}`, { method: "DELETE" });
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer", error);
      }
    }
  };

  const handleSaveCustomer = async (customerData: any) => {
    try {
      if (currentCustomer) {
        await fetch(`${baseUrl}customers/${currentCustomer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });
      } else {
        await fetch(`${baseUrl}customers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerData),
        });
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer", error);
    }
  };

  const handleReset = async () => {
    try {
      await fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset`, { method: "POST" });
      fetchCustomers();
    } catch (error) {
      console.error("Error resetting API data", error);
    }
  };

  const handleViewTrainings = () => {
    // Always navigate to the general trainings page
    navigate(`/trainings`);
  };


  //https://stackoverflow.com/questions/56154046/downloading-blob-with-type-text-csv-strips-unicode-bom
  const handleExportCSV = () => {
    // Define CSV headers
    const headers = ["First Name", "Last Name", "Email", "Phone", "Street Address", "Postcode", "City"];
    // Map customers to CSV rows filtering out extra fields
    const rows = customers.map(cust => [
      cust.firstname,
      cust.lastname,
      cust.email,
      cust.phone,
      cust.streetaddress,
      cust.postcode,
      cust.city
    ]);
    // Build CSV string with headers and rows
    const csvContent = [headers, ...rows]
      .map(e => e.join(","))
      .join("\n");
      
    // Create a blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [columnDefs] = useState<ColDef<Customer>[]>([
    {
      headerName: "Name",
      flex: 2,
      valueGetter: (params: any) => `${params.data.firstname} ${params.data.lastname}`,
    },
    { field: "email", headerName: "Email", sortable: true, filter: true, flex: 2 },
    {
      headerName: "Edit",
      
      flex: 1,
      cellRenderer: (params: any) => (
        <button onClick={() => handleEditCustomer(params.data)} className="action-button">
          Edit
        </button>
      ),
    },
    {
      headerName: "Delete",
      flex: 1,
      cellRenderer: (params: any) => (
        <button onClick={() => handleDeleteCustomer(params.data.id)} className="action-button">
          Delete
        </button>
      ),
    },
  ]);

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Customer List</h1>
        <div className="button-group">
          <button onClick={handleAddCustomer} className="action-button">
            Add Customer
          </button>
          <button onClick={handleReset} className="action-button">
            Reset API Data
          </button>
          <button onClick={handleViewTrainings} className="action-button">
            View Trainings
          </button>
          <button onClick={handleExportCSV} className="action-button">
            Export CSV
          </button>
        </div>
        {!isModalOpen && (
          <div className="ag-theme-alpine grid-container" >
            <AgGridReact
              ref={gridRef}
              rowData={customers}
              columnDefs={columnDefs}
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
  onSave: (customer: any) => void;
  onCancel: () => void;
}) => {
  const [firstname, setFirstname] = useState(customer?.firstname || "");
  const [lastname, setLastname] = useState(customer?.lastname || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [streetaddress, setStreetaddress] = useState(customer?.streetaddress || "");
  const [postcode, setPostcode] = useState(customer?.postcode || "");
  const [city, setCity] = useState(customer?.city || "");

  const handleSubmit = () => {
    onSave({ firstname, lastname, email, phone, streetaddress, postcode, city });
  };

  return (
    <div>
      <h2>{customer ? "Edit Customer" : "Add Customer"}</h2>
      <input
        type="text"
        placeholder="First Name"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Street Address"
        value={streetaddress}
        onChange={(e) => setStreetaddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Postcode"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default CustomerList;