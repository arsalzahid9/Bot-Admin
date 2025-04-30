import React, { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { createCoupon } from "../../api/Coupon/createCoupon";
import { getCoupon } from "../../api/Coupon/getCoupon";
import DeleteCouponModal from "./DeleteCouponModal";
import { UpdateCouponModal } from "./UpdateCouponModal";

// Example Bot interface (adjust fields as needed)
interface Coupon {
  id: number;
  bot_name: string;
  access_token: string;
  created_at: string;
  updated_at: string;
}

const CreateBotModal = ({
  isOpen,
  onClose,
  onCreate,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; botName: string }) => void;
  isLoading: boolean;
}) => {
  const [form, setForm] = useState({ name: "", botName: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onCreate(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Coupon</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Access Token
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border"
              value={form.botName}
              onChange={(e) => setForm({ ...form, botName: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : "Create Bot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CreateCouponModal = ({
  isOpen,
  onClose,
  onCreate,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: {
    code: string;
    type: string;
    min_price: number;
    market_place: string;
    max_price: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
  }) => void;
  isLoading: boolean;
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
  const [marketplaces, setMarketplaces] = useState<{ value: string; label: string }[]>([]);

  React.useEffect(() => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onCreate(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create Coupon</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Code</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Type</label>
            <select
              required
              className="w-full px-3 py-2 border"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Is Active</label>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Coupon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string | number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCouponForUpdate, setSelectedCouponForUpdate] = useState<any>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch coupons from API
  const fetchCoupons = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await getCoupon(page, perPage);
      setCoupons(res.data || []);
      setCurrentPage(res.pagination?.current_page || 1);
      setTotalPages(res.pagination?.last_page || 1);
    } catch (error: any) {
      setCoupons([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCoupons(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const handleCreateCoupon = async (data: {
    code: string;
    type: string;
    min_price: number;
    market_place: string;
    max_price: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
  }) => {
    setIsLoading(true);
    try {
      await createCoupon(data);
      toast.success("Coupon created successfully!");
      setIsModalOpen(false);
      fetchCoupons(1); // Refetch first page or coupons
    } catch (error: any) {
      toast.error(error?.message || "Failed to create coupon");
    } finally {
      setIsLoading(false);
    }
  };
  const handleUpdateCoupon = async (updatedData: any) => {
    setIsLoading(true);
    try {
      // You might want to add your update API call here if needed
      toast.success("Coupon updated successfully!");
      fetchCoupons(currentPage); // Refresh the list
    } catch (error: any) {
      toast.error(error?.message || "Failed to update coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string | number) => {
    setSelectedCouponId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    setSelectedCouponId(null);
    fetchCoupons(currentPage);
  };

  // Update and pagination handlers would be similar, omitted for brevity

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Coupon
        </button>
      </div>
      <CreateCouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCoupon}
        isLoading={isLoading}
      />
      {/* Add DeleteCouponModal here */}
      <DeleteCouponModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        couponId={selectedCouponId}
      />
      <UpdateCouponModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleUpdateCoupon}
        isLoading={isLoading}
        initialData={selectedCouponForUpdate}
      />
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="border border-lg bg-white overflow-auto rounded-md">
          <table className="min-w-full">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Min Price</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Max Price</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Market Place</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Start Date</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">End Date</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Is Active</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Created At</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.length > 0 ? (
                coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="px-6 py-4">{c.code}</td>
                    <td className="px-6 py-4">{c.type}</td>
                    <td className="px-6 py-4">{c.min_price}</td>
                    <td className="px-6 py-4">{c.max_price}</td>
                    <td className="px-6 py-4">{c.market_place}</td>
                    <td className="px-6 py-4">{c.start_date}</td>
                    <td className="px-6 py-4">{c.end_date}</td>
                    <td className="px-6 py-4">{c.is_active ? "Yes" : "No"}</td>
                    <td className="px-6 py-4">{c.created_at?.slice(0, 10)}</td>
                    <td className="px-6 py-4">
                      {/* Add update and delete buttons here */}
                      <button
                        className="text-blue-600 mr-2"
                        onClick={() => {
                          setSelectedCouponForUpdate({ id: c.id });
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => handleDeleteClick(c.id)}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2 mb-6">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
