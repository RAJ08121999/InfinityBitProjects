import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getPupils } from '@/lib/api';
import type { Pupil } from '@/lib/pupilType';
import Spinner from '@/assets/Spinner';
import { columns } from './columns';
import { useTableStore } from '@/store/tableStore';

import { useNavigate } from '@tanstack/react-router';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePupil } from '@/lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowUp, ArrowDown } from 'lucide-react';


export default function PupilsTable() {
    const navigate = useNavigate();
    const { data: pupils, isLoading, isError } = useQuery<Pupil[]>({
        queryKey: ['pupils'],
        queryFn: getPupils,
});

const {
    globalFilter,
    setGlobalFilter,
    rowSelection,
    setRowSelection,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
} = useTableStore();


const { mutate: handleDelete} = useMutation({
    mutationFn:(id: string)=> deletePupil(id),
    onSuccess:()=>{
        queryClient.invalidateQueries({ queryKey:["pupils"]});
    },
    onError:(error)=>{
        console.error("Failed to delete pupil:",error)
        alert("Error deleting pupil");
    },
})

const table = useReactTable({
    data: pupils ?? [],
    columns:columns(handleDelete),
    state: {
        globalFilter,
        rowSelection,
        pagination: { pageIndex, pageSize },
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: (updater) =>{
        const next = 
            typeof updater === "function"
                ? updater(rowSelection)
                : updater;
        setRowSelection(next);
    },
    onPaginationChange: (updater) =>{
        const next = 
        typeof updater === "function"
            ? updater({ pageIndex, pageSize})
            : updater;
        setPageIndex(next.pageIndex);
        setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    globalFilterFn: 'includesString',
});
const queryClient = useQueryClient();


if (isLoading) return <div className='h-screen w-full flex justify-center items-center'><Spinner/></div>;
if (isError) return <div className="text-xl text-red-600 text-center">Error fetching pupils</div>;


return (
    <div className="p-2">
        <h1 className="text-4xl font-bold mb-4 text-center text-amber-600">Pupils List</h1>

      {/* Global Search + Navigation Button to Add Pupil */}
        <div className="flex items-center justify-around mb-2 w-full max-w-2xl mx-auto space-x-4">
            <Input
                type="text"
                placeholder="Search all columns..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="flex-1 input input-bordered"
            />

            <Button
                onClick={() => navigate({ to: "/pupils/add" })}
                className="bg-amber-600 hover:bg-amber-700 text-white"
            >
                Add Pupil
            </Button>
        </div>

      {/* Table */}
        <div className='overflow-auto border rounded-lg'>
            <div className='min-w-full relative'>
                <table className="table-x-auto w-full border-collapse border border-gray-300 bg-slate-100">
                <thead className='bg-slate-900 text-white top-0 z-10 text-center'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            className="border border-gray-300 px-4 py-2 cursor-pointer select-none whitespace-nowrap"
                            >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                                asc: <ArrowUp className="h-4 w-4 inline ml-1" />,
                                desc: <ArrowDown className="h-4 w-4 inline ml-1" />,
                            }[header.column.getIsSorted() as string] ?? null}
                            </th>
                        ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.length === 0 && (
                    <tr>
                    <td colSpan={columns.length} className="text-center p-4">
                        No pupils found.
                    </td>
                    </tr>
                )}
                {table.getRowModel().rows.map((row) => (
                    <tr
                    key={row.id}
                    className={row.getIsSelected() ? 'bg-blue-100' : ''}
                    onClick={() => row.toggleSelected()}
                    >
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="border border-gray-300 px-4 py-2 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                    </tr>
                ))}
                </tbody>
                </table>
            </div>
        </div>

      {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-2 space-x-2 bg-slate-100 border-t border-gray-300 p-3 sticky bottom-0 z-10 w-full rounded-md">
            <Button
            className="btn btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            >
            Previous
            </Button>
            <span>
            Page{' '}
            <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
            </span>
            <Button
            className="btn btn-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            >
            Next
            </Button>

            <select
            className="select select-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            >
            {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                Show {size}
                </option>
            ))}
            </select>

            <Button
            // className="btn btn-error btn-sm"
            onClick={() => {
                const selectedIds = Object.keys(rowSelection);
                if (selectedIds.length === 0) return;
            
                if (window.confirm(`Are you sure you want to delete ${selectedIds.length} pupil(s)?`)) {
                    selectedIds.forEach((id) => handleDelete(id));
                }
            }}
            disabled={Object.keys(rowSelection).length === 0}
            >
            Delete Selected
            </Button>
        </div>
    </div>
);
}