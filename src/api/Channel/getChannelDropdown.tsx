import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export interface Channel {
  id: number;
  user_id: number;
  name: string;
  channel_username: string;
  created_at: string;
  updated_at: string;
}

export interface ChannelDropdownResponse {
  message: string;
  data: Channel[];
}

export const getChannelDropdown = async (): Promise<ChannelDropdownResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/channel/list`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
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