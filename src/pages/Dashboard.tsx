import { Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchPosts } from '../api/Post/fetchPosts';
import { statusChange } from '../api/Post/statusChange';
import { rejectPost } from '../api/Post/rejectPost';
import toast from 'react-hot-toast';
import type { Post } from '../types';
import { getDashboard } from '../api/Dashboard/getDashboard';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // New state for dashboard stats
  const [stats, setStats] = useState({
    totalPosts: 0,
    pendingPosts: 0,
    approvedPosts: 0,
    rejectedPosts: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getDashboard();
      if (response && response.data) {
        setStats({
          totalPosts: response.data.total_post ?? 0,
          pendingPosts: response.data.total_post_pending ?? 0,
          approvedPosts: response.data.total_post_approve ?? 0,
          rejectedPosts: response.data.total_post_reject ?? 0,
        });
      } else {
        setStats({
          totalPosts: 0,
          pendingPosts: 0,
          approvedPosts: 0,
          rejectedPosts: 0,
        });
        toast.error('Failed to load dashboard stats');
      }
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchPostsData = async () => {
    try {
      setLoading(true);
      const response = await fetchPosts();
      if (Array.isArray(response.data.data)) {
        setPosts(response.data.data);
      } else {
        setPosts([]);
        toast.error('Failed to load posts');
      }
    } catch (error) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchPostsData();
  }, []);

  const handleStatusChange = async (
    postId: string,
    newStatus: 'approve' | 'reject'
  ) => {
    try {
      await statusChange(postId, newStatus);
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );
      toast.success(`Post status changed to ${newStatus}`);
      await fetchPostsData();
    } catch (error) {
      toast.error(`Failed to change status: ${error}`);
    }
  };

  const handleRejectPost = async (postId: string) => {
    try {
      await rejectPost(postId);
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, status: 'reject' } : post
        )
      );
      toast.success('Post rejected successfully');
      await fetchPostsData();
    } catch (error) {
      toast.error(`Failed to reject post: ${error}`);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {statsLoading ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-md w-full h-24 animate-pulse" />
            <div className="bg-white p-6 rounded-lg shadow-md w-full h-24 animate-pulse" />
            <div className="bg-white p-6 rounded-lg shadow-md w-full h-24 animate-pulse" />
            <div className="bg-white p-6 rounded-lg shadow-md w-full h-24 animate-pulse" />
          </>
        ) : (
          <>
            <StatCard icon={Activity} label="Total Posts" value={stats.totalPosts} color="bg-blue-500" />
            <StatCard icon={Clock} label="Pending Posts" value={stats.pendingPosts} color="bg-yellow-500" />
            <StatCard icon={CheckCircle} label="Approved Posts" value={stats.approvedPosts} color="bg-green-500" />
            <StatCard icon={XCircle} label="Rejected Posts" value={stats.rejectedPosts} color="bg-red-500" />
          </>
        )}
      </div>

      {/* Posts Table */}
      <div className="my-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Recent Posts</h1>
        <div className="border border-lg bg-white overflow-auto rounded-md">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="border-b border-gray-300">
                <tr>
                  <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Marketplace</th>
                  <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Current Price</th>
                  <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Min Price</th>
                  <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Max Price</th>
                  <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Status</th>
                  {/* <th className="px-6 py-4 text-left text-md font-medium text-gray-900 tracking-wider">Actions</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.slice(0, 5).map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <a
                            href={post.product_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-900 underline underline-offset-2"
                          >
                            {post.product_name}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.market_place}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">${post.current_price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">${post.min_price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">${post.max_price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          post.status === 'approve'
                            ? 'bg-green-100 text-green-800'
                            : post.status === 'reject'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(post.id, 'approve')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectPost(post.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={post.status === 'approve'}
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
