import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/routes";
import Navbar from "./components/common/navbar";
import { useAuth } from "./contexts/authContexts";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {!isAuthenticated && <Navbar />}
      <AppRoutes />
    </Router>
  );
}

export default App;
