import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Course, Gender, LeadType, Locations } from '@/static/enum';
import TechnoLeadTypeTag, { TechnoLeadType } from '@/components/custom-ui/lead-type-tag/techno-lead-type-tag';

interface LeadData {
    _id: string;
    date: string;
    source: string;
    name: string;
    phoneNumber: string;
    altPhoneNumber?: string;
    email: string;
    gender: string;
    location: string;
    assignedTo: string;
    leadType: string;
    course?: string;
    createdAt: string;
    updatedAt: string;
    nextDueDate?: string;
    [key: string]: any; // Allow for any additional properties
}

export default function LeadViewEdit({ id }: { id: string }) {
    const [formData, setFormData] = useState<LeadData | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDateToInput = (dateString: string) => {
        if (!dateString) return '';
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    const formatDateToDisplay = (dateString: string) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const fetchLead = async () => {
        const authToken = Cookies.get('token');
        const apiUrl = process.env.NEXT_PUBLIC_LOCAL_API_URL;
        const res = await fetch(`${apiUrl}/crm/get-by-id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({ id }),
            credentials: 'include'
        });

        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        return data.lead; // Accessing the lead object directly
    };

    const { data, status, error, refetch } = useQuery({
        queryKey: ['lead', id],
        queryFn: fetchLead,
        enabled: !!id
    });


    useEffect(() => {
        if (data) setFormData(data);
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            console.log(formData)
            const res = await fetch(`${apiUrl}/crm/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: formData._id,
                    ...formData
                }),
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to update lead');

            setIsEditMode(false);
            refetch();
        } catch (err) {
            console.error('Error updating lead:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'pending') {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <CardContent className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ))}
                </CardContent>
            </div>
        );
    }

    if (status === 'error' || !formData) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-500">{error?.message || 'No lead data found'}</p>
                </CardContent>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto border-none">
            <CardHeader>
                <CardTitle>Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Date Field - Always read-only as specified */}
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                        <Input
                            id="date"
                            value={formData.date}
                            readOnly
                            className="bg-gray-50 pl-10"
                        />
                        <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Personal Information</h3>

                    {/* Name Field */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        {isEditMode ? (
                            <Input
                                id="name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">{formData.name}</div>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        {isEditMode ? (
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">{formData.email}</div>
                        )}
                    </div>

                    {/* Gender Field - Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        {isEditMode ? (
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
                        ) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">{formData.gender}</div>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>

                    {/* Phone Number Field */}
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        {isEditMode ? (
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber || ''}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">{formData.phoneNumber}</div>
                        )}
                    </div>

                    {/* Alternative Phone Number Field */}
                    <div className="space-y-2">
                        <Label htmlFor="altPhoneNumber">Alternative Phone</Label>
                        {isEditMode ? (
                            <Input
                                id="altPhoneNumber"
                                name="altPhoneNumber"
                                value={formData.altPhoneNumber || ''}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">{formData.altPhoneNumber || 'N/A'}</div>
                        )}
                    </div>

                    {/* Location Field - Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        {isEditMode ? (
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
                        ) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">{formData.location}</div>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Lead Information */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Lead Information</h3>

                    {/* Source Field */}
                    <div className="space-y-2">
                        <Label htmlFor="source">Source</Label>
                        {isEditMode ? (
                            <Input
                                id="source"
                                name="source"
                                value={formData.source || ''}
                                onChange={handleChange}
                            />
                        ) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">{formData.source}</div>
                        )}
                    </div>

                    {/* Course Field - Dropdown (if exists) */}
                    <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        {isEditMode ? (
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
                        ) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">{formData.course || 'N/A'}</div>
                        )}
                    </div>

                    {/* Lead Type Field - Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="leadType">Lead Type</Label>
                        {isEditMode ? (
                            <Select
                                defaultValue={formData.leadType}
                                onValueChange={(value) => handleSelectChange("leadType", value)}
                            >
                                <SelectTrigger id="leadType" className="w-full">
                                    <SelectValue placeholder="Select lead type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(TechnoLeadType).map((leadType) => (
                                        <SelectItem key={leadType} value={leadType}>
                                            <TechnoLeadTypeTag type={leadType} />
                                        </SelectItem>
                                    ))}
                                </SelectContent>

                            </Select>
                        ) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">
                                <TechnoLeadTypeTag type={formData.leadType as TechnoLeadType} />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="nextDueDate">Next Due Date</label>
                        {isEditMode ? (
                            <input
                                type="date"
                                id="nextDueDate"
                                name="nextDueDate"
                                value={formatDateToInput(formData.nextDueDate) || ''}
                                onChange={(e) => handleChange({
                                    target: {
                                        name: 'nextDueDate',
                                        value: formatDateToDisplay(e.target.value)
                                    }
                                } as React.ChangeEvent<HTMLInputElement>)}
                                className="border rounded px-2 py-1 w-full"
                            />) : (
                            <div className="px-3 py-2 border rounded-md bg-gray-50">
                                {formatDateToDisplay(formData.nextDueDate) || 'N/A'}
                            </div>
                        )}
                    </div>

                </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-6">
                {isEditMode ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFormData(data); // Reset to original data
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
