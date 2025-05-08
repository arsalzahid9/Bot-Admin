import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, Plus, ChevronLeft, ChevronRight, RefreshCw, Pencil, Heart, Upload } from "lucide-react";
import type { Post } from "../../types";
import toast from "react-hot-toast";
import { createPost } from "../../api/Post/createPost";
import { fetchPosts } from "../../api/Post/fetchPosts";
import { statusChange } from "../../api/Post/statusChange";
import { getProductDetail } from "../../api/Post/getProductDetail";
import { getMarketPlaceDropdown } from "../../api/Marketplace/getMarketPlaceDropdown";
import { rejectPost } from "../../api/Post/rejectPost";
import { resendPost } from "../../api/Post/resendPost";
import { getChannelDropdown } from "../../api/Channel/getChannelDropdown";
import { addToFavorite } from "../../api/Post/favorite";
import EditPostModal from "./EditPostModal";
import UploadCSVModal from "./UploadCSVModal";


function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated, // Add this prop
}: {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void; // Add this prop type
}) {

  interface Channel {
    id: number;
    user_id: number;
    name: string;
    channel_username: string;
    created_at: string;
    updated_at: string;
  }
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    channelIds: [""],
    marketplace: "",
    productLink: "",
    productName: "",
    priceMin: 0,
    priceMax: 0,
    currentPrice: 0,
    price: 0,
    affiliateLink: "",
    convertedLink: "",
    imageUrl: null,
    purchaseType: "",
    coupons: [""],
    specialConditions: [""],
    photo: null as File | null,
    schedulePost: "",
  });
  // Inside Posts component
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Should match your default perPage value
  const [marketplaces, setMarketplaces] = useState<{ value: string; label: string }[]>([]);


  const filteredChannels = channels.filter((channel) =>
    channel.channel_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleChannel = (channelId: string) => {
    setFormData(prev => {
      const index = prev.channelIds.indexOf(channelId);
      if (index === -1) {
        return { ...prev, channelIds: [...prev.channelIds, channelId] };
      } else {
        return {
          ...prev,
          channelIds: prev.channelIds.filter(id => id !== channelId)
        };
      }
    });
  };

  const removeChannel = (channelId: string) => {
    setFormData(prev => ({
      ...prev,
      channelIds: prev.channelIds.filter(id => id !== channelId)
    }));
  };
  useEffect(() => {
    if (isOpen) {
      getChannelDropdown()
        .then((response) => {
          if (response.data) {
            setChannels(response.data);
          }
        })
        .catch((err) => {
          toast.error("Failed to load channels");
        });
    }
  }, [isOpen]);
  useEffect(() => {
    // Fetch marketplace dropdown data when modal opens
    if (isOpen) {
      getMarketPlaceDropdown()
        .then((data) => {
          // Adjust this mapping based on your API response structure
          // Example assumes data is an array of { id, name }
          if (Array.isArray(data.data)) {
            setMarketplaces(
              data.data.map((item: any) => ({
                value: item.name || item.value || item.id,
                label: item.name || item.label || item.id,
              }))
            );
          }
        })
        .catch((err) => {
          toast.error("Failed to load marketplaces");
        });
    }
  }, [isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true); // Set loading immediately

    try {
      const data = new FormData();

      data.append("channelId", JSON.stringify(formData.channelIds));
      // Use image for both file and URL
      if (formData.photo) {
        data.append("image", formData.photo);
      } else if (formData.imageUrl) {
        data.append("image", formData.imageUrl);
      }
      data.append("market_place", formData.marketplace);
      data.append("productLink", formData.productLink);
      data.append("productName", formData.productName);
      data.append("priceMin", formData.priceMin.toString());
      data.append("priceMax", formData.priceMax.toString());
      data.append("currentprice", formData.currentPrice.toString());
      data.append("coupons", formData.coupons.filter((c) => c).join(","));
      data.append("purchaseType", formData.purchaseType);
      data.append("converted_link", formData.convertedLink);
      data.append(
        "special_conditions",
        formData.specialConditions.filter((c) => c).join(",")
      );

      if (formData.schedulePost) {
        const formattedDate = new Date(formData.schedulePost)
          .toISOString()
          .replace('T', ' ')
          .slice(0, 19);
        data.append("schedule_post", formattedDate);
      }
      await createPost(data);
      toast.success("Post created successfully!");

      // Clear form fields after successful submission
      setFormData({
        channelIds: [""],
        marketplace: "AliExpress",
        productLink: "",
        productName: "",
        priceMin: 0,
        priceMax: 0,
        currentPrice: 0,
        price: 0,
        convertedLink: "",
        imageUrl: null,
        affiliateLink: "",
        purchaseType: "",
        coupons: [""],
        specialConditions: [""],
        photo: null,
      });
      setPreview(null);
      onClose();
      onPostCreated(); // Notify parent to refresh posts
    } catch (error: any) {
      toast.error(error?.message || "Post creation failed");
    } finally {
      setIsLoading(false); // Always reset loading state
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, photo: file, imageUrl: null });

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  // Fixed channel change handler to properly handle pasted links
  const handleChannelChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const updated = [...formData.channelIds];
    updated[idx] = e.target.value;
    setFormData({ ...formData, channelIds: updated });
  };

  const handleAddChannel = () => {
    setFormData({ ...formData, channelIds: [...formData.channelIds, ""] });
  };

  const handleRemoveChannel = (idx: number) => {
    if (formData.channelIds.length > 1) {
      const updated = formData.channelIds.filter((_, i) => i !== idx);
      setFormData({ ...formData, channelIds: updated });
    }
  };

  // Function to fetch product details when product link changes
  const fetchProductDetails = async (link: string) => {
    if (!link) return;

    try {
      setIsLoading(true);

      // Send the marketplace name and product link to the API
      const response = await getProductDetail(formData.marketplace, link);
      console.log("Product details:", response);

      if (response && response.data) {
        // Convert price strings to numbers
        const parsePrice = (priceStr: any) => {
          if (typeof priceStr === 'string') {
            return parseFloat(priceStr.replace(/[^\d,.-]/g, '').replace(',', '.'));
          }
          return 0; // Default to 0 if priceStr is not a string
        };

        // Update form with fetched data
        setFormData(prev => ({
          ...prev,
          productName: response.data.productName || prev.productName,
          currentPrice: parsePrice(response.data.price) || prev.currentPrice,
          priceMin: parsePrice(response.data.priceMin) || prev.priceMin,
          priceMax: parsePrice(response.data.priceMax) || prev.priceMax,
          convertedLink: response.data.affiliateLink || prev.affiliateLink,
          imageUrl: response.data.imageUrl || prev.imageUrl,
          coupons: [response.data.coupons || ""], // Add coupon from API response
          photo: null // Clear photo if imageUrl is set
        }));

        // If there's an image URL in the response, set it as preview
        if (response.data.image_url) {
          setPreview(response.data.image_url);
        }

        toast.success("Product details loaded successfully");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce function to prevent too many API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Debounced product link change handler
  const debouncedFetchProductDetails = debounce(fetchProductDetails, 1000);

  const handleProductLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setFormData({ ...formData, productLink: link });

    if (link && link.includes('http')) {
      debouncedFetchProductDetails(link);
    }
  };

  const handleCancel = () => {
    setFormData({
      channelIds: [""],
      marketplace: "AliExpress",
      productLink: "",
      productName: "",
      priceMin: 0,
      priceMax: 0,
      currentPrice: 0,
      price: 0,
      convertedLink: "",
      imageUrl: null,
      affiliateLink: "",
      purchaseType: "",
      coupons: [""],
      specialConditions: [""],
      photo: null,
    });
    setPreview(null);
    onClose();
  };

  useEffect(() => {
    // Cleanup the object URL when the component unmounts or when the preview changes
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <label className="block text-md font-medium text-gray-900 mb-1">
              Channel IDs
            </label>

            {/* Selected channels as pills */}
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.channelIds.filter(id => id).map((channelId) => {
                const channel = channels.find(c => c.channel_username === channelId);
                return (
                  <div
                    key={channelId}
                    className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                  >
                    {channel ? channel.name : channelId}
                    <button
                      type="button"
                      onClick={() => removeChannel(channelId)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Dropdown input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search channels..."
                className="w-full px-3 py-2 border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              />

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredChannels.length > 0 ? (
                    filteredChannels.map((channel) => (
                      <div
                        key={channel.id}
                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${formData.channelIds.includes(channel.channel_username) ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleChannel(channel.channel_username)}
                      >
                        <div className="font-medium">{channel.name}</div>
                        <div className="text-sm text-gray-500">{channel.channel_username}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No channels found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Marketplace
            </label>
            <select
              value={formData.marketplace}
              onChange={(e) =>
                setFormData({ ...formData, marketplace: e.target.value })
              }
              className="w-full px-3 py-2 border"
              required
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
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Product Link
            </label>
            <div className="relative">
              <input
                type="url"
                required
                className="w-full px-3 py-2 border"
                value={formData.productLink}
                onChange={handleProductLinkChange}
                placeholder="Paste product URL to auto-fill details"
                disabled={!formData.marketplace}
              />
              {isLoading && (
                <div className="absolute right-3 top-2">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              disabled={!formData.marketplace}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Min Price
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full px-3 py-2 border"
              value={formData.priceMin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priceMin: parseFloat(e.target.value),
                })
              }
              disabled={!formData.marketplace}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Max Price
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full px-3 py-2 border"
              value={formData.priceMax}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priceMax: parseFloat(e.target.value),
                })
              }
              disabled={!formData.marketplace}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Current Price
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full px-3 py-2 border"
              value={formData.currentPrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  currentPrice: parseFloat(e.target.value),
                })
              }
              disabled={!formData.marketplace}
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Converted Link
            </label>
            <input
              type="url"
              required
              className="w-full px-3 py-2 border"
              value={formData.convertedLink}
              onChange={(e) =>
                setFormData({ ...formData, convertedLink: e.target.value })
              }
              disabled={!formData.marketplace}
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Purchase Type
            </label>
            <select
              className="w-full px-3 py-2 border"
              value={formData.purchaseType}
              onChange={(e) =>
                setFormData({ ...formData, purchaseType: e.target.value })
              }
              disabled={!formData.marketplace}
            >
              <option value="">(empty) - no mandatory</option>
              <option value="No Brasil">No Brasil</option>
              <option value="Taxas Inclusas">Taxas Inclusas</option>
              <option value="Fora do Remessa Conforme">Fora do Remessa Conforme</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Photo
            </label>
            <div
              className="w-full h-28 border border-dashed flex items-center justify-center cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxWidth: "100px" }}
                />
              ) : formData.imageUrl ? (
                <img
                  src={formData.imageUrl}
                  alt="Product"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxWidth: "100px" }}
                />
              ) : (
                <span className="text-gray-500">Click to upload an image</span>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleFileChange(e);
                setFormData(prev => ({ ...prev, imageUrl: null }));
              }}
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Special Conditions
            </label>
            {formData.specialConditions.map((cond, idx) => (
              <input
                key={idx}
                type="text"
                className="w-full px-3 py-2 border mb-2"
                value={cond}
                onChange={(e) => {
                  const updated = [...formData.specialConditions];
                  updated[idx] = e.target.value;
                  setFormData({ ...formData, specialConditions: updated });
                }}
                disabled={!formData.marketplace}
              />
            ))}
            
            {/* <button
              type="button"
              onClick={() => setFormData({...formData, specialConditions: [...formData.specialConditions, ""]})}
              className="text-blue-500"
            >
              + Add Another Condition
            </button> */}
                <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Coupon
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border"
              value={formData.coupons[0] || ""}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  coupons: [e.target.value],
                });
              }}
              disabled={!formData.marketplace}
              placeholder="Enter coupon code"
            />
          </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Schedule Post
            </label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border"
              value={formData.schedulePost}
              onChange={(e) =>
                setFormData({ ...formData, schedulePost: e.target.value })
              }
              disabled={!formData.marketplace}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 rounded"
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
                  Loading...
                </>
              ) : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function useOutsideClick(ref: React.RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}
function ActionsDropdown({
  post,
  onClose,
  onApprove,
  onReject,
  onResend,
  onEdit,
  fetchPostsData,
  isResending, // Add this prop
  isApproving,  // Add this prop
  isRejecting,  // Add this prop
}: {
  post: Post;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onResend: () => void;
  onEdit: () => void;
  fetchPostsData: () => Promise<void>;
  isResending: boolean; // Add this prop
  isApproving: boolean;  // Add this prop
  isRejecting: boolean;  // Add this prop
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFavorite, setIsFavorite] = useState(post.is_favorite);
  const [isLoading, setIsLoading] = useState(false);


  useOutsideClick(dropdownRef, () => {
    onClose();
  });
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await addToFavorite(post.id);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removed from favorites!" : "Added to favorites!");
    } catch (error) {
      toast.error(error?.message || "Failed to update favorites");
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onApprove();
        }}
        className={`block px-4 py-2 text-sm w-full text-left ${post.status === "approve" || post.status === "reject" || post.status === "schedule"
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100"
          }`}
        disabled={post.status === "approve" || post.status === "reject" || post.status === "schedule" || isApproving}
      >
        <div className="flex items-center">
          {isApproving ? (
            <svg className="animate-spin h-4 w-4 mr-2 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
          )}
          {isApproving ? 'Approving...' : 'Approve'}
        </div>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onReject();
        }}
        className={`block px-4 py-2 text-sm w-full text-left ${post.status === "approve" || post.status === "reject" || post.status === "schedule"
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100"
          }`}
        disabled={post.status === "approve" || post.status === "reject" || post.status === "schedule" || isRejecting}
      >
        <div className="flex items-center">
          {isRejecting ? (
            <svg className="animate-spin h-4 w-4 mr-2 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <XCircle className="w-4 h-4 mr-2 text-red-600" />
          )}
          {isRejecting ? 'Rejecting...' : 'Reject'}
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onResend();
        }}
        className={`block px-4 py-2 text-sm w-full text-left ${post.status === "schedule"
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100"
          }`}
        disabled={post.status === "schedule" || isResending}
      >
        <div className="flex items-center">
          {isResending ? (
            <svg className="animate-spin h-4 w-4 mr-2 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <RefreshCw className="w-4 h-4 mr-2 text-blue-600" />
          )}
          {isResending ? 'Resending...' : 'Resend'}
        </div>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
      >
        <div className="flex items-center">
          <Pencil className="w-4 h-4 mr-2 text-blue-600" />
          Edit
        </div>
      </button>

      <button
        onClick={
          async (e) => {
            e.stopPropagation();
            try {
              setIsLoading(true);
              await addToFavorite(post.id);
              toast.success(post.isFavorite ? "Removed from favorites!" : "Added to favorites!");
              await fetchPostsData();
            } catch (error) {
              toast.error("Failed to update favorite status");
            } finally {
              setIsLoading(false);
            }
          }
        }
        disabled={isLoading}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left disabled:opacity-50"
      >
        <span className="flex items-center">
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {post.isFavorite === 1 ? "Removing..." : "Adding..."}
            </>
          ) : post.isFavorite === 1 ? (
            <>
              <Heart className="w-4 h-4 mr-2 text-blue-600" fill="red" color="red" />
              Remove from Favorite
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 mr-2 text-red-600" />
              Add to Favorite
            </>
          )}
        </span>
      </button>

    </div>
  );
}
function Posts() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [approvingPosts, setApprovingPosts] = useState<Record<string, boolean>>({});
  const [rejectingPosts, setRejectingPosts] = useState<Record<string, boolean>>({});

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleEditClick = (post: Post) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedPost(null);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingPosts, setResendingPosts] = useState<Record<string, boolean>>({}); // Add this state


  const handleResendPost = async (postId: string) => {
    setResendingPosts(prev => ({ ...prev, [postId]: true }));
    try {
      await resendPost(postId);
      toast.success("Post resent successfully");
      await fetchPostsData(); // Refresh after resend
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend post");
    } finally {
      setResendingPosts(prev => ({ ...prev, [postId]: false }));
    }
  };


  // Pagination states: define here at the top level of Posts component
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10; // Should match your default perPage value

  const handleRejectPost = async (postId: string) => {
    try {
      setRejectingPosts(prev => ({ ...prev, [postId]: true })); // Set loading state
      await rejectPost(postId); // This only sends the ID
      toast.success("Post rejected successfully");
      await fetchPostsData(); // Refresh after reject
    } catch (error) {
      console.error("Reject error:", error);
      toast.error(`Failed to reject post: ${error}`);
    } finally {
      setRejectingPosts(prev => ({ ...prev, [postId]: false })); // Clear loading state
    }
  };

  const fetchPostsData = async () => {
    try {
      setLoading(true);
      const response = await fetchPosts(currentPage, itemsPerPage);

      if (response.data && Array.isArray(response.data.data)) {
        setPosts(response.data.data);
        setTotalPages(response.data.pagination.last_page);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, [currentPage]); // Refetch when page changes
  const handleStatusChange = async (postId: string) => {
    try {
      setApprovingPosts(prev => ({ ...prev, [postId]: true })); // Set loading state
      await statusChange(postId, "approve"); // Only handles approval now
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, status: "approve" } : post
      ));
      toast.success("Post approved successfully");
      await fetchPostsData(); // Refresh after approve
    } catch (error) {
      toast.error(`Failed to approve post: ${error}`);
    } finally {
      setApprovingPosts(prev => ({ ...prev, [postId]: false })); // Clear loading state
    }
  };
  const handleCreatePost = async () => {
    setCurrentPage(1); // Reset to first page after creation
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Posts Management</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Post
          </button>
        </div>
      </div>


      {/* 3. Loader UI */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="border border-lg bg-white overflow-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">
                  Marketplace
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">
                  Min Price
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">
                  Max Price
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">
                  Schedule Datetime
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="truncate" style={{ maxWidth: '160px' }}>
                        <a
                          href={post.product_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-900 underline underline-offset-2"
                          title={post.product_link} // Tooltip added here
                        >
                          {post.product_name}
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.market_place}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      ${post.current_price}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      ${post.min_price}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      ${post.max_price}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {post.schedule_post
                      ? post.schedule_post
                      : <span className="text-gray-400">N/A</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === "approve"
                        ? "bg-green-100 text-green-800"
                        : post.status === "reject"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="relative">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center p-1 rounded-full hover:bg-gray-200 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPosts(posts.map(p =>
                            p.id === post.id ? { ...p, showActions: !p.showActions } : { ...p, showActions: false }
                          ));
                        }}
                      >
                        <svg
                          className="w-5 h-5 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01"
                          />
                        </svg>
                      </button>

                      {post.showActions && (
                        <ActionsDropdown
                          post={post}
                          onClose={() => setPosts(posts.map(p => ({ ...p, showActions: false })))}
                          onApprove={() => handleStatusChange(post.id, "approve")}
                          onReject={() => handleRejectPost(post.id)} // Uses separate reject function
                          onResend={() => handleResendPost(post.id)}
                          onEdit={() => handleEditClick(post)}
                          fetchPostsData={fetchPostsData}
                          isResending={resendingPosts[post.id] || false}
                          isApproving={approvingPosts[post.id] || false}
                          isRejecting={rejectingPosts[post.id] || false}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* After the table closing tag */}
          {!loading && totalPages > 1 && (
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
          )}
        </div>
      )}
      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        post={selectedPost}
        onPostEdited={fetchPostsData}
      />

      <UploadCSVModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploaded={fetchPostsData}
      />

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={fetchPostsData}
      />
    </div>
  );
}

export default Posts;



