// api/createPost.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/fetch/post`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
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
