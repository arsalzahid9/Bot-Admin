import React, { useState, useEffect } from "react";
import type { Marketplace } from "../types";
import { createMarketPlace } from "../api/Marketplace/createMarketPlace";
import { updateMarketPlace } from "../api/Marketplace/updateMarketPlace";
import toast from "react-hot-toast";

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    marketplace: Omit<Marketplace, "id" | "createdAt">,
    id?: string
  ) => void;
  initialData?: Marketplace | null;
}

const MarketplaceModal: React.FC<MarketplaceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    website_link: "",
    marketplace: "amazon", // Default value for marketplace
    app_id: "",
    app_secret: "",
    partner_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Effect hook to populate the form when initialData is passed (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        website_link: initialData.website_link ?? "",
        marketplace: initialData.marketplace ?? "amazon", // Default to 'amazon' if not provided
        app_id: initialData.app_id ?? "",
        app_secret: initialData.app_secret ?? "",
        partner_id: initialData.partner_id ?? "",
      });
    } else {
      setFormData({
        name: "",
        website_link: "",
        marketplace: "amazon",
        app_id: "",
        app_secret: "",
        partner_id: "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create a new FormData object to send as multipart/form-data
    const form = new FormData();
    form.append("name", formData.name);
    form.append("website_link", formData.website_link);
    form.append("marketplace", formData.marketplace);
    form.append("app_id", formData.app_id);
    form.append("app_secret", formData.app_secret);
    form.append("partner_id", formData.partner_id);

    try {
      if (initialData?.id) {
        // Update existing marketplace
        const response = await updateMarketPlace(initialData.id, form);
        console.log("Marketplace Updated:", response);
        toast.success("Marketplace updated successfully");
      } else {
        // Create new marketplace
        const response = await createMarketPlace(form);
        console.log("Marketplace Created:", response);
        toast.success("Marketplace created successfully");
      }
      
      onSubmit(formData, initialData?.id);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error with marketplace:", error);
      toast.error(initialData ? "Failed to update marketplace" : "Failed to create marketplace");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {initialData ? "Edit Marketplace" : "Add Marketplace"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields remain the same */}
          {/* Marketplace Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Marketplace Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website Link
            </label>
            <input
              type="url"
              required
              value={formData.website_link}
              onChange={(e) =>
                setFormData({ ...formData, website_link: e.target.value })
              }
              className="mt-1 block w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Marketplace Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Marketplace
            </label>
            <select
              value={formData.marketplace}
              onChange={(e) =>
                setFormData({ ...formData, marketplace: e.target.value })
              }
              className="mt-1 block w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="amazon">Amazon</option>
              <option value="shopee">Shopee</option>
              <option value="aliexpress">AliExpress</option>
              <option value="mercadolivre">MercadoLivre</option>
            </select>
          </div>

          {/* App ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              App ID
            </label>
            <input
              type="text"
              // required
              value={formData.app_id}
              onChange={(e) =>
                setFormData({ ...formData, app_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* App Secret */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              App Secret
            </label>
            <input
              type="text"
              // required
              value={formData.app_secret}
              onChange={(e) =>
                setFormData({ ...formData, app_secret: e.target.value })
              }
              className="mt-1 block w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Partner ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Partner ID
            </label>
            <input
              type="text"
              // required
              value={formData.partner_id}
              onChange={(e) =>
                setFormData({ ...formData, partner_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : (
                initialData ? "Update" : "Create"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarketplaceModal;
