import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import type { Marketplace } from "../../types";
import MarketplaceModal from "./MarketplaceModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { getMarketPlace } from "../../api/Marketplace/getMarketPlace";
import toast from "react-hot-toast";

function Marketplaces() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] =
    useState<Marketplace | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch marketplaces data when component mounts
  useEffect(() => {
    fetchMarketplaces();
  }, []);

  const fetchMarketplaces = async () => {
    try {
      setLoading(true);
      const response = await getMarketPlace();
      console.log("response", response);

      // Check if response.data exists and is an array
      if (response && response.data && Array.isArray(response.data)) {
        setMarketplaces(response.data);
      } else if (
        response &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        // If response.data.data is an array (common API structure)
        setMarketplaces(response.data.data);
      } else {
        // If we can't find an array, set an empty array
        console.error("Expected an array but received:", response);
        setMarketplaces([]);
        toast.error("Invalid data format received from server");
      }
    } catch (error) {
      console.error("Failed to fetch marketplaces:", error);
      toast.error("Failed to load marketplaces");
      setMarketplaces([]); // Ensure marketplaces is always an array
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedMarketplace(null);
    setIsModalOpen(true);
  };

  const openEditModal = (marketplace: Marketplace) => {
    setSelectedMarketplace(marketplace);
    setIsModalOpen(true);
  };

  const openDeleteModal = (marketplace: Marketplace) => {
    setSelectedMarketplace(marketplace);
    setIsDeleteOpen(true);
  };

  // Refresh after delete
  const handleDelete = async () => {
    setIsDeleteOpen(false);
    setSelectedMarketplace(null);
    setLoading(true);
    await fetchMarketplaces();
  };

  // Refresh after add/edit
  const handleSaveMarketplace = async (
    data: Omit<Marketplace, "id" | "createdAt">,
    id?: string
  ) => {
    setLoading(true);
    await fetchMarketplaces();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Marketplaces</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Marketplace
        </button>
      </div>

      <div>
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : marketplaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Marketplaces Found
            </h2>
            <p className="text-gray-500 mb-6">
              Click below to add your first marketplace.
            </p>
            <button
              onClick={openCreateModal}
              className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600"
            >
              Add Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {marketplaces.map((marketplace) => (
              <div
                key={marketplace.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {marketplace.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(marketplace)}
                      className="text-gray-600 hover:text-blue-500"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(marketplace)}
                      className="text-gray-600 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col md:flex-row items-start justify-between mt-3">
                    <div className="space-y-2">
                      <div>
                        <label className="text-gray-900 font-bold">
                          App ID
                        </label>
                        <p className="font-medium text-gray-800 break-all">
                          {marketplace.app_id}
                        </p>
                      </div>

                      <div>
                        <label className="text-gray-900 font-bold">ID</label>
                        <p className="font-medium text-gray-800">
                          {marketplace.id}
                        </p>
                      </div>

                      <div className="max-w-[300px]">
                        <label className="text-gray-900 font-bold">
                          App Secret
                        </label>
                        <p className="font-medium text-gray-800 break-all">
                          {marketplace.app_secret}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-900 font-bold">
                          Market Place
                        </label>
                        <p className="font-medium text-gray-800">
                          {marketplace.marketplace}
                        </p>
                      </div>

                      <div>
                        <label className="text-gray-900 font-bold">
                          Status
                        </label>
                        <p className="font-medium text-gray-800">
                          {marketplace.status}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-gray-900 font-bold">
                          User ID
                        </label>
                        <p className="font-medium text-gray-800">
                          {marketplace.user_id}
                        </p>
                      </div>

                      <div>
                        <label className="text-gray-900 font-bold">
                          Partner ID
                        </label>
                        <p className="font-medium text-gray-800">
                          {marketplace.partner_id}
                        </p>
                      </div>

                      <div>
                        <label className="text-gray-900 font-bold">
                          Status
                        </label>
                        <p className="font-medium text-gray-800">
                          {marketplace.status}
                        </p>
                      </div>

                      <div>
                        <label className="text-gray-900 font-bold">
                          Website Link
                        </label>
                        <p className="font-medium text-gray-800 break-all">
                          {marketplace.website_link}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <MarketplaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveMarketplace}
        initialData={selectedMarketplace}
      />

      
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        marketplaceId={selectedMarketplace?.id}
      />
    </div>
  );
}

export default Marketplaces;
