import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchFavoritePosts = async (page: number = 1, perPage: number = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/add-to-favourite/list`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
      params: {
        page,
        per_page: perPage,
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
