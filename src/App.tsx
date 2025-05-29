import "@styles/App.scss";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "@pages/Home";
import Gallery from "@pages/Gallery";
import Contact from "@pages/Contact";
import { ConfigProvider } from "@/contexts/ConfigContext";

export default function App() {
  return (
    <div className="app">
      <ConfigProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </div>
  );
}
