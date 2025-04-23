import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

export const resetPassword = async (payload: {
    password: string;
    new_password: string;
    new_password_confirmation: string;
}): Promise<any> => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/auth/user/passwordreset`,
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