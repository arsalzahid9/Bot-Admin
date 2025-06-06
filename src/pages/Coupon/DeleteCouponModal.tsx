import React, { useState } from 'react';
import { deleteCoupon } from '../../api/Coupon/deleteCoupon';
import toast from 'react-hot-toast';

interface DeleteCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  couponId?: string | number;
}

const DeleteCouponModal: React.FC<DeleteCouponModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  couponId,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!couponId) {
      toast.error("Coupon ID is missing");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteCoupon(couponId);
      toast.success("Coupon deleted successfully");
      onConfirm();
    } catch (error) {
      console.error("Failed to delete coupon:", error);
      toast.error(
        typeof error === "string"
          ? error
          : (error as any)?.message || "Failed to delete coupon"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
        <h3 className="text-lg font-semibold mb-4">
          Are you sure you want to delete this coupon?
        </h3>
        <div className="flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center justify-center"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCouponModal;