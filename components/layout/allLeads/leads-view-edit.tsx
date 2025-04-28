import { useEffect, useState } from 'react';
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
import { CalendarIcon, Loader2, Pencil } from 'lucide-react';
import { Course, CourseNameMapper, Gender, LeadType, Locations, UserRoles } from '@/types/enum';
import TechnoLeadTypeTag from '@/components/custom-ui/lead-type-tag/techno-lead-type-tag';
import { apiRequest } from '@/lib/apiClient';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { Calendar } from '@/components/ui/calendar';
import { parse, format, isValid } from 'date-fns';
import { toast } from 'sonner';
import { removeNullValues, toPascal } from '@/lib/utils';
import { updateLeadRequestSchema } from './validators';
import z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchAssignedToDropdown } from './helpers/fetch-data';
import {
  cityDropdown,
  fixCityDropdown,
  fixCourseDropdown
} from '../admin-tracker/helpers/fetch-data';
import { formatDateView, formatTimeStampView } from './helpers/refine-data';
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
  email: string;
  gender: string;
  area: string;
  city: string;
  course?: string;
  assignedTo: string[];
  schoolName?: string;
  leadsFollowUpCount?: number;
  leadType?: string;
  remarks?: string;
  nextDueDate?: string;
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
  remarks?: string;
  city?: string;
}

export default function LeadViewEdit({
  data,
  setIsDrawerOpen,
  setSelectedRowId,
  setRefreshKey
}: any) {
  const [formData, setFormData] = useState<LeadData | null>(null);
  const [originalData, setOriginalData] = useState<LeadData | null>(null);
  // const [isEditing, toggleIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { hasRole } = useAuthStore();

  useEffect(() => {
    if (data) {
      setFormData(data);
      setOriginalData(data);
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

  const validateField = (name: string, value: any) => {
    if (!formData) return;

    try {
      let tempData = { ...formData, [name]: value };

      tempData = removeNullValues(tempData);
      console.log(tempData);
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
        leadsFollowUpCount: tempData.leadsFollowUpCount,
        remarks: tempData.remarks,
        nextDueDate: tempData.nextDueDate,
        assignedTo: tempData.assignedTo,
        leadTypeModifiedDate: tempData.leadTypeModifiedDate
      };

      validationData = removeNullValues(validationData);
      console.log('Validation Data', validationData);

      const response = updateLeadRequestSchema.parse(validationData);

      setErrors((prevErrors: any) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      console.log(error);
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

  const handleSelectChange = (name: string, value: string | string[]) => {
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

    const allowedFields = [
      'name',
      'phoneNumber',
      'altPhoneNumber',
      'email',
      'gender',
      'area',
      'city',
      'course',
      'leadType',
      'schoolName',
      'assignedTo',
      'leadsFollowUpCount',
      'remarks',
      'nextDueDate'
    ];

    return allowedFields.some((field) => {
      const origValue = originalData[field] || '';
      const newValue = formData[field] || '';
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
        'course',
        'leadType',
        'schoolName',
        'assignedTo',
        'leadsFollowUpCount',
        'remarks',
        'nextDueDate'
      ];

      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => allowedFields.includes(key))
      );

      let { leadTypeModifiedDate, ...toBeUpdatedData } = filteredData;
      toBeUpdatedData = removeNullValues(toBeUpdatedData);
      const validation = updateLeadRequestSchema.safeParse(toBeUpdatedData);
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

      const response: LeadData | null = await apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateLead,
        toBeUpdatedData
      );
      if (response) {
        toast.success('Updated Lead Successfully');
        setFormData(response);
        setOriginalData(formData);
      } else {
        setFormData(originalData);
      }
      setSelectedRowId(null);
      setRefreshKey((prev: number) => prev + 1);
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
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Assigned To</p>
          <p>
            {assignedToDropdownData.find((user: any) => user._id === formData.assignedTo)?.name ??
              '-'}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Follow-ups</p>
          <p>{formData.leadsFollowUpCount ?? '-'}</p>
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
          <p>{formData.leadTypeModifiedDate ?? '-'}</p>
        </div>
      </div>
    </>
  );

  const EditView = (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-[#666666] font-normal">Date</p>
        <p>{formatDateView(data.date)}</p>
      </div>

      <div className="space-y-2">
        <EditLabel htmlFor="name" title={'Name'} />
        <Input
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          className="rounded-[5px]"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div className="flex gap-5">
        <div className="space-y-2">
          <EditLabel htmlFor="phoneNumber" title={'Phone number'} />
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleChange}
            className="rounded-[5px]"
          />
          {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
        </div>

        <div className="space-y-2">
          <EditLabel htmlFor="altPhoneNumber" title={'Alt Phone number'} />
          <Input
            id="altPhoneNumber"
            name="altPhoneNumber"
            value={formData.altPhoneNumber || ''}
            onChange={handleChange}
            className="rounded-[5px]"
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
            className="rounded-[5px]"
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
                  {toPascal(gender)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-5 h-max w-full items-end">
        <div className="space-y-2 flex-1">
          <EditLabel htmlFor="area" title={'Area'} />
          <Input
            id="area"
            name="area"
            type="area"
            value={formData.area || ''}
            onChange={handleChange}
            className="rounded-[5px] w-full"
          />
          {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
        </div>

        <div className="space-y-2 flex-1">
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
            disabled={formData.leadType == LeadType.INTERESTED}
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
          <EditLabel htmlFor="leadsFollowUpCount" title={'Follow-up Count'} />
          <Select
            defaultValue={formData.leadsFollowUpCount?.toString() || ''}
            onValueChange={(value) =>
              handleFollowUpCountChange('leadsFollowUpCount', Number(value))
            }
          >
            <SelectTrigger id="leadsFollowUpCount" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select follow-up count" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: formData?.leadsFollowUpCount! + 2 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <EditLabel htmlFor="schoolName" title={'School Name'} />
        <Input
          id="schoolName"
          name="schoolName"
          value={formData.schoolName || ''}
          onChange={handleChange}
          className="rounded-[5px]"
        />
        {errors.schoolName && <p className="text-red-500 text-xs mt-1">{errors.schoolName}</p>}
      </div>

      <div className="space-y-2">
        <EditLabel htmlFor="remarks" title={'Remarks'} />
        <textarea
          id="remarks"
          name="remarks"
          value={formData.remarks || ''}
          onChange={handleChange}
          className="w-full min-h-20 px-3 py-2 border rounded-[5px]"
          placeholder="Enter remarks here"
        />
      </div>

      <div className="space-y-2 w-full">
        <EditLabel htmlFor="assignedTo" title="Assigned To" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              disabled={!hasRole(UserRoles.LEAD_MARKETING)}
              className={cn(
                'w-full justify-between rounded-[5px] min-h-10',
                !formData.assignedTo?.length && 'text-muted-foreground'
              )}
            >
              <div className="flex gap-1 flex-wrap overflow-hidden max-w-[calc(100%-30px)]">
                {formData.assignedTo?.length > 0 ? (
                  assignedToDropdownData
                    .filter((user) => formData.assignedTo.includes(user._id))
                    .map((user) => (
                      <div
                        key={user._id}
                        className="inline-flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Badge variant="secondary" className="mb-0.5 max-w-full truncate pr-1">
                          <span className="truncate">{user.name}</span>
                          <span
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleSelectChange(
                                  'assignedTo',
                                  formData.assignedTo.filter((id) => id !== user._id)
                                );
                              }
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              handleSelectChange(
                                'assignedTo',
                                formData.assignedTo.filter((id) => id !== user._id)
                              );
                            }}
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          >
                            <X className="h-3 w-3" />
                          </span>
                        </Badge>
                      </div>
                    ))
                ) : (
                  <span className="truncate">Select Assigned To</span>
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command shouldFilter={true}>
              <CommandInput placeholder="Search users..." />
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                <ScrollArea className="h-48">
                  {assignedToDropdownData.map((user: { _id: string; name: string }) => (
                    <CommandItem
                      key={user._id}
                      value={`${user.name}${user._id}`}
                      onSelect={() => {
                        const currentAssigned = formData.assignedTo || [];
                        const newAssigned = currentAssigned.includes(user._id)
                          ? currentAssigned.filter((id) => id !== user._id)
                          : [...currentAssigned, user._id];
                        handleSelectChange('assignedTo', newAssigned);
                      }}
                      className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                      data-user-id={user._id}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          formData.assignedTo?.includes(user._id) ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className="truncate">{user.name}</span>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[#666666]">Last Modified Date</p>
        <p>{formatTimeStampView(formData.leadTypeModifiedDate)}</p>
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
    <Label htmlFor={htmlFor} className="font-normal text-[#666666]">
      {title}
    </Label>
  );
}
