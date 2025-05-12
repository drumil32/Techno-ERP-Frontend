import { Button } from '@/components/ui/button';
import TechnoFilter, { FilterOption } from './techno-filter';

interface FilterConfig {
  filterKey: string;
  label: string;
  placeholder?: string;
  options?: string[] | FilterOption[];
  hasSearch?: boolean;
  multiSelect?: boolean;
  isDateFilter?: boolean;
}

interface TechnoFilterGroupsProps {
  filters: FilterConfig[];
  handleFilters: () => void;
  clearFilters: () => void;
  clearFiltersVisible? : boolean;
}

export default function TechnoFiltersGroup({
  filters,
  handleFilters,
  clearFilters,
  clearFiltersVisible = true
}: TechnoFilterGroupsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {filters.map((filter) => (
        <TechnoFilter
          key={filter.filterKey}
          filterKey={filter.filterKey}
          filterLabel={filter.label}
          filterPlaceholder={filter.placeholder || ''}
          options={filter.options}
          hasSearch={filter.hasSearch}
          multiSelect={filter.multiSelect}
          isDateFilter={filter.isDateFilter}
          applyFilters={handleFilters}
        />
      ))}
      {clearFiltersVisible && (
        <Button className="cursor-pointer" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
