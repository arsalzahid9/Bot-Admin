// api/createPost.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const statusChange = async (id: string, status: "approve" | "reject") => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/message-status-change/${id}`,
      { status }, // Send status in the request body
      {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json", // Changed to application/json
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