import { Route, Routes } from 'react-router-dom';
import Track from './pages/Track';
import Inventory from './pages/Inventory';
import Navigation from './components/Navigation';
import axios from "axios";
import { useEffect, useState } from 'react';





function App() {

  return (
    <>
      <Navigation />
      <Routes>
        <Route path='/' element={<Track />} />
        <Route path='/inventory' element={<Inventory />} />
      </Routes>
    </>
  );
}

export default App;
