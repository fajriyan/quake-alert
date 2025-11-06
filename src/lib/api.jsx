import { useQuery } from "@tanstack/react-query";

export const useBMKGsummary = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch(
        "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    },
    queryKey: ["fetch.GMBKGSummary"],
  });

  return {
    data: data?.Infogempa?.gempa || [],
    isLoading,
  };
};
export const useGMBKGTerkini = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch(
        "https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    },
    queryKey: ["fetch.GMBKGTerkini"],
  });

  return {
    data: data?.Infogempa?.gempa || [],
    isLoading,
  };
};

export const useGMBKGFeel = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch(
        "https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    },
    queryKey: ["fetch.BMKGFeel"],
  });

  return {
    data: data?.Infogempa?.gempa || [],
    isLoading,
  };
};
