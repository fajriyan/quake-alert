const parseDepth = (kedalamanStr) =>
  parseInt(String(kedalamanStr).replace(/[^0-9]/g, ""), 10);

export const getDepthCategory = (kedalamanStr) => {
  const depth = parseDepth(kedalamanStr);

  if (Number.isNaN(depth)) return null;
  if (depth < 60) return "dangkal";
  if (depth <= 300) return "menengah";
  return "dalam";
};

export const getDepthTag = (kedalamanStr) => {
  const category = getDepthCategory(kedalamanStr);

  if (!category) {
    return {
      label: "Data Tidak Valid",
      desc: "-",
      color: "bg-gray-100 text-gray-800 border-gray-300",
    };
  }

  const tags = {
    dangkal: {
      label: "Gempa Dangkal",
      desc: "Potensi kerusakan di permukaan lebih tinggi.",
      color: "bg-green-50 text-green-700 border-green-200",
    },
    menengah: {
      label: "Gempa Menengah",
      desc: "Getaran bisa dirasakan cukup luas, dampak kerusakan sedang.",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    dalam: {
      label: "Gempa Dalam",
      desc: "Jarang merusak, getaran menyebar sangat luas.",
      color: "bg-red-50 text-red-700 border-red-200",
    },
  };

  return tags[category];
};
