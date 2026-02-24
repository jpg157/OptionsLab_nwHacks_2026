import { BrowserRouter, Routes, Route } from "react-router-dom";
import OptionsStrategy from "./pages/OptionsStrategy";
// import Login from "./pages/Login";
import Tutorial from "./pages/Tutorial";

import "./App.css"
import "./index.css"
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./layout/Layout";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route index element={<Index />}/>
        
        {/* Navbar shown in Layout component for all the child routes of / */}
        <Route element={<Layout/>}>
          <Route path="/options" element={<OptionsStrategy />} />
          <Route path="/tutorial" element = {<Tutorial/>}/>
          {/* <Route path="/login" element = {<Login/>}/> */}
          <Route path="*" element={<NotFound />} />
        </Route>
        

      </Routes>
    </BrowserRouter>
  );
}
