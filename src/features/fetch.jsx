import { useQuery } from "@tanstack/react-query";
import { instanse } from "../lib/axios";

const useGT = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      return (await instanse.get("/gempa")).data.data;
    },
    queryKey: ["fetch.GT"],
  });

  return {
    data,
    isLoading,
  };
};
export default useGT;

export const useGD = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      return (await instanse.get("/gempa-dirasakan")).data.data;
    },
    queryKey: ["fetch.GD"],
  });

  return {
    data,
    isLoading,
  };
};
export const useGTR = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      return (await instanse.get("/gempa-terkini")).data.data;
    },
    queryKey: ["fetch.GTR"],
  });

  return {
    data,
    isLoading,
  };
};

export const useBMKGsummary = () => {
  const { data, isLoading } = useQuery({
    queryFn: async () => {
      const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
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
      const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json");
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
      const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/gempadirasakan.json");
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