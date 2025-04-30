import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCouponModal } from "../../api/Coupon/getCouponModal";
import { updateCouponModal } from "../../api/Coupon/UpdateCouponModal";

interface UpdateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  isLoading: boolean;
  initialData?: { id: string | number };
}

export const UpdateCouponModal: React.FC<UpdateCouponModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  isLoading,
  initialData,
}) => {
  const [form, setForm] = useState({
    code: "",
    type: "",
    min_price: 0,
    market_place: "",
    max_price: 0,
    start_date: "",
    end_date: "",
    is_active: true,
  });
  const [originalForm, setOriginalForm] = useState(form);
  const [marketplaces, setMarketplaces] = useState<{ value: string; label: string }[]>([]);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [updating, setUpdating] = useState(false);
  

  // Fetch coupon data when modal opens
  useEffect(() => {
    const fetchCoupon = async () => {
      if (isOpen && initialData?.id) {
        setLoadingCoupon(true);
        try {
          const res = await getCouponModal(initialData.id.toString());
          if (res && res.data) {
            const coupon = res.data;
            const newForm = {
              code: coupon.code || "",
              type: coupon.type || "",
              min_price: Number(coupon.min_price) || 0,
              market_place: coupon.market_place || "",
              max_price: Number(coupon.max_price) || 0,
              start_date: coupon.start_date ? coupon.start_date.slice(0, 10) : "",
              end_date: coupon.end_date ? coupon.end_date.slice(0, 10) : "",
              is_active: coupon.is_active !== undefined ? coupon.is_active : true,
            };
            setForm(newForm);
            setOriginalForm(newForm);
          }
        } catch (error: any) {
          toast.error(error?.message || "Failed to fetch coupon data");
        } finally {
          setLoadingCoupon(false);
        }
      }
    };
    fetchCoupon();
  }, [isOpen, initialData?.id]);

  // Fetch marketplaces for dropdown
  useEffect(() => {
    if (isOpen) {
      import("../../api/Marketplace/getMarketPlaceDropdown").then(({ getMarketPlaceDropdown }) => {
        getMarketPlaceDropdown()
          .then((data) => {
            if (Array.isArray(data.data)) {
              setMarketplaces(
                data.data.map((item: any) => ({
                  value: item.name || item.value || item.id,
                  label: item.name || item.label || item.id,
                }))
              );
            }
          })
          .catch(() => {
            setMarketplaces([]);
          });
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || loadingCoupon || !initialData) return;
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("code", form.code);
      formData.append("type", form.type);
      formData.append("min_price", String(form.min_price));
      formData.append("market_place", form.market_place);
      formData.append("max_price", String(form.max_price));
      formData.append("start_date", form.start_date);
      formData.append("end_date", form.end_date);
      formData.append("is_active", form.is_active ? "1" : "0");

      await updateCouponModal(initialData.id.toString(), formData);
      toast.success("Coupon updated successfully!");
      onUpdate({ id: initialData.id, ...form });
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update coupon");
    } finally {
      setUpdating(false);
    }
  };

  const isFormChanged = Object.keys(form).some(
    (key) => (form as any)[key] !== (originalForm as any)[key]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Coupon</h2>
        {loadingCoupon ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Code</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                disabled={isLoading || updating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Type</label>
              <select
                required
                className="w-full px-3 py-2 border"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                disabled={isLoading || updating}
              >
                <option value="">Select Type</option>
                <option value="fixed">Fixed</option>
                <option value="percent">Percent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Market Place</label>
              <select
                value={form.market_place}
                onChange={(e) => setForm({ ...form, market_place: e.target.value })}
                className="w-full px-3 py-2 border"
                required
                disabled={isLoading || updating}
              >
                <option value="">Select Marketplace</option>
                {marketplaces.map((mp) => (
                  <option key={mp.value} value={mp.value}>
                    {mp.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Min Price</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border"
                value={form.min_price}
                onChange={(e) => setForm({ ...form, min_price: Number(e.target.value) })}
                disabled={isLoading || updating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Max Price</label>
              <input
                type="number"
                required
                className="w-full px-3 py-2 border"
                value={form.max_price}
                onChange={(e) => setForm({ ...form, max_price: Number(e.target.value) })}
                disabled={isLoading || updating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Start Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                disabled={isLoading || updating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">End Date</label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                disabled={isLoading || updating}
              />
            </div>
            <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-900 mb-1">Is Active</label>

              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                disabled={isLoading || updating}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={isLoading || updating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 text-white rounded ${isLoading || updating || !isFormChanged ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading || updating || !isFormChanged}
              >
                {isLoading || updating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : "Update Coupon"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
