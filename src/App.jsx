import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ThemeContext from "./lib/ThemeContext";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home/Home";
import Feel from "./pages/Feel/Feel";
import Latest from "./pages/Latest/Latest";
import About from "./pages/About/About";
import Navbar from "./components/Navbar";

function App() {
  const theme = useState("light");
  const location = useLocation();

  return (
    <ThemeContext.Provider value={theme}>
      <Navbar />
      <AnimatePresence mode="wait">
        {/* PageTransition hanya satu kali di sini */}
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/tentang-website" element={<About />} />
            <Route path="/gempa-dirasakan" element={<Feel />} />
            <Route path="/gempa-terkini" element={<Latest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}

export default App;
