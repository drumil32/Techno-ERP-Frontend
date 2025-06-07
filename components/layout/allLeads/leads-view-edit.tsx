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
import { CalendarIcon, Edit, Loader2, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { Course, CourseNameMapper, Gender, LeadType, Locations, UserRoles } from '@/types/enum';
import TechnoLeadTypeTag from '@/components/custom-ui/lead-type-tag/techno-lead-type-tag';
import { apiRequest } from '@/lib/apiClient';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { Calendar } from '@/components/ui/calendar';
import { parse, format, isValid, isBefore, startOfDay } from 'date-fns';
import { toast } from 'sonner';
import { removeNullValues, toPascal } from '@/lib/utils';
import { updateLeadRequestSchema } from './validators';
import z from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAssignedToDropdown } from './helpers/fetch-data';
import {
  cityDropdown,
  fixCityDropdown,
  fixCourseDropdown
} from '../admin-tracker/helpers/fetch-data';
import { convertDdmmyyyyToDate, formatDateView, formatTimeStampView } from './helpers/refine-data';
import { MultiSelectCustomDropdown } from '@/components/custom-ui/common/multi-select-custom-editable';
import { cleanDataForDraft } from '@/components/custom-ui/enquiry-form/stage-2/helpers/refine-data';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import useAuthStore from '@/stores/auth-store';

export interface LeadData {
  _id: string;
  name: string;
  phoneNumber: string;
  altPhoneNumber?: string;
  date: string;
  email: string;
  gender: string;
  area: string;
  city: string;
  course?: string;
  assignedTo: string[];
  schoolName?: string;
  degree?: string;
  followUpCount?: number;
  leadType?: string;
  remarks: string[];
  nextDueDate?: string;
  lastCallDate?: string;
  [key: string]: any;
}

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  altPhoneNumber?: string;
  course?: string;
  email?: string;
  area?: string;
  nextDueDate?: string;
  schoolName?: string;
  degree?: string;
  remarks?: string;
  city?: string;
  date?: string;
}

export default function LeadViewEdit({
  data,
  setIsDrawerOpen,
  setSelectedRowId,
  setRefreshKey,
  setLeadData
}: any) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<LeadData | null>(null);
  const [originalData, setOriginalData] = useState<LeadData | null>(null);
  // const [isEditing, toggleIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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

  const fixCityDropdownQuery = useQuery({
    queryKey: ['cities'],
    queryFn: fixCityDropdown
  });
  const fixCityDropdownData = Array.isArray(fixCityDropdownQuery.data)
    ? fixCityDropdownQuery.data
    : [];
  const fixCourseQuery = useQuery({
    queryKey: ['courses'],
    queryFn: fixCourseDropdown
  });
  const fixCourses = Array.isArray(fixCourseQuery.data) ? fixCourseQuery.data : [];

  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const isLoading = fixCityDropdownQuery.isLoading || fixCourseQuery.isLoading;
    const hasError = fixCityDropdownQuery.isError || fixCourseQuery.isError;
    const isSuccess = fixCityDropdownQuery.isSuccess && fixCourseQuery.isSuccess;
    const isFetching = fixCityDropdownQuery.isFetching || fixCourseQuery.isFetching;

    if (toastIdRef.current) {
      if (isLoading || isFetching) {
        toast.loading('Loading data...', { id: toastIdRef.current, duration: Infinity });
      }
      if (hasError) {
        toast.error('Failed to load data', { id: toastIdRef.current, duration: 3000 });
        setTimeout(() => {
          toastIdRef.current = null;
        }, 3000);
      }
      if (isSuccess) {
        toast.success('Data loaded successfully', { id: toastIdRef.current!, duration: 3000 });
        toastIdRef.current = null;
      }
    } else if (hasError) {
      toastIdRef.current = toast.error('Failed to load data', { duration: 3000 });
    } else if (isLoading || isFetching) {
      toastIdRef.current = toast.loading('Loading data...', { duration: Infinity });
    }

    return () => {
      if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    };
  }, [
    fixCityDropdownQuery.isLoading,
    fixCityDropdownQuery.isError,
    fixCityDropdownQuery.isSuccess,
    fixCityDropdownQuery.isFetching,
    fixCourseQuery.isLoading,
    fixCourseQuery.isError,
    fixCourseQuery.isSuccess,
    fixCourseQuery.isFetching
  ]);

  const validateField = (name: string, value: any) => {
    if (!formData) return;

    try {
      let tempData = { ...formData, [name]: value };
      tempData = removeNullValues(tempData);
      let validationData = {
        _id: tempData._id,
        date: tempData.date,
        name: tempData.name,
        phoneNumber: tempData.phoneNumber,
        altPhoneNumber: tempData.altPhoneNumber,
        email: tempData.email,
        gender: tempData.gender,
        area: tempData.area,
        city: tempData.city,
        leadType: tempData.leadType,
        course: tempData.course,
        schoolName: tempData.schoolName,
        degree: tempData.degree,
        followUpCount: tempData.followUpCount,
        remarks: tempData.remarks,
        nextDueDate: tempData.nextDueDate,
        assignedTo: tempData.assignedTo
      };

      validationData = removeNullValues(validationData);

      const response = updateLeadRequestSchema.parse(validationData);

      setErrors((prevErrors: any) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Collect all field errors
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

  const assignedToDropdownData = Array.isArray(assignedToQuery.data) ? assignedToQuery.data : [];

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

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    validateField(name, value);
  };

  const handleFollowUpCountChange = (name: string, value: number) => {
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    validateField(name, value);
  };

  const handleDueDateChange = (date: Date | undefined) => {
    if (!date) return;

    const formattedDate = format(date, 'dd/MM/yyyy');
    setFormData((prev) => (prev ? { ...prev, nextDueDate: formattedDate } : null));
    validateField('nextDueDate', formattedDate);
    setIsCalendarOpen(false);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    const formattedDate = format(date, 'dd/MM/yyyy');
    setFormData((prev) => (prev ? { ...prev, date: formattedDate } : null));
    validateField('nextDueDate', formattedDate);
    setIsCalendarOpen(false);
  };

  const parseDateString = (dateString?: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      return isValid(parsedDate) ? parsedDate : undefined;
    } catch {
      return undefined;
    }
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
      'date',
      'city',
      'course',
      'leadType',
      'schoolName',
      'degree',
      'assignedTo',
      'followUpCount',
      'remarks',
      'nextDueDate'
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

    // Check if there are any changes
    if (!hasChanges()) {
      toast.info('No changes to save');
      setSelectedRowId(null);
      setIsDrawerOpen(false);
      // toggleIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const allowedFields = [
        '_id',
        'name',
        'phoneNumber',
        'altPhoneNumber',
        'email',
        'gender',
        'area',
        'city',
        'date',
        'course',
        'leadType',
        'schoolName',
        'degree',
        'assignedTo',
        'followUpCount',
        'remarks',
        'nextDueDate'
      ];

      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => allowedFields.includes(key))
      );

      if (newRemark) {
        filteredData.remarks.push(newRemark);
        setNewRemark('');
      }

      let { lastCallDate, ...toBeUpdatedData } = filteredData;
      toBeUpdatedData = removeNullValues(toBeUpdatedData);
      const validation = updateLeadRequestSchema.safeParse(toBeUpdatedData);
      if (!validation.success) {
        const newErrors: FormErrors = {};
        validation.error.errors.forEach((err) => {
          const key = err.path[0] as keyof FormErrors;
          newErrors[key] = err.message;
        });
        setErrors(newErrors);
        console.log("newErrors", newErrors)
        toast.error('Please fix the errors in the form');
        return;
      }
      delete toBeUpdatedData.assignedTo;

      const response: LeadData | null = await apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateLead,
        toBeUpdatedData
      );
      if (response) {
        toast.success('Updated Lead Successfully');
        setFormData(response);
        setOriginalData(formData);

        const updateLeadCache = () => {
          const queryCache = queryClient.getQueryCache();
          const leadQueries = queryCache.findAll({ queryKey: ['leads'] });
          leadQueries.forEach((query) => {
            queryClient.setQueryData(query.queryKey, (oldData: any) => {
              if (!oldData || !oldData.leads) return oldData;

              const newData = JSON.parse(JSON.stringify(oldData));

              const leadIndex = newData.leads.findIndex((lead: any) => lead._id === response._id);

              const assignedToUsers = Array.isArray(response.assignedTo)
                ? response.assignedTo
                  .map((id: string) =>
                    assignedToDropdownData?.find((user: any) => user._id === id)
                  )
                  .filter(Boolean)
                : assignedToDropdownData.find((user:any) => user._id === response.assignedTo);


              let assignedToName = 'N/A';
              let assignedToView = '-';

              if (assignedToUsers.length > 0 || assignedToUsers?.name) {
                assignedToName = assignedToUsers?.name || assignedToUsers[0].name ;
                assignedToView = assignedToUsers?.name || assignedToUsers[0].name;

                if (assignedToUsers.length > 1) {
                  assignedToName += ` +${assignedToUsers.length - 1}`;
                  assignedToView += ` +${assignedToUsers.length - 1}`;
                }
              }

              if (leadIndex !== -1) {
                setLeadData((prevLeads : any[]) => {
                  return prevLeads.map((lead) => {
                    if (lead.id === data.id) {
                      return {
                        ...lead,
                        name: response.name,
                        source: response.source,
                        email: response.email,
                        sourceView: response.source ?? '-',
                        schoolName: response.schoolName,
                        degree: response.degree,
                        phoneNumber: response.phoneNumber,
                        altPhoneNumber: response.altPhoneNumber,
                        altPhoneNumberView: response.altPhoneNumber ?? '-',
                        gender: response.gender,
                        genderView: toPascal(response.gender),
                        city: response.city,
                        cityView: !response.city || response.city === '' ? '-' : response.city,
                        area: response.area,
                        areaView: !response.area || response.area === '' ? '-' : response.area,
                        course: response.course,
                        courseView: response.course ?? '-',
                        assignedTo: response.assignedTo,
                        assignedToView: assignedToView,
                        assignedToName: assignedToName,
                        date: response.date,
                        // lastCallDate: response.lastCallDate,
                        nextDueDate: response.nextDueDate,
                        nextDueDateView: response.nextDueDate
                          ? formatDateView(response.nextDueDate)
                          : '-',
                        leadType: LeadType[response.leadType as keyof typeof LeadType] ?? response.leadType,
                        _leadType: response.leadType,
                        followUpCount: response.followUpCount ?? lead.followUpCount,
                        remarks: response.remarks || lead.remarks,
                        remarksView: response.remarks && response.remarks.length > 0
                          ? response.remarks.map(remark => remark).join(' | ')
                          : response.remarks,
                        lastCallDate: response.lastCallDate ?? lead.lastCallDate,
                        lastCallDateView: formatTimeStampView(response.lastCallDate) ?? lead.lastCallDateView,
                        isOlderThan7Days: response.isOlderThan7Days
                      };
                    }
                    return lead;
                  });
                });
              }
              return newData;
            });
          });
        };

        updateLeadCache();
        queryClient.invalidateQueries({ queryKey: ['leadsAnalytics'] });
      } else {
        setFormData(originalData);
      }
      setSelectedRowId(null);
      // setRefreshKey((prev: number) => prev + 1);
      setIsDrawerOpen(false);
      // toggleIsEditing(false);
      setErrors({});
    } catch (err) {
      console.error('Error updating lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) return <div>Loading...</div>;

  const ReadOnlyView = (
    <>
      <div className="flex flex-col gap-6 text-sm">
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Date</p>
          <p>{formatDateView(formData.date) ?? '-'}</p>
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
          <p className="w-1/4 text-[#666666]">Lead Type</p>
          <div>
            <TechnoLeadTypeTag type={(formData.leadType as LeadType) ?? '-'} />
          </div>
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
          <p className="w-1/4 text-[#666666]">School Name</p>
          <p>{formData.schoolName ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Remarks</p>
          <p>{formData.remarks ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Next Due Date</p>
          <p>{formData.nextDueDate ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Timestamp</p>
          <p>{formData.lastCallDate ?? '-'}</p>
        </div>
      </div>
    </>
  );

  const inputStyle = 'rounded-[5px] font-medium';

  const EditView = (
    <>
      <div className="flex gap-5 items-center">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="date" title={'Date'} />
          <Popover modal>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${inputStyle}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? (
                  typeof formData.date === 'object' ? (
                    format(formData.date, 'dd/MM/yyyy')
                  ) : (
                    formData.date
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  formData.date
                    ? typeof formData.date === 'object'
                      ? new Date(formData.date)
                      : convertDdmmyyyyToDate(formData.date)!
                    : undefined
                }
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
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
            className={inputStyle}
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
            className={inputStyle}
          />
          {errors.altPhoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.altPhoneNumber}</p>
          )}
        </div>
      </div>

      <div className="flex gap-5 w-full">
        <div className="space-y-2  w-1/2">
          <EditLabel htmlFor="email" title={'Email'} />
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={inputStyle}
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
                  <span className={inputStyle}>{toPascal(gender)}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-5 h-max w-full items-end">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="area" title={'Area'} />
          <Input
            id="area"
            name="area"
            type="area"
            value={formData.area || ''}
            onChange={handleChange}
            className={`${inputStyle} w-full`}
          />
          {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
        </div>

        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="city" title={'City'} />
          <MultiSelectCustomDropdown
            form={formData}
            name="city"
            options={Object.values(fixCityDropdownData).map((city) => ({ _id: city, name: city }))}
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
          <EditLabel htmlFor="leadType" title={'Lead Type'} />
          <Select
            disabled={formData.leadType == LeadType.ACTIVE}
            defaultValue={formData.leadType || ''}
            onValueChange={(value) => handleSelectChange('leadType', value)}
          >
            <SelectTrigger id="leadType" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select lead type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(LeadType).map((type) => (
                <SelectItem key={type} value={type}>
                  <TechnoLeadTypeTag type={type} />
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
                onSelect={handleDueDateChange}
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
          <EditLabel htmlFor="followUpCount" title={'Follow-up Count'} />
          <Select
            defaultValue={formData.followUpCount?.toString() || ''}
            onValueChange={(value) => handleFollowUpCountChange('followUpCount', Number(value))}
          >
            <SelectTrigger id="followUpCount" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select follow-up count" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: formData?.followUpCount! + 2 }, (_, i) => (
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
      </div>

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

      <div className="flex gap-5">
        {hasRole(UserRoles.LEAD_MARKETING) && (
          <div className="space-y-2 w-full flex-1">
            <EditLabel htmlFor="assignedTo" title="Assigned To" />
            <p className="font-medium">
              {formData.assignedTo
                ? assignedToDropdownData.find((item) => item._id == formData.assignedTo)?.name ||
                'Not Provided'
                : 'Not Provided'}
            </p>
          </div>
        )}
        <div className="flex-1 space-y-2">
          <EditLabel className="text-[#666666]" title="Source" />
          <p className="font-medium">{formData.source ?? 'Not Provided'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <EditLabel className="text-[#666666]" title="Last Call Date" />
        <p className="font-medium">{formatTimeStampView(formData.lastCallDate) ?? 'Not Provided'}</p>
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
    <Label htmlFor={htmlFor} className=" text-primary font-semibold">
      {title}
    </Label>
  );
}
