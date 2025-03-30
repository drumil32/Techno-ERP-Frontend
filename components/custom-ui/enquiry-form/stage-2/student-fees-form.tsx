'use client'

import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { feesRequestSchema, IFeesRequestSchema } from "./studentFeesSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { getEnquiry } from "../stage-1/enquiry-form-api"
import { useEffect } from "react"
import { Form } from "@/components/ui/form"
import ConfirmationCheckBox from "../stage-1/confirmation-check-box"
import EnquiryFormFooter from "../stage-1/enquiry-form-footer-section"
import { OtherFeesSection } from "./other-fees-section"
import { useParams } from 'next/navigation'


export const StudentFeesForm = () => {
  const params = useParams()

  const enquiry_id = params.id as string
 
  const form = useForm<IFeesRequestSchema>({
    resolver: zodResolver(feesRequestSchema),
  })

  console.log(form)

  const { data } = useQuery({
    queryKey: ['enquireFormData', enquiry_id],
    queryFn: () => enquiry_id ? getEnquiry(enquiry_id) : Promise.reject('Enquiry ID is null'),
  })

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
    console.log(data)
  }, [data, form]);

  async function saveDraft() {
    console.log(form.getValues)
  }

  async function onSubmit(values: IFeesRequestSchema) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="py-8 mr-[25px] space-y-8 flex flex-col w-full"
      >
        <OtherFeesSection form={form}/>
        <ConfirmationCheckBox form={form} />
        <EnquiryFormFooter saveDraft={saveDraft} />
      </form>
    </Form>
  )

}
