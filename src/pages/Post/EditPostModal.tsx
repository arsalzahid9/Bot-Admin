import React, { useEffect, useState } from "react";

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  onPostEdited: () => void;
}

const initialFormData = {
  productName: "",
  productLink: "",
  priceMin: 0,
  priceMax: 0,
  currentPrice: 0,
  convertedLink: "",
  purchaseType: "",
  imageUrl: "",
  coupons: [""],
  specialConditions: [""],
  // Add other fields as needed
};

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  post,
  onPostEdited,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        ...initialFormData,
        ...post,
        coupons: post.coupons ? post.coupons.split(",") : [""],
        specialConditions: post.special_conditions ? post.special_conditions.split(",") : [""],
      });
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (idx: number, value: string, key: "coupons" | "specialConditions") => {
    setFormData((prev) => {
      const arr = [...(prev as any)[key]];
      arr[idx] = value;
      return { ...prev, [key]: arr };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("productName", formData.productName);
      data.append("productLink", formData.productLink);
      data.append("priceMin", formData.priceMin.toString());
      data.append("priceMax", formData.priceMax.toString());
      data.append("currentPrice", formData.currentPrice.toString());
      data.append("convertedLink", formData.convertedLink);
      data.append("purchaseType", formData.purchaseType);
      data.append("imageUrl", formData.imageUrl);
      data.append("coupon", formData.coupons.filter((c) => c).join(","));
      data.append("special_conditions", formData.specialConditions.filter((c) => c).join(","));

      // Replace with your update API call
      // await updatePost(post.id, data);
      onPostEdited();
      onClose();
    } catch (err) {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input
              name="productName"
              type="text"
              className="w-full px-3 py-2 border"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Product Link</label>
            <input
              name="productLink"
              type="url"
              className="w-full px-3 py-2 border"
              value={formData.productLink}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3 flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Min Price</label>
              <input
                name="priceMin"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border"
                value={formData.priceMin}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Max Price</label>
              <input
                name="priceMax"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border"
                value={formData.priceMax}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Current Price</label>
              <input
                name="currentPrice"
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border"
                value={formData.currentPrice}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Converted Link</label>
            <input
              name="convertedLink"
              type="url"
              className="w-full px-3 py-2 border"
              value={formData.convertedLink}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Purchase Type</label>
            <select
              name="purchaseType"
              className="w-full px-3 py-2 border"
              value={formData.purchaseType}
              onChange={handleChange}
            >
              <option value="">(empty) - no mandatory</option>
              <option value="No Brasil">No Brasil</option>
              <option value="Taxas Inclusas">Taxas Inclusas</option>
              <option value="Fora do Remessa Conforme">Fora do Remessa Conforme</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Photo URL</label>
            <input
              name="imageUrl"
              type="url"
              className="w-full px-3 py-2 border"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Coupons</label>
            {formData.coupons.map((coupon, idx) => (
              <input
                key={idx}
                type="text"
                className="w-full px-3 py-2 border mb-2"
                value={coupon}
                onChange={e => handleArrayChange(idx, e.target.value, "coupons")}
              />
            ))}
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Special Conditions</label>
            {formData.specialConditions.map((cond, idx) => (
              <input
                key={idx}
                type="text"
                className="w-full px-3 py-2 border mb-2"
                value={cond}
                onChange={e => handleArrayChange(idx, e.target.value, "specialConditions")}
              />
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
