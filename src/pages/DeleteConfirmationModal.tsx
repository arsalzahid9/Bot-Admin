// components/DeleteConfirmationModal.tsx
interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
          <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this marketplace?</h3>
          <div className="flex justify-center space-x-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteConfirmationModal;
  