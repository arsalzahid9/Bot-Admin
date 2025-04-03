import { useState } from 'react';
import { Eye, EyeOff, Plus, Edit2, Trash2 } from 'lucide-react';
import type { Marketplace } from '../types';
import MarketplaceModal from './MarketplaceModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

function Marketplaces() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

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

  const handleDelete = () => {
    if (selectedMarketplace) {
      setMarketplaces(prev => prev.filter(mp => mp.id !== selectedMarketplace.id));
      setIsDeleteOpen(false);
      setSelectedMarketplace(null);
    }
  };

  const handleSaveMarketplace = (data: Omit<Marketplace, 'id' | 'createdAt'>, id?: string) => {
    if (id) {
      // Edit
      setMarketplaces(prev => prev.map(mp => mp.id === id ? { ...mp, ...data } : mp));
    } else {
      // Create
      const newMarketplace: Marketplace = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setMarketplaces(prev => [newMarketplace, ...prev]);
    }
  };

  const toggleMarketplace = (id: string) => {
    setMarketplaces(prev => prev.map(mp =>
      mp.id === id ? { ...mp, isActive: !mp.isActive } : mp
    ));
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
        {marketplaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 rounded-lg shadow-inner">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Marketplaces Found</h2>
            <p className="text-gray-500 mb-6">Click below to add your first marketplace.</p>
            <button
              onClick={openCreateModal}
              className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600"
            >
              Add Marketplace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaces.map((marketplace) => (
              <div key={marketplace.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{marketplace.name}</h3>
                  <div className="flex space-x-2">
                    <button onClick={() => openEditModal(marketplace)} className="text-gray-600 hover:text-blue-500">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => openDeleteModal(marketplace)} className="text-gray-600 hover:text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <label className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={marketplace.isActive}
                    onChange={() => toggleMarketplace(marketplace.id)}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span className="ml-2 text-gray-700">
                    {marketplace.isActive ? 'Active' : 'Inactive'}
                  </span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700">API Key</label>
                  <div className="mt-1 flex items-center">
                    <input
                      type={showApiKey ? 'url' : 'password'}
                      value={marketplace.apiKey}
                      readOnly
                      className="flex-1 block w-full rounded-md p-1 border border-gray-300 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="ml-2 text-gray-600 hover:text-gray-900"
                    >
                      {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Added on {new Date(marketplace.createdAt).toLocaleDateString()}
                  </p>
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
      />
    </div>
  );
}

export default Marketplaces;
