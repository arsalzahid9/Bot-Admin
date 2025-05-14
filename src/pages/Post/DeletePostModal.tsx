import React, { useState } from 'react';
import { deletePost } from '../../api/Post/deletePost';
import toast from 'react-hot-toast';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string | number;
  onDeleteSuccess: () => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ 
  isOpen, 
  onClose, 
  postId,
  onDeleteSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deletePost(postId);
      toast.success('Post deleted successfully!');
      onDeleteSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Delete Post</h2>
        <p className="mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePostModal;
