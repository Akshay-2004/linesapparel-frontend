'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useUserDetails, EUserRole } from '@/hooks/useUserDetails';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Settings,
  ShoppingBag,
  Shield,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, error, isAdmin, logout } = useUserDetails();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const navigateToOrders = () => {
    router.push('/orders');
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-900 mb-2">
                Failed to load profile
              </h2>
              <p className="text-red-700">{error || 'User not found'}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleBadgeColor = (role: EUserRole) => {
    switch (role) {
      case EUserRole.superAdmin:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case EUserRole.admin:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Logout
        </Button>
      </div>

      {/* Profile Information Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            {/* User Details */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                  <div className="flex items-center space-x-3 mt-1">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role === EUserRole.superAdmin ? 'Super Admin' : 
                       user.role === EUserRole.admin ? 'Admin' : 'Client'}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {user.verified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm text-red-600">Not Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
          <CardTitle className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-green-600" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Orders Button */}
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-200"
              onClick={navigateToOrders}
            >
              <ShoppingBag className="h-6 w-6 text-blue-600" />
              <span className="font-medium">My Orders</span>
            </Button>

            {/* Admin Dashboard Button - Only show for admins */}
            {isAdmin() && (
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-200"
                onClick={navigateToDashboard}
              >
                <Shield className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Admin Dashboard</span>
              </Button>
            )}

            {/* Edit Profile Button */}
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 hover:border-gray-200"
              onClick={() => toast.info('Profile editing coming soon')}
            >
              <User className="h-6 w-6 text-gray-600" />
              <span className="font-medium">Edit Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
          <CardTitle className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-gray-600" />
            <span>Account Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email Verification</span>
              <div className="flex items-center space-x-2">
                {user.verified ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-green-600 font-medium">Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-red-600 font-medium">Pending</span>
                    <Button size="sm" variant="outline" className="ml-2">
                      Resend Verification
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Account Type</span>
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role === EUserRole.superAdmin ? 'Super Admin' : 
                 user.role === EUserRole.admin ? 'Admin' : 'Client'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-gray-900 font-medium">
                {formatDate(user.updatedAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
