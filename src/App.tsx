import React from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from './Components/Home/Home'
import Navbar from "./Components/Navbar/Navbar";
import Shops from "./Components/Shops/Shops";
import Shop from "./Components/Shop/Shop";

function App() {
  return (
      <main>
          <Navbar/>
          <Routes>
              <Route index element={<Home/>}/>
              <Route path="/shops" element={<Shops/>}/>
              <Route path="/shop" element={<Shop/>}/>
          </Routes>
      </main>
  );
}

export default App;
