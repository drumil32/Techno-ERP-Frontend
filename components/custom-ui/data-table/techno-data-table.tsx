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
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react';

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
    searchTerm = ''
}: any) {
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [pageSize, setPageSize] = useState<number>(pageLimit);

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
        manualPagination: true, // Tell the table you're handling pagination manually
        pageCount: totalPages
    });
    

    return (
        <div className="w-full space-y-4 border-2 rounded-lg mt-5 px-4 py-2">
            {/* Data Table Header */}
            <div className="flex items-center justify-between py-4">
                <h2 className="text-lg font-bold">{tableName}</h2>
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search..."
                        value={globalFilter}
                        onChange={handleSearchChange}
                        className="max-w-sm"
                    />
                    {/* TODO: Get the function for the upload and download from parent */}
                    <Button>Upload</Button>
                    <Button>Download</Button>
                </div>
            </div>

            {/* Data Table Body */}
            <div className="rounded-md border">
                {/* TODO: Update table header and the rows borders and backgground to match the figma design */}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-center">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                                        <TableCell key={cell.id} className="text-center">
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
                            {[10, 20, 30, 50].map((size) => (
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
                        {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, data.length)} of{' '}
                        {data.length}
                    </span>
                </div>

                {/* TODO: Match the page switch match to Figma design */}
                <div className="flex items-center space-x-2">
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ArrowLeft />
                    </Button>
                    <span>{currentPage}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <ArrowRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
