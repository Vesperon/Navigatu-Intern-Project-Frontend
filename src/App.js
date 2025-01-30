import { Route, Routes, useLocation } from "react-router-dom";
import Track from "./pages/Track";
import Inventory from "./pages/Inventory";
import Logs from "./pages/Logs";
import Login from "./pages/Login";
import Navigation from "./components/Navigation";
import PrivateRoute from "./PrivateRoute";

function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && <Navigation />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/track" element={<Track />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/logs" element={<Logs />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
