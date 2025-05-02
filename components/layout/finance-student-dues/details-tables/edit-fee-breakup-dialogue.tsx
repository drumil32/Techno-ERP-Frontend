import { Button } from "@/components/ui/button";
import { FeeBreakupResponse } from "@/types/finance";
import { Pencil } from "lucide-react";
import * as Dialog from '@radix-ui/react-dialog';
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { z } from "zod";

// Zod schema for validation
const feeSchema = z.object({
  finalFees: z.number().positive("Fee must be greater than 0").optional()
});

export default function EditFeeBreakupDialogue({studentName, feesBreakup, onSave}: {
  studentName: string | undefined,
  feesBreakup: FeeBreakupResponse | undefined,
  onSave?: (updatedBreakup: any) => void
}) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // State to track edited fee values
  const [editedFees, setEditedFees] = useState<Record<string, number | null>>({});

  // Calculate the total of all final fees
  const calculateTotal = () => {
    let total = 0;
    feesBreakup?.breakup.forEach((item) => {
      const editedValue = editedFees[item.feesCategory];
      const finalFee = editedValue !== undefined ? editedValue : item.finalFees;
      if (finalFee && typeof finalFee === 'number') {
        total += finalFee;
      }
    });
    return total;
  };

  const handleInputChange = (category: string, value: string) => {
    try {
      // Clear previous error for this field
      const newErrors = { ...errors };
      delete newErrors[category];
      setErrors(newErrors);

      if (value === "") {
        // Handle empty input as null (no edit)
        const newEditedFees = { ...editedFees };
        delete newEditedFees[category]; // Remove from edits if empty
        setEditedFees(newEditedFees);
        return;
      }

      const numValue = parseFloat(value);

      // Validate the value
      feeSchema.shape.finalFees.parse(numValue);

      // Update edited fees
      setEditedFees({
        ...editedFees,
        [category]: numValue
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors({
          ...errors,
          [category]: error.errors[0]?.message || "Invalid value"
        });
      }
    }
  };

  const handleSave = () => {
    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    // Prepare payload with only the edited values
    const updatedBreakup = {
      semester: feesBreakup?.semester,
      breakup: feesBreakup?.breakup.map(item => {
        const editedFee = editedFees[item.feesCategory];
        if (editedFee !== undefined) {
          return {
            ...item,
            finalFees: editedFee
          };
        }
        return item;
      })
    };

    console.log("Updated Breakup:", updatedBreakup);

    if (onSave) {
      onSave(updatedBreakup);
    }

    setOpen(false);
  };

  const handleDiscard = () => {
    setEditedFees({});
    setErrors({});
    setIsConfirmed(false);
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          variant="outline"
          className="h-9 rounded-[10px] border ml-auto"
          onClick={() => setOpen(true)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Breakup
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-30 inset-0 bg-black/30" />
        <Dialog.Content className="bg-white sm:min-w-[600px] z-40 p-6 rounded-xl shadow-xl w-full max-w-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Dialogue Title Header */}
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold flex items-center gap-2">
              <Pencil className="w-5 h-5 text-gray-500" />
              &nbsp;Edit Fees Breakup
            </Dialog.Title>
            <Dialog.Close className="text-gray-500 hover:text-black text-xl font-bold" onClick={handleDiscard}>
              &times;
            </Dialog.Close>
          </div>

          <div className="mb-3">Semester {feesBreakup?.semester}</div>

          <Table className="w-full mb-4">
            <TableHeader className="bg-[#F7F7F7]">
              <TableRow>
                <TableHead className="rounded-l-[5px]">Fees Category</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-right">Final Fees</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feesBreakup?.breakup.map((item) => (
                <TableRow key={item.feesCategory}>
                  <TableCell>{item.feesCategory}</TableCell>
                  <TableCell>{item.schedule}</TableCell>
                  <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <Input
                          className="w-24 text-right"
                          type="number"
                          defaultValue={item.finalFees !== null ? item.finalFees : ""}
                          onChange={(e) => handleInputChange(item.feesCategory, e.target.value)}
                          placeholder="—"
                          prefix="₹"
                        />
                        {errors[item.feesCategory] && (
                          <span className="text-red-500 text-xs mt-1">{errors[item.feesCategory]}</span>
                        )}
                      </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-medium">Total</TableCell>
                <TableCell className="text-right font-medium">₹{calculateTotal().toLocaleString()}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

          <div className="flex items-center space-x-2 mb-6">
            <Checkbox
              id="confirm"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked === true)}
            />
            <Label htmlFor="confirm" className="text-gray-600 cursor-pointer">
              Are you sure you want to update the fees of this student ({studentName})
            </Label>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleDiscard}>
              Discard
            </Button>
            <Button
              disabled={!isConfirmed || Object.keys(errors).length > 0}
              onClick={handleSave}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Save
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
