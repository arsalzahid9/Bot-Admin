import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const sendOtp = async ({ email }: { email: string }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/user/send-otp`,
      { email },
      {
        headers: {
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
