import React from "react";

interface DataTableProps {
    columns: string[];
    data: Array<Record<string, unknown>>;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
    return (
        <table className="w-full border-collapse bg-white mt-4">
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col} className="border-b-2 border-gray-200 px-2 py-2 text-left text-sm font-semibold text-gray-700 bg-gray-50">{col}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                        {columns.map((col) => (
                            <td key={col} className="border-b border-gray-100 px-2 py-2 text-sm">{String(row[col])}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable; 