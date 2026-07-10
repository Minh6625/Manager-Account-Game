import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  displayName: string | null;
}

interface Account {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'IN_USE' | 'PENDING_LOGOUT';
  note: string | null;
  ownerUserId: string;
  owner: {
    id: string;
    email: string;
    displayName: string | null;
  };
  memberships: Array<{
    user: {
      id: string;
      email: string;
      displayName: string | null;
    };
    memberStatus: string;
  }>;
  _count: {
    memberships: number;
  };
  createdAt: string;
  updatedAt: string;
}

type FilterTab = 'all' | 'owned' | 'joined';

export default function AccountListPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formName, setFormName] = useState('');
  const [formNote, setFormNote] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      loadAccounts();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/auth/me', {
        credentials: 'include',
      });

      if (!response.ok) {
        navigate('/login');
        return;
      }

      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/accs', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAllAccounts(data.data);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
    }
  };

  // Client-side filtering
  const getFilteredAccounts = (): Account[] => {
    let filtered = allAccounts;

    // Apply tab filter
    if (activeTab === 'owned') {
      filtered = filtered.filter((acc) => acc.ownerUserId === user?.id);
    } else if (activeTab === 'joined') {
      filtered = filtered.filter((acc) => acc.ownerUserId !== user?.id);
    }

    // Apply search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((acc) =>
        acc.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const accounts = getFilteredAccounts();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreating(true);

    try {
      const body: any = { name: formName };
      if (formNote && formNote.trim()) {
        body.note = formNote.trim();
      }

      const response = await fetch('http://localhost:3000/api/v1/accs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      console.log('Create account response:', response.status, response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Create account success:', data);
        
        // Add new account to state directly (optimistic update)
        setAllAccounts(prev => [data.data, ...prev]);
        
        // Reset form state
        setFormName('');
        setFormNote('');
        
        // Close modal
        setShowCreateModal(false);
      } else {
        let errorMessage = 'Tạo tài khoản thất bại';
        try {
          const error = await response.json();
          console.error('Create account error response:', error);
          errorMessage = error.message || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          // Response is not JSON, use default message
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Create account network error:', error);
      alert('Có lỗi xảy ra khi kết nối đến server');
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: Account['status']) => {
    const badges = {
      AVAILABLE: { text: 'Rảnh', color: 'bg-green-100 text-green-800' },
      IN_USE: { text: 'Đang chơi', color: 'bg-blue-100 text-blue-800' },
      PENDING_LOGOUT: { text: 'Chờ logout', color: 'bg-yellow-100 text-yellow-800' },
    };
    const badge = badges[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const getCurrentPlayer = (account: Account) => {
    const player = account.memberships.find(m => m.memberStatus === 'PLAYING');
    if (player) {
      return player.user.displayName || player.user.email;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Danh sách tài khoản
              </h1>
              <p className="text-sm text-gray-600">
                Xin chào, {user?.displayName || user?.email}
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                + Tạo acc
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab('owned')}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'owned'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Acc của tôi
              </button>
              <button
                onClick={() => setActiveTab('joined')}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'joined'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Acc đã tham gia
              </button>
            </nav>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên acc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Account List */}
          <div className="p-4">
            {accounts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">📭</div>
                <p>Không có tài khoản nào</p>
              </div>
            ) : (
              <div className="space-y-3">
                {accounts.map((account) => {
                  const currentPlayer = getCurrentPlayer(account);
                  return (
                    <div
                      key={account.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {account.name}
                            </h3>
                            {getStatusBadge(account.status)}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Chủ phòng:</span>{' '}
                              {account.owner.displayName || account.owner.email}
                            </p>
                            {currentPlayer && (
                              <p>
                                <span className="font-medium">Đang chơi:</span>{' '}
                                {currentPlayer}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">Thành viên:</span>{' '}
                              {account._count.memberships}
                            </p>
                            {account.note && (
                              <p className="text-gray-500 italic">{account.note}</p>
                            )}
                          </div>
                        </div>
                        
                        <button className="min-w-fit px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Tạo tài khoản mới</h2>
            <form onSubmit={handleCreateAccount}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên tài khoản <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên tài khoản"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    value={formNote}
                    onChange={(e) => setFormNote(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ghi chú thêm (tùy chọn)"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {creating ? 'Đang tạo...' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
