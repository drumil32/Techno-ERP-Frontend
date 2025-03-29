import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format, parse } from 'date-fns';
import { Course, CourseNameMapper, Locations } from '@/static/enum';
import { Badge } from '@/components/ui/badge';
import { toPascal } from '@/lib/utils';

type BadgeData = {
  key: string;
  label: string;
  value: any;
};

interface FilterBadgesProps {
  onFilterRemove: (filterKey: string) => void;
  assignedToData: any[];
  appliedFilters: Record<string, any>;
}

const FilterBadges = ({ onFilterRemove, assignedToData, appliedFilters }: FilterBadgesProps) => {
  const [badges, setBadges] = useState<BadgeData[]>([]);

  const getAssignedToLabel = (id: string) => {
    const user = assignedToData.find((item) => item._id === id);
    return user?.name || id;
  };

  const formatDateRange = (startDateStr: string | undefined, endDateStr: string | undefined) => {
    if (!startDateStr && !endDateStr) return '';

    try {
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (startDateStr) {
        startDate = parse(startDateStr, 'dd/MM/yyyy', new Date());
      }

      if (endDateStr) {
        endDate = parse(endDateStr, 'dd/MM/yyyy', new Date());
      }

      if (startDate && endDate) {
        return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
      } else if (startDate) {
        return `From ${format(startDate, 'dd/MM/yyyy')}`;
      } else if (endDate) {
        return `Until ${format(endDate, 'dd/MM/yyyy')}`;
      }
      return '';
    } catch (error) {
      console.error('Error formatting date range:', error);
      return 'Invalid Date'; // Or some other fallback
    }
  };

  useEffect(() => {
    const newBadges: BadgeData[] = [];

    if (appliedFilters.startDate || appliedFilters.endDate) {
      // Check for start or end date
      newBadges.push({
        key: 'date',
        label: 'Date',
        value: formatDateRange(appliedFilters.startDate, appliedFilters.endDate) // Use individual start/end
      });
    }

    if (appliedFilters.startLTCDate || appliedFilters.endLTCDate) {
      newBadges.push({
        key: 'ltcDate',
        label: 'LTC Date',
        value: formatDateRange(appliedFilters.startLTCDate, appliedFilters.endLTCDate)
      });
    }

    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (key === 'startDate' || key === 'endDate') return; // Skip startDate and endDate because handled above
      if (Array.isArray(value) && value.length > 0) {
        let displayValue: string;
        let getLabel;

        if (key === 'location') {
          getLabel = (val: string) => Locations[val as keyof typeof Locations] || val;
        } else if (key === 'course') {
          getLabel = (val: string) => CourseNameMapper[val as Course] || val;
        } else if (key === 'assignedTo') {
          getLabel = getAssignedToLabel;
        } else if (key === 'source') {
          getLabel = (val: string) => toPascal(val);
        } else {
          getLabel = (val: string) => val;
        }

        if (value.length <= 2) {
          displayValue = value.map(getLabel).join(', ');
        } else {
          displayValue = `${value.slice(0, 2).map(getLabel).join(', ')} +${value.length - 2} more`;
        }

        newBadges.push({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          value: displayValue
        });
      }
    });

    setBadges(newBadges);
  }, [appliedFilters, assignedToData]);

  return (
    <div className="flex flex-row flex-wrap gap-2">
      {badges.map((badge) => (
        <div
          className="flex flex-row flex-wrap gap-2"
          onClick={() => onFilterRemove(badge.key)} // Remove by badge.key
          key={badge.key}
        >
          <Badge variant="secondary" className="py-1 px-2 flex items-center gap-1 cursor-pointer">
            <span className="font-medium">{badge.label}:</span> {badge.value}
            <X size={16} className="ml-1 cursor-pointer" />
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default FilterBadges;
