import React from "react";

interface GraphProps {
    data: { label: string; value: number }[];
    height?: number;
}

const Graph: React.FC<GraphProps> = ({ data, height = 180 }) => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return (
        <div className="bg-gray-50  rounded-xl p-4">
            <svg width="100%" height={height} className="w-full">
                {data.map((d, i) => {
                    const barHeight = (d.value / max) * (height - 40);
                    return (
                        <g key={d.label}>
                            <rect
                                x={32 + i * 48}
                                y={height - barHeight - 24}
                                width={32}
                                height={barHeight}
                                fill="#4f46e5"
                                rx={6}
                            />
                            <text
                                x={32 + i * 48 + 16}
                                y={height - 8}
                                textAnchor="middle"
                                fontSize={12}
                                fill="#888"
                            >
                                {d.label}
                            </text>
                            <text
                                x={32 + i * 48 + 16}
                                y={height - barHeight - 32}
                                textAnchor="middle"
                                fontSize={12}
                                fill="#222"
                            >
                                {d.value}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default Graph; 