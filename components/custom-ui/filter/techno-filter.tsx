import { useState } from "react";
import { useTechnoFilterContext } from "./filter-context";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar1, ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface TechnoFilterProps {
    filterKey: string;
    options?: string[];
    hasSearch?: boolean;
    multiSelect?: boolean;
    isDateFilter?: boolean;
}

export default function TechnoFilter({ filterKey, options = [], hasSearch = false, multiSelect = false, isDateFilter = false }: TechnoFilterProps) {
    const { filters, updateFilter } = useTechnoFilterContext();
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const filteredOptions = options.filter(option => option.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelect = (option: string) => {
        if (multiSelect) {
            const current = filters[filterKey] || []
            const newFilters = current.includes(option)
                ? current.filter((item: string) => item !== option)
                : [...current, option]
            updateFilter(filterKey, newFilters)
        } else {
            updateFilter(filterKey, option)
        }
    }

    const handleDateChange = (type: 'start' | 'end', selectedDate: Date | undefined) => {
        if (type === 'start') {
            setStartDate(selectedDate);
            updateFilter(`${filterKey}_start`, selectedDate);
        } else {
            setEndDate(selectedDate);
            updateFilter(`${filterKey}_end`, selectedDate);
        }
    }

    const handleThisMonth = () => {
        if (filters[filterKey] === "This Month") {
            setStartDate(undefined);
            setEndDate(undefined);
            updateFilter(`${filterKey}_start`, undefined);
            updateFilter(`${filterKey}_end`, undefined);
        } else {
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setStartDate(firstDay);
            setEndDate(lastDay);
            updateFilter(`${filterKey}_start`, firstDay);
            updateFilter(`${filterKey}_end`, lastDay);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{filterKey} <ChevronDown /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
                {isDateFilter ? (
                    <div className="p-2 space-y-4">
                        <div className="flex items-center space-x-2" onClick={handleThisMonth}>
                            <Checkbox checked={filters[filterKey] === "This Month"} />
                            <span>This Month</span>
                        </div>
                        <div className={`flex flex-col gap-4 ${filters[filterKey] === "This Month" ? "opacity-50 pointer-events-none" : ""}`}>
                            <div className="flex items-center gap-2">
                                <Calendar1 />
                                {/* TODO: Selection of the Start and End date it is not updating */}
                                <Input
                                    type="date"
                                    value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                                    placeholder="Start Date"
                                    readOnly
                                    onClick={() => handleDateChange('start', new Date())}
                                />
                                <Calendar1 />
                                <Input
                                    type="date"
                                    value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                                    placeholder="End Date"
                                    readOnly
                                    onClick={() => handleDateChange('end', new Date())}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {hasSearch && (
                            <div className="p-2">
                                <Input
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        )}
                        {filteredOptions.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelect(option)}>
                                <Checkbox
                                    checked={multiSelect ? filters[filterKey]?.includes(option) : filters[filterKey] === option}
                                />
                                <span>{option}</span>
                            </div>
                        ))}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

