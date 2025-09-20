import {create} from 'zustand';

interface TableState {
    globalFilter: string;
    setGlobalFilter: (filter: string) => void;

    rowSelection: Record<string, boolean>;
    setRowSelection: (selection: Record<string, boolean>) => void;

    pageIndex: number;
    setPageIndex: (index: number) => void;

    pageSize: number;
    setPageSize: (size: number) => void;
}

export const useTableStore = create<TableState>((set) => ({
    globalFilter: '',
    setGlobalFilter: (filter: string) => set({ globalFilter: filter }),

    rowSelection: {},
    setRowSelection: (selection: Record<string, boolean>) => set({ rowSelection: selection }),

    pageIndex: 0,
    setPageIndex: (index: number) => set({ pageIndex: index }),

    pageSize: 10,
    setPageSize: (size: number) => set({ pageSize: size }),
}));