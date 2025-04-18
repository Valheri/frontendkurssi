import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CustomerList from "./CustomerList";
import TrainingList from "./TrainingList";
import "./styles.css"; // Import shared CSS

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-link">
          Customers
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/trainings/:customerId" element={<TrainingList />} />
      </Routes>
    </Router>
  );
}

export default App;