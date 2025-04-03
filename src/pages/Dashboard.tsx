import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Post } from '../types';

// ✅ Dummy recent posts (in real apps this can come from props, context, or API)
const recentPosts: Post[] = [
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
    status: 'pending',
  },
  {
    id: '2',
    marketplace: 'Amazon',
    productLink: 'https://amazon.com/item/456',
    productName: 'Bluetooth Speaker',
    previousPrice: 49.99,
    currentPrice: 39.99,
    convertedLink: 'https://converted-link.com/456',
    coupons: ['OFF20'],
    specialConditions: [],
    createdAt: '2024-03-01T08:00:00Z',
    status: 'approved',
  },
  {
    id: '3',
    marketplace: 'Shopee',
    productLink: 'https://shopee.com/item/789',
    productName: 'Phone Case',
    previousPrice: 10.99,
    currentPrice: 6.99,
    convertedLink: 'https://converted-link.com/789',
    coupons: [],
    specialConditions: [],
    createdAt: '2024-03-02T08:00:00Z',
    status: 'rejected',
  },
];

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white border-l-4 border-[#A3A3A3] p-6 rounded-lg shadow-md w-full">
      <div className="flex items-center justify-between w-full">
        <div>
          <h3 className="text-xl font-bold">{label}</h3>
          <p className="text-lg font-semibold text-gray-700">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10 mr-4`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const stats = {
    totalPosts: 156,
    pendingPosts: 12,
    approvedPosts: 134,
    rejectedPosts: 10,
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard icon={Activity} label="Total Posts" value={stats.totalPosts} color="bg-blue-500" />
        <StatCard icon={Clock} label="Pending Posts" value={stats.pendingPosts} color="bg-yellow-500" />
        <StatCard icon={CheckCircle} label="Approved Posts" value={stats.approvedPosts} color="bg-green-500" />
        <StatCard icon={XCircle} label="Rejected Posts" value={stats.rejectedPosts} color="bg-red-500" />
      </div>

      {/* Recent Posts */}
      <div className="my-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Recent Posts</h1>
        <div className="border border-lg bg-white overflow-auto rounded-md">
          <table className="min-w-full">
            <thead className="border-b border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Product</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Marketplace</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Current Price</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Old Price</th>
                <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPosts.slice(0, 5).map((post) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right">
          <Link to="/posts" className="text-blue-600 hover:underline text-sm font-medium">
            View all posts →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
