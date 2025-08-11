import React from "react";
import StatsCard from "@/components/cards/StatsCard";
import DataTable from "@/components/shared/DataTable";
import Graph from "@/components/shared/Graph";
import { FaShoppingCart, FaUsers, FaBoxOpen, FaDollarSign } from "react-icons/fa";

const stats = [
  { title: "Total Sales", value: "$12,340", icon: <FaDollarSign color="#22c55e" /> },
  { title: "Orders", value: 320, icon: <FaShoppingCart color="#3b82f6" /> },
  { title: "Products", value: 58, icon: <FaBoxOpen color="#f59e42" /> },
  { title: "Customers", value: 210, icon: <FaUsers color="#a855f7" /> },
];

const salesData = [
  { label: "Jan", value: 1200 },
  { label: "Feb", value: 2100 },
  { label: "Mar", value: 800 },
  { label: "Apr", value: 1600 },
  { label: "May", value: 2400 },
  { label: "Jun", value: 1800 },
];

const orderColumns = ["Order ID", "Customer", "Amount", "Status", "Date"];
const orderData = [
  { "Order ID": "#1001", Customer: "Alice", Amount: "$120.00", Status: "Paid", Date: "2024-06-01" },
  { "Order ID": "#1002", Customer: "Bob", Amount: "$80.00", Status: "Pending", Date: "2024-06-02" },
  { "Order ID": "#1003", Customer: "Charlie", Amount: "$150.00", Status: "Paid", Date: "2024-06-03" },
  { "Order ID": "#1004", Customer: "Diana", Amount: "$60.00", Status: "Refunded", Date: "2024-06-04" },
  { "Order ID": "#1005", Customer: "Eve", Amount: "$200.00", Status: "Paid", Date: "2024-06-05" },
];

const AdminDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="flex gap-6 mb-8 flex-wrap items-stretch">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="flex gap-8 items-start mb-8 flex-col lg:flex-row">
        <div className="flex-2 w-full lg:w-2/5">
          <h2 className="text-xl mb-3 font-semibold">Sales Overview</h2>
          <div className=" bg-white rounded-lg">
            <Graph data={salesData} height={220} />
          </div>
        </div>
        <div className="flex-3 w-full lg:w-3/5">
          <h2 className="text-xl mb-3 font-semibold">Recent Orders</h2>
          <DataTable columns={orderColumns} data={orderData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
