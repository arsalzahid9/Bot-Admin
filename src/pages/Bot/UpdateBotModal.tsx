import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getBotModal } from "../../api/Bot/getBotModal";
import { updateBotModal } from "../../api/Bot/UpdateBotModal";

interface UpdateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: { id: string | number; name: string; botName: string }) => void;
  isLoading: boolean;
  initialData?: { id: string | number; name: string; botName: string };
}

export const UpdateBotModal: React.FC<UpdateBotModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  isLoading,
  initialData,
}) => {
  const [form, setForm] = useState({ name: "", botName: "" });
  const [originalForm, setOriginalForm] = useState({ name: "", botName: "" });
  const [loadingBot, setLoadingBot] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchBot = async () => {
      if (isOpen && initialData?.id) {
        setLoadingBot(true);
        try {
          const res = await getBotModal(initialData.id.toString());
          if (res && res.data) {
            const newForm = {
              name: res.data.bot_name || res.data.name || "",
              accessToken: res.data.access_token || res.data.bot_username || "",
            };
            setForm(newForm);
            setOriginalForm(newForm);
          }
        } catch (error: any) {
          toast.error(error?.message || "Failed to fetch bot data");
        } finally {
          setLoadingBot(false);
        }
      }
    };
    fetchBot();
  }, [isOpen, initialData?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || loadingBot || !initialData) return;
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("bot_name", form.name);
      formData.append("access_token", form.accessToken);

      await updateBotModal(initialData.id.toString(), formData);
      toast.success("Bot updated successfully!");
      onUpdate({ id: initialData.id, name: form.name, botName: form.accessToken });
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update bot");
    } finally {
      setUpdating(false);
    }
  };

  const isFormChanged =
    form.name !== originalForm.name || form.accessToken !== originalForm.accessToken;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Update Bot</h2>
        {loadingBot ? (
          <div className="flex justify-center items-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
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
                disabled={isLoading || updating}
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
                value={form.accessToken}
                onChange={(e) => setForm({ ...form, accessToken: e.target.value })}
                disabled={isLoading || updating}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded"
                disabled={isLoading || updating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 text-white rounded ${isLoading || updating || !isFormChanged ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading || updating || !isFormChanged}
              >
                {isLoading || updating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : "Update Bot"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
