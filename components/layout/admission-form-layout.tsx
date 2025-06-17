'use client';

import TechnoTopHeader from '@/components/custom-ui/top-header/techno-top-header';
import TechnoBreadCrumb from '@/components/custom-ui/breadcrump/techno-breadcrumb';
import { useTopHeaderContext } from '@/components/custom-ui/top-header/top-header-context';
import { useEffect, useState } from 'react';
import { useSidebarContext } from '@/components/custom-ui/sidebar/sidebar-context';
import { SIDEBAR_ITEMS } from '@/common/constants/sidebarItems';
import { SITE_MAP } from '@/common/constants/frontendRouting';
import { usePathname } from 'next/navigation';
import { ADMISSION_STEPS } from '@/common/constants/admissionSteps';
import { AdmissionStepper } from '@/components/custom-ui/stepper/admission-stepper';
import { getEnquiry } from '../custom-ui/enquiry-form/stage-1/enquiry-form-api';
import PremiumBreadCrumb from '../custom-ui/breadcrump/premium-breadcrumb';

const HEADER_ITEMS = {
  APPLICATION_PROCESS: { title: 'Application Process', route: SITE_MAP.ADMISSIONS.DEFAULT }
};

export default function AdmissionFormLayout({ children }: { children: React.ReactNode }) {
  const { setHeaderActiveItem } = useTopHeaderContext();
  const { setSidebarActiveItem } = useSidebarContext();
  const [status, setStatus] = useState<string | null>(null);
  const pathname = usePathname();
  const pathSegments = pathname.split('/');
  const currentStepPath = pathSegments.find((segment) =>
    ADMISSION_STEPS.some((step) => step.path === segment)
  );
  const id = pathSegments[pathSegments.length - 2];

  useEffect(() => {
    setHeaderActiveItem(HEADER_ITEMS.APPLICATION_PROCESS.title);
    setSidebarActiveItem(SIDEBAR_ITEMS.ADMISSIONS);
  }, [setHeaderActiveItem, setSidebarActiveItem]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const enquiryData = await getEnquiry(id);
        if (enquiryData) {
          setStatus(enquiryData.applicationStatus);
        }
      } catch (error) {
      }
    };
    
    if (pathname === SITE_MAP.ADMISSIONS.CREATE_ADMISSION) {
      setStatus('step_1');
      return;
    }

    fetchStatus();
  }, [id]);

  if (!status) return null;

  return (
    <>
      <TechnoTopHeader headerItems={HEADER_ITEMS} />
      <div className="flex flex-col px-4 py-4 gap-6">
        <PremiumBreadCrumb rootUrl={SITE_MAP.ADMISSIONS.DEFAULT} />
        <div className="flex items-center flex-col justify-center lg:justify-normal lg:flex-row flex-wrap">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Admission Application Process
          </h1>
          <div className="w-2/4 mb-6 px-4 md:px-8 lg:px-16">
            <AdmissionStepper
              applicationCurrentStatus={parseInt(status[status.length - 1])}
              steps={ADMISSION_STEPS}
              currentStepPath={currentStepPath}
              applicationId={id}
            />
          </div>
        </div>
        <div className="">{children}</div>
      </div>
    </>
  );
}
