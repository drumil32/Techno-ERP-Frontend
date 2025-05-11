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
import { z } from "zod";
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
  Edit2,
  Trash2,
  Upload
} from 'lucide-react';
import { LuDownload, LuUpload } from 'react-icons/lu';
import { AddMoreDataBtn } from '../add-more-data-btn/add-data-btn';
import { LectureConfirmation } from '@/types/enum';
import { CustomStyledDropdown } from '../custom-dropdown/custom-styled-dropdown';
import { IScheduleSchema, scheduleSchema } from '@/components/layout/courses/schemas/scheduleSchema';
import { DatePicker } from '@/components/ui/date-picker';
import { SimpleDatePicker } from '@/components/ui/simple-date-picker';
import { formatDateForAPI } from '../filter/techno-filter';
import { isValid, parse } from 'date-fns';
import clsx from 'clsx';

const confirmationStatus: Record<LectureConfirmation, { name: string; textStyle: string; bgStyle: string }> = {
  [LectureConfirmation.TO_BE_DONE]: {
    name: "To Be Done",
    textStyle: "text-yellow-800",
    bgStyle: "bg-yellow-100",
  },
  [LectureConfirmation.CONFIRMED]: {
    name: "Confirmed",
    textStyle: "text-green-800",
    bgStyle: "bg-green-100",
  },
  [LectureConfirmation.DELAYED]: {
    name: "Delayed",
    textStyle: "text-red-800",
    bgStyle: "bg-red-100",
  },
};

interface AttendanceRow {
  classStrength?: string;
  attendance?: string;
  absent?: string;
  [key: string]: any;
}

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
  minVisibleRows = 10,
  maxVisibleRows = 10,
  addButtonPlacement = "top",
  addBtnLabel = "Add",
  addViaDialog = false,
  onAddClick,
  onSaveNewRow,
  handleBatchEdit
}: any) {

  // console.log("Columns are : ", columns)
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(pageLimit);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState([...data]);
  const [addingRow, setAddingRow] = useState(false);
  const [newRow, setNewRow] = useState<any>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [batchValidationErrors, setBatchValidationErrors] = useState<Record<string, string>[]>([]);

  // console.log("New Row : ", newRow);
  // console.log("Edited Data : ", editedData);
  // console.log("Adding Row : ", addingRow);
  // console.log("Editing : ", editing);


  const validateAllEditedRows = (rows: any[]): boolean => {
    const allErrors: Record<string, string>[] = [];
    let isValid = true;

    rows.forEach((row, index) => {
      const newRow = { ...row };

      ['unit', 'lectureNumber', 'classStrength', 'attendance', 'absent'].forEach((key) => {
        if (newRow[key]) newRow[key] = parseInt(newRow[key]);
      });

      try {
        scheduleSchema.parse(newRow);
        allErrors[index] = {};
      }
      catch (err) {
        isValid = false;
        if (err instanceof z.ZodError) {
          const rowErrors: Record<string, string> = {};
          err.errors.forEach((e) => {
            if (e.path.length > 0) {
              const key = e.path[0] as string;
              rowErrors[key] = e.message;
            }
          });
          allErrors[index] = rowErrors;
        }
      }
    });

    setBatchValidationErrors(allErrors);
    return isValid;
  };


  const validateRow = (row: any): boolean => {
    try {
      // console.log("Row to be validated : ", row);
      if (row.unit)
        row.unit = parseInt(row.unit);
      if (row.lectureNumber)
        row.lectureNumber = parseInt(row.lectureNumber);
      if (row.classStrength)
        row.classStrength = parseInt(row.classStrength);
      if (row.attendance)
        row.attendance = parseInt(row.attendance);
      if (row.absent)
        row.absent = parseInt(row.absent);
      const validation = scheduleSchema.parse(row);
      // console.log("Validation result : ", validation);
      setValidationErrors({});
      return true;
    }
    catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path.length > 0) {
            const key = e.path[0] as string;
            errors[key] = e.message;
          }
        });
        // console.log("Errors are : ", errors);
        setValidationErrors(errors);
      }
      return false;
    }
  };

  const attendanceValue = (row: any) => {
    const classStrength = parseInt(row.classStrength || 0);
    const absent = parseInt(row.absent || 0);
    if (!isNaN(classStrength) && !isNaN(absent)) {
      return Math.max(classStrength - absent, 0);
    }
    return '';
  };

  const parseDateFromAPI = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const parsed = parse(dateString, 'dd/MM/yyyy', new Date());
    const [day, month, year] = dateString.split('/');
    const isExact =
      isValid(parsed) &&
      parsed.getDate() === Number(day) &&
      parsed.getMonth() + 1 === Number(month) &&
      parsed.getFullYear() === Number(year);
    return isExact ? parsed : undefined;
  };

  useEffect(() => {
    setGlobalFilter(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
    if (onSearch) onSearch(value);
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

  return (
    <div className="w-full mb-3 bg-white space-y-4 my-[8px] px-4 py-2 shadow-sm border-[1px] rounded-[10px] border-gray-200">
      <div className="flex w-full items-center py-4 px-4">

        {/* Table Header */}
        <div className="flex items-center">
          <h2 className="text-xl font-bold">{tableName}</h2>
          {children && <div className="ml-2">{children}</div>}
        </div>

        {/* Edit Button, always on top */}
        <div className="flex items-center space-x-2 ml-auto" >
          {showEditButton && (
            <Button
              variant="outline"
              className="btnLabelAdd h-8"
              onClick={handleEditToggle}
              disabled={!data || data.length === 0 || addingRow || editing}
            >
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

          <Button variant="outline" disabled className="h-8 w-[85px] rounded-[10px] border" icon={LuUpload}>
            <span className="font-inter font-medium text-[12px]">Upload</span>
          </Button>
          <Button disabled className="h-8 w-[103px] rounded-[10px] border" icon={LuDownload}>
            <span className="font-inter font-semibold text-[12px]">Download</span>
          </Button>
        </div>
      </div>

      <div className={`relative overflow-auto`} style={{ maxHeight: `${maxVisibleRows * 39}px`, minHeight: `${minVisibleRows * 39}px`}}>
        <Table className="w-full">
          <TableHeader className="bg-[#5B31D1]/10 backdrop-blur-lg font-bolds sticky top-0 z-10">
            <TableRow>
              {columns.map((column: any, idx: number) => (
                <TableHead
                  key={idx}
                  className={clsx('text-[#5B31D1] font-semibold h-10 text-center')}

                > {column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="[&_tr]:h-[39px]">
            {table.getRowModel().rows.length > 0 && (
              <>
                {table.getRowModel().rows.map((row: any, rowIndex: number) => (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      if (!row.original.disabled) {
                        setSelectedRowId(row.id);
                        handleViewMore(row.original);
                      }
                    }}
                    className={`h-[39px] ${row.original.disabled
                        ? 'bg-gray-100 cursor-not-allowed  opacity-50'
                        : 'cursor-pointer'}`}
                  >

                    {row.getVisibleCells().map((cell: any) => {
                      // const isExcluded = nonClickableColumns.includes(cell.column.id);
                      return (
                        <TableCell
                          key={cell.id}
                          className={`h-[39px] w-[20px] py-2 ${cell.column.columnDef.header === 'Remarks' && cell.getValue() !== '-' ? 'text-center w-[40px] max-w-[400px] truncate' : 'text-center'}`}
                          onClick={(e) => {
                            // if (isExcluded) e.stopPropagation();
                          }}
                        >
                          {(() => {
                            const columnId = cell.column.id;
                            const value = cell.getValue();

                            if (columnId === 'actions') {
                              if (editing || addingRow) {
                                return (
                                  <div className="flex justify-center items-center">
                                    <Button variant="ghost" disabled className="font-light hover:text-gray-500 disabled">
                                      <Trash2 size={20} className="text-gray-400" />
                                    </Button>
                                    <Button variant="ghost" disabled className="font-light hover:text-gray-500 disabled">
                                      <Upload size={20} className="text-gray-400" />
                                    </Button>
                                  </div>
                                );
                              }
                              return flexRender(cell.column.columnDef.cell, cell.getContext());
                            }

                            if (columnId === 'confirmation') {
                              if (editing) {
                                return (
                                  <CustomStyledDropdown
                                    value={value}
                                    onChange={(newValue) =>
                                      editing
                                        ? handleEditedChange(rowIndex, 'confirmation', newValue)
                                        : handleNewRowChange('confirmation', newValue)
                                    }
                                    data={confirmationStatus}
                                  />
                                );
                              }

                              const style = confirmationStatus[value as keyof typeof confirmationStatus];
                              return (
                                <span className={`w-25 inline-block rounded-md px-3 py-1 text-sm font-medium ${style?.bgStyle} ${style?.textStyle}`}>
                                  {style?.name || value}
                                </span>
                              );
                            }

                            if (editing) {
                              const errorMsg = batchValidationErrors?.[rowIndex]?.[columnId];

                              if (columnId === 'actualDate' || columnId === 'plannedDate') {
                                const parsedDate = parseDateFromAPI(value?.toString());

                                return (
                                  <div className="flex flex-col items-center">
                                    <SimpleDatePicker
                                      value={parsedDate ? formatDateForAPI(parsedDate) : undefined}
                                      onChange={(newDateStr: string | undefined) => {
                                        // console.log("New Date is:", newDateStr);
                                        handleEditedChange(rowIndex, columnId, newDateStr);
                                        setBatchValidationErrors((prev) => {
                                          const updated = [...prev];
                                          if (!updated[rowIndex]) updated[rowIndex] = {};
                                          updated[rowIndex][columnId] = '';
                                          return updated;
                                        });
                                      }}
                                      placeholder="Pick a Date"
                                      showYearMonthDropdowns
                                      className="w-[200px]"
                                    />
                                    {/* {errorMsg && <span className="text-xs text-red-500">{errorMsg}</span>} */}
                                  </div>
                                );
                              }
                              return (
                                <div className="flex flex-col items-center">
                                  <input
                                    type="text"
                                    className={`bg-white border rounded px-2 py-1 text-sm w-3/4 ${errorMsg ? 'border border-red-500' : ''}`}
                                    value={value ?? ''}
                                    onChange={(e) => {
                                      const newValue = e.target.value;
                                      const numericFields = ['classStrength', 'attendance', 'absent', 'unitNumber', 'lectureNumber'];
                                      const isNumeric = /^\d*$/.test(newValue); 
                                
                                      if (numericFields.includes(columnId) && !isNumeric) {
                                        return;
                                      }
                                
                                      const updatedErrors = [...batchValidationErrors];
                                      if (!updatedErrors[rowIndex]) updatedErrors[rowIndex] = {};
                                     
                                      const row = (table.getRowModel().rows[rowIndex]?.original ?? {}) as AttendanceRow;
                                      
                            
                                      const updatedRow = { ...row, [columnId]: newValue };

                                      const classStrength = parseInt(
                                        columnId === 'classStrength' ? newValue : (updatedRow?.classStrength ?? ''),
                                        10
                                      );

                                      const attendance = parseInt(
                                        columnId === 'attendance' ? newValue : updatedRow?.attendance ?? '',
                                        10
                                      );
                                      const absent = parseInt(
                                        columnId === 'absent' ? newValue : updatedRow?.absent ?? '',
                                        10
                                      );

                                      const isValidNumber = (num: number) => !isNaN(num) && num >= 0;

                                      updatedErrors[rowIndex][columnId] = '';

                            
                                      if (columnId === 'classStrength') {
                                        if (!isValidNumber(classStrength)) {
                                          updatedErrors[rowIndex][columnId] = 'Class strength must be a non-negative number';
                                        } else {
                                          if (isValidNumber(attendance)) {
                                            if (attendance > classStrength) {
                                              updatedErrors[rowIndex]['attendance'] = 'Attendance cannot exceed class strength';
                                            } else {
                                              handleEditedChange(rowIndex, 'absent', classStrength - attendance);
                                              updatedErrors[rowIndex]['attendance'] = '';
                                              updatedErrors[rowIndex]['absent'] = '';
                                            }
                                          } else if (isValidNumber(absent)) {
                                            if (absent > classStrength) {
                                              updatedErrors[rowIndex]['absent'] = 'Absent cannot exceed class strength';
                                            } else {
                                              handleEditedChange(rowIndex, 'attendance', classStrength - absent);
                                              updatedErrors[rowIndex]['attendance'] = '';
                                              updatedErrors[rowIndex]['absent'] = '';
                                            }
                                          }
                                        }
                                      }

                                      if (columnId === 'attendance') {
                                        if (!isValidNumber(attendance)) {
                                          updatedErrors[rowIndex][columnId] = 'Attendance must be a non-negative number';
                                        } else if (isValidNumber(classStrength) && attendance > classStrength) {
                                          updatedErrors[rowIndex][columnId] = 'Attendance cannot exceed class strength';
                                        } else {
                                          handleEditedChange(rowIndex, 'absent', classStrength - attendance);
                                          updatedErrors[rowIndex]['absent'] = '';
                                        }
                                      }

                                      if (columnId === 'absent') {
                                        if (!isValidNumber(absent)) {
                                          updatedErrors[rowIndex][columnId] = 'Absent must be a non-negative number';
                                        } else if (isValidNumber(classStrength) && absent > classStrength) {
                                          updatedErrors[rowIndex][columnId] = 'Absent cannot exceed class strength';
                                        } else {
                                          handleEditedChange(rowIndex, 'attendance', classStrength - absent);
                                          updatedErrors[rowIndex]['attendance'] = '';
                                        }
                                      }

                                      handleEditedChange(rowIndex, columnId, newValue);
                                      setBatchValidationErrors(updatedErrors);
                                    }}
                                  />
                                  {/* {errorMsg && <span className="text-xs text-red-500">{errorMsg}</span>} */}
                                </div>

                              );
                            }
                            return flexRender(cell.column.columnDef.cell, cell.getContext());
                          })()}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                ))}
                {/* Here */}
              </>
            )}
            {!addViaDialog && addingRow && (
              <TableRow className="h-[39px] cursor-pointer">
                {columns.map((column: any, idx: number) => {
                  const columnId = column.accessorKey || column.id;
                  // console.log("Here, column Id : ", columnId);
                  if (columnId === 'actions') {
                    return (
                      <TableCell key={idx} className="h-[39px] text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Button variant="ghost" disabled className="font-light hover:text-gray-500 disabled">
                            <Trash2 size={20} className="text-gray-400" />
                          </Button>
                          <Button variant="ghost" disabled className="font-light hover:text-gray-500 disabled">
                            <Upload size={20} className="text-gray-400" />
                          </Button>
                        </div>
                      </TableCell>
                    );
                  }

                  else if (columnId === 'confirmation') {
                    const defaultValue = newRow[columnId] ?? `${LectureConfirmation.TO_BE_DONE}`; // adjust the default key if needed
                    return (
                      <TableCell key={idx} className="h-[39px] text-center">
                        <CustomStyledDropdown
                          value={defaultValue}
                          onChange={(newValue) => handleNewRowChange(columnId, newValue)}
                          data={confirmationStatus}
                        />
                      </TableCell>
                    );
                  }

                  else if (columnId === 'actualDate' || columnId === 'plannedDate') {
                    const errorMsg = validationErrors[columnId];
                    const parsedDate = parseDateFromAPI(newRow[columnId]);

                    return (
                      <TableCell key={idx} className="h-[39px] text-center">
                        <div className="flex flex-col items-center">
                          <SimpleDatePicker
                            value={parsedDate ? formatDateForAPI(parsedDate) : undefined}
                            onChange={(newDateStr: string | undefined) => {
                              // console.log('Selected date:', newDateStr);
                              handleNewRowChange(columnId, newDateStr);
                              setValidationErrors((prev) => ({ ...prev, [columnId]: '' }));
                            }}
                            dateFormat="dd/MM/yyyy"
                            placeholder="Pick a Date"
                            showYearMonthDropdowns
                            className="w-[200px]"
                          />
                          {/* {errorMsg && <span className="text-xs text-red-500">{errorMsg}</span>} */}
                        </div>
                      </TableCell>
                    );
                  }
                  else {
                    return (
                      <TableCell key={idx} className="h-[39px]">
                        <div className="flex flex-col items-center">
                          <Input
                             className={`bg-white editable-cell px-2 py-2 border rounded-md ${
                              validationErrors[columnId] ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
                            }`}
                            value={newRow[columnId] || ''}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              const numericOnlyFields = ['classStrength', 'attendance', 'unitNumber', 'lectureNumber', 'absent'];
                              if (numericOnlyFields.includes(columnId) && !/^\d*$/.test(newValue)) {
                                return; // Do not update value if not numeric
                              }

                              const updatedRow = { ...newRow, [columnId]: newValue };
                              const newErrors = { ...validationErrors };

                              const classStrength = parseInt(
                                columnId === 'classStrength' ? newValue : newRow.classStrength ?? '',
                                10
                              );
                              const attendance = parseInt(
                                columnId === 'attendance' ? newValue : newRow.attendance ?? '',
                                10
                              );
                              const absent = parseInt(
                                columnId === 'absent' ? newValue : newRow.absent ?? '',
                                10
                              );

                              const isValidNumber = (num: number) => !isNaN(num) && num >= 0;

                              newErrors[columnId] = '';

                              const numericFields = ['classStrength', 'attendance', 'absent'];

                              if (numericFields.includes(columnId)) {
                                if (!/^\d*$/.test(newValue)) {
                                  newErrors[columnId] = 'Only numeric values allowed';
                                }
                              }

                              if (columnId === 'classStrength') {
                                if (!isValidNumber(classStrength)) {
                                  newErrors[columnId] = 'Class strength must be a non-negative number';
                                } else {
                                  if (isValidNumber(attendance)) {
                                    if (attendance > classStrength) {
                                      newErrors['attendance'] = 'Attendance cannot exceed class strength';
                                    } else {
                                      updatedRow.absent = classStrength - attendance;
                                      newErrors['attendance'] = '';
                                      newErrors['absent'] = '';
                                    }
                                  } else if (isValidNumber(absent)) {
                                    if (absent > classStrength) {
                                      newErrors['absent'] = 'Absent cannot exceed class strength';
                                    } else {
                                      updatedRow.attendance = classStrength - absent;
                                      newErrors['attendance'] = '';
                                      newErrors['absent'] = '';
                                    }
                                  }
                                }
                              }

                              if (columnId === 'attendance') {
                                if (!isValidNumber(attendance)) {
                                  newErrors[columnId] = 'Attendance must be a non-negative number';
                                } else if (isValidNumber(classStrength) && attendance > classStrength) {
                                  newErrors[columnId] = 'Attendance cannot exceed class strength';
                                } else {
                                  updatedRow.absent = isValidNumber(classStrength) ? classStrength - attendance : '';
                                  newErrors['absent'] = '';
                                }
                              }

                              if (columnId === 'absent') {
                                if (!isValidNumber(absent)) {
                                  newErrors[columnId] = 'Absent must be a non-negative number';
                                } else if (isValidNumber(classStrength) && absent > classStrength) {
                                  newErrors[columnId] = 'Absent cannot exceed class strength';
                                } else {
                                  updatedRow.attendance = isValidNumber(classStrength) ? classStrength - absent : '';
                                  newErrors['attendance'] = '';
                                }
                              }

                              setNewRow(updatedRow);
                              setValidationErrors(newErrors);
                            }}
                          />
                          {/* {validationErrors[columnId] && (
                            <span className="text-xs text-red-500">{validationErrors[columnId]}</span>
                          )} */}
                        </div>
                      </TableCell>
                    );
                  }



                })}
              </TableRow>
            )}

            {table.getRowModel().rows.length === 0 && !addingRow && (
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
            )}
          </TableBody>
        </Table>

        {addButtonPlacement === "bottom" && (
          <div className="h-[50px] flex justify-between items-center pt-2 w-full">
            <Button
              variant="outline"
              className="h-[40px] p-2 pr-3 upload-materials-border-box transition btnLabelAdd font-inter bg-white text-black hover:bg-gray-200"
              onClick={() => {
                setValidationErrors({});
                if (addViaDialog && onAddClick) {
                  onAddClick();
                } else {
                  setAddingRow(true);
                  setNewRow({});
                }
              }}
              disabled={addingRow || editing}
            >
              <span className='font-inter'><FolderPlus className='text-xl' /></span>
              <p className='font-inter btnLabelAdd text-md'>{addBtnLabel}</p>
            </Button>


            {/* Adding/Editing Mode */}
            {!addViaDialog && (addingRow || editing) && (
              <div className="flex gap-2 justify-end ml-4">
                {/* Save button */}
                <AddMoreDataBtn onClick={() => {
                  if (addingRow) {
                    const isValid = validateRow(newRow);
                    // console.log("Is valid : ", isValid);
                    if (isValid) {
                      onSaveNewRow?.(newRow);
                      data.push(newRow);
                      setAddingRow(false);
                      setNewRow({});
                    }
                  }
                  else {
                    // console.log("Updated data : ", editedData);
                    const isValid = validateAllEditedRows(editedData);
                    if (isValid) {
                      handleBatchEdit?.(editedData);
                      setEditing(false);
                    }
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
                    setBatchValidationErrors([]);
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