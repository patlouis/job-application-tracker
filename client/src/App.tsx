import { BrowserRouter, Routes, Route } from "react-router-dom";
import Applications from "./pages/Applications";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/applications" element={<Applications />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
