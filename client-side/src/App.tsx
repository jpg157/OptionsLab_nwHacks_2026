import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
// import Header from "./components/Header"; // 如果有

export default function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}