'use client'
import CRMLayout from "@/components/layout/crm-layout";
import AllLeadsPage from "@/components/layout/allLeads/all-leads-page";
import { TechnoFilterProvider } from "@/components/custom-ui/filter/filter-context";
import { useEffect } from "react";
import { useTopHeaderContext } from "@/components/custom-ui/top-header/top-header-context";

export default function AllLeads() {
  const { setHeaderActiveItem } = useTopHeaderContext();

  useEffect(() => {
    setHeaderActiveItem("All Leads"); // Set active header item
  }, []);
  return (
    <CRMLayout>
      <TechnoFilterProvider key="all-leads">
        <AllLeadsPage />
      </TechnoFilterProvider>
    </CRMLayout>
  );
}
