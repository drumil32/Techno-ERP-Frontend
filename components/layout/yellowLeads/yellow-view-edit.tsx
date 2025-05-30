import { useEffect, useRef, useState } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { CalendarIcon, Loader2, Pencil, Save, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Course, FinalConversionStatus, Gender, Locations, UserRoles } from '@/types/enum';
import { apiRequest } from '@/lib/apiClient';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { parse, format, isValid, isBefore, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import z, { boolean } from 'zod';
import { YellowLead } from '@/components/custom-ui/yellow-leads/interfaces';
import { FootFallStatus } from './foot-fall-tag';
import FinalConversionTag from './final-conversion-tag';
import FootFallTag from './foot-fall-tag';
import { yellowLeadUpdateSchema } from '../allLeads/validators';
import { fetchAssignedToDropdown } from './helpers/fetch-data';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { removeNullValues, toPascal } from '@/lib/utils';
import { cityDropdown, fixCourseDropdown } from '../admin-tracker/helpers/fetch-data';
import { formatDateView, formatTimeStampView } from '../allLeads/helpers/refine-data';
import { MultiSelectCustomDropdown } from '@/components/custom-ui/common/multi-select-custom-editable';
import { MultiSelectDropdown } from '@/components/custom-ui/multi-select/mutli-select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/stores/auth-store';

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  altPhoneNumber?: string;
  email?: string;
  nextDueDate?: string;
  area?: string;
  course?: string;
  schoolName?: string;
  degree?: string;
  city?: string;
}

export const contactNumberSchema = z
  .string()
  .regex(/^[1-9]\d{9}$/, 'Invalid contact number format. Expected: 1234567890');

export default function YellowLeadViewEdit({
  data,
  setIsDrawerOpen,
  setSelectedRowId,
  setRefreshKey
}: any) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<YellowLead | null>(null);
  const [originalData, setOriginalData] = useState<YellowLead | null>(null);
  // const [isEditing, toggleIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const { hasRole } = useAuthStore();

  const [newRemark, setNewRemark] = useState('');

  useEffect(() => {
    if (data) {
      const formattedData = {
        ...data,
        remarks: Array.isArray(data.remarks) ? data.remarks : data.remarks ? [data.remarks] : []
      };
      setFormData(formattedData);
      setOriginalData(formattedData);
    }
  }, [data]);

  const validateField = (name: string, value: any) => {
    if (!formData) return;

    try {
      let tempData = { ...formData, [name]: value };
      tempData = removeNullValues(tempData);
      let validationData = {
        _id: tempData._id,
        leadTypeModifiedDate: tempData.leadTypeModifiedDate,
        name: tempData.name,
        phoneNumber: tempData.phoneNumber,
        altPhoneNumber: tempData.altPhoneNumber,
        email: tempData.email,
        gender: tempData.gender,
        area: tempData.area,
        city: tempData.city,
        course: tempData.course,
        footFall: tempData.footFall,
        finalConversion: tempData.finalConversion,
        schoolName: tempData.schoolName,
        degree: tempData.degree,
        followUpCount: tempData.followUpCount,
        remarks: tempData.remarks,
        nextDueDate: tempData.nextDueDate
      };
      validationData = removeNullValues(validationData);
      const response = yellowLeadUpdateSchema.parse(validationData);

      setErrors((prevErrors: any) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = { ...errors };
        error.errors.forEach((err) => {
          const key = err.path[0] as keyof FormErrors;
          newErrors[key] = err.message;
        });

        setErrors(newErrors);
      }
    }
  };

  const assignedToQuery = useQuery({
    queryKey: ['assignedToDropdown'],
    queryFn: fetchAssignedToDropdown
  });
  const fixCourseQuery = useQuery({
    queryKey: ['courses'],
    queryFn: fixCourseDropdown
  });
  const fixCourses = Array.isArray(fixCourseQuery.data) ? fixCourseQuery.data : [];

  const assignedToDropdownData = Array.isArray(assignedToQuery.data) ? assignedToQuery.data : [];
  const cityDropdownQuery = useQuery({
    queryKey: ['cities'],
    queryFn: cityDropdown
  });
  const cityDropdownData = Array.isArray(cityDropdownQuery.data) ? cityDropdownQuery.data : [];

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const isLoading =
      assignedToQuery.isLoading || fixCourseQuery.isLoading || cityDropdownQuery.isLoading;
    const hasError = assignedToQuery.isError || fixCourseQuery.isError || cityDropdownQuery.isError;
    const isSuccess =
      assignedToQuery.isSuccess && fixCourseQuery.isSuccess && cityDropdownQuery.isSuccess;
    const isFetching =
      assignedToQuery.isFetching || fixCourseQuery.isFetching || cityDropdownQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading dropdown data...', { id: toastIdRef.current, duration: Infinity });
      }
      if (hasError) {
        toast.error('Failed to load dropdown data', { id: toastIdRef.current, duration: 3000 });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
      }
      if (isSuccess) {
        toast.success('Dropdown data loaded', { id: toastIdRef.current!, duration: 2000 });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Failed to load dropdown data', { duration: 3000 });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading dropdown data...', { duration: Infinity });
    }

    return () => {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    };
  }, [
    assignedToQuery.isLoading,
    assignedToQuery.isError,
    assignedToQuery.isSuccess,
    assignedToQuery.isFetching,
    fixCourseQuery.isLoading,
    fixCourseQuery.isError,
    fixCourseQuery.isSuccess,
    fixCourseQuery.isFetching,
    cityDropdownQuery.isLoading,
    cityDropdownQuery.isError,
    cityDropdownQuery.isSuccess,
    cityDropdownQuery.isFetching
  ]);

  const parseDateString = (dateString?: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      return isValid(parsedDate) ? parsedDate : undefined;
    } catch {
      return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    validateField(name, value);
  };

  const handleExistingRemarkChange = (index: number, value: string) => {
    if (!formData) return;
    const updatedRemarks = [...formData.remarks];
    updatedRemarks[index] = value;
    setFormData((prev) => (prev ? { ...prev, remarks: updatedRemarks } : null));
    validateField('remarks', updatedRemarks);
  };

  const handleSelectChange = (name: string, value: string | boolean | string[]) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    validateField(name, value);
  };

  const handleFollowUpCountChange = (name: string, value: number) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    validateField(name, value);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    const formattedDate = format(date, 'dd/MM/yyyy');
    setFormData((prev) => (prev ? { ...prev, nextDueDate: formattedDate } : null));
    validateField('nextDueDate', formattedDate);
    setIsCalendarOpen(false);
  };

  const hasChanges = () => {
    if (!formData || !originalData) return false;
    if (newRemark) return true;

    const allowedFields = [
      'name',
      'phoneNumber',
      'altPhoneNumber',
      'email',
      'gender',
      'area',
      'city',
      'course',
      'footFall',
      'finalConversion',
      'assignedTo',
      'followUpCount',
      'schoolName',
      'degree',
      'remarks',
      'nextDueDate',
      'leadTypeModifiedDate'
    ];

    return allowedFields.some((field) => {
      const origValue = originalData[field] || '';
      const newValue = formData[field] || '';

      if (field === 'remarks') {
        const origRemarks = Array.isArray(originalData.remarks) ? originalData.remarks : [];
        const newRemarks = Array.isArray(formData.remarks) ? formData.remarks : [];

        if (origRemarks.length !== newRemarks.length) return true;
        return origRemarks.some((remark, index) => remark !== newRemarks[index]);
      }

      return origValue !== newValue;
    });
  };

  const handleSubmit = async () => {
    if (!formData) return;

    if (!hasChanges()) {
      toast.info('No changes to save');
      setSelectedRowId(null);
      setIsDrawerOpen(false);
      // toggleIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      formData.footFall = formData.footFall;
      const allowedFields = [
        '_id',
        'name',
        'phoneNumber',
        'altPhoneNumber',
        'email',
        'gender',
        'area',
        'city',
        'course',
        'footFall',
        'schoolName',
        'degree',
        'assignedTo',
        'finalConversion',
        'followUpCount',
        'remarks',
        'nextDueDate',
        'leadTypeModifiedDate'
      ];

      let filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => allowedFields.includes(key))
      );

      if (newRemark) {
        filteredData.remarks.push(newRemark);
        setNewRemark('');
      }

      filteredData = removeNullValues(filteredData);
      const validation = yellowLeadUpdateSchema.safeParse(filteredData);
      if (!validation.success) {
        const newErrors: FormErrors = {};
        validation.error.errors.forEach((err) => {
          const key = err.path[0] as keyof FormErrors;
          newErrors[key] = err.message;
        });
        setErrors(newErrors);
        toast.error('Please fix the errors in the form');
        return;
      }

      const { leadTypeModifiedDate, ...toBeUpdatedData } = filteredData;

      delete toBeUpdatedData.assignedTo;

      const response: YellowLead | null = await apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateYellowLead,
        toBeUpdatedData
      );

      if (response) {
        // response.footFall =formData.footFall;
        setFormData(response as YellowLead);
        toast.success('Updated Lead Successfully');

        const updateLeadCache = () => {
          const queryCache = queryClient.getQueryCache();
          const leadQueries = queryCache.findAll({ queryKey: ['leads'] });

          leadQueries.forEach((query) => {
            queryClient.setQueryData(query.queryKey, (oldData: any) => {
              if (!oldData || !oldData.yellowLeads) return oldData;

              const newData = JSON.parse(JSON.stringify(oldData));

              const leadIndex = newData.yellowLeads.findIndex(
                (lead: any) => lead._id === response._id
              );

              const assignedToUsers = Array.isArray(response.assignedTo)
                ? response.assignedTo
                  .map((id: string) =>
                    assignedToDropdownData?.find((user: any) => user._id === id)
                  )
                  .filter(Boolean)
                : [];

              let assignedToName = 'N/A';
              let assignedToView = '-';

              if (assignedToUsers.length > 0) {
                assignedToName = assignedToUsers[0].name;
                assignedToView = assignedToUsers[0].name;

                if (assignedToUsers.length > 1) {
                  assignedToName += ` +${assignedToUsers.length - 1}`;
                  assignedToView += ` +${assignedToUsers.length - 1}`;
                }
              }

              if (leadIndex !== -1) {
                newData.yellowLeads[leadIndex] = {
                  ...newData.yellowLeads[leadIndex],

                  name: response.name,
                  phoneNumber: response.phoneNumber,
                  altPhoneNumber: response.altPhoneNumber,
                  altPhoneNumberView: response.altPhoneNumber ?? '-',
                  email: response.email,
                  gender: response.gender,
                  genderView: toPascal(response.gender),
                  city: response.city,
                  cityView: !response.city || response.city === '' ? '-' : response.city,
                  area: response.area,
                  areaView: !response.area || response.area === '' ? '-' : response.area,
                  course: response.course,
                  courseView: response.course ?? '-',
                  footFall: response.footFall,
                  finalConversion:
                    FinalConversionStatus[
                    response.finalConversion as keyof typeof FinalConversionStatus
                    ] ?? response.finalConversion,
                  assignedTo: response.assignedTo,
                  assignedToName: assignedToName,
                  followUpCount: response.followUpCount,
                  schoolName: response.schoolName,
                  degree: response.degree,
                  remarks: response.remarks || newData.yellowLeads[leadIndex].remarks,
                  remarksView:
                    response.remarks && response.remarks.length > 0
                      ? response.remarks[response.remarks.length - 1]
                      : newData.yellowLeads[leadIndex].remarksView,
                  nextDueDate: response.nextDueDate,
                  nextDueDateView: response.nextDueDate
                    ? formatDateView(response.nextDueDate)
                    : '-',
                  leadTypeModifiedDate:
                    response.leadTypeModifiedDate ??
                    newData.yellowLeads[leadIndex].leadTypeModifiedDate,
                  leadTypeModifiedDateView:
                    formatTimeStampView(response.leadTypeModifiedDate) ??
                    newData.yellowLeads[leadIndex].leadTypeModifiedDateView,

                  updatedAt: response.updatedAt ?? 'N/A'
                };
              }

              return newData;
            });
          });
        };

        updateLeadCache();
        queryClient.invalidateQueries({ queryKey: ['leadsAnalytics'] });

        setOriginalData(formData);
        // setRefreshKey((prev: number) => prev + 1);
        setSelectedRowId(null);
        setIsDrawerOpen(false);
        // toggleIsEditing(false);
        setErrors({});
      } else {
        setFormData(originalData);
      }
    } catch (err) {
      console.log(err);
      console.error('Error updating lead:', err);
      toast.error('An error occurred while updating the lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) return <div>Loading...</div>;

  // Render read-only view
  const ReadOnlyView = (
    <>
      <div className="flex flex-col gap-6 text-sm">
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">LTC Date</p>
          <p>{formData.leadTypeModifiedDate ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Name</p>
          <p>{formData.name ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Phone number</p>
          <p>{formData.phoneNumber ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Alt number</p>
          <p>{formData.altPhoneNumber ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Email</p>
          <p>{formData.email ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Gender</p>
          <p>{toPascal(formData.gender) ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Area</p>
          <p>{formData.area ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">City</p>
          <p>{formData.city ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Course</p>
          <p>{formData.course ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Footfall</p>
          {formData.footFall != undefined ? (
            <FootFallTag
              status={formData.footFall === true ? FootFallStatus.true : FootFallStatus.false}
            />
          ) : (
            <p>-</p>
          )}
        </div>
        {hasRole(UserRoles.LEAD_MARKETING) && (
          <div className="flex gap-2">
            <p className="w-1/4 text-[#666666]">Assigned To</p>
            <p>
              {assignedToDropdownData.find((user: any) => user._id === formData.assignedTo)?.name ??
                '-'}
            </p>
          </div>
        )}
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Follow-ups</p>
          <p>{formData.followUpCount ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4.5 text-[#666666]">Lead Type</p>
          {formData.finalConversion ? (
            <FinalConversionTag status={formData.finalConversion as FinalConversionStatus} />
          ) : (
            <p>-</p>
          )}
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Remarks</p>
          <p>{formData.remarks ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Next Due Date</p>
          <p>{formData.nextDueDate ?? '-'}</p>
        </div>
      </div>
    </>
  );

  const inputStyle = 'rounded-[5px] font-medium';

  // Render edit view
  const EditView = (
    <>
      <div className="flex flex-row gap-5 items-center">
        <div className="flex flex-col gap-2 w-1/2">
          <EditLabel htmlFor="ltcDate" title={'LTC Date'} />
          <p className="h-9 font-medium">{formatTimeStampView(data.leadTypeModifiedDate)}</p>
        </div>

        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="name" title={'Name'} />
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={inputStyle}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
      </div>

      <div className="flex gap-5">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="phoneNumber" title={'Phone number'} />
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            className={`${inputStyle} ${errors.phoneNumber ? 'border-red-500' : ''}`}
          />
          {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="altPhoneNumber" title={'Alt Phone number'} />
          <Input
            id="altPhoneNumber"
            name="altPhoneNumber"
            value={formData.altPhoneNumber || ''}
            onChange={handleChange}
            className={`${inputStyle} ${errors.altPhoneNumber ? 'border-red-500' : ''}`}
          />
          {errors.altPhoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.altPhoneNumber}</p>
          )}
        </div>
      </div>

      <div className="flex gap-5 w-full">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="email" title={'Email'} />
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`${inputStyle} ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="gender" title={'Gender'} />
          <Select
            defaultValue={formData.gender}
            onValueChange={(value) => handleSelectChange('gender', value)}
          >
            <SelectTrigger id="gender" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Gender).map((gender) => (
                <SelectItem key={gender} value={gender}>
                  <span className="font-medium">{toPascal(gender)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-5 w-full">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="area" title={'Area'} />
          <Input
            id="area"
            name="area"
            type="area"
            value={formData.area || ''}
            onChange={handleChange}
            className={inputStyle}
          />
          {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
        </div>

        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="city" title={'City'} />
          <MultiSelectCustomDropdown
            form={formData}
            name="city"
            options={Object.values(cityDropdownData).map((city) => ({ _id: city, name: city }))}
            placeholder="Select city"
            allowCustomInput={true}
            onChange={(value) => {
              setFormData((prev) => (prev ? { ...prev, city: value } : null));
              validateField('city', value);
            }}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
      </div>

      <div className="flex gap-5">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="course" title={'Course'} />
          <MultiSelectCustomDropdown
            form={formData}
            name="course"
            options={Object.values(fixCourses).map((course) => ({ _id: course, name: course }))}
            placeholder="Select course"
            allowCustomInput={true}
            onChange={(value) => {
              setFormData((prev) => (prev ? { ...prev, course: value } : null));
              validateField('course', value);
            }}
          />
          {errors.course && <p className="text-red-500 text-xs mt-1">{errors.course}</p>}
        </div>

        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="footFall" title={'Footfall'} />
          <Select
            defaultValue={formData.footFall ? 'true' : 'false'}
            onValueChange={(value) => handleSelectChange('footFall', value === 'true')}
          >
            <SelectTrigger id="footFall" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select Foot Fall" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FootFallStatus).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <FootFallTag status={label} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="nextDueDate" title={'Next Due Date'} />
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left pl-20">
                <CalendarIcon className="left-3 h-5 w-5 text-gray-400" />
                {formData.nextDueDate || 'Select a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                disabled={(date) => isBefore(date, startOfDay(new Date()))}
                selected={parseDateString(formData.nextDueDate)}
                onSelect={handleDateChange}
                initialFocus
                captionLayout={'dropdown-buttons'}
                fromYear={new Date().getFullYear() - 100}
                toYear={new Date().getFullYear() + 10}
              />
            </PopoverContent>
          </Popover>
          {errors.nextDueDate && <p className="text-red-500 text-xs mt-1">{errors.nextDueDate}</p>}
        </div>

        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="followUpCount" title={'Follow-ups'} />
          <Select
            defaultValue={formData.followUpCount?.toString() || ''}
            onValueChange={(value) => handleFollowUpCountChange('followUpCount', Number(value))}
          >
            <SelectTrigger id="followUpCount" className="w-full">
              <SelectValue placeholder="Select follow-up count" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: formData.followUpCount + 2 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  <span className="font-medium">{i.toString().padStart(2, '0')}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="degree" title={'Degree'} />
          <Input
            id="degree"
            name="degree"
            value={formData.degree || ''}
            onChange={handleChange}
            className={inputStyle}
          />
          {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree}</p>}
        </div>
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="finalConversion" title={'Lead Type'} />
          <Select
            // disabled={!formData.footFall}
            defaultValue={String(formData.finalConversion) as FinalConversionStatus}
            onValueChange={(value) => handleSelectChange('finalConversion', value)}
          >
            <SelectTrigger id="finalConversion" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select Lead Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(FinalConversionStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  <FinalConversionTag status={status} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 ">
        <EditLabel htmlFor="schoolName" title={'School/College Name'} />
        <Input
          id="schoolName"
          name="schoolName"
          value={formData.schoolName || ''}
          onChange={handleChange}
          className={inputStyle}
        />
        {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName}</p>}
      </div>
      {/* Remarks Section */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <EditLabel htmlFor="remarks" title={'Remarks'} />
        <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-[5px]">
          <div className="bg-blue-100 px-3 py-1 rounded-md text-sm text-blue-600 min-w-24 flex justify-center h-7">
            Remark {(formData.remarks?.length ?? 0) + 1}:
          </div>
          <Input
            placeholder="Add your remarks"
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
            className="rounded-md flex-1 border-none px-2 shadow-none font-medium"
          />
        </div>
        {formData.remarks && formData.remarks.length > 0 ? (
          [...formData.remarks].reverse().map((remark, reversedIndex) => {
            const actualIndex = formData.remarks.length - 1 - reversedIndex;
            return (
              <div
                className="flex items-center gap-2 p-2 border border-gray-300 rounded-[5px]"
                key={actualIndex}
              >
                <div className="bg-blue-100 px-3 py-1 rounded-md text-sm text-blue-600 min-w-24 flex justify-center h-7">
                  Remark {actualIndex + 1}:
                </div>
                <Input
                  placeholder="Add your remarks"
                  value={formData.remarks[actualIndex] || ''}
                  onChange={(e) => handleExistingRemarkChange(actualIndex, e.target.value)}
                  className="rounded-md flex-1 border-none px-2 shadow-none font-medium"
                />
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 italic">No remarks added yet</p>
        )}
      </div>

      <div className='flex gap-5'>
        {hasRole(UserRoles.LEAD_MARKETING) && (
          <div className="space-y-2 w-full flex-1">
            <EditLabel htmlFor="assignedTo" title="Assigned To" />
            <p className="font-medium">{formData.assignedTo
              ? assignedToDropdownData.find((item) => item._id == formData.assignedTo)?.name || 'Not Provided'
              : 'Not Provided'
            }</p>
          </div>
        )}
        <div className='flex-1 space-y-2'>
          <EditLabel className="text-[#666666]" title="Source" />
          <p className="font-medium">{formData.source ?? 'Not Provided'}</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="w-full h-full max-w-2xl mx-auto border-none flex flex-col">
      <CardContent className="px-3 space-y-6 mb-20">{EditView}</CardContent>

      <CardFooter className="flex w-[439px] justify-end gap-2 fixed bottom-0 right-0 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] px-[10px] py-[12px] bg-white">
        <>
          <Button
            variant="outline"
            onClick={() => {
              setFormData(originalData);
              setSelectedRowId(null);
              setIsDrawerOpen(false);
              // toggleIsEditing(false);
              setErrors({});
              setChangedFields(new Set());
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || Object.keys(errors).length > 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              'Save Lead'
            )}
          </Button>
        </>
      </CardFooter>
    </div>
  );
}

function EditLabel({ htmlFor, title }: any) {
  return (
    <>
      <Label htmlFor={htmlFor} className="font-normal text-[#666666]">
        {title}
      </Label>
    </>
  );
}
