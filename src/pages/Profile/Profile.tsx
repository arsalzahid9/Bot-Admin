import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock,Key, ArrowLeft, Mail, Shield, Pencil, Check, X, Loader2, Eye, EyeOff } from "lucide-react"; // <-- Import Loader2
import { getProfile } from "../../api/Profile/getProfile";
import { updateProfile } from "../../api/Profile/updateProfile";
import { resetPassword } from "../../api/Auth/resetPassword"; // <-- Add this import
import toast from "react-hot-toast";

function Profile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ // <-- Add state for password fields
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isResettingPassword, setIsResettingPassword] = useState(false); // <-- Add loading state for password reset
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProfile();
        setProfile(response.data);
        setEditData({
          name: response.data?.name || "",
          email: response.data?.email || ""
        });
      } catch (err: any) {
        setError(typeof err === "string" ? err : err?.message || "Failed to fetch profile");
        toast.error(typeof err === "string" ? err : err?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ name: profile?.name || "", email: profile?.email || "" });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    if (!profile?.id) {
      toast.error("Profile ID not found.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("email", editData.email);
      
      await updateProfile(profile.id, formData);
      
      setProfile({ ...profile, ...editData });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : err?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => { // <-- Add handler for password inputs
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => { // <-- Add handler for password reset submit
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
        toast.error("Please fill in all password fields.");
        return;
    }

    setIsResettingPassword(true);
    try {
      const payload = {
        password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword,
      };
      await resetPassword(payload);
      toast.success("Password reset successfully!");
      // Clear password fields after successful reset
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : (err?.message || "Failed to reset password");
      // Check for specific backend error messages if available
      if (err?.errors?.password) {
          toast.error(`Password Error: ${err.errors.password.join(', ')}`);
      } else if (err?.errors?.new_password) {
          toast.error(`New Password Error: ${err.errors.new_password.join(', ')}`);
      } else {
          toast.error(errorMessage);
      }
    } finally {
      setIsResettingPassword(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className=" p-4 flex items-center gap-4">
        {/* <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={24} />
        </button> */}
        <div className="flex items-center">
          <User className="text-blue-900 mr-2" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Personal Details</h1>
        </div>
        {!loading && !error && (
          isEditing ? (
            <div className="ml-auto flex gap-2">
              <button
                onClick={handleSave}
                className="text-green-600 hover:text-green-800"
                title="Save"
              >
                <Check size={22} />
              </button>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-red-600"
                title="Cancel"
              >
                <X size={22} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleEditClick}
              className="ml-auto text-gray-500 hover:text-blue-600"
              title="Edit"
            >
              <Pencil size={22} />
            </button>
          )
        )}
      </div>

      <div className="bg-white p-6 mt-6 space-y-6 mx-4 rounded-lg shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : profile ? (
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-blue-900 mr-3" />
              <div>
                <label className="text-sm text-gray-600">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleChange}
                    className="text-lg font-medium bg-white border-b border-blue-200 focus:outline-none px-1"
                  />
                ) : (
                  <p className="text-lg font-medium">{profile?.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-900 mr-3" />
              <div>
                <label className="text-sm text-gray-600">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    className="text-lg font-medium bg-white border-b border-blue-200 focus:outline-none px-1"
                  />
                ) : (
                  <p className="text-lg font-medium">{profile?.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-900 mr-3" />
              <div>
                <label className="text-sm text-gray-600">Role</label>
                <p className="text-lg font-medium capitalize">
                  {profile?.is_admin === 1 || profile?.is_admin === "1" ? "Admin" : "Guide"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">No profile data found.</div>
        )}
      </div>
      
      <div className="flex items-center md:ml-5 md:mt-6 ml-4 mt-4">
        <Lock className="text-blue-900 mr-2" size={24} />
        <h1 className="text-2xl font-bold text-gray-800">Password Reset</h1>
      </div>
      <div className="bg-white p-8 mt-6 mx-4 rounded-lg shadow-sm">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : profile ? (
          <form className="space-y-6" onSubmit={handlePasswordReset}>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    autoComplete="current-password"
                    required
                    disabled={isResettingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    autoComplete="new-password"
                    required
                    disabled={isResettingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    autoComplete="new-password"
                    required
                    disabled={isResettingPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-700"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50"
                disabled={isResettingPassword}
              >
                {isResettingPassword ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center text-gray-500 py-8">No profile data found.</div>
        )}
      </div>
    </div>
  );
}

export default Profile;
