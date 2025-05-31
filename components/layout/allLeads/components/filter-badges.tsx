import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { format, formatDate, parse } from 'date-fns';
import { Course, CourseNameMapper, LeadType, LeadTypeMapper, Locations } from '@/types/enum';
import { Badge } from '@/components/ui/badge';
import { toPascal } from '@/lib/utils';

type BadgeData = {
  key: string;
  label: string;
  value: any;
};

interface FilterBadgesProps {
  onFilterRemove: (filterKey: string) => void;
  assignedToData?: any[];
  appliedFilters: Record<string, any>;
  crossVisible?: boolean;
}

const FilterBadges = ({
  onFilterRemove,
  assignedToData,
  appliedFilters,
  crossVisible = true
}: FilterBadgesProps) => {
  const [badges, setBadges] = useState<BadgeData[]>([]);

  const getAssignedToLabel = (id: string) => {
    const user = assignedToData!.find((item) => item._id === id);
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
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    const newBadges: BadgeData[] = [];

    if (appliedFilters.startDate || appliedFilters.endDate) {
      newBadges.push({
        key: 'date',
        label: 'Date',
        value: formatDateRange(appliedFilters.startDate, appliedFilters.endDate)
      });
    }

    if (appliedFilters.startLTCDate || appliedFilters.endLTCDate) {
      newBadges.push({
        key: 'leadTypeModifiedDate',
        label: 'LTC Date',
        value: formatDateRange(appliedFilters.startLTCDate, appliedFilters.endLTCDate)
      });
    }

    if (appliedFilters.academicYear) {
      newBadges.push({
        key: 'academicYear',
        label: 'Academic Year',
        value: appliedFilters.academicYear
      });
    }

    if (appliedFilters.startNextDueDate || appliedFilters.endNextDueDate) {
      newBadges.push({
        key: 'nextDueDate',
        label: 'Next Due Date',
        value:
          appliedFilters.startNextDueDate || appliedFilters.endNextDueDate
            ? appliedFilters.startNextDueDate || appliedFilters.endNextDueDate
            : ''
      });
    }

    if (appliedFilters.courseYear) {
      newBadges.push({
        key: 'courseYear',
        label: 'Course Year',
        value: appliedFilters.courseYear
      });
    }

    if (appliedFilters.courseCode) {
      newBadges.push({
        key: 'courseCode',
        label: 'Course Code',
        value: appliedFilters.courseCode
      });
    }

    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (key === 'startDate' || key === 'endDate') return; // Skip startDate and endDate because handled above
      // Ensure you are not misunderstanding this config with normal single valued filter config !
      if (Array.isArray(value) && value.length > 0) {
        let displayValue: string;
        let getLabel;

        if (key === 'location') {
          getLabel = (val: string) => Locations[val as keyof typeof Locations] || val;
        } else if (key === 'courseCode') {
          console.log('I am here my man fixing this shit');
          getLabel = (val: string) => CourseNameMapper[val as Course] || val;
        } else if (key === 'assignedTo') {
          getLabel = getAssignedToLabel;
        } else if (key === 'source') {
          getLabel = (val: string) => val;
        } else if (key === 'leadType') {
          getLabel = (val: string) => LeadTypeMapper[val as LeadType];
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
          onClick={() => onFilterRemove(badge.key)}
          key={badge.key}
        >
          <Badge
            variant="secondary"
            className="py-1 px-2 text-[14px] flex items-center gap-1 cursor-pointer font-bold bg-gray-400/20"
          >
            <span className="">{badge.label}:</span> {badge.value}
            {crossVisible && <X size={16} className="ml-1 cursor-pointer" />}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default FilterBadges;
