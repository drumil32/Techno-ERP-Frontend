import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import * as Dialog from '@radix-ui/react-dialog';
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { courseDropdown } from "../admin-tracker/helpers/fetch-data";
import { useTechnoFilterContext } from "@/components/custom-ui/filter/filter-context";
import TechnoFiltersGroup from "@/components/custom-ui/filter/techno-filters-group";
import { FilterOption } from "@/components/custom-ui/filter/techno-filter";
import FilterBadges from "../allLeads/components/filter-badges";

export default function BulkFeeUpdateDialogue() {
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [refreshKey, setRefreshKey] = useState(0);

  const courseQuery = useQuery({
    queryKey: ['courses'],
    queryFn: courseDropdown
  });
  const courses = Array.isArray(courseQuery.data) ? courseQuery.data : [];

  const { filters, updateFilter } = useTechnoFilterContext();

  const currentFiltersRef = useRef<{ [key: string]: any } | null>(null);

  const applyFilter = () => {
    currentFiltersRef.current = { ...filters };
    setAppliedFilters({ ...filters });
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const [open, setOpen] = useState(false);

  const getFiltersData = () => {
    return [
      {
        filterKey: 'academic-year',
        label: 'Academic Year',
        options: [
          {
            label: "24-25",
            id: "2024-25"
          }
        ] as FilterOption[],
        multiSelect: true,
      },
      {
        filterKey: 'course',
        label: 'Course',
        options: courses.map((item: string) => {
          return {
            label: item,
            id: item
          };
        }),
        hasSearch: true,
        multiSelect: true
      },
      {
        filterKey: 'selected-semester',
        label: 'Semester',
        options: [
          {
            label: "Sem 1",
            id: "sem1"
          }
        ] as FilterOption[],
        multiSelect: true
      },
      {
        filterKey: 'fees-type',
        label: 'Fees Type',
        options: [
          {
            label: "MISC",
            id: "misc"
          },
          {
            label: "Optional",
            id: "optional"
          }
        ],
        hasSearch: true,
        multiSelect: true
      },
    ]
  }

  const handleFilterRemove = (filterKey: string) => {
    const updatedFilters = { ...appliedFilters };

    if (filterKey === 'date' || filterKey.includes('Date')) {
      const dateKeys = ['startDate', 'endDate', 'startLTCDate', 'endLTCDate', 'date'];

      dateKeys.forEach((key) => {
        delete updatedFilters[key];
        updateFilter(key, undefined);
      });
    } else {
      delete updatedFilters[filterKey];
      updateFilter(filterKey, undefined);
    }

    setAppliedFilters(updatedFilters);
    setRefreshKey((prevKey) => prevKey + 1);
  };



  const clearFilters = () => {
    getFiltersData().forEach((filter) => {
      updateFilter(filter.filterKey, undefined);
    });
    setAppliedFilters({});
    currentFiltersRef.current = {};
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant='outline' className="h-8 rounded-[10px] border">Bulk Fee Update</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-30 inset-0 bg-black/30" />
        <Dialog.Content className="bg-white sm:min-w-[850px] z-40 p-6 rounded-xl shadow-xl w-full max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/*Dialogue Title Header*/}
          <div className="flex justify-between items-center mb-8">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <Pencil className="w-5 h-5 text-gray-500 text-xl" />
              &nbsp;Bulk Fees Update
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-black text-xl font-bold">&times;</Dialog.Close>
          </div>
          <div className="flex flex-col gap-4">
            <TechnoFiltersGroup
              filters={getFiltersData()}
              handleFilters={applyFilter}
              clearFilters={clearFilters}
            />
            <FilterBadges
              onFilterRemove={handleFilterRemove}
              appliedFilters={appliedFilters}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
