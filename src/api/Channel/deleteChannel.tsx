import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const deleteChannel = async (id: string | number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/channel/delete/${id}`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
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