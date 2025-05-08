export interface FilterData {
  filterKey: string;
  label: string;
  options?: FilterOption[] | string[];
  placeholder: string;
  hasSearch?: boolean;
  multiSelect?: boolean;
  isDateFilter?: boolean;
}
export interface FilterOption {
  label: string;
  id: string;
}
