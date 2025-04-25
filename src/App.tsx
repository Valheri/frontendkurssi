import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CalendarPage from "./CalendarPage";
import CustomerList from "./CustomerList";
import Diagram from "./Diagram";
import "./styles.css";
import TrainingList from "./TrainingList";
function App() {
  return (
    <Router basename="/frontendkurssi">
      <nav className="navbar">
        <Link to="/" className="nav-link">
          Customers
        </Link>
        <Link to="/trainings" className="nav-link">
          Trainings
        </Link>
        <Link to="/calendar" className="nav-link">
          Calendar
        </Link>
        <Link to="/diagram" className="nav-link">
          Diagram
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/trainings" element={<TrainingList />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/diagram" element={<Diagram />} />
      </Routes>
    </Router>
  );
}

export default App;