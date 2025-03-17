import { Route, Routes, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import About from "./pages/About";
import GempaDirasakan from "./pages/Gempa-Dirasakan";
import GempaTerkini from "./pages/Gempa-Terkini";
// import Sandbox from "./pages/Sandbox";
import ThemeContext from "./lib/ThemeContext";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageTransition from "./components/PageTransition";

function App() {
  const theme = useState("light");
  const location = useLocation();
  
  return (
    <ThemeContext.Provider value={theme}>
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Homepage /></PageTransition>} />
        <Route path="/tentang" element={<PageTransition><About /></PageTransition>} />
        <Route path="/gempa-dirasakan" element={<PageTransition><GempaDirasakan /></PageTransition>} />
        <Route path="/gempa-terkini" element={<PageTransition><GempaTerkini /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  </ThemeContext.Provider>
  );
}

export default App;
