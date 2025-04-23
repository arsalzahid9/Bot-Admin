import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

interface LoginParams {
  email: string;
  password: string;
}

export const login = async (loginData: LoginParams): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/user/login`, loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error.message;
    }
    throw new Error('An unexpected error occurred');
  }
};
