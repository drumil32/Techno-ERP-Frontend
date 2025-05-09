'use client';
import { useEffect, useState, useRef } from 'react';
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
  ChevronsLeft,
  User
} from 'lucide-react';
import { LuDownload, LuUpload } from 'react-icons/lu';
import clsx from 'clsx';
import useAuthStore from '@/stores/auth-store';
import { UserRoles } from '@/types/enum';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import Loading from '@/app/loading';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: 'left' | 'center' | 'right';
    maxWidth?: number;
    fixedWidth?: number;
  }
}

export const TruncatedCell = ({ value, maxWidth }: { value: string; maxWidth?: number }) => {
  const cellRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (cellRef.current && maxWidth) {
      setIsTruncated(cellRef.current.scrollWidth > maxWidth);
    }
  }, [value, maxWidth]);

  if (!value || value === '-' || value === 'N/A') return <>{value}</>;

  return isTruncated ? (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            ref={cellRef}
            className="truncate block hover:text-[#6042D1] hover:underline"
            style={{ maxWidth: maxWidth ? `${maxWidth}px` : 'none' }}
          >
            {value}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] break-words bg-gray-800 text-white border-gray-600">
          <p>{value}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <span ref={cellRef} style={{ maxWidth: maxWidth ? `${maxWidth}px` : 'none' }} className="block">
      {value}
    </span>
  );
};

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
  tableActionButton,
  tableStyles,
  headerStyles,
  children
}: any) {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(pageLimit);
  const { hasRole } = useAuthStore();

  const [activeSortColumn, setActiveSortColumn] = useState('dateView');
  const [sortDirection, setSortDirection] = useState('desc');

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

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
    if (activeSortColumn === columnName) {
      const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
      setSortDirection(newDirection);
      if (onSort) onSort(columnName, newDirection);
    } else {
      setActiveSortColumn(columnName);
      setSortDirection('desc');
      if (onSort) onSort(columnName, 'desc');
    }
  };

  const getSortIcon = (columnName: string) => {
    if (activeSortColumn === columnName) {
      return sortDirection === 'asc' ? (
        <ArrowUp className="ml-1 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-1 h-4 w-4" />
      );
    }
    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
  };

  const uploadAction = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.uploadMarketingData, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok && data.SUCCESS) {
        toast.success(data.MESSAGE || 'Marketing Data Uploaded Successfully');
      } else {
        throw new Error(data.ERROR || data.MESSAGE);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const nonClickableColumns = [
    'actions',
    'leadType',
    'footFall',
    'finalConversion',
  ];

  if (!table.getRowModel().rows) {
    return <Loading />;
  }

  const sortableColumns = ['dateView', 'nextDueDateView', 'leadTypeModifiedDate', 'leadsFollowUpCount', 'yellowLeadsFollowUpCount'];

  return (
    <div className="w-full mb-10 bg-white space-y-4 my-[8px] px-4 py-2 shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="flex w-full items-center py-4 px-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">{tableName}</h2>
          {children && <div className="ml-2">{children}</div>}
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <div className="relative w-[300px]">
            <Input
              placeholder="Search here"
              value={globalFilter}
              onChange={handleSearchChange}
              className="max-w-[500px] h-[32px] rounded-md bg-[#f3f3f3] px-4 py-2 pr-10 text-gray-600 placeholder-gray-400"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="h-4 w-4 text-gray-500" />
            </span>
          </div>
          {tableActionButton ? (
            tableActionButton
          ) : (
            <>
              <Button
                disabled={
                  !hasRole(UserRoles.EMPLOYEE_MARKETING) ||
                  !hasRole(UserRoles.LEAD_MARKETING) ||
                  tableName != 'All Leads'
                }
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
            </>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          ref={tableContainerRef}
          className="min-h-[580px] h-[240px] overflow-auto custom-scrollbar relative"
        >
          <Table ref={tableRef} className="w-full">
            <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg font-bolds sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="h-10">
                  {headerGroup.headers.map((header, index) => {
                    const columnId = header.column.id;
                    const isSortable = sortableColumns.includes(columnId);
                    const isNonClickable = nonClickableColumns.includes(columnId);
                    const align = header.column.columnDef.meta?.align || 'left';
                    const fixedWidth = header.column.columnDef.meta?.fixedWidth;

                    return (
                      <TableHead
                        key={header.id}
                        className={clsx('text-[#5B31D1] font-semibold h-10', {
                          'text-left': align === 'left',
                          'text-center': !align || align === 'center',
                          'text-right': align === 'right',
                          'rounded-l-[5px]': index === 0,
                          'rounded-r-[5px]': index === headerGroup.headers.length - 1
                        })}
                        style={{ width: fixedWidth ? `${fixedWidth}px` : 'auto' }}
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
            <TableBody className="[&_tr]:h-[39px]">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row: any) => (
                  <TableRow
                    key={row.id}
                    className={`h-[39px] ${rowCursor ? 'cursor-pointer' : ''} ${selectedRowId === row.id ? 'bg-gray-100' : ''}`}
                    onClick={() => {
                      if (rowCursor) {
                        setSelectedRowId(row.id);
                        handleViewMore({ ...row.original, leadType: row.original._leadType });
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell: any) => {
                      const isExcluded = nonClickableColumns.includes(cell.column.id);
                      const align = cell.column.columnDef.meta?.align || 'left';
                      const cellValue = cell.getValue();
                      const maxWidth = cell.column.columnDef.meta?.maxWidth;
                      const fixedWidth = cell.column.columnDef.meta?.fixedWidth;

                      return (
                        <TableCell
                          key={cell.id}
                          className={clsx('h-[39px] py-2', {
                            'text-left': align === 'left',
                            'text-center': cellValue === 'N/A' || align === 'center',
                            'text-right': align === 'right'
                          })}
                          style={{ width: fixedWidth ? `${fixedWidth}px` : 'auto' }}
                          onClick={(e) => isExcluded && e.stopPropagation()}
                        >
                          {maxWidth ? (
                            <TruncatedCell value={cellValue} maxWidth={maxWidth} />
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
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
            <span className="underline">{currentPage}</span>
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
