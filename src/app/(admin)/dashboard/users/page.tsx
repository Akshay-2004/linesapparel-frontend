'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUserService, IUser, UserStats } from '@/services/user.service';
import { 
  Search, 
  Users, 
  Edit, 
  Trash2,
  Filter,
  User,
  Mail,
  Phone,
  AlertTriangle,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Calendar,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface Filters {
  role: 'all' | 'client' | 'admin' | 'super_admin';
  search: string;
}

interface DeleteConfirmation {
  isOpen: boolean;
  userId: string;
  userName: string;
  isDeleting: boolean;
}

interface RoleChangeModal {
  isOpen: boolean;
  userId: string;
  userName: string;
  currentRole: string;
  newRole: string;
  isChanging: boolean;
}

interface EditUserModal {
  isOpen: boolean;
  user: IUser | null;
  isUpdating: boolean;
  formData: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    role: 'all',
    search: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    userId: '',
    userName: '',
    isDeleting: false,
  });
  const [roleChangeModal, setRoleChangeModal] = useState<RoleChangeModal>({
    isOpen: false,
    userId: '',
    userName: '',
    currentRole: '',
    newRole: '',
    isChanging: false,
  });
  const [editUserModal, setEditUserModal] = useState<EditUserModal>({
    isOpen: false,
    user: null,
    isUpdating: false,
    formData: {
      name: '',
      email: '',
      phone: '',
    },
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    getAllUsers,
    getUserStats,
    updateUserProfile,
    changeUserRole,
    deleteUser,
    loading,
    error
  } = useUserService();

  const limit = 12; // 12 users per page

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage, filters]);

  const fetchUsers = async () => {
    try {
      const params: any = {
        page: currentPage,
        limit,
      };

      if (filters.role !== 'all') {
        params.role = filters.role;
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const response = await getAllUsers(params);
      
      if (response && response.users) {
        setUsers(response.users);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.pagination?.total || 0);
      } else {
        setUsers([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      setUsers([]);
      setTotalPages(1);
      setTotalCount(0);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await getUserStats();
      setStats(statsData);
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      userId: id,
      userName: name,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));
    
    try {
      await deleteUser(deleteConfirmation.userId);
      toast.success('User deleted successfully');
      await fetchUsers();
      await fetchStats();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        userId: '',
        userName: '',
        isDeleting: false,
      });
    }
  };

  const handleRoleChangeClick = (user: IUser) => {
    setRoleChangeModal({
      isOpen: true,
      userId: user._id,
      userName: user.name,
      currentRole: user.role,
      newRole: user.role,
      isChanging: false,
    });
  };

  const handleRoleChangeConfirm = async () => {
    setRoleChangeModal(prev => ({ ...prev, isChanging: true }));
    
    try {
      await changeUserRole(roleChangeModal.userId, { role: roleChangeModal.newRole as any });
      toast.success('User role updated successfully');
      await fetchUsers();
      await fetchStats();
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setRoleChangeModal({
        isOpen: false,
        userId: '',
        userName: '',
        currentRole: '',
        newRole: '',
        isChanging: false,
      });
    }
  };

  const handleEditClick = (user: IUser) => {
    setEditUserModal({
      isOpen: true,
      user,
      isUpdating: false,
      formData: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      },
    });
  };

  const handleEditConfirm = async () => {
    if (!editUserModal.user) return;
    
    setEditUserModal(prev => ({ ...prev, isUpdating: true }));
    
    try {
      await updateUserProfile(editUserModal.user._id, editUserModal.formData);
      toast.success('User profile updated successfully');
      await fetchUsers();
    } catch (error) {
      toast.error('Failed to update user profile');
    } finally {
      setEditUserModal({
        isOpen: false,
        user: null,
        isUpdating: false,
        formData: { name: '', email: '', phone: '' },
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchUsers(), fetchStats()]);
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      client: { color: 'bg-blue-100 text-blue-800', icon: User, label: 'Client' },
      admin: { color: 'bg-green-100 text-green-800', icon: Shield, label: 'Admin' },
      super_admin: { color: 'bg-purple-100 text-purple-800', icon: Crown, label: 'Super Admin' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.client;
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center text-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage user accounts and permissions ({totalCount} total)
          </p>
        </div>
        
        {/* Refresh Button */}
        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          variant="outline"
          size="lg"
          className="flex items-center"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-4xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-4xl font-bold">{stats.clients}</div>
              <p className="text-xs text-muted-foreground">
                {stats.breakdown.clientPercentage}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-4xl font-bold">{stats.admins + stats.superAdmins}</div>
              <p className="text-xs text-muted-foreground">
                {(parseFloat(stats.breakdown.adminPercentage) + parseFloat(stats.breakdown.superAdminPercentage)).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Recent Signups</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl lg:text-4xl font-bold">{stats.recentSignups}</div>
              <p className="text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Search by Name or Email
              </Label>
              <div className="flex mt-1">
                <Input
                  id="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search users..."
                  className="rounded-r-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  className="rounded-l-none"
                  variant="outline"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <Label htmlFor="role-filter" className="text-sm font-medium text-gray-700">
                Role
              </Label>
              <select
                id="role-filter"
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="mt-1 block w-full h-10 px-3 py-2 rounded-xs border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="all">All Roles</option>
                <option value="client">Clients</option>
                <option value="admin">Admins</option>
                <option value="super_admin">Super Admins</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.role !== 'all' || filters.search) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.role !== 'all' && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Role: {filters.role.replace('_', ' ')}
                </span>
              )}
              {filters.search && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Search: "{filters.search}"
                </span>
              )}
              <button
                onClick={() => {
                  setFilters({ role: 'all', search: '' });
                  setSearchInput('');
                  setCurrentPage(1);
                }}
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                Clear all
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Grid */}
      {users.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.role !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'No users are currently registered in the system.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card key={user._id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {getRoleBadge(user.role)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Join Date */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(user)}
                      className="flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>

                    {/* Delete Button - Only show if not super admin */}
                    {user.role !== 'super_admin' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(user._id, user.name)}
                        className="flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>

                  {/* Role Change Button */}
                  {user.role !== 'super_admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChangeClick(user)}
                      className="flex items-center"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Change Role
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirmation.userName}</span>? 
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone and will permanently remove the user account.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmation({ isOpen: false, userId: '', userName: '', isDeleting: false })}
                disabled={deleteConfirmation.isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmation.isDeleting}
              >
                {deleteConfirmation.isDeleting ? 'Deleting...' : 'Delete User'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleChangeModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <UserCheck className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Change User Role</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Change role for <span className="font-semibold text-gray-900">{roleChangeModal.userName}</span>
              </p>
              
              <Label htmlFor="new-role" className="text-sm font-medium text-gray-700">
                New Role
              </Label>
              <select
                id="new-role"
                value={roleChangeModal.newRole}
                onChange={(e) => setRoleChangeModal(prev => ({ ...prev, newRole: e.target.value }))}
                className="mt-1 block w-full h-10 px-3 py-2 rounded-xs border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setRoleChangeModal({ isOpen: false, userId: '', userName: '', currentRole: '', newRole: '', isChanging: false })}
                disabled={roleChangeModal.isChanging}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRoleChangeConfirm}
                disabled={roleChangeModal.isChanging || roleChangeModal.newRole === roleChangeModal.currentRole}
              >
                {roleChangeModal.isChanging ? 'Updating...' : 'Update Role'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUserModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Edit className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Edit User Profile</h3>
            </div>
            
            <div className="mb-6 space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editUserModal.formData.name}
                  onChange={(e) => setEditUserModal(prev => ({
                    ...prev,
                    formData: { ...prev.formData, name: e.target.value }
                  }))}
                  placeholder="Enter name"
                />
              </div>

              <div>
                <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUserModal.formData.email}
                  onChange={(e) => setEditUserModal(prev => ({
                    ...prev,
                    formData: { ...prev.formData, email: e.target.value }
                  }))}
                  placeholder="Enter email"
                />
              </div>

              <div>
                <Label htmlFor="edit-phone" className="text-sm font-medium text-gray-700">
                  Phone (Optional)
                </Label>
                <Input
                  id="edit-phone"
                  value={editUserModal.formData.phone}
                  onChange={(e) => setEditUserModal(prev => ({
                    ...prev,
                    formData: { ...prev.formData, phone: e.target.value }
                  }))}
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setEditUserModal({ isOpen: false, user: null, isUpdating: false, formData: { name: '', email: '', phone: '' } })}
                disabled={editUserModal.isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditConfirm}
                disabled={editUserModal.isUpdating || !editUserModal.formData.name.trim() || !editUserModal.formData.email.trim()}
              >
                {editUserModal.isUpdating ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10"
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
