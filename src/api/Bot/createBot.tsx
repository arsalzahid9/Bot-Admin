// api/Channel/createBot.tsx
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const createBot = async (formData: { bot_name: string; access_token: string }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/bot/create`,
      {
        bot_name: formData.bot_name,
        access_token: formData.access_token,
      },
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