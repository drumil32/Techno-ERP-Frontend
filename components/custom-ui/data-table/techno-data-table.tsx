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
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft
} from 'lucide-react';
import { LuDownload, LuUpload } from 'react-icons/lu';

// TODO: Create the props type for the table in place of any
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
  children
}: any) {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(pageLimit);
  const [sortColumn, setSortColumn] = useState<string | null>(null); // 'date' or 'nextDueDate'
  const [sortOrder, setSortOrder] = useState<string>('asc'); // 'asc' or 'desc'

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);

    if (onSearch) {
      onSearch(value);
    }
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
    if (sortColumn === columnName) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnName);
      setSortOrder('asc');
    }

    if (onSort) {
      onSort(columnName, sortOrder === 'asc' ? 'desc' : 'asc');
    }
  };

  const getSortIcon = (columnName: string) => {
    if (sortColumn === columnName) {
      return sortOrder === 'asc' ? (
        <ArrowUp className="ml-1 h-4 w-4" />
      ) : (
        <ArrowDown className="ml-1 h-4 w-4" />
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white space-y-4 my-5 px-4 py-2 shadow-sm border-[1px] rounded-[10px] border-gray-200 ">
      <div className="flex w-full items-center py-4 px-4">
        <div className="flex items-center">
          <h2 className="text-xl font-bold">{tableName}</h2>
          {children && <div className="ml-2">{children}</div>}
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <div className="relative">
            <Input
              placeholder="Search for leads"
              value={globalFilter}
              onChange={handleSearchChange}
              className="max-w-[243px] h-[32px] rounded-md bg-[#f3f3f3] px-4 py-2 pr-10 text-gray-600 placeholder-gray-400"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              <Search className="h-4 w-4 text-gray-500" />
            </span>
          </div>
          <Button variant="outline" className="h-8 w-[85px] rounded-[10px] border" icon={LuUpload}>
            <span className="font-inter font-medium text-[12px]">Upload</span>
          </Button>
          <Button className="h-8 w-[103px] rounded-[10px] border" icon={LuDownload}>
            <span className="font-inter font-semibold text-[12px]">Download</span>
          </Button>
        </div>
      </div>

      {/* Data Table Body */}
      <div>
        {/* TODO: Update table header and the rows borders and backgground to match the figma design */}
        <Table>
          <TableHeader className="bg-[#F7F7F7]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="rounded-lg overflow-hidden">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={`text-center font-light ${index === 0 ? 'rounded-l-[5px]' : ''} ${
                      index === headerGroup.headers.length - 1 ? 'rounded-r-[5px]' : ''
                    }`}
                  >
                    {header.column.columnDef.header === 'Date' ||
                    header.column.columnDef.header === 'Next Due Date' ||
                    header.column.columnDef.header === 'Next Call Date' ||
                    header.column.columnDef.header === 'LTC Date' ? (
                      <Button variant="ghost" onClick={() => handleSort(header.column.id)}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {getSortIcon(header.column.id)}
                      </Button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={ `text-center
                        ${cell.column.columnDef.header === 'Remarks' && cell.getValue()!='-'
                          ? 'text-left max-w-[225px] truncate'
                          : ''}`
                      }
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Data Table Footer - Pagination Section */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
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

        {/* TODO: Match the page switch match to Figma design */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="Go to first page"
          >
            <ChevronsLeft />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            <ChevronLeft />
          </Button>

          {currentPage > 1 && <span>1 ..</span>}
          <span>{currentPage}</span>

          {currentPage < totalPages && <span>..{totalPages}</span>}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            <ChevronRight />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Go to last page"
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
