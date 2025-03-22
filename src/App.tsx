
import { Link, Outlet } from 'react-router-dom';
import "./App.css";


function App() {
  return (
    <>
      <nav>
        <Link style={{ marginRight: "10px" }} to={"/home"}>Home</Link>
        <Link style={{ marginRight: "10px" }} to={"/about"}>About</Link>
        <Link to={"/contact"}>Contact</Link>
      </nav>
      <Outlet />
    </>
  );
}

export default App;