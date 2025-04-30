// api/Channel/createCoupon.tsx
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const createCoupon = async (formData: {
  code: string;
  type: string;
  user_id: number | string;
  min_price: number;
  market_place: string;
  max_price: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/coupon/create`,
      {
        code: formData.code,
        type: formData.type,
        user_id: formData.user_id,
        min_price: formData.min_price,
        market_place: formData.market_place,
        max_price: formData.max_price,
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_active: formData.is_active,
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
