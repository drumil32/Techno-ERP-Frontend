import { format, isValid } from "date-fns";

export const cleanDataForDraft = (data: any): any => {
    if (data === null || data === undefined) {
      return undefined; 
    }
  
    if (data instanceof Date) {
      if (isValid(data)) {
        return format(data, 'dd/MM/yyyy'); //
      } else {
        return undefined; ;
      }
    }
  
    // 3. Handle Arrays: Recursively clean and filter
    if (Array.isArray(data)) {
      const cleanedArray = data
        .map(item => cleanDataForDraft(item)) // Recursively clean items
        .filter(item => item !== undefined);   // Remove items that became undefined
      // Return undefined if array is empty after cleaning
      return cleanedArray.length > 0 ? cleanedArray : undefined;
    }
  
    // 4. Handle generic Objects (excluding Dates, already handled)
    if (typeof data === 'object') { // No need for !(data instanceof Date) check anymore
      const cleanedObject: { [key: string]: any } = {};
      let isEmpty = true;
      for (const key in data) {
        // Skip specific keys not meant for draft payload
        if (key === 'otpTarget' || key === 'confirmationCheck') { // Add any other UI-only keys here
          continue;
        }
  
        const cleanedValue = cleanDataForDraft(data[key]); 
  
        if (cleanedValue !== undefined) {
          cleanedObject[key] = cleanedValue;
          isEmpty = false;
        }
      }
      return isEmpty ? undefined : cleanedObject;
    }
  
    return data;
  };