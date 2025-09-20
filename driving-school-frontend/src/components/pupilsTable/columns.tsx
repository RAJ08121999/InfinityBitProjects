// src/components/pupilTable/columns.tsx
import type { ColumnDef } from '@tanstack/react-table';
import type { Pupil } from '@/lib/pupilType';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Trash2, MoreVertical, ArrowUp, ArrowDown, Eye, Edit, } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const toSafeDateString = (val: unknown): string => {
  if (!val) return '';
  const d = val instanceof Date ? val : new Date(String(val));
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};


export const columns = (handleDelete: (id: string) => void): ColumnDef<Pupil>[] => {
  const navigate = useNavigate(); // TanStack router navigate

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorFn: (row) => `${row.forename ?? ''} ${row.surname ?? ''}`.trim(),
      id: 'fullName',
      header: ({ column }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 group"
            >
              Full Name
              <MoreVertical className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="h-4 w-4 mr-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="h-4 w-4 mr-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.clearSorting()}>
              Clear Sort
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: (info) => info.getValue() as string,
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 group"
            >
              Email Address
              <MoreVertical className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="h-4 w-4 mr-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="h-4 w-4 mr-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.clearSorting()}>
              Clear Sort
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: (info) => (info.getValue() as string) ?? '',
      enableSorting: true,
    },
    {
      accessorKey: 'dob',
      header: ({ column }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 group"
            >
              DOB
              <MoreVertical className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <ArrowUp className="h-4 w-4 mr-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <ArrowDown className="h-4 w-4 mr-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.clearSorting()}>
              Clear Sort
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: (info) => toSafeDateString(info.getValue()),
      enableSorting: true,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: (info) => String(info.getValue() ?? ''),
      enableSorting: true,
    },
    {
      accessorFn: (row) => row.home?.mobile ?? '',
      id: 'mobile',
      header: 'Mobile',
      cell: (info) => (info.getValue() as string) ?? '',
      enableSorting: false,
    },
    {
      accessorKey: 'licenseType',
      header: 'License Type',
      cell: (info) => (info.getValue() as string) ?? '',
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: `/pupils/${row.original._id}` });
            }}
          >
            <Eye className="h-5 w-5 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: `/pupils/${row.original._id}/edit` });
            }}
          >
            <Edit className="h-5 w-5 text-green-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.original._id);
            }}
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
};
