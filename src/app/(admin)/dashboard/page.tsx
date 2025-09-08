"use client"
import React, { useEffect, useState } from "react";
import StatsCard from "@/components/cards/StatsCard";
import DataTable from "@/components/shared/DataTable";
import { FaShoppingCart, FaUsers, FaBoxOpen, FaDollarSign } from "react-icons/fa";
import { useApi } from "@/hooks/useApi";

interface DashboardStats {
  totalUsers: number;
  totalCarts: number;
  totalInquiries: number;
  totalReviews: number;
  totalTestimonials: number;
  totalSales: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
}

const AdminDashboard = () => {
  const { fetchData, loading: statsLoading, error: statsError } = useApi<DashboardStats>();
  const { fetchData: fetchOrders, loading: ordersLoading, error: ordersError } = useApi<RecentOrder[]>();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const orderColumns = ["Order ID", "Customer", "Amount", "Status", "Date"];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsData = await fetchData("/dashboard/stats");
        if (statsData) {
          setStats(statsData);
        }

        // Fetch recent orders
        const ordersData = await fetchOrders("/dashboard/recent-orders");
        if (ordersData) {
          setRecentOrders(ordersData);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadDashboardData();
  }, [fetchData, fetchOrders]);

  // Prepare stats for display
  const displayStats = stats ? [
    { title: "Total Sales", value: `$${stats.totalSales.toLocaleString()}`, icon: <FaDollarSign color="#22c55e" /> },
    { title: "Users", value: stats.totalUsers, icon: <FaUsers color="#3b82f6" /> },
    { title: "Carts", value: stats.totalCarts, icon: <FaShoppingCart color="#f59e42" /> },
    { title: "Inquiries", value: stats.totalInquiries, icon: <FaBoxOpen color="#a855f7" /> },
    { title: "Reviews", value: stats.totalReviews, icon: <FaDollarSign color="#22c55e" /> },
    { title: "Testimonials", value: stats.totalTestimonials, icon: <FaUsers color="#3b82f6" /> },
  ] : [
    { title: "Total Sales", value: "Loading...", icon: <FaDollarSign color="#22c55e" /> },
    { title: "Users", value: "Loading...", icon: <FaUsers color="#3b82f6" /> },
    { title: "Carts", value: "Loading...", icon: <FaShoppingCart color="#f59e42" /> },
    { title: "Inquiries", value: "Loading...", icon: <FaBoxOpen color="#a855f7" /> },
    { title: "Reviews", value: "Loading...", icon: <FaDollarSign color="#22c55e" /> },
    { title: "Testimonials", value: "Loading...", icon: <FaUsers color="#3b82f6" /> },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Error messages */}
      {(statsError || ordersError) && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error loading dashboard data:</p>
          <p>{statsError || ordersError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {displayStats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="w-full">
        <h2 className="text-xl mb-3 font-semibold">Recent Orders</h2>
        {ordersLoading ? (
          <div className="bg-white rounded-lg p-4">
            <p className="text-gray-500">Loading recent orders...</p>
          </div>
        ) : (
          <DataTable
            columns={orderColumns}
            data={recentOrders.length > 0 ? recentOrders.map(order => ({
              "Order ID": `#${order.id}`,
              "Customer": order.customer,
              "Amount": order.amount,
              "Status": order.status,
              "Date": order.date
            })) : []}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
