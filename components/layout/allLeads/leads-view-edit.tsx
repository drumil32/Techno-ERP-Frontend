import { useEffect, useState } from 'react';
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Course, Gender, Locations } from '@/static/enum';
import TechnoLeadTypeTag, { TechnoLeadType } from '@/components/custom-ui/lead-type-tag/techno-lead-type-tag';

interface LeadData {
    _id: string;
    name: string;
    phoneNumber: string;
    altPhoneNumber?: string;
    email: string;
    gender: string;
    location: string;
    course?: string;
    leadType?: string;
    remarks?: string;
    nextDueDate?: string;
    [key: string]: any;
}

export default function LeadViewEdit({ data }: { data: any }) {
    const [formData, setFormData] = useState<LeadData | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDateToInput = (dateString: string) => {
        if (!dateString || dateString === '-') return '';
        try {
            const [day, month, year] = dateString.split('/');
            return `${year}-${month}-${day}`;
        } catch {
            return '';
        }
    };

    const formatDateToDisplay = (dateString: string) => {
        if (!dateString) return '';
        try {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        } catch {
            return dateString;
        }
    };

    useEffect(() => {
        if (data) setFormData(data);
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => prev ? { ...prev, [name]: value } : null);
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = async () => {
        if (!formData) return;

        setIsSubmitting(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            // Pick only the allowed fields for submission
            const allowedFields = [
                '_id', 'name', 'phoneNumber', 'altPhoneNumber',
                'email', 'gender', 'location', 'course',
                'leadType', 'remarks', 'nextDueDate'
            ];

            const filteredData = Object.fromEntries(
                Object.entries(formData).filter(([key]) => allowedFields.includes(key))
            );

            console.log(filteredData)

            const res = await fetch(`${apiUrl}/crm/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filteredData),
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to update lead');

            setIsEditMode(false);

        } catch (err) {
            console.error('Error updating lead:', err);
        } finally {
            setIsSubmitting(false);
        }
    };
    if (!formData) return <div>Loading...</div>;

    // Render read-only view
    const ReadOnlyView = (
        <>
            <div className='flex flex-col gap-4 text-lg'>
                <div className='flex gap-2'>
                    <p>Date:</p>
                    <p>{data.date}</p>
                </div>
                <div className='flex gap-2'>
                    <p>Name:</p>
                    <p>{data.name}</p>
                </div>
                <div className='flex gap-2'>
                    <p>Phone Number:</p>
                    <p>{data.phoneNumber}</p>
                </div>
                <div className='flex gap-2'>
                    <p>Alt Number:</p>
                    <p>{data.altPhoneNumber}</p>
                </div>
                <div className='flex gap-2'>
                    <p>Email:</p>
                    <p>{data.email}</p>
                </div>
                <div className='flex gap-2'>
                    <p>Location:</p>
                    <p>{data.location}</p>
                </div>
                <div className='flex gap-2'>
                    <p>Course:</p>
                    <p>{data.course}</p>
                </div>
                <div className='flex gap-2'>
                    <p>Lead Type:</p>
                    <p>
                        <TechnoLeadTypeTag type={data.leadType} />
                    </p>
                </div>
                <div className='flex gap-2'>
                    <p>Remarks:</p>
                    <p>{data.remarks}</p>
                </div>
                <div className='flex gap-2'>
                    <p>Next Due Date:</p>
                    <p>{data.nextDueDate}</p>
                </div>
            </div>
        </>
    );

    // Render edit view
    const EditView = (
        <>

            <div className='flex gap-2'>
                <p>Date:</p>
                <p>{data.date}</p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                    defaultValue={formData.gender}
                    onValueChange={(value) => handleSelectChange("gender", value)}
                >
                    <SelectTrigger id="gender" className="w-full">
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

            <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber || ''}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="altPhoneNumber">Alternative Phone</Label>
                <Input
                    id="altPhoneNumber"
                    name="altPhoneNumber"
                    value={formData.altPhoneNumber || ''}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                    defaultValue={formData.location}
                    onValueChange={(value) => handleSelectChange("location", value)}
                >
                    <SelectTrigger id="location" className="w-full">
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



            <div className="space-y-2">
                <Label htmlFor="leadType">Lead Type</Label>
                <Select
                    defaultValue={formData.leadType || ''}
                    onValueChange={(value) => handleSelectChange("leadType", value)}
                >
                    <SelectTrigger id="leadType" className="w-full">
                        <SelectValue placeholder="Select lead type" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(TechnoLeadType).map((type) => (
                            <SelectItem key={type} value={type}>
                                <TechnoLeadTypeTag type={type} />
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select
                    defaultValue={formData.course || ''}
                    onValueChange={(value) => handleSelectChange("course", value)}
                >
                    <SelectTrigger id="course" className="w-full">
                        <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(Course).map((course) => (
                            <SelectItem key={course} value={course}>
                                {course}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <textarea
                    id="remarks"
                    name="remarks"
                    value={formData.remarks || ''}
                    onChange={handleChange}
                    className="w-full min-h-20 px-3 py-2 border rounded-md"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="nextDueDate">Next Due Date</Label>
                <div className="relative">
                    <input
                        type="date"
                        id="nextDueDate"
                        name="nextDueDate"
                        value={formatDateToInput(formData.nextDueDate || '')}
                        onChange={(e) => handleChange({
                            target: {
                                name: 'nextDueDate',
                                value: formatDateToDisplay(e.target.value)
                            }
                        } as React.ChangeEvent<HTMLInputElement>)}
                        className="w-full px-3 py-2 pl-10 border rounded-md"
                    />
                    <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
            </div>
        </>
    );

    return (
        <div className="w-full max-w-2xl mx-auto border-none">
            <CardContent className="space-y-6">
                {isEditMode ? EditView : ReadOnlyView}
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-6">
                {isEditMode ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFormData(data);
                                setIsEditMode(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </>
                ) : (
                    <Button onClick={() => setIsEditMode(true)}>
                        Edit Lead
                    </Button>
                )}
            </CardFooter>
        </div>
    );
}
