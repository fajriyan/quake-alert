export const getDepthTag = (kedalamanStr) => {
    const depth = parseInt(kedalamanStr.replace(/[^0-9]/g, ""), 10);

    if (isNaN(depth)) {
      return {
        label: "Data Tidak Valid",
        desc: "-",
        color: "bg-gray-100 text-gray-800 border-gray-300",
      };
    }

    if (depth < 60) {
      return {
        label: "Gempa Dangkal",
        desc: "Potensi kerusakan di permukaan lebih tinggi.",
        color: "bg-green-50 text-green-700 border-green-200",
      };
    } else if (depth >= 60 && depth <= 300) {
      return {
        label: "Gempa Menengah",
        desc: "Getaran bisa dirasakan cukup luas, dampak kerusakan sedang.",
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      };
    } else {
      return {
        label: "Gempa Dalam",
        desc: "Jarang merusak, getaran menyebar sangat luas.",
        color: "bg-red-50 text-red-700 border-red-200",
      };
    }
  };