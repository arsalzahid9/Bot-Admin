// api/Auth/updatePassword.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

export const updatePassword = async (payload: {
  password: string;
  password_confirmation: string;
  email: string;
}): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/user/update-password`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
