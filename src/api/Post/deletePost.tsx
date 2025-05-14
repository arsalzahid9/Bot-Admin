import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const deletePost = async (id: string | number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/post/delete/${id}`, {
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