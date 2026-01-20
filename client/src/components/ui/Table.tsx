import React from 'react';
import { cn } from '../../lib/utils';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    isLoading?: boolean;
    emptyMessage?: string;
}

export function Table<T extends { id: string | number }>({
    data,
    columns,
    onEdit,
    onDelete,
    isLoading,
    emptyMessage = "Belum ada data di sini"
}: TableProps<T>) {
    if (isLoading) {
        return (
            <div className="w-full h-48 flex items-center justify-center bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">Memuat data...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="w-full h-48 flex items-center justify-center bg-white rounded-xl border border-slate-200">
                <p className="text-slate-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-brand-50 text-brand-900 font-medium">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={cn("px-6 py-4", col.className)}>
                                    {col.header}
                                </th>
                            ))}
                            {(onEdit || onDelete) && <th className="px-6 py-4 text-right">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                {columns.map((col, idx) => (
                                    <td key={idx} className={cn("px-6 py-4 text-slate-600", col.className)}>
                                        {col.cell ? col.cell(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {onEdit && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEdit(item)}
                                                className="text-brand-600 hover:text-brand-700 hover:bg-brand-50"
                                            >
                                                <Edit size={16} />
                                            </Button>
                                        )}
                                        {onDelete && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onDelete(item)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
