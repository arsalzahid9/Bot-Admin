import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const token = localStorage.getItem("token");

export const getMarketPlaceDropdown = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/market-place-data`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error.message;
    }
    throw new Error("An unexpected error occurred");
  }
};