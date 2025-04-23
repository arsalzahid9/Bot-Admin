import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const token = localStorage.getItem("token");

export const logout = async (): Promise<any> => {
  try {
    // Check if token exists
    if (!token) {
      throw new Error("No token found. Already logged out.");
    }

    const response = await axios.post(
      `${API_BASE_URL}/auth/user/logout`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Clear token from localStorage after logout
    localStorage.removeItem("token");
    localStorage.removeItem("userName"); // Optional: If you're storing user data in localStorage

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error.message;
    }
    throw new Error("An unexpected error occurred");
  }
};
