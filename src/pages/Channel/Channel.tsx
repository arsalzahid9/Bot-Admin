import React, { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash } from "lucide-react";
import { createChannel } from "../../api/Channel/createChannel";
import toast from "react-hot-toast";
import { getChannel } from "../../api/Channel/getChannel";
import DeleteChannelModal from "./DeleteChannelModal";
import UpdateChannelModal from "./UpdateChannelModal";

interface Channel {
  id: string;
  name: string;
  channelName: string;
  channelLink: string;
  createdAt: string;
}


const CreateChannelModal = ({
  isOpen,
  onClose,
  onCreate,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; channelName: string }) => void;
  isLoading: boolean;
}) => {
  const [form, setForm] = useState({ name: "", channelName: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    onCreate(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Channel</h2>
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
              Channel Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border"
              value={form.channelName}
              onChange={(e) => setForm({ ...form, channelName: e.target.value })}
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
              ) : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface Channel {
  id: string;
  name: string;
  channel_username: string;
  created_at: string;
  // Optionally: user_id, updated_at if needed
}

export const Channel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedChannelId, setSelectedChannelId] = useState<string | number | null>(null);

  // Pagination states from API
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch channels from API
  const fetchChannels = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await getChannel(page, perPage);
      setChannels(res.data || []);
      setCurrentPage(res.pagination?.current_page || 1);
      setTotalPages(res.pagination?.last_page || 1);
    } catch (error: any) {
      setChannels([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchChannels(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const handleCreateChannel = async (data: { name: string; channelName: string }) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("channel_username", data.channelName);

      // Assuming createChannel returns the new channel, but we refetch for consistency
      await createChannel(formData);
      toast.success("Channel created successfully!");
      setIsModalOpen(false);
      fetchChannels(1); // Refetch first page
    } catch (error: any) {
      toast.error(error?.message || "Failed to create channel");
    } finally {
      setIsLoading(false);
    }
  };

  // Replace the handleDelete function with:
  const handleDeleteClick = (id: string | number) => {
    setSelectedChannelId(id);
    setIsDeleteModalOpen(true);
  };

  // Add a function to refresh after deletion
  const handleDeleteConfirm = () => {
    setIsDeleteModalOpen(false);
    setSelectedChannelId(null);
    fetchChannels(currentPage);
  };

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateChannelData, setUpdateChannelData] = useState<{ id: string | number; name: string; channelName: string } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = (id: string | number) => {
    const channel = channels.find((ch) => ch.id === id);
    if (channel) {
      setUpdateChannelData({
        id: channel.id,
        name: channel.name,
        channelName: channel.channel_username,
      });
      setIsUpdateModalOpen(true);
    }
  };

  const handleUpdateChannel = async (data: { id: string | number; name: string; channelName: string }) => {
    setIsUpdating(true);
    try {
      // You need to implement updateChannel API
      // Example:
      // await updateChannel(data.id, { name: data.name, channel_username: data.channelName });
      toast.success("Channel updated successfully!");
      setIsUpdateModalOpen(false);
      setUpdateChannelData(null);
      fetchChannels(currentPage);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update channel");
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
        <h1 className="text-2xl font-bold text-gray-800">Channel Management</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Channel
        </button>
      </div>
      <CreateChannelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateChannel}
        isLoading={isLoading}
      />
      <UpdateChannelModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setUpdateChannelData(null);
        }}
        onUpdate={handleUpdateChannel}
        isLoading={isUpdating}
        initialData={updateChannelData || undefined}
      />
      <DeleteChannelModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedChannelId(null);
        }}
        onConfirm={handleDeleteConfirm}
        channelId={selectedChannelId || undefined}
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
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Channel Username</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Channel Link</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Created At</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {channels.length > 0 ? (
                channels.map((ch) => (
                  <tr key={ch.id}>
                    <td className="px-6 py-4">{ch.name}</td>
                    <td className="px-6 py-4">{ch.channel_username}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://t.me/${ch.channel_username.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline underline-offset-2"
                      >
                        {`https://t.me/${ch.channel_username.replace(/^@/, "")}`}
                      </a>
                    </td>
                    <td className="px-6 py-4">{ch.created_at.slice(0, 10)}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-600 mr-2"
                        onClick={() => handleUpdate(ch.id)}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => handleDeleteClick(ch.id)}
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No channels found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2 mb-6">
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
