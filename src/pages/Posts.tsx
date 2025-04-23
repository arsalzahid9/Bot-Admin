import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Plus } from "lucide-react";
import type { Post } from "../types";
import toast from "react-hot-toast";
import { createPost } from "../api/Post/createPost";
import { fetchPosts } from "../api/Post/fetchPosts";
import { statusChange } from "../api/Post/statusChange"; 
import { getProductDetail } from "../api/Post/getProductDetail";
import { getMarketPlaceDropdown } from "../api/Marketplace/getMarketPlaceDropdown";
import { rejectPost } from "../api/Post/rejectPost";

function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated, // Add this prop
}: {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void; // Add this prop type
}) {
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

  const [marketplaces, setMarketplaces] = useState<{ value: string; label: string }[]>([]);

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

    try {
      const data = new FormData();

      data.append("channelId", JSON.stringify(formData.channelIds));
      if (formData.photo) data.append("photo", formData.photo);
      data.append("market_place", formData.marketplace);
      data.append("productLink", formData.productLink);
      data.append("productName", formData.productName);
      data.append("priceMin", formData.priceMin.toString());
      data.append("priceMax", formData.priceMax.toString());
      data.append("currentprice", formData.currentPrice.toString());
      data.append("coupon", formData.coupons.filter((c) => c).join(","));
      data.append("purchaseType", formData.purchaseType);
      data.append("converted_link", formData.convertedLink);
      data.append("imageUrl", formData.imageUrl);
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
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, photo: file });

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
          <div>
            <label className="block text-md font-medium text-gray-900 mb-1">
              Channel IDs
            </label>
            {formData.channelIds.map((channel, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  required
                  placeholder="@t.me/channel"
                  className="w-full px-3 py-2 border"
                  value={channel}
                  onChange={(e) => handleChannelChange(e, idx)}
                />
                {formData.channelIds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveChannel(idx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddChannel}
              className="text-blue-500"
            >
              + Add Another Channel
            </button>
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

          <div>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Purchase Type
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border"
              value={formData.purchaseType}
              onChange={(e) =>
                setFormData({ ...formData, purchaseType: e.target.value })
              }
              disabled={!formData.marketplace}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Photo
            </label>
            {/* <div
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
              ) : (
                <span className="text-gray-500">Click to upload an image</span>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            /> */}
            {formData.imageUrl && (
              <div className="w-full h-28 border border-dashed flex items-center justify-center">
                <img
                  src={formData.imageUrl}
                  alt="Fetched Product"
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxWidth: "100px" }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Coupons
            </label>
            {formData.coupons.map((coupon, idx) => (
              <input
                key={idx}
                type="text"
                className="w-full px-3 py-2 border mb-2"
                value={coupon}
                onChange={(e) => {
                  const updated = [...formData.coupons];
                  updated[idx] = e.target.value;
                  setFormData({ ...formData, coupons: updated });
                }}
                disabled={!formData.marketplace}
              />
            ))}
            {/* <button
              type="button"
              onClick={() => setFormData({...formData, coupons: [...formData.coupons, ""]})}
              className="text-blue-500"
            >
              + Add Another Coupon
            </button> */}
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
              {isLoading ? "Loading..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Posts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const handleRejectPost = async (postId: string) => {
    try {
      await rejectPost(postId);
      toast.success("Post rejected successfully");
      await fetchPostsData(); // Refresh after reject
    } catch (error) {
      console.error("Reject error:", error);
      toast.error(`Failed to reject post: ${error}`);
    }
  };

  const fetchPostsData = async () => {
    try {
      setLoading(true); // 2. Set loading to true before fetching
      const response = await fetchPosts();
      console.log("response", response);
      if (Array.isArray(response.data.data)) {
        setPosts(response.data.data);
        console.log("posts", posts);
      } else {
        console.error("Expected an array but received:", response.data);
      }
    } catch (error: unknown) {
      console.error("An unexpected error occurred", error);
    } finally {
      setLoading(false); // 2. Set loading to false after fetching
    }
  };

  useEffect(() => {
   

    fetchPostsData();
  }, []);

  const handleStatusChange = async (
    postId: string,
    newStatus: "approve" | "reject"
  ) => {
    try {
      await statusChange(postId, newStatus);
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );
      toast.success(`Post status changed to ${newStatus}`);
      await fetchPostsData(); // Refresh after approve/reject
    } catch (error) {
      toast.error(`Failed to change status: ${error}`);
    }
  };

  const handleCreatePost = async () => {
    await fetchPostsData(); // Refresh posts after creation
    setIsModalOpen(false);  // Close the modal
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Posts Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Post
        </button>
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
                      <div>
                        <a
                          href={post.product_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-gray-900 underline underline-offset-2"
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
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === "approve"
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
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(post.id, "approve")}
                        className={`text-green-600 hover:text-green-900 ${
                          post.status === "approve" || post.status === "reject"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={post.status === "approve" || post.status === "reject"}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRejectPost(post.id)}
                        className={`text-red-600 hover:text-red-900 ${
                          post.status === "approve" || post.status === "reject"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        disabled={post.status === "approve" || post.status === "reject"}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handleCreatePost}
      />
    </div>
  );
}

export default Posts;
