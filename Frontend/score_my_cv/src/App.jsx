import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ScoreDisplay from "./pages/ScoreDisplay";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<UploadPage />} />
        <Route path="/score"               element={<ScoreDisplay/>} />
      </Routes>
    </BrowserRouter>
  );
}