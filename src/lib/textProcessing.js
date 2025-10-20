var replacementSources = [
  // Arah mata angin
  ["TimurLaut", "Timur Laut"],
  ["BaratLaut", "Barat Laut"],
  ["BaratDaya", "Barat Daya"],
  ["Tenggara", "Tenggara"],
  ["Tenggara", "Tenggara"],
  ["SelatanTimur", "Selatan-Timur"],
  ["UtaraBarat", "Utara-Barat"],
  ["UtaraTimur", "Utara-Timur"],

  // Wilayah umum
  ["MALUKUTENGAH", "Maluku Tengah"],
  ["MALUKUBRTDAYA", "Maluku Barat Daya"],
  ["MALUKUUTARA", "Maluku Utara"],
  ["NUSATENGGARA", "Nusa Tenggara"],
  ["KALIMANTANBARAT", "Kalimantan Barat"],
  ["KALIMANTANTENGAH", "Kalimantan Tengah"],
  ["KALIMANTANTIMUR", "Kalimantan Timur"],
  ["KALIMANTANSELATAN", "Kalimantan Selatan"],
  ["KALIMANTANUTARA", "Kalimantan Utara"],
  ["SULAWESITENGAH", "Sulawesi Tengah"],
  ["SULAWESIUTARA", "Sulawesi Utara"],
  ["SULAWESITENGGARA", "Sulawesi Tenggara"],
  ["SULAWESISOUTH", "Sulawesi Selatan"],
  ["PAPUABARATDAYA", "Papua Barat Daya"],
  ["PAPUABARAT", "Papua Barat"],
  ["PAPUATENGAH", "Papua Tengah"],
  ["PAPUAPEGUNUNGAN", "Papua Pegunungan"],
  ["PAPUASELATAN", "Papua Selatan"],
  ["PAPUAUTARA", "Papua Utara"],
  ["KEPLAUTAN", "Kepulauan Laut"],
  ["KEPULAUAN", "Kepulauan"],
  ["JAKARTAUTARA", "Jakarta Utara"],
  ["JAKARTASELATAN", "Jakarta Selatan"],
  ["JAKARTATIMUR", "Jakarta Timur"],
  ["JAKARTABARAT", "Jakarta Barat"],
  ["JAKARTAPUSAT", "Jakarta Pusat"],
  ["JAWATENGAH", "Jawa Tengah"],
  ["JAWABARAT", "Jawa Barat"],
  ["JAWATIMUR", "Jawa Timur"],
  ["SUMATERAUTARA", "Sumatera Utara"],
  ["SUMATERABARAT", "Sumatera Barat"],
  ["SUMATERASELATAN", "Sumatera Selatan"],
  ["ACEH", "Aceh"],
  ["RIAU", "Riau"],
  ["KEPRIAU", "Kepulauan Riau"],
  ["BANGKABELITUNG", "Bangka Belitung"],
  ["BENGKULU", "Bengkulu"],
  ["LAMPUNG", "Lampung"],
  ["BANTEN", "Banten"],
  ["BALI", "Bali"],
  ["NTB", "Nusa Tenggara Barat"],
  ["NTT", "Nusa Tenggara Timur"],
  ["GORONTALO", "Gorontalo"],
  ["DIY", "DI Yogyakarta"],
  ["YOGYAKARTA", "Yogyakarta"],

  // Istilah lokasi atau kondisi umum
  ["didarat", "di darat"],
  ["dilaut", "di laut"],
  ["dipesisir", "di pesisir"],
  ["disekitar", "di sekitar"],
  ["disebagian", "di sebagian"],
  ["selat", "Selat"],
  ["teluk", "Teluk"],
  ["gunung", "Gunung"],
  ["pegunungan", "Pegunungan"],

  // Perbaikan kata dan tanda baca
  ["-", " "],

  // Ejaan umum yang sering disambung
  ["berpotensihujan", "berpotensi hujan"],
  ["berpotensipetir", "berpotensi petir"],
  ["berpotensipetir", "berpotensi petir"],
  ["anginkencang", "angin kencang"],
  ["gelombangtinggi", "gelombang tinggi"],
  ["suhumeningkat", "suhu meningkat"],
  ["suhumenurun", "suhu menurun"],
  ["berkabut", "berkabut"],
  ["udaraLembap", "udara lembap"],

  // Bentuk jamak dan kecil lainnya
  ["danlainnya", "dan lainnya"],
  ["dll", "dan lain-lain"],
  ["utk", "untuk"],
  ["dr", "dari"],
  ["sdg", "sedang"],
  ["bgt", "banget"],
  ["sktr", "sekitar"],
];

const textProcessing = (originalText, lower) => {
  replacementSources.forEach(function (replacement) {
    var searchText = replacement[0];
    var replacementText = replacement[1];
    originalText = originalText?.replace(
      new RegExp(searchText, "g"),
      replacementText
    );
  });

  if (!lower) {
    return originalText?.toLowerCase();
  } else {
    return originalText?.toLowerCase();
  }
};

export default textProcessing;
