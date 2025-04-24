import React, { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { createBot } from "../../api/Bot/createBot";
import { getBot } from "../../api/Bot/getBot";
import DeleteBotModal from "./DeleteBotModal";
import { UpdateBotModal } from "./UpdateBotModal";

// Example Bot interface (adjust fields as needed)
interface Bot {
  id: number;
  user_id: number;
  bot_name: string;
  access_token: string;
  created_at: string;
  updated_at: string;
}

const CreateBotModal = ({
  isOpen,
  onClose,
  onCreate,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; botName: string }) => void;
  isLoading: boolean;
}) => {
  const [form, setForm] = useState({ name: "", botName: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onCreate(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Bot</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Access Token
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border"
              value={form.botName}
              onChange={(e) => setForm({ ...form, botName: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
              disabled={isLoading}
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
                  Creating...
                </>
              ) : "Create Bot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const Bot = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBotId, setSelectedBotId] = useState<string | number | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch bots from API
  const fetchBots = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await getBot(page, perPage);
      setBots(res.data || []);
      setCurrentPage(res.pagination?.current_page || 1);
      setTotalPages(res.pagination?.last_page || 1);
    } catch (error: any) {
      setBots([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBots(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const handleCreateBot = async (data: { name: string; botName: string }) => {
    setIsLoading(true);
    try {
      await createBot({
        bot_name: data.name,
        access_token: data.botName, // Use botName field as access_token input
      });
      toast.success("Bot created successfully!");
      setIsModalOpen(false);
      fetchBots(1); // Refetch first page
    } catch (error: any) {
      toast.error(error?.message || "Failed to create bot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string | number) => {
    setSelectedBotId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    setSelectedBotId(null);
    fetchBots(currentPage);
  };

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateBotData, setUpdateBotData] = useState<{ id: string | number; name: string; botName: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (id: string | number) => {
    const bot = bots.find((b) => b.id === id);
    if (bot) {
      setUpdateBotData({
        id: bot.id,
        name: bot.bot_name, // Use bot_name from API
        botName: bot.access_token, // Use access_token as botName for modal
      });
      setIsUpdateModalOpen(true);
    }
  };

  const handleUpdateBot = async (data: { id: string | number; name: string; botName: string }) => {
    setIsUpdating(true);
    try {
      // await updateBot(data.id, { name: data.name, bot_username: data.botName });
      toast.success("Bot updated successfully!");
      setIsUpdateModalOpen(false);
      setUpdateBotData(null);
      fetchBots(currentPage);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update bot");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Bot Management</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Bot
        </button>
      </div>
      <CreateBotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateBot}
        isLoading={isLoading}
      />
      <UpdateBotModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setUpdateBotData(null);
        }}
        onUpdate={handleUpdateBot}
        isLoading={isUpdating}
        initialData={updateBotData || undefined}
      />
      <DeleteBotModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBotId(null);
        }}
        onConfirm={handleDeleteConfirm}
        botId={selectedBotId || undefined}
      />
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="border border-lg bg-white overflow-auto rounded-md">
          <table className="min-w-full">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Bot Name</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Access Token</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Created At</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bots.length > 0 ? (
                bots.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4">{b.bot_name}</td>
                    <td className="px-6 py-4">{b.access_token}</td>
                    <td className="px-6 py-4">{b.created_at.slice(0, 10)}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-600 mr-2"
                        onClick={() => handleUpdate(b.id)}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => handleDeleteClick(b.id)}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No bots found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2">
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
        </div>
      )}
    </div>
  );
};
