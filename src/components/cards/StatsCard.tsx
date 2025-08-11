import React from "react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
    return (
        <div
            className={`bg-white rounded-xl shadow-md p-5 flex items-center gap-4 min-w-[180px] ${color ? '' : ''}`}
            style={color ? { background: color } : {}}
        >
            {icon && <div className="text-3xl">{icon}</div>}
            <div>
                <div className="text-sm text-gray-500">{title}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    );
};

export default StatsCard; 