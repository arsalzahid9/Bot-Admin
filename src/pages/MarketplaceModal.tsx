// components/MarketplaceModal.tsx
import React, { useState, useEffect } from 'react';
import type { Marketplace } from '../types';

interface MarketplaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (marketplace: Omit<Marketplace, 'id' | 'createdAt'>, id?: string) => void;
    initialData?: Marketplace | null;
}

const MarketplaceModal: React.FC<MarketplaceModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        isActive: true,
        apiKey: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                isActive: initialData.isActive,
                apiKey: initialData.apiKey ?? '',
            });
        } else {
            setFormData({
                name: '',
                isActive: true,
                apiKey: '',
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData, initialData?.id);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{initialData ? 'Edit Marketplace' : 'Add Marketplace'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Marketplace Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 block w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="form-checkbox h-5 w-5 text-blue-500"
                            />
                            <span className="ml-2 text-gray-700">
                                {formData.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">API Key</label>
                        <input
                            type="url"
                            required
                            value={formData.apiKey}
                            onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                            className="mt-1 block w-full rounded-md px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MarketplaceModal;
