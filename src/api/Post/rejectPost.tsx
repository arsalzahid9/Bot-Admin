// api/createPost.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// Only send id in the URL, no payload for reject, now using GET
export const rejectPost = async (id: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/poststatus/${id}`,
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error.message;
    }
    throw new Error("An unexpected error occurred");
  }
};
