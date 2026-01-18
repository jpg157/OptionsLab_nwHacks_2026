import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Tutorial from "./pages/Tutorial";

import "./App.css"
import "./index.css"

export default function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element = {<Login/>}/>
        <Route path="/tutorial" element = {<Tutorial/>}/>
      </Routes>
    </BrowserRouter>
  );
}