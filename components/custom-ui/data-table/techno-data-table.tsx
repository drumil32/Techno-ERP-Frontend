'use client';
import React, { useEffect, useState, useRef } from 'react';
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
  User,
  CalendarIcon,
  X
} from 'lucide-react';
import { LuDownload, LuUpload } from 'react-icons/lu';
import clsx from 'clsx';
import useAuthStore from '@/stores/auth-store';
import { StepMapper, UserRoles } from '@/types/enum';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import Loading from '@/app/loading';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: 'left' | 'center' | 'right';
    maxWidth?: number;
    fixedWidth?: number | string; // Minor Change Allow both number (px) and string (like '100px')
  }
}

export const TruncatedCell = ({
  value,
  maxWidth,
  disableTooltip = false,
  columnId = '',
  tableName = '',
}: {
  value: any;
  maxWidth?: number;
  disableTooltip?: boolean;
  columnId?: string;
  tableName ?:string;
}) => {

  
  const cellRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (cellRef.current && maxWidth) {
      setIsTruncated(cellRef.current.scrollWidth > maxWidth);
    }
  }, [value, maxWidth]);
  
  if (!value || value == '-'|| value === "--" || value === 'N/A'  || columnId == "name" || columnId == "nextDueDateView" || columnId == "assignedToName" || columnId == "followUpCount" || columnId == "leadType" || columnId == "date" || columnId == "id" || columnId == "finalConversion" || columnId == "footFall" || columnId == "phoneNumber" || disableTooltip || tableName.includes("Ongoing Enquiry") || tableName.includes("Recent Admissions") || tableName.includes("Course Dues") || tableName.includes("Student Dues")) return <>{value}</>;

  if (columnId === "remarks") {
    
    const showValue = cellRef.current?.innerText
    console.log("after update ", showValue)
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              ref={cellRef}
              className="truncate block hover:text-[#6042D1] hover:underline"
              style={{ maxWidth: maxWidth ? `${maxWidth}px` : 'none' }}
            >
              {showValue}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px] break-words bg-gray-800 text-white border-gray-600">
            <p>{showValue}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }


  return (
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
  );
};

interface DateSortableColumnProps {
  columnId: string;
  selectedDates: Record<string, Date | undefined>;
  onDateSelect: (columnId: string, date: Date | undefined) => void;
  tableName?: string;
}

const DateFilterBadge = ({
  selectedDates,
  onRemove
}: {
  selectedDates: Record<string, Date | undefined>;
  onRemove: (columnId: string) => void;
}) => {
  const hasDates = Object.values(selectedDates).some((date) => date !== undefined);

  if (!hasDates) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(selectedDates).map(([columnId, date]) => {
        if (!date) return null;

        return (
          <div
            key={columnId}
            className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800 border border-blue-100"
          >
            <span className="font-medium capitalize">{columnId.replace('Date', '')}:</span>
            <span>{format(date, 'MMM dd, yyyy')}</span>
            <button
              title="Remove date filter"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(columnId);
              }}
              className="ml-1 rounded-full p-0.5 hover:bg-blue-100 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

const DateSortableColumn = ({ columnId, selectedDates, onDateSelect, tableName }: DateSortableColumnProps) => {
  const [isOpen, setIsOpen] = useState(false);
  let selectedDatesCheck = true;

  const selectedDate = selectedDates[columnId];
  const handleSelect = (date: Date | undefined) => {
    onDateSelect(columnId, date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateSelect(columnId, undefined);
    setIsOpen(false);
  };

  if (tableName === "Active Leads") {
    const localf = localStorage.getItem("techno-filters-yellow-leads");
    if (localf) {
      const filters = JSON.parse(localf);
      if (!filters.startNextDueDate) {
        selectedDatesCheck = false;
      }
    }
  } else if (tableName === "All Leads") {
    const localf = localStorage.getItem("techno-filters-all-leads");
    if (localf) {
      const filters = JSON.parse(localf);
      if (!filters.startNextDueDate) {
        selectedDatesCheck = false;
      }
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8  hover:bg-primary/10 hover:text-primary font-semibold',
            selectedDate ? 'border border-primary text-primary' : 'text-primary border border-none'
          )}
        >
          <span>Next Due Date</span>
          {selectedDatesCheck && selectedDate ? (
            <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
          ) : (
            <CalendarIcon className="h-4 w-4 mr-2 text-primary/50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        className=" mx-auto w-auto p-0" align="center">
        {selectedDatesCheck ?
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            modifiers={{
              today: new Date(),
              selected: day => selectedDate ? isSameDay(day, selectedDate) : false,
            }}
            modifiersStyles={{
              today: {
                backgroundColor: '#a7c7f5',
                color: '#111',
              },
            }}
          /> : <Calendar
            mode="single"
            onSelect={handleSelect}
            initialFocus

            modifiersStyles={{
              today: {
                backgroundColor: '#a7c7f5',
                color: '#111',
              },
            }}
          />
        }
        {selectedDatesCheck && selectedDate && (
          <div className="p-3 border-t flex justify-between items-center">
            <span className="text-sm">{format(selectedDate, 'PPP')}</span>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

interface DateSortableColumnProps {
  columnId: string;
  selectedDates: Record<string, Date | undefined>;
  onDateSelect: (columnId: string, date: Date | undefined) => void;
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
  tableActionButton,
  searchBarPlaceholder = 'Search here',
  tableStyles = '',
  onDateFilter,
  children,
}: any) {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnVisibility, setColumnVisibility] = useState({
    altPhoneNumber: false
  });
  const [pageSize, setPageSize] = useState<number>(pageLimit);
  const { hasRole } = useAuthStore();

  const [activeSortColumn, setActiveSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [selectedDates, setSelectedDates] = useState<Record<string, Date | undefined>>(() => {
    if (typeof window === 'undefined') return {};
    let saved;
    if (tableName === "All Leads") {
      saved = localStorage.getItem('allLeadsDateFilters');
    } else if (tableName === "Active Leads") {
      saved = localStorage.getItem('activeLeadsDateFilters');
    }
    return saved ? JSON.parse(saved) : {};
  });

  const handleRemoveDate = (columnId: string) => {
    setSelectedDates((prev) => ({ ...prev, [columnId]: undefined }));
    if (columnId && onDateFilter) {
      onDateFilter(columnId, undefined, undefined);
    }
  };

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (tableName === "All Leads")
      localStorage.setItem('allLeadsDateFilters', JSON.stringify(selectedDates));
    else if (tableName === "Active Leads")
      localStorage.setItem('activeLeadsDateFilters', JSON.stringify(selectedDates));
  }, [selectedDates]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    if (onSearch) onSearch(value);
  };



  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
      columnVisibility
    },
    onGlobalFilterChange: setGlobalFilter,
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

  const handleDateSelect = (columnId: string, date: Date | undefined) => {
    setSelectedDates((prev) => ({
      ...prev,
      [columnId]: date
    }));

    if (onDateFilter) {
      onDateFilter(columnId, date, date);
    } else {
    }
  };

  const getSortIcon = (columnName: string) => {
    const iconStyle = { minWidth: '16px', minHeight: '16px', width: '16px', height: '16px' };

    if (activeSortColumn === columnName) {
      return sortDirection === 'asc' ? (
        <ArrowUp className="ml-1 flex-shrink-0" style={iconStyle} />
      ) : (
        <ArrowDown className="ml-1 flex-shrink-0" style={iconStyle} />
      );
    }
    return <ArrowUpDown className="ml-1 opacity-50 flex-shrink-0" style={iconStyle} />;
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
    'departmentHODEmail',
    'form',
    'receipt'
  ];

  if (!table.getRowModel().rows) {
    return <Loading />;
  }

  const sortableColumns = ['date', 'leadTypeModifiedDate', 'followUpCount'];

  const dateSortableColumns = ['nextDueDateView'];

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
              placeholder={searchBarPlaceholder}
              value={globalFilter}
              onChange={handleSearchChange}
              className="max-w-[500px] h-[32px] rounded-md bg-[#f3f3f3] px-2 py-2 pr-10 text-gray-600 placeholder-gray-400"
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
          className= " min-h-[900px] h-[240px] overflow-auto custom-scrollbar relative"
        >
          <Table ref={tableRef} className={cn('  w-full', tableStyles)}>
            <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg font-bolds sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="h-10">
                  {headerGroup.headers.map((header, index) => {
                    const columnId = header.column.id;
                    const isSortable = sortableColumns.includes(columnId);
                    const isNonClickable = nonClickableColumns.includes(columnId);
                    const isDateSortable = dateSortableColumns.includes(columnId);
                    const align = header.column.columnDef.meta?.align || 'left';
                    const fixedWidth = header.column.columnDef.meta?.fixedWidth;
                    const maxWidth = header.column.columnDef.meta?.maxWidth;

                    // Style for fixed width columns
                    const widthStyle = fixedWidth
                      ? {
                        width: typeof fixedWidth === 'number' ? `${fixedWidth}px` : fixedWidth,
                        minWidth: typeof fixedWidth === 'number' ? `${fixedWidth}px` : fixedWidth,
                        maxWidth: typeof fixedWidth === 'number' ? `${fixedWidth}px` : fixedWidth
                      }
                      : {};

                    return (
                      <TableHead
                        key={header.id}
                        className={clsx('text-[#5B31D1] font-semibold h-10 items-center', {
                          'text-left': align === 'left',
                          'text-center': align === 'center',
                          'text-right': align === 'right',
                          'rounded-l-[5px]': index === 0,
                          'rounded-r-[5px]': index === headerGroup.headers.length - 1
                        })}
                        style={widthStyle}
                      >
                        <div
                          className={clsx('w-full overflow-hidden flex items-center', {
                            'justify-start': align === 'left',
                            'justify-center': align === 'center',
                            'justify-end': align === 'right'
                          })}
                        >
                          {isDateSortable && (
                            <>
                              <DateSortableColumn
                                columnId={columnId}
                                selectedDates={selectedDates}
                                onDateSelect={handleDateSelect}
                                tableName={tableName}
                              />
                            </>
                          )}
                          {isSortable && !isDateSortable && !isNonClickable ? (
                            <div
                              className={clsx('flex items-center cursor-pointer w-full', {
                                'justify-start': align === 'left',
                                'justify-center': align === 'center',
                                'justify-end': align === 'right'
                              })}
                              onClick={() => handleSort(columnId)}
                            >
                              <TruncatedCell
                                value={flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                disableTooltip={true}
                                columnId={columnId}
                                maxWidth={maxWidth}
                                tableName={tableName}
                              />
                              {getSortIcon(columnId)}
                            </div>
                          ) : (
                            !isDateSortable && (
                              <TruncatedCell
                                value={flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                 disableTooltip={true}
                                columnId={columnId}
                                maxWidth={maxWidth}
                                tableName={tableName}
                              />
                            )
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="[&_tr]:h-[50px]">
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
                    {row.getVisibleCells()
                      .map((cell: any, idx: number) => {
                        const isExcluded = nonClickableColumns.includes(cell.column.id);
                        const align = cell.column.columnDef.meta?.align || 'left';
                        let cellValue = cell.getValue();
                        const maxWidth = cell.column.columnDef.meta?.maxWidth;
                        const fixedWidth = cell.column.columnDef.meta?.fixedWidth;

                        if(["Step_1","Step_2","Step_3","Step_4"].includes(cellValue)){
                          cellValue = StepMapper[cellValue?.toString()]
                        }

                        // Style for fixed width columns
                        const widthStyle = fixedWidth
                          ? {
                            width: typeof fixedWidth === 'number' ? `${fixedWidth}px` : fixedWidth,
                            minWidth:
                              typeof fixedWidth === 'number' ? `${fixedWidth}px` : fixedWidth,
                            maxWidth:
                              typeof fixedWidth === 'number' ? `${fixedWidth}px` : fixedWidth
                          }
                          : {};

                        return (
                          <TableCell
                            key={cell.id}
                            className={clsx('h-[39px] py-2', {
                              'text-left': align === 'left',
                              'text-center': cellValue === 'N/A' || align === 'center',
                              'text-right': align === 'right'
                            })}
                            style={widthStyle}
                            onClick={(e) => isExcluded && e.stopPropagation()}
                          >
                            <div
                              className={clsx('w-full overflow-hidden', {
                                'text-left': align === 'left',
                                'text-center': align === 'center',
                                'text-right': align === 'right'
                              })}
                            >
                              {cell.column.id === 'id' ? (
                                <div className="flex items-center justify-start gap-1">
                                  <span>{row.index + 1}</span>
                                  {data[row.index]?.isOlderThan7Days == false && (
                                    <span className="text-green-500 ml-1 t" title="Last 7 days">
                                      ✔
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <TruncatedCell
                                  // value={flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  value={cellValue}
                                  maxWidth={maxWidth}
                                  columnId={cell.column.id}
                                  tableName={tableName}
                                />
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-[900px] text-center p-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center py-10">
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
           
            <span>
              {table.getState().pagination.pageIndex * pageSize + 1} -{' '}
              {data.length} of{' '}
              {totalEntries}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* <Button
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
            </Button> */}
            <Button
              variant="default"
              size="lg"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="load more leads"
              className="cursor-pointer"
            >
              Load more
            </Button>
          </div>
          <div className='w-[23.5%] '>
          </div>
        </div>
      )}
    </div>
  );
}
