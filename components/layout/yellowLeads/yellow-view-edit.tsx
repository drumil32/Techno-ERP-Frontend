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
import { Course, CourseNameMapper, Gender, Locations } from '@/static/enum';
import { apiRequest } from '@/lib/apiClient';
import { API_METHODS } from '@/common/constants/apiMethods';
import { API_ENDPOINTS } from '@/common/constants/apiEndpoints';
import { YellowLead } from '@/components/custom-ui/yellow-leads/interfaces';
import CampusVisitTag, { CampusVisitStatus } from './campus-visit-tag';
import FinalConversionTag, { FinalConversionStatus, toPascal } from './final-conversion-tag';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { parse, format, isValid } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';

import z from 'zod';

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  altPhoneNumber?: string;
  email?: string;
  nextDueDate?: string;
}

// Define schema for validation - only validate fields that are provided
const updateLeadRequestSchema = z.object({
  _id: z.string(),
  name: z.string().min(3, "Name must be at least 3 characters").optional(),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits").optional(),
  altPhoneNumber: z.string().regex(/^\d{10}$/, "Alt phone number must be 10 digits").optional().or(z.literal('')),
  email: z.string().email("Invalid email format").optional(),
  gender: z.string().optional(),
  location: z.string().optional(),
  course: z.string().optional(),
  campusVisit: z.string().optional(),
  finalConversion: z.string().optional(),
  remarks: z.string().optional(),
  nextDueDate: z.string().optional()
}).strict();

export default function YellowLeadViewEdit({ data }:  any) {
  const [formData, setFormData] = useState<YellowLead | null>(null);
  const [originalData, setOriginalData] = useState<YellowLead | null>(null);
  const [isEditing, toggleIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data) {
      setFormData(data);
      setOriginalData(data);
    }
  }, [data]);

  const validateField = (name: string, value: any) => {
    if (!formData) return;

    // Only validate fields that have been changed
    if (value === originalData?.[name as keyof YellowLead]) {
      // If value is the same as original, remove from changedFields and clear error
      setChangedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(name);
        return newSet;
      });
      
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
      
      return;
    }

    // Add to changedFields if it's different from original
    setChangedFields(prev => {
      const newSet = new Set(prev);
      newSet.add(name);
      return newSet;
    });

    try {
      // Only validate the specific field
      if (name === 'name' && value) {
        updateLeadRequestSchema.shape.name.parse(value);
      } else if (name === 'phoneNumber' && value) {
        updateLeadRequestSchema.shape.phoneNumber.parse(value);
      } else if (name === 'altPhoneNumber') {
        // Special case for altPhoneNumber which can be empty
        if (value) {
          updateLeadRequestSchema.shape.altPhoneNumber.parse(value);
        }
      } else if (name === 'email' && value) {
        updateLeadRequestSchema.shape.email.parse(value);
      }
      
      // Clear error for this field if validation passes
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(e => e.path.includes(name));
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [name]: fieldError.message
          }));
        }
      }
    }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
    validateField(name, value);
  };

  const handleSelectChange = (name: string, value: string) => {
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

  const handleSubmit = async () => {
    if (!formData) return;

    setIsSubmitting(true);
    try {
      const allowedFields = [
        '_id',
        'name',
        'phoneNumber',
        'altPhoneNumber',
        'email',
        'gender',
        'location',
        'course',
        'campusVisit',
        'finalConversion',
        'remarks',
        'nextDueDate'
      ];

      const updateData: Record<string, any> = { _id: formData._id };
      
      changedFields.forEach(field => {
        if (allowedFields.includes(field)) {
          updateData[field] = formData[field as keyof YellowLead];
        }
      });

      
      if (changedFields.has('campusVisit')) {
        updateData.campusVisit = updateData.campusVisit === CampusVisitStatus.true ? true : false;
      }

      if (Object.keys(updateData).length <= 1) {
        toast.info('No changes to save');
        toggleIsEditing(false);
        return;
      }

      
      const fieldsToValidate = Object.keys(updateData);
      let hasValidationErrors = false;
      
      fieldsToValidate.forEach(field => {
        try {
          if (field === 'name' && updateData.name) {
            updateLeadRequestSchema.shape.name.parse(updateData.name);
          } else if (field === 'phoneNumber' && updateData.phoneNumber) {
            updateLeadRequestSchema.shape.phoneNumber.parse(updateData.phoneNumber);
          } else if (field === 'altPhoneNumber') {
            if (updateData.altPhoneNumber) {
              updateLeadRequestSchema.shape.altPhoneNumber.parse(updateData.altPhoneNumber);
            }
          } else if (field === 'email' && updateData.email) {
            updateLeadRequestSchema.shape.email.parse(updateData.email);
          }
        } catch (error) {
          if (error instanceof z.ZodError) {
            const fieldError = error.errors.find(e => e.path.includes(field));
            if (fieldError) {
              setErrors(prev => ({
                ...prev,
                [field]: fieldError.message
              }));
              hasValidationErrors = true;
            }
          }
        }
      });

      if (hasValidationErrors) {
        toast.error('Please fix the errors in the form');
        return;
      }

      const response = await apiRequest(
        API_METHODS.PUT,
        API_ENDPOINTS.updateYellowLead,
        updateData
      );

      if (response) {
        toast.success('Updated Yellow Lead Successfully');
        // Update the original data with new values
        setOriginalData(formData);
        // Clear the changed fields
        setChangedFields(new Set());
      } else {
        // Revert to original data if update fails
        setFormData(originalData);
        toast.error('Failed to update lead');
      }
      
      toggleIsEditing(false);
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
          <p>{formData.ltcDate ?? '-'}</p>
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
          <p className="w-1/4 text-[#666666]">Location</p>
          <p>{formData.location ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Course</p>
          <p>{formData.course ? CourseNameMapper[formData.course as Course] : '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Campus Visit</p>
          {formData.campusVisit ? <CampusVisitTag status={String(formData.campusVisit) as CampusVisitStatus} /> : <p>-</p>}
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Final Conversion</p>
          {formData.finalConversion ? <FinalConversionTag status={formData.finalConversion as FinalConversionStatus} /> : <p>-</p>}
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Remarks</p>
          <p>{formData.remarks ?? '-'}</p>
        </div>
        <div className="flex gap-2">
          <p className="w-1/4 text-[#666666]">Next Call Date</p>
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
        <p>{data.ltcDate}</p>
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
          {errors.altPhoneNumber && <p className="text-red-500 text-xs mt-1">{errors.altPhoneNumber}</p>}
        </div>
      </div>

      <div className="space-y-2">
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

      <div className="flex gap-5 w-full">
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
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="location" title={'Location'} />
          <Select
            defaultValue={formData.location}
            onValueChange={(value) => handleSelectChange('location', value)}
          >
            <SelectTrigger id="location" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Locations).map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-5">
        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="course" title={'Course'} />
          <Select
            defaultValue={formData.course || ''}
            onValueChange={(value) => handleSelectChange('course', value)}
          >
            <SelectTrigger id="course" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Course).map((course) => (
                <SelectItem key={course} value={course}>
                  {CourseNameMapper[course as Course]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-1/2">
          <EditLabel htmlFor="campusVisit" title={'Campus Visit'} />
          <Select
            defaultValue={String(formData.campusVisit) || CampusVisitStatus.false}
            onValueChange={(value) => handleSelectChange('campusVisit', value)}
          >
            <SelectTrigger id="campusVisit" className="w-full rounded-[5px]">
              <SelectValue placeholder="Select Campus Visit" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CampusVisitStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  <CampusVisitTag status={status} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <EditLabel htmlFor="finalConversion" title={'Final Conversion'} />
        <Select
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
            />
          </PopoverContent>
        </Popover>
        {errors.nextDueDate && <p className="text-red-500 text-xs mt-1">{errors.nextDueDate}</p>}
      </div>
    </>
  );

  return (
    <div className="w-full h-full max-w-2xl mx-auto border-none flex flex-col">
      <CardContent className="px-3 space-y-6 mb-20">
        {isEditing ? EditView : ReadOnlyView}
      </CardContent>

      {isEditing ? (
        <CardFooter className="flex w-[439px] justify-end gap-2 fixed bottom-0 right-0 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] px-[10px] py-[12px] bg-white">
          <>
            <Button
              variant="outline"
              onClick={() => {
                setFormData(originalData);
                toggleIsEditing(false);
                setErrors({});
                setChangedFields(new Set());
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || Object.keys(errors).length > 0}
            >
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
      ) : (
        <CardFooter className="flex w-[439px] justify-end gap-2 fixed bottom-0 right-0 shadow-[0px_-2px_10px_rgba(0,0,0,0.1)] px-[10px] py-[12px] bg-white">
          <div className="w-full flex">
            <Button onClick={() => toggleIsEditing(true)} className="ml-auto" icon={Pencil}>
              Edit Lead
            </Button>
          </div>
        </CardFooter>
      )}
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