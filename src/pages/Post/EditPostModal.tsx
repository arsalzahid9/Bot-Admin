import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Plus, ChevronLeft, ChevronRight, RefreshCw, Pencil, Heart, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { getProductDetail } from "../../api/Post/getProductDetail";
import { getMarketPlaceDropdown } from "../../api/Marketplace/getMarketPlaceDropdown";
import { getChannelDropdown } from "../../api/Channel/getChannelDropdown";
import { updatePost } from "../../api/Post/updatePostModal";
import { getPostForEdit } from "../../api/Post/editPostModal";

interface Channel {
  id: number;
  user_id: number;
  name: string;
  channel_username: string;
  created_at: string;
  updated_at: string;
}

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  onPostEdited: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  post,
  onPostEdited,
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [marketplaces, setMarketplaces] = useState<{ value: string; label: string }[]>([]);
  
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
    // convertedLink: "",
    imageUrl: null,
    purchaseType: "",
    coupons: [""],  // Add this line
    specialConditions: [""],
    photo: null as File | null,
    schedulePost: "",
  });

  const filteredChannels = channels.filter((channel) =>
    channel.channel_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      // Load channels
      getChannelDropdown()
        .then((response) => {
          if (response.data) {
            setChannels(response.data);
          }
        })
        .catch((err) => {
          toast.error("Failed to load channels");
        });

      // Load marketplaces
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
        .catch((err) => {
          toast.error("Failed to load marketplaces");
        });

      // Fetch post data if post has id
      if (post?.id) {
        getPostForEdit(post.id)
          .then((response) => {
            const postData = response.data;
            setFormData({
              channelIds: postData.group_data || [""],
              marketplace: postData.market_place || "",
              productLink: postData.product_link || "",
              productName: postData.product_name || "",
              priceMin: Number(postData.min_price) || 0,
              priceMax: Number(postData.max_price) || 0,
              currentPrice: Number(postData.current_price) || 0,
              price: 0,
              affiliateLink: "",
              // convertedLink: "",
              imageUrl: postData.image || null,
              purchaseType: postData.purchaseType || "",
              coupons: postData.coupons ? postData.coupons.split(",") : [""],  // Add this line
              specialConditions: postData.special_conditions ? postData.special_conditions.split(",") : [""],
              photo: null,
              schedulePost: "",
            });

            if (postData.image) {
              setPreview(postData.image);
            }
          })
          .catch((err) => {
            toast.error("Failed to load post data");
          });
      } else if (post) {
        // Fallback to existing post data if no id
        setFormData({
          channelIds: post.channel_ids ? JSON.parse(post.channel_ids) : [""],
          marketplace: post.market_place || "",
          productLink: post.product_link || "",
          productName: post.product_name || "",
          priceMin: post.min_price || 0,
          priceMax: post.max_price || 0,
          currentPrice: post.current_price || 0,
          price: post.price || 0,
          affiliateLink: post.affiliate_link || "",
          // convertedLink: post.converted_link || "",
          imageUrl: post.image_url || null,
          purchaseType: post.purchase_type || "",
          // coupons: post.coupons ? post.coupons.split(",") : [""],
          specialConditions: post.special_conditions ? post.special_conditions.split(",") : [""],
          photo: null,
          schedulePost: post.schedule_post || "",
        });

        if (post.image_url) {
          setPreview(post.image_url);
        }
      }
    }
  }, [isOpen, post]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const data = new FormData();

      data.append("channelId", JSON.stringify(formData.channelIds));
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
      data.append("coupon", formData.coupons.filter((c) => c).join(","));  // Add this line
      data.append("purchaseType", formData.purchaseType);
      // data.append("converted_link", formData.convertedLink);
      data.append("special_conditions", formData.specialConditions.filter((c) => c).join(","));

      if (formData.schedulePost) {
        const formattedDate = new Date(formData.schedulePost)
          .toISOString()
          .replace('T', ' ')
          .slice(0, 19);
        data.append("schedule_post", formattedDate);
      }

      await updatePost(post.id, data);
      toast.success("Post updated successfully!");
      onPostEdited();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Post update failed");
    } finally {
      setIsLoading(false);
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

  const fetchProductDetails = async (link: string) => {
    if (!link) return;

    try {
      setIsLoading(true);
      const response = await getProductDetail(formData.marketplace, link);

      if (response && response.data) {
        const parsePrice = (priceStr: any) => {
          if (typeof priceStr === 'string') {
            return parseFloat(priceStr.replace(/[^\d,.-]/g, '').replace(',', '.'));
          }
          return 0;
        };

        setFormData(prev => ({
          ...prev,
          productName: response.data.productName || prev.productName,
          currentPrice: parsePrice(response.data.price) || prev.currentPrice,
          priceMin: parsePrice(response.data.priceMin) || prev.priceMin,
          priceMax: parsePrice(response.data.priceMax) || prev.priceMax,
          // convertedLink: response.data.affiliateLink || prev.affiliateLink,
          imageUrl: response.data.imageUrl || prev.imageUrl,
          photo: null
        }));

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

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedFetchProductDetails = debounce(fetchProductDetails, 1000);

  const handleProductLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setFormData({ ...formData, productLink: link });

    if (link && link.includes('http')) {
      debouncedFetchProductDetails(link);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <label className="block text-md font-medium text-gray-900 mb-1">
              Channel IDs
            </label>

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

          {/* <div>
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
          </div> */}

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
          </div>

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
              ) : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;