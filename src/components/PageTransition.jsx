import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PageTransition = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // Durasi preload
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative">
      {/* Logo Preloader */}
      {loading && (
        <motion.div
          initial={{ y: 0, opacity: 0 }}  // Muncul dari bawah
          animate={{ y: 0, opacity: 1 }}        // Naik ke tengah
          exit={{ y: 0, opacity: 0 }}     // Turun ke bawah saat keluar
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 flex justify-center items-center bg-white z-50"
        >
          <img src="https://raw.githubusercontent.com/fajriyan/info-gempa/90f658ab8dcb69f7cc2ebd628ab8fb13d05b6a32/public/favicon.svg" width="auto" height="auto" alt="Logo" className="w-32 h-32 animate-pulse" />
        </motion.div>
      )}

      {/* Konten Halaman */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: loading ? 1 : 0 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PageTransition;
