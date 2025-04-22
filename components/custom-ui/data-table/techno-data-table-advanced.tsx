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
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  ChevronsLeft,
  Edit,
  Plus,
  X,
  Check,
  FolderPlus,
  Edit2Icon,
  Edit2
} from 'lucide-react';
import { LuDownload, LuUpload } from 'react-icons/lu';
import { AddMoreDataBtn } from '../add-more-data-btn/add-data-btn';

export default function TechnoDataTableAdvanced({
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
  children,
  showAddButton = false,
  showEditButton = false,
  visibleRows = 10,
  addButtonPlacement = "top",
  addBtnLabel = "Add",
  addViaDialog = false,
  onAddClick
}: any) {
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(pageLimit);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState([...data]);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState<any>({});

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    if (onSearch) onSearch(value);
  };

  const handleSort = (columnName: string) => {
    const newOrder = sortColumn === columnName ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';
    setSortColumn(columnName);
    setSortOrder(newOrder);
    if (onSort) onSort(columnName, newOrder);
  };

  const getSortIcon = (columnName: string) => {
    if (sortColumn === columnName) {
      return sortOrder === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />;
    }
    return null;
  };

  const handleEditToggle = () => {
    setAddingRow(false);
    setEditing((prev) => !prev);
    setEditedData([...data]);
  };

  const handleNewRowChange = (key: string, value: any) => {
    setNewRow((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleEditedChange = (rowIndex: number, key: string, value: any) => {
    const updated = [...editedData];
    updated[rowIndex][key] = value;
    setEditedData(updated);
  };

  const visibleData = editing ? editedData : data;

  const table = useReactTable({
    data: visibleData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount: totalPages,
  });



  const nonClickableColumns = ['actions', 'leadType', 'finalConversion', "leadsFollowUpCount", 'yellowLeadsFollowUpCount'];

  return (
    <div className="w-full mb-10 bg-white space-y-4 my-[8px] px-4 py-2 shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="flex w-full items-center py-4 px-4">

        {/* Table Header */}
        <div className="flex items-center">
          <h2 className="text-xl font-bold">{tableName}</h2>
          {children && <div className="ml-2">{children}</div>}
        </div>

        {/* Edit Button, always on top */}
        <div className="flex items-center space-x-2 ml-auto" >
          {showEditButton && (
            <Button variant="outline" className="btnLabelAdd h-8" onClick={handleEditToggle} disabled={addingRow || editing} >
              <Edit2 className="mr-1 h-4 w-4" /> Edit
            </Button>
          )}

          {showAddButton && addButtonPlacement === "top" && (
            <Button
              variant="outline"
              className="h-8 btnLabelAdd font-inter bg-white text-black hover:bg-gray-200"
              onClick={() => {
                if (addViaDialog && onAddClick) {
                  onAddClick();
                } else {
                  setAddingRow(true);
                }
              }}
              disabled={addingRow || editing}
            >
              <FolderPlus className="h-4 w-4" /> {addBtnLabel}
            </Button>
          )}

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

          <Button variant="outline" className="h-8 w-[85px] rounded-[10px] border" icon={LuUpload}>
            <span className="font-inter font-medium text-[12px]">Upload</span>
          </Button>
          <Button className="h-8 w-[103px] rounded-[10px] border" icon={LuDownload}>
            <span className="font-inter font-semibold text-[12px]">Download</span>
          </Button>
        </div>
      </div>

      <div className={`relative overflow-auto min-h-[580px]`} style={{ minHeight: `${visibleRows * 39 + 40}px` }}>
        <Table className="w-full">
          <TableHeader className="bg-[#F7F7F7] sticky top-0">
            <TableRow>
            {columns.map((column: any, idx: number) => (
              <TableHead key={idx} className="text-center font-light h-10">
                {column.header === 'Date' || column.header === 'Next Due Date' ? (
                  <Button variant="ghost" onClick={() => handleSort(column.accessorKey)}>
                    {column.header} {getSortIcon(column.accessorKey)}
                  </Button>
                ) : (
                  column.header
                )}
              </TableHead>
            ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:h-[39px]">
            {table.getRowModel().rows.length > 0 && !addingRow ? (
              table.getRowModel().rows.map((row: any, rowIndex: number) => (
                <TableRow
                  key={row.id}
                  className={`h-[39px] cursor-pointer ${selectedRowId === row.id ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    setSelectedRowId(row.id);
                    handleViewMore?.({ ...row.original, leadType: row.original._leadType });
                  }}
                >
                  {row.getVisibleCells().map((cell: any) => {
                    const isExcluded = nonClickableColumns.includes(cell.column.id);
                    return (
                      <TableCell
                        key={cell.id}
                        className={`h-[39px] py-2 ${cell.column.columnDef.header === 'Remarks' && cell.getValue() !== '-' ? 'text-left max-w-[225px] truncate' : 'text-center'}`}
                        // className={`h-[39px] py-2 ${cell.column.columnDef.header === 'Remarks' && cell.getValue() !== '-' ? 'text-left w-auto truncate' : 'text-center w-auto'}`}
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
            ) : !addingRow ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-[450px] text-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No Results Found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : null}

            {!addViaDialog && addingRow && (
              <TableRow className='h-[39px] cursor-pointer'>
                {columns.map((column: any, idx: number) => (
                  <TableCell key={idx} className='h-[39px]'>
                    <Input
                      className="editable-cell px-2 py-2"
                      value={newRow[column.accessorKey] || ''}
                      onChange={(e) => handleNewRowChange(column.accessorKey, e.target.value)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {addButtonPlacement === "bottom" && (
          <div className="flex justify-between items-center mt-2 w-full">
            {/* By default mode of add mode */}

            <AddMoreDataBtn
              onClick={() => {
                if (addViaDialog && onAddClick) {
                  onAddClick();
                } else {
                  setAddingRow(true);
                  setNewRow({});
                }
              }}
              btnClassName="btnLabelAdd upload-materials-border-box font-inter bg-white text-black hover:bg-gray-200 p-2 pr-3"
              labelClassName="font-inter btnLabelAdd text-md"
              disabled={addingRow || editing}
              icon={<FolderPlus></FolderPlus>} label={addBtnLabel}>
            </AddMoreDataBtn>

            {/* Adding/Editing Mode */}
            {!addViaDialog && (addingRow || editing) && (
              <div className="flex gap-2 justify-end ml-4">
                {/* Save button */}
                <AddMoreDataBtn onClick={() => {
                  if (addingRow) {
                    data.push(newRow);
                    setAddingRow(false);
                    setNewRow({});
                  }
                  else {
                    setEditing(false);
                  }
                }}
                  btnClassName=" font-inter font-semibold h-[40px] p-2 pr-3 saveDataBtn"
                  icon={<Check></Check>}
                  label={"Save"} />

                {/* Discard button */}
                <AddMoreDataBtn onClick={() => {
                  if (addingRow) {
                    setAddingRow(false);
                    setNewRow({});
                  } else {
                    setEditing(false);
                  }
                }}
                  btnClassName="upload-materials-border-box font-inter font-normal bg-white text-black hover:bg-gray-200"
                  icon={<X></X>}
                  label={"Discard"} />

              </div>
            )}
          </div>
        )}



        {addButtonPlacement !== "bottom" && (
          <>
            {!addViaDialog && addingRow && (
              <div className="flex gap-2 justify-end mt-2">
                <AddMoreDataBtn onClick={() => { data.push(newRow); setAddingRow(false); setNewRow({}); }} btnClassName='font-inter font-semibold h-[40px] p-2 pr-3 saveDataBtn' icon={<Check></Check>} label={"Save"} />
                <AddMoreDataBtn onClick={() => { setAddingRow(false); setNewRow({}); }} btnClassName='upload-materials-border-box font-inter font-normal bg-white text-black hover:bg-gray-200 h-[40px] p-2 pr-3' icon={<X />} label={"Discard"} />
              </div>
            )}
            {!addViaDialog && editing && (
              <div className="flex gap-2 justify-end mt-2">
                <AddMoreDataBtn onClick={() => { setEditing(false); }} btnClassName='font-inter font-semibold h-[40px] p-2 pr-3 saveDataBtn' icon={<Check></Check>} label={"Save"} />
                <AddMoreDataBtn onClick={() => { setEditing(false); }} btnClassName='upload-materials-border-box font-inter font-normal bg-white text-black hover:bg-gray-200 h-[40px] p-2 pr-3' icon={<X />} label={"Discard"} />
              </div>
            )}
          </>
        )}

      </div>

      {showPagination && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className='cursor-pointer'>
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
              className='cursor-pointer'
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='cursor-pointer'
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
              className='cursor-pointer'
            >
              <ChevronRight />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className='cursor-pointer'
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}