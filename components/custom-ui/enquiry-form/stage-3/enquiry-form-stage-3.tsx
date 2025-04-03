'use client'

import { useParams, useSearchParams } from "next/navigation";
import StudentDetailsSection from "../stage-1/student-details-section";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { enquiryStep3UpdateRequestSchema } from "../schema/schema";

import { Form } from '@/components/ui/form';
import AddressDetailsSection from "../stage-1/address-details-section";
import AcademicDetailsSection from "../stage-1/academic-details-section";
import { getEnquiry } from "../stage-1/enquiry-form-api";
import { useEffect } from "react";
import EnquiryFormFooter from "../stage-1/enquiry-form-footer-section";
import { useQuery } from "@tanstack/react-query";
import AcademicDetailsSectionStage3 from "./academic-details-section";
import { DropBox } from "../../dropbox/dropbox";
import StudentDetailsSectionStage3 from "./student-details-section";
import AddressDetailsSectionStage3 from "./address-details-section";
import { format } from 'date-fns';
import ConfirmationCheckBoxStage3 from "./acknowledgement-section";
import EntranceExamDetailsSection from "./entrance-exam-details-section";
import MoreDetailsSection from "./more-details-section";

const EnquiryFormStage3 = () => {

    const pathVariables = useParams();
    const id = pathVariables.id as string;

    const form = useForm<z.infer<typeof enquiryStep3UpdateRequestSchema>>(
        {
            resolver: zodResolver(enquiryStep3UpdateRequestSchema),


        }
    );

    const saveData = () => {

    };
    const onSubmit = () => {
        let filledData = form.getValues();
        console.log("filled details", filledData);


    };

    const { data, isError, isLoading, isSuccess, isFetching } = useQuery({
        queryKey: ['enquiryFormData', id],
        queryFn: () => getEnquiry(id ? id : ''),
        enabled: !!id
    });

    useEffect(() => {
        console.log('this is id', id);
        console.log('Effect running, data:', data);
        if (data) {
            console.log('Attempting to reset form with:', data);
            form.reset(data);
            form.setValue('dateOfAdmission', format(new Date(), 'dd/MM/yyyy')); // As per discussion set date manually because if we set at schema level it would be overriden 
            console.log('Form values after reset:', form.getValues());
        }
    }, [data, form]);
    const commonFormItemClass = 'col-span-1 gap-y-0';
    const commonFieldClass = '';


    return (
        <Form {...form} >
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="py-8 mr-[25px] space-y-8 flex flex-col w-full "
            >
                {/* <DropBox className=" w-[25px] " label="hello there"/> */}
                {/* Student Details */}
                <StudentDetailsSectionStage3
                    form={form}
                    commonFieldClass={commonFieldClass}
                    commonFormItemClass={commonFormItemClass}
                />

                <MoreDetailsSection
                    form={form}
                    commonFieldClass={commonFieldClass}
                    commonFormItemClass={commonFormItemClass}
                />

                {/* Address details */}
                <AddressDetailsSectionStage3
                    form={form}
                    commonFieldClass={commonFieldClass}
                    commonFormItemClass={commonFormItemClass}
                />

                {/* Academic Details */}
                <AcademicDetailsSectionStage3
                    form={form}
                    commonFieldClass={commonFieldClass}
                    commonFormItemClass={commonFormItemClass}
                />
                <EntranceExamDetailsSection form={form} commonFieldClass={commonFieldClass}
                    commonFormItemClass={commonFormItemClass} />

                <ConfirmationCheckBoxStage3 form={form} />

                <EnquiryFormFooter form={form} onSubmit={saveData} saveDraft={saveData} />
            </form>
        </Form>
    );
};

export default EnquiryFormStage3;
