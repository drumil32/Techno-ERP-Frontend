import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import {  Nationality, Qualification } from '../schema/schema';
import { AreaType, BloodGroup, Category, Religion, StatesOfIndia } from '@/types/enum';
interface MoreDetailsSectionInterface {
  form: UseFormReturn<any>;
  commonFormItemClass: string;
  commonFieldClass: string;
}

const MoreDetailsSection: React.FC<MoreDetailsSectionInterface> = ({ form, commonFieldClass, commonFormItemClass }) => {



  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="student-details">
        <div className="space-y-2">
          <AccordionTrigger className="w-full items-center">
            {/* Section Title */}
            <h3 className="font-inter text-[16px] font-semibold">More Details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-6 gap-x-[32px] bg-white p-4 rounded-[10px]">


              <FormField
                key="state"
                control={form.control}
                name="moreDetails.state"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      State Of Domicile
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select the state" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(StatesOfIndia).map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="area"
                control={form.control}
                name="moreDetails.area"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Area Type
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select the area type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AreaType).map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="nationality"
                control={form.control}
                name="moreDetails.nationality"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Nationality
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Enter the nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Nationality).map((nationality) => (
                            <SelectItem key={nationality} value={nationality}>
                              {nationality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="religion"
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Religion
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select the religion" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Religion).map((religion) => (
                            <SelectItem key={religion} value={religion}>
                              {religion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="category"
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Category
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select the religion" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(Category).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                key="bloodGroup"
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1 col-start-1`}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Blood Group
                    </FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={`${commonFieldClass} w-full`}>
                          <SelectValue placeholder="Select the blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(BloodGroup).map((bloodGroup) => (
                            <SelectItem key={bloodGroup} value={bloodGroup}>
                              {bloodGroup}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />



              <FormField
                key="aadharNumber"
                control={form.control}
                name="aadharNumber"
                render={({ field }) => (
                  <FormItem className={`${commonFormItemClass} col-span-1 `}>
                    <FormLabel className="font-inter font-normal text-[12px] text-[#666666]">
                      Aadhaar Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className={commonFieldClass}
                        placeholder="Enter the Aadhaar number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  )
}

export default MoreDetailsSection;