import { Route, Routes, useLocation } from "react-router-dom";
import Track from "./pages/Track";
import Inventory from "./pages/Inventory";
import Logs from "./pages/Logs";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && <Navigation />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/track" element={<Track />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </>
  );
}

export default App;
