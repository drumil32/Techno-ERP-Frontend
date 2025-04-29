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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Course, Gender, Locations, UserRoles } from '@/types/enum';
import { apiRequest } from '@/lib/apiClient';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { parse, format, isValid } from 'date-fns';
import { toast } from 'sonner';
import z, { boolean } from 'zod';
import { YellowLead } from '@/components/custom-ui/yellow-leads/interfaces';
import { FootFallStatus } from './foot-fall-tag';
import FinalConversionTag, { FinalConversionStatus } from './final-conversion-tag';
import FootFallTag from './foot-fall-tag';
import { yellowLeadUpdateSchema } from '../allLeads/validators';
import { fetchAssignedToDropdown } from './helpers/fetch-data';
import { useQuery } from '@tanstack/react-query';
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
  const [formData, setFormData] = useState<YellowLead | null>(null);
  const [originalData, setOriginalData] = useState<YellowLead | null>(null);
  // const [isEditing, toggleIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());
  const { hasRole } = useAuthStore();
  useEffect(() => {
    if (data) {
      setFormData(data);
      setOriginalData(data);
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
        yellowLeadsFollowUpCount: tempData.yellowLeadsFollowUpCount,
        remarks: tempData.remarks,
        nextDueDate: tempData.nextDueDate
      };
      validationData = removeNullValues(validationData);
      const response = yellowLeadUpdateSchema.parse(validationData);

      console.log(errors);
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
      'yellowLeadsFollowUpCount',
      'schoolName',
      'remarks',
      'nextDueDate',
      'leadTypeModifiedDate'
    ];

    return allowedFields.some((field: any) => {
      const origValue = originalData[field] || '';
      const newValue = formData[field] || '';
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
        'assignedTo',
        'finalConversion',
        'yellowLeadsFollowUpCount',
        'remarks',
        'nextDueDate',
        'leadTypeModifiedDate'
      ];

      let filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => allowedFields.includes(key))
      );
      filteredData = removeNullValues(filteredData);
      const validation = yellowLeadUpdateSchema.safeParse(filteredData);
      console.log(filteredData);
      console.log(validation);
      if (!validation.success) {
        const newErrors: FormErrors = {};
        validation.error.errors.forEach((err) => {
          const key = err.path[0] as keyof FormErrors;
          newErrors[key] = err.message;
        });
        setErrors(newErrors);
        console.log(errors);
        toast.error('Please fix the errors in the form');
        return;
      }

      const { leadTypeModifiedDate, ...toBeUpdatedData } = filteredData;

      const response: YellowLead | null = await apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateYellowLead,
        toBeUpdatedData
      );

      if (response) {
        // response.footFall =formData.footFall;
        setFormData(response as YellowLead);
        toast.success('Updated Lead Successfully');
        setOriginalData(formData);
      } else {
        setFormData(originalData);
      }
      setRefreshKey((prev: number) => prev + 1);
      setSelectedRowId(null);
      setIsDrawerOpen(false);
      // toggleIsEditing(false);
      setErrors({});
    } catch (err) {
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
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Assigned To</p>
          <p>
            {assignedToDropdownData.find((user: any) => user._id === formData.assignedTo)?.name ??
              '-'}
          </p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Follow-ups</p>
          <p>{formData.yellowLeadsFollowUpCount ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4.5 text-[#666666]">Final Conversion</p>
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

  // Render edit view
  const EditView = (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-[#666666] font-normal">LTC Date</p>
        <p>{formatTimeStampView(data.leadTypeModifiedDate)}</p>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
            className={`rounded-[5px] ${errors.phoneNumber ? 'border-red-500' : ''}`}
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
            className={`rounded-[5px] ${errors.altPhoneNumber ? 'border-red-500' : ''}`}
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
            className={`rounded-[5px] ${errors.email ? 'border-red-500' : ''}`}
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

      <div className="flex gap-5 w-full">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="area" title={'Area'} />
          <Input
            id="area"
            name="area"
            type="area"
            value={formData.area || ''}
            onChange={handleChange}
            className="rounded-[5px]"
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
          <EditLabel htmlFor="nextDueDate" title={'Next Call Date'} />
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
          <EditLabel htmlFor="yellowLeadsFollowUpCount" title={'Follow-ups'} />
          <Select
            defaultValue={formData.yellowLeadsFollowUpCount?.toString() || ''}
            onValueChange={(value) =>
              handleFollowUpCountChange('yellowLeadsFollowUpCount', Number(value))
            }
          >
            <SelectTrigger id="yellowLeadsFollowUpCount" className="w-full">
              <SelectValue placeholder="Select follow-up count" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: formData.yellowLeadsFollowUpCount + 2 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i.toString().padStart(2, '0')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-5">
        <div className="space-y-2 w-1/2">
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
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="finalConversion" title={'Final Conversion'} />
          <Select
            disabled={!formData.footFall}
            defaultValue={String(formData.finalConversion) as FinalConversionStatus}
            onValueChange={(value) => handleSelectChange('finalConversion', value)}
          >
            <SelectTrigger id="finalConversion" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select Final Conversion Type" />
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
              disabled={!hasRole(UserRoles.LEAD_MARKETING || UserRoles.ADMIN)}
              role="combobox"
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
