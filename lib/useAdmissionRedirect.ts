'use client';

import { SITE_MAP } from '@/common/constants/frontendRouting';
import { getEnquiry } from '@/components/custom-ui/enquiry-form/stage-1/enquiry-form-api';
import { ApplicationStatus } from '@/types/enum';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UseAdmissionRedirectProps {
  id?: string;
  currentStage: ApplicationStatus;
}

interface UseAdmissionRedirectReturn {
  isChecking: boolean;
  isCheckError: boolean;
  isViewable: boolean;
}

export const useAdmissionRedirect = ({
  id,
  currentStage
}: UseAdmissionRedirectProps): UseAdmissionRedirectReturn => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [isCheckError, setIsCheckError] = useState(false);
  const [isViewable, setIsViewable] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!id) return;

      setIsChecking(true);
      setIsCheckError(false);
      setIsViewable(false);

      try {
        const enquiryData = await getEnquiry(id);

        if (!enquiryData) {
          throw new Error(`Enquiry with ID ${id} not found.`);
        }

        const fetchedStatus = enquiryData.applicationStatus;

        if (
          !fetchedStatus ||
          !Object.values(ApplicationStatus).includes(fetchedStatus as ApplicationStatus)
        ) {
          console.warn(`Invalid application status: ${fetchedStatus}`);
          return;
        }

        if (fetchedStatus !== currentStage) {
          setIsViewable(true);
        }
      } catch (err) {
        console.error(`Error fetching enquiry ${id}:`, err);
        toast.error(`Failed to load enquiry data (ID: ${id})`);
        setIsCheckError(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [id, currentStage, router]);

  return {
    isChecking,
    isCheckError,
    isViewable
  };
};
