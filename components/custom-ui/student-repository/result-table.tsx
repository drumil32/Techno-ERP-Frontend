"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Subject } from "./helpers/interface"

/**
 * Calculate metrics for a single subject
 * Returns all calculated metrics with special handling for no-exam cases
 */
const getSubjectMetrics = (subject: Subject) => {
  // Handle attendance calculation
  const attendance = subject?.attendance || []
  
  let totalClasses = 0
  let attended = 0
  
  attendance.forEach(attendanceRecord => {

    if (typeof attendanceRecord.totalLectureAttendance === 'number' && 
        typeof attendanceRecord.totalPracticalAttendance === 'number') {
      totalClasses = (attendanceRecord.totalLectureAttendance + attendanceRecord.totalPracticalAttendance)
      attended = (attendanceRecord.totalLectureAttendance + attendanceRecord.totalPracticalAttendance)
    }
    
  })
  
  // Check if student has taken any exams
  const hasExams = subject?.exams && subject.exams.length > 0
  
  // Calculate marks only if exams were taken
  let theoryMarks = 0
  let practicalMarks = 0
  let totalPossibleMarks = 0
  
  if (hasExams) {
    subject.exams.forEach(exam => {

      // Add theory marks
      if (exam.theory && Array.isArray(exam.theory)) {
        theoryMarks += exam.theory.reduce((sum, item) => sum + (Number(item.marks) || 0), 0)
      }
      
      // Add practical marks
      if (exam.practical && Array.isArray(exam.practical)) {
        practicalMarks += exam.practical.reduce((sum, item) => sum + (Number(item.marks) || 0), 0)
      }
      
      // Consider the totalMarks field for each exam
      if (typeof exam.totalMarks === 'number') {
        totalPossibleMarks += exam.totalMarks
      } else {
        // If totalMarks not provided, estimate based on max theory + practical
        // Default to 100 if we have no better information
        totalPossibleMarks += 100
      }
    })
  }
    
  // Final marks depend on exam existence
  const finalMarks = hasExams ? (theoryMarks || 0) + (practicalMarks || 0) : null
  
  // Calculate percentages and results
  const percentageScore = hasExams && finalMarks !== null && totalPossibleMarks > 0 
    ? Math.round((finalMarks / totalPossibleMarks) * 100) 
    : null
    
  const attendancePercentage = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0
  const result = !hasExams ? "Pending" : (percentageScore !== null && percentageScore >= 40) ? "Pass" : "Fail"

  return {
    totalClasses,
    attended,
    theoryMarks,
    practicalMarks,
    finalMarks,
    totalPossibleMarks,
    attendancePercentage,
    percentageScore,
    result
  }
}

/**
 * Calculate totals across all subjects
 */
const calculateTotals = (subjects: Subject[]) => {
  if (!subjects || subjects.length === 0) {
    return {
      classes: 0,
      attendance: 0,
      theory: 0,
      practical: 0,
      finalMarks: 0,
      totalPossibleMarks: 0
    }
  }
  
  return subjects.reduce(
    (acc: any, subj: Subject | null) => {
      if (subj) {
        const metrics = getSubjectMetrics(subj)
        acc.classes += metrics.totalClasses
        acc.attendance += metrics.attended
        acc.theory += metrics.theoryMarks || 0 
        acc.practical += metrics.practicalMarks || 0 
        acc.finalMarks += metrics.finalMarks || 0 
        acc.totalPossibleMarks += metrics.totalPossibleMarks || 0 
      }
      return acc
    },
    {
      classes: 0,
      attendance: 0,
      theory: 0,
      practical: 0,
      finalMarks: 0,
      totalPossibleMarks: 0
    }
  )
}

/**
 * Options for rendering values safely
 */
interface RenderSafeOptions {
  /** Number of decimal places to display */
  decimals?: number;
  /** Suffix to append to the value (e.g., "%") */
  suffix?: string;
  /** Custom placeholder for null/undefined values */
  placeholder?: string;
  /** Whether zero values should be shown as placeholder */
  zeroAsPlaceholder?: boolean;
}

/**
 * Safely renders values with consistent formatting
 * Handles null, undefined, NaN cases with placeholders
 */
const renderSafe = (value: any, opts: RenderSafeOptions = {}): string => {
  const placeholder = opts.placeholder || "--";
  
  // If value is null, undefined, NaN, or empty string, return placeholder
  if (value === null || value === undefined || value === "" || 
      (typeof value === "number" && isNaN(value))) {
    return placeholder;
  }
  
  // Special case: treat zero as placeholder if requested
  if (opts.zeroAsPlaceholder && (value === 0 || value === "0")) {
    return placeholder;
  }

  // Format number with optional decimal places and suffix
  const num = typeof value === "number" ? value : Number(value);
  
  if (!isNaN(num)) {
    const formattedNum = opts.decimals !== undefined ? num.toFixed(opts.decimals) : num;
    return `${formattedNum}${opts.suffix || ""}`;
  }

  // Return as string for non-numeric values
  return String(value);
}

/**
 * Props for ResultsTable component
 */
interface ResultsTableProps {
  subjects: Subject[];
}

/**
 * ResultsTable component displays academic performance in a tabular format
 * Handles edge cases like missing data and no-exam scenarios
 */
export default function ResultsTable({ subjects }: ResultsTableProps) {
  // Ensure subjects is always an array
  const safeSubjects = Array.isArray(subjects) ? subjects : []
  
  // Calculate totals and percentages
  const totals = calculateTotals(safeSubjects)
  
  // Calculate attendance percentage only if classes were held
  const totalAttendancePercentage = totals.classes > 0 
    ? Math.round((totals.attendance / totals.classes) * 100) 
    : null
    
  // Calculate total score percentage considering the totalPossibleMarks
  const totalPercentageScore = totals.totalPossibleMarks > 0 
    ? Math.round((totals.finalMarks / totals.totalPossibleMarks) * 100) 
    : null

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium">Subject</TableHead>
                <TableHead className="font-medium text-right">Subject Code</TableHead>
                <TableHead className="font-medium text-right">Instructor</TableHead>
                <TableHead className="font-medium text-right">No. of Classes</TableHead>
                <TableHead className="font-medium text-right">Attendance</TableHead>
                <TableHead className="font-medium text-right">Attendance %</TableHead>
                <TableHead className="font-medium text-right">Theory</TableHead>
                <TableHead className="font-medium text-right">Practical</TableHead>
                <TableHead className="font-medium text-right">Final Marks</TableHead>
                <TableHead className="font-medium text-right">Total Possible</TableHead>
                <TableHead className="font-medium text-right">Percentage Score</TableHead>
                <TableHead className="font-medium">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeSubjects.map((subject, index) => {
                if (!subject) return null;
                
                const {
                  totalClasses,
                  attended,
                  theoryMarks,
                  practicalMarks,
                  finalMarks,
                  totalPossibleMarks,
                  attendancePercentage,
                  percentageScore,
                  result
                } = getSubjectMetrics(subject)

                return (
                  <TableRow key={subject._id || `subject-${index}`}>
                    <TableCell className="font-medium">{subject.subjectName || "--"}</TableCell>
                    <TableCell className="text-right">{subject.subjectCode || "--"}</TableCell>
                    <TableCell className="text-right">{subject?.instructor?.join(", ") || "--"}</TableCell>
                    <TableCell className="text-right">{renderSafe(totalClasses)}</TableCell>
                    <TableCell className="text-right">{renderSafe(attended)}</TableCell>
                    <TableCell className="text-right">
                      {renderSafe(attendancePercentage, { suffix: "%", decimals: 0 })}
                    </TableCell>
                    <TableCell className="text-right">{renderSafe(theoryMarks, { zeroAsPlaceholder: true })}</TableCell>
                    <TableCell className="text-right">{renderSafe(practicalMarks, { zeroAsPlaceholder: true })}</TableCell>
                    <TableCell className="text-right">{renderSafe(finalMarks, { zeroAsPlaceholder: true })}</TableCell>
                    <TableCell className="text-right">{renderSafe(totalPossibleMarks, { zeroAsPlaceholder: true })}</TableCell>
                    <TableCell className="text-right">
                      {renderSafe(percentageScore, { suffix: "%", decimals: 0, zeroAsPlaceholder: true })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          result === "Pass"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : result === "Fail"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }`}
                      >
                        {result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Summary row */}
              <TableRow className="border-t-2">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="text-right font-medium">--</TableCell>
                <TableCell className="text-right font-medium">--</TableCell>
                <TableCell className="text-right font-medium">{renderSafe(totals.classes)}</TableCell>
                <TableCell className="text-right font-medium">{renderSafe(totals.attendance)}</TableCell>
                <TableCell className="text-right font-medium">
                  {renderSafe(totalAttendancePercentage, { suffix: "%", decimals: 0 })}
                </TableCell>
                <TableCell className="text-right font-medium">{renderSafe(totals.theory, { zeroAsPlaceholder: true })}</TableCell>
                <TableCell className="text-right font-medium">{renderSafe(totals.practical, { zeroAsPlaceholder: true })}</TableCell>
                <TableCell className="text-right font-medium">{renderSafe(totals.finalMarks, { zeroAsPlaceholder: true })}</TableCell>
                <TableCell className="text-right font-medium">{renderSafe(totals.totalPossibleMarks, { zeroAsPlaceholder: true })}</TableCell>
                <TableCell className="text-right font-medium">{renderSafe(totalPercentageScore, { suffix: "%", decimals: 0, zeroAsPlaceholder: true })}</TableCell>
                <TableCell>
                  {totalPercentageScore === null ? (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                      Pending
                    </Badge>
                  ) : (
                    <Badge 
                      variant="outline" 
                      className={totalPercentageScore >= 40 
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {totalPercentageScore >= 40 ? "Pass" : "Fail"}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}