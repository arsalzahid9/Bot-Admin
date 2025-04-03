import { Save } from "lucide-react";

function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Bot Configuration
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-md font-medium text-gray-700">
                  Default Post Format
                </label>
                <div className="mt-2 p-4 block w-full space-y-2 rounded-md border border-gray-300 outline-none sm:text-sm" >
                  <div className="text-sm font-medium">Product name</div>
                  <div className="text-sm font-medium">Product link </div>
                  <div className="text-sm font-medium">Previous Price </div>
                  <div className="text-sm font-medium">Current Price</div>
                  <div className="text-sm font-medium">Coupons</div>
                  <div className="text-sm font-medium">Conditions</div>
                  <div className="text-sm font-medium">Buy here</div>
                </div>
              </div>

              <div>
                <label className="block text-md font-medium text-gray-700">
                  Auto-approval Price Threshold
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="w-full relative">
                    <span className="absolute top-2.5 left-2.5">$</span>
                    <input
                      type="number"
                      className="w-full flex-1 p-3 pl-7 rounded-lg border border-gray-300 outline-none sm:text-sm"
                      placeholder="Enter Approval Price"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Minimum Discount Percentage
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="w-full relative">
                    <span className="absolute top-2.5 right-2.5">%</span>
                    <input
                      type="number"
                      className="w-full flex-1 p-3 pr-7 rounded-lg border border-gray-300 outline-none sm:text-sm"
                      placeholder="Enter Approval Price"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Notification Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">
                    Email notifications for new posts
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-500"
                    defaultChecked
                  />
                  <span className="ml-2 text-gray-700">
                    Notify on marketplace errors
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
              >
                <Save className="w-5 h-5 mr-2" />
                Update Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
