import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { postScrapping } from '../../api/Post/postScrapping'; // Add this import

interface ScrappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrapeComplete: () => void;
}

const ScrappingModal: React.FC<ScrappingModalProps> = ({ isOpen, onClose, onScrapeComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [websiteName, setWebsiteName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !websiteName) {
      toast.error('Please enter both website name and URL');
      return;
    }

    setIsLoading(true);
    let apiSuccess = false;
    try {
      const formData = new FormData();
      formData.append('website_name', websiteName);
      formData.append('website_link', url);

      await postScrapping(formData);
      apiSuccess = true;
      toast.success('Products scraped successfully!');
    } catch (error) {
      console.error('Error scraping products:', error);
      toast.error('Failed to scrape products');
    } finally {
      setIsLoading(false);
      if (apiSuccess) {
        onScrapeComplete();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Scrape Products</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Website Name
            </label>
            <select
              className="w-full px-3 py-2 border rounded"
              required
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
            >
              <option value="">Select a website</option>
              <option value="pelando">Pelando</option>
              <option value="pechinchou">Pechinchou</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Website URL
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter website URL to scrape"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin w-4 h-4 mr-2" />
                  Scraping...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Start Scraping
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScrappingModal;