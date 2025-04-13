"use client"

import { SITE_MAP } from "@/common/constants/frontendRouting";
import { getEnquiry } from "@/components/custom-ui/enquiry-form/stage-1/enquiry-form-api";
import { ApplicationStatus } from "@/types/enum";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface UseAdmissionRedirectProps {
    id?: string;
    currentStage: ApplicationStatus;
}

export const useAdmissionRedirect = ({ id, currentStage }: UseAdmissionRedirectProps) => {

    const router = useRouter();

    const { data, isLoading, isError, isSuccess, error } = useQuery({
        queryKey: ['enquiryRedirectCheck', id],
        queryFn: async () => {
            if (!id) {
                throw new Error('Enquiry ID is required');
            }
            const enquiryData = await getEnquiry(id);
            if (!enquiryData) {
                throw new Error(`Enquiry with ID ${id} not found.`);
            }
            return enquiryData;
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
        retry: 1,
    });

    useEffect(() => {
        if (isSuccess && data && id) {
            const fetchedStatus = data.applicationStatus;

            if (!fetchedStatus || !Object.values(ApplicationStatus).includes(fetchedStatus as ApplicationStatus)) {
                console.warn(`Enquiry ${id} has an invalid or missing applicationStatus: ${fetchedStatus}. Cannot determine correct stage.`);
                return;
            }

            if (fetchedStatus !== currentStage) {
                let targetRoute: string | null = null;

                switch (fetchedStatus) {
                    case ApplicationStatus.STEP_1:
                        targetRoute = SITE_MAP.ADMISSIONS.FORM_STAGE_1(id);
                        break;
                    case ApplicationStatus.STEP_2:
                        targetRoute = SITE_MAP.ADMISSIONS.FORM_STAGE_2(id);
                        break;
                    case ApplicationStatus.STEP_3:
                        targetRoute = SITE_MAP.ADMISSIONS.FORM_STAGE_3(id);
                        break;
                    case ApplicationStatus.STEP_4:
                        targetRoute = SITE_MAP.ADMISSIONS.FORM_STAGE_4(id);
                        break;
                    default:
                        console.warn(`No defined route for application status: ${fetchedStatus}`);
                }

                if (targetRoute) {
                    console.log(
                        `Redirecting: Current stage ${currentStage}, Fetched status ${fetchedStatus}. Navigating to ${targetRoute}`
                    );
                    router.push(targetRoute);
                } else {
                    console.warn(`Could not determine redirect route for status ${fetchedStatus}. Staying on current page.`);
                }
            }
        }

        if (isError && id) {
            console.error(`Error fetching enquiry ${id} for redirect check:`, error);
            toast.error(`Failed to load enquiry data (ID: ${id}). Redirecting to list.`);
        }

    }, [isSuccess, isError, data, id, currentStage, router, error]);

    return {
        isChecking: isLoading,
        isCheckError: isError,
    };
}