import React, { useRef, useState } from "react";
import { UploadCloud, FileText, X, Download } from "lucide-react"; // Add icons
import { uploadCSV } from "../../api/Post/uploadCSV";
import toast from "react-hot-toast";

interface UploadCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

const UploadCSVModal: React.FC<UploadCSVModalProps> = ({
  isOpen,
  onClose,
  onUploaded,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a CSV file.");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("csv_file", file); // <-- changed key here
      await uploadCSV(formData);
      toast.success("CSV uploaded successfully!");
      setFile(null);
      onClose();
      if (onUploaded) onUploaded();
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload CSV.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-blue-600" />
            Upload CSV
          </h2>
          <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open('/sample.csv', '_blank');
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Template
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}>
            <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-gray-600 text-center">
              Click to 
              <span className="text-blue-600 font-medium"> browse </span>
              your CSV file
            </p>
            <p className="text-sm text-gray-500 mt-1">Accepted formats: .csv, .txt</p>
            <input
              type="file"
              accept=".csv,.txt"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
          </div>
          {file && (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex justify-end gap-3">
            {/* <button
              type="button"
              onClick={() => window.open('/sample.csv', '_blank')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Template
            </button> */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-2"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                disabled={isLoading || !file}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5" />
                    Upload
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCSVModal;