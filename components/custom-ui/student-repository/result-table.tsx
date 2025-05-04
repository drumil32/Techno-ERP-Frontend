"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Subject } from "./helpers/interface"

const getSubjectMetrics = (subject: Subject) => {
  const attendance = subject.attendance ?? []
  const totalClasses = attendance.length
  const attended = attendance.filter(Boolean).length

  const theoryMarks = subject?.exams
    ?.flatMap(exam => exam.theory ?? [])
    ?.reduce((sum, item) => sum + (item.marks ?? 0), 0)

  const practicalMarks = subject?.exams
    ?.flatMap(exam => exam.practical ?? [])
    ?.reduce((sum, item) => sum + (item.marks ?? 0), 0)

  const finalMarks = theoryMarks + practicalMarks
  const percentageScore = Math.round((finalMarks / 100) * 100) // Adjust if total is not 100
  const attendancePercentage = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0
  const result = percentageScore >= 40 ? "Pass" : "Fail"

  return {
    totalClasses,
    attended,
    theoryMarks,
    practicalMarks,
    finalMarks,
    attendancePercentage,
    percentageScore,
    result
  }
}


const calculateTotals = (subjects: Subject[]) => {
  return subjects.reduce(
    (acc, subj) => {
      const metrics = getSubjectMetrics(subj)
      acc.classes += metrics.totalClasses
      acc.attendance += metrics.attended
      acc.theory += metrics.theoryMarks
      acc.practical += metrics.practicalMarks
      acc.finalMarks += metrics.finalMarks
      return acc
    },
    {
      classes: 0,
      attendance: 0,
      theory: 0,
      practical: 0,
      finalMarks: 0,
    }
  )
}

const renderSafe = (
  value: number | string | null | undefined,
  opts: { suffix?: string; decimals?: number } = {}
): string => {
  if (value === null || value === undefined) return "-";

  const num = typeof value === "string" ? Number(value) : value;

  if (typeof num === "number" && !isNaN(num)) {
    const formattedNum = opts.decimals !== undefined ? num.toFixed(opts.decimals) : num;
    return `${formattedNum}${opts.suffix || ""}`;
  }

  return "-";
};


interface ResultsTableProps {
  subjects: Subject[]
}

export default function ResultsTable({ subjects }: ResultsTableProps) {

  const totals = calculateTotals(subjects)
  const totalAttendancePercentage = totals.classes > 0 ? Math.round((totals.attendance / totals.classes) * 100) : 0
  const totalPercentageScore =
    subjects.length > 0 ? Math.round((totals.finalMarks / (subjects.length * 100)) * 100) : 0

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
                <TableHead className="font-medium text-right">Percentage Score</TableHead>
                <TableHead className="font-medium">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map(subject => {
                const {
                  totalClasses,
                  attended,
                  theoryMarks,
                  practicalMarks,
                  finalMarks,
                  attendancePercentage,
                  percentageScore,
                  result
                } = getSubjectMetrics(subject)

                return (
                  <TableRow key={subject._id}>
                    <TableCell className="font-medium">{subject.subjectId}</TableCell>
                    <TableCell className="text-right">{subject.subjectId}</TableCell>
                    <TableCell className="text-right">{subject.subjectId}</TableCell>
                    <TableCell className="text-right">{renderSafe(totalClasses)}</TableCell>
                    <TableCell className="text-right">{renderSafe(attended)}</TableCell>
                    <TableCell className="text-right">
                      {renderSafe(attendancePercentage, { suffix: "%", decimals: 2 })}
                    </TableCell>
                    <TableCell className="text-right">{renderSafe(theoryMarks)}</TableCell>
                    <TableCell className="text-right">{renderSafe(practicalMarks)}</TableCell>
                    <TableCell className="text-right">{renderSafe(finalMarks)}</TableCell>
                    <TableCell className="text-right">
                      {renderSafe(percentageScore, { suffix: "%", decimals: 2 })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          result === "Pass"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }`}
                      >
                        {result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
                
              })}
              <TableRow className="border-t-2">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="text-right font-medium">-</TableCell>
                <TableCell className="text-right font-medium">-</TableCell>
                <TableCell className="text-right font-medium">{totals.classes}</TableCell>
                <TableCell className="text-right font-medium">{totals.attendance}</TableCell>
                <TableCell className="text-right font-medium">{totalAttendancePercentage}%</TableCell>
                <TableCell className="text-right font-medium">{totals.theory}</TableCell>
                <TableCell className="text-right font-medium">{totals.practical}</TableCell>
                <TableCell className="text-right font-medium">{totals.finalMarks}</TableCell>
                <TableCell className="text-right font-medium">{totalPercentageScore}%</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Pass
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
