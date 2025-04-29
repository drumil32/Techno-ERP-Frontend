'use client';
import { useEffect, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft
} from 'lucide-react';
import { LuDownload, LuUpload } from 'react-icons/lu';
import clsx from 'clsx';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import { apiRequest } from '@/lib/apiClient';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import axios, { HttpStatusCode, AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: 'left' | 'center' | 'right';
  }
}
export default function TechnoDataTable({
  columns,
  data,
  tableName,
  totalPages,
  currentPage,
  onPageChange,
  pageLimit,
  onLimitChange,
  onSearch,
  searchTerm = '',
  onSort,
  totalEntries,
  handleViewMore,
  selectedRowId = null,
  setSelectedRowId,
  rowCursor = true,
  showPagination = true,
  children
}: any) {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(pageLimit);
  const { hasRole, user } = useAuthStore();

  const [sortConfig, setSortConfig] = useState<Record<string, string>>(() => {
    const initialConfig: Record<string, string> = {};
    ['dateView', 'nextDueDateView', 'Next Call Date', 'LTC Date', 'leadTypeModifiedDate'].forEach(
      (column) => {
        initialConfig[column] = 'desc';
      }
    );
    return initialConfig;
  });

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    if (onSearch) onSearch(value);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
    pageCount: totalPages
  });

  const handleSort = (columnName: string) => {
    const newSortConfig = { ...sortConfig };

    if (!newSortConfig[columnName]) {
      newSortConfig[columnName] = 'desc';
    } else if (newSortConfig[columnName] === 'desc') {
      newSortConfig[columnName] = 'asc';
    } else {
      newSortConfig[columnName] = 'desc';
    }

    setSortConfig(newSortConfig);
    if (onSort) onSort(columnName, newSortConfig[columnName]);
  };

  const getSortIcon = (columnName: string) => {
    if (sortConfig[columnName]) {
      return sortConfig[columnName] === 'asc' ? (
        <ArrowUp className="ml-1 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-1 h-4 w-4" />
      );
    }
    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
  };
  interface ApiResponse {
    MESSAGE?: string;
    SUCCESS?: boolean;
    ERROR?: string;
    DATA?: any;
  }

  const uploadAction = async (): Promise<void> => {
    try {
      const response = await axios<ApiResponse>({
        method: 'POST',
        url: API_ENDPOINTS.uploadMarketingData,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === HttpStatusCode.Ok && response.data.SUCCESS) {
        toast.success(response.data.MESSAGE || 'Marketing Data Uploaded Successfully');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        const errorMessage =
          error.response?.data?.ERROR ||
          error.response?.data?.MESSAGE ||
          `HTTP Error: ${error.response?.status || 'Unknown'}`;
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };
  const nonClickableColumns = [
    'actions',
    'leadType',
    'footFall',
    'finalConversion',
    'leadsFollowUpCount',
    'yellowLeadsFollowUpCount'
  ];

  const sortableColumns = ['dateView', 'nextDueDateView', 'leadTypeModifiedDate'];

  return (
    <div className="w-full mb-10 bg-white space-y-4 my-[8px]  px-4 py-2 shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="flex w-full items-center py-4 px-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">{tableName}</h2>
          {children && <div className="ml-2">{children}</div>}
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <div className="relative">
            <Input
              placeholder="Search here"
              value={globalFilter}
              onChange={handleSearchChange}
              className="max-w-[243px] h-[32px] rounded-md bg-[#f3f3f3] px-4 py-2 pr-10 text-gray-600 placeholder-gray-400"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="h-4 w-4 text-gray-500" />
            </span>
          </div>
          <Button
            disabled={!hasRole(UserRoles.ADMIN)}
            onClick={uploadAction}
            variant="outline"
            className="h-8 w-[85px] rounded-[10px] border"
            icon={LuUpload}
          >
            <span className="font-inter font-medium text-[12px]">Upload</span>
          </Button>
          <Button disabled className="h-8 w-[103px] rounded-[10px] border" icon={LuDownload}>
            <span className="font-inter font-semibold text-[12px]">Download</span>
          </Button>
        </div>
      </div>

      <div className="relative min-h-[580px] overflow-auto">
        <Table className="w-full">
          <TableHeader className="bg-[#F7F7F7] sticky top-0 ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-10">
                {headerGroup.headers.map((header, index) => {
                  const columnId = header.column.id;
                  const isSortable = sortableColumns.includes(columnId);
                  const isNonClickable = nonClickableColumns.includes(columnId);
                  const align = header.column.columnDef.meta?.align || 'left';

                  return (
                    <TableHead
                      key={header.id}
                      className={clsx('font-light h-10', {
                        'text-left': align === 'left',
                        'text-center': !align || align === 'center',
                        'text-right': align === 'right',
                        'rounded-l-[5px]': index === 0,
                        'rounded-r-[5px]': index === headerGroup.headers.length - 1
                      })}
                    >
                      {isSortable && !isNonClickable ? (
                        <div
                          className="flex items-center justify-center cursor-pointer"
                          onClick={() => handleSort(columnId)}
                        >
                          <span>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {getSortIcon(columnId)}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&_tr]:h-[39px] ">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  className={`h-[39px] cursor-pointer ${selectedRowId === row.id ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    setSelectedRowId(row.id);
                    handleViewMore({ ...row.original, leadType: row.original._leadType });
                  }}
                >
                  {row.getVisibleCells().map((cell: any) => {
                    const isExcluded = nonClickableColumns.includes(cell.column.id);
                    const align = cell.column.columnDef.meta?.align || 'left';
                    return (
                      <TableCell
                        key={cell.id}
                        className={clsx('h-[39px] py-2', {
                          'text-left': align === 'left',
                          'text-center': cell.getValue() === 'N/A' || align === 'center',
                          'text-right': align === 'right',
                          'max-w-[120px] truncate':
                            (cell.column.columnDef.header === 'Remarks' ||
                              cell.column.columnDef.header === 'Area' ||
                              cell.column.columnDef.header === 'Name' ||
                              cell.column.columnDef.header === 'Assigned To') &&
                            cell.getValue() !== '-'
                        })}
                        onClick={(e) => {
                          if (isExcluded) e.stopPropagation();
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-[580px] text-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No Results Found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="cursor-pointer">
                  {pageSize} <ChevronDown className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {[5, 10, 20, 30, 50].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => {
                      onLimitChange(size);
                      setPageSize(size);
                    }}
                  >
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <span>
              {table.getState().pagination.pageIndex * pageSize + 1} -{' '}
              {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, totalEntries)} of{' '}
              {totalEntries}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              aria-label="Go to first page"
              className="cursor-pointer"
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Go to previous page"
              className="cursor-pointer"
            >
              <ChevronLeft />
            </Button>
            {currentPage > 1 && <span>1 ..</span>}
            <span className=" underline">{currentPage}</span>
            {currentPage < totalPages && <span>..{totalPages}</span>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Go to next page"
              className="cursor-pointer"
            >
              <ChevronRight />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Go to last page"
              className="cursor-pointer"
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
