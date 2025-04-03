import React, { useState } from 'react';
import { CheckCircle, XCircle, Plus } from 'lucide-react';
import type { Post } from '../types';

function CreatePostModal({ isOpen, onClose, onSubmit }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<Post, 'id' | 'createdAt' | 'status'>) => void;
}) {
  const [formData, setFormData] = useState({
    marketplace: 'AliExpress',
    productLink: '',
    productName: '',
    previousPrice: 0,
    currentPrice: 0,
    convertedLink: '',
    coupons: [''],
    specialConditions: ['']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Marketplace</label>
            <select
              className="mt-1 block w-full rounded-md px-2 py-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.marketplace}
              onChange={(e) => setFormData({ ...formData, marketplace: e.target.value })}
            >
              <option value="AliExpress">AliExpress</option>
              <option value="Shopee">Shopee</option>
              <option value="Amazon">Amazon</option>
              <option value="Mercado Livre">Mercado Livre</option>
              <option value="Magalu">Magalu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Link</label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md px-2 py-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.productLink}
              onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md px-2 py-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Previous Price</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  className="pl-7 block w-full rounded-md px-2 py-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.previousPrice}
                  onChange={(e) => setFormData({ ...formData, previousPrice: parseFloat(e.target.value) })}
                  required
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Current Price</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  className="pl-7 block w-full rounded-md px-2 py-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({ ...formData, currentPrice: parseFloat(e.target.value) })}
                  required
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Converted Link</label>
            <input
              type="url"
              className="mt-1 block w-full rounded-md px-2 py-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.convertedLink}
              onChange={(e) => setFormData({ ...formData, convertedLink: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Coupons</label>
            {formData.coupons.map((coupon, index) => (
              <div key={index} className="mt-1 flex">
                <input
                  type="text"
                  className="flex-1 rounded-md px-2 py-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={coupon}
                  onChange={(e) => {
                    const newCoupons = [...formData.coupons];
                    newCoupons[index] = e.target.value;
                    setFormData({ ...formData, coupons: newCoupons });
                  }}
                />
                {index === formData.coupons.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coupons: [...formData.coupons, ''] })}
                    className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Special Conditions</label>
            {formData.specialConditions.map((condition, index) => (
              <div key={index} className="mt-1 flex">
                <input
                  type="text"
                  className="flex-1 rounded-md px-2 py-4 border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={condition}
                  onChange={(e) => {
                    const newConditions = [...formData.specialConditions];
                    newConditions[index] = e.target.value;
                    setFormData({ ...formData, specialConditions: newConditions });
                  }}
                />
                {index === formData.specialConditions.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, specialConditions: [...formData.specialConditions, ''] })}
                    className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Posts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      marketplace: 'AliExpress',
      productLink: 'https://aliexpress.com/item/123',
      productName: 'Wireless Earbuds',
      previousPrice: 29.99,
      currentPrice: 19.99,
      convertedLink: 'https://converted-link.com/123',
      coupons: ['SAVE10'],
      specialConditions: ['Limited time offer'],
      createdAt: '2024-02-28T12:00:00Z',
      status: 'pending'
    },
  ]);

  const handleStatusChange = (postId: string, newStatus: 'approved' | 'rejected') => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, status: newStatus } : post
    ));
  };

  const handleCreatePost = (newPost: Omit<Post, 'id' | 'createdAt' | 'status'>) => {
    const post: Post = {
      ...newPost,
      id: (posts.length + 1).toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setPosts([post, ...posts]);
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

      <div className="border border-lg bg-white overflow-auto">
        <table className="min-w-full">
          <thead className="border-b border-gray-300">
            <tr>
              <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Product</th>
              <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Marketplace</th>
              <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Current Price</th>
              <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Old Price</th>
              <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <a href={post.productLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-900 underline underline-offset-2">{post.productName}</a>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{post.marketplace}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">${post.currentPrice}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">${post.previousPrice}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'approved' ? 'bg-green-100 text-green-800' :
                      post.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(post.id, 'approved')}
                      className="text-green-600 hover:text-green-900"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStatusChange(post.id, 'rejected')}
                      className="text-red-600 hover:text-red-900"
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

      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}

export default Posts;