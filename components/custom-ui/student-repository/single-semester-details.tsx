// React and React Hook Form imports
import React from 'react';
import { FieldValues } from 'react-hook-form';

// UI component imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

// Utility and type imports
import { getOrdinalSuffix } from '@/lib/utils';
import ResultsTable from './result-table';
import { Semester, Subject } from './helpers/interface';

interface SingleSemesterDetailsFormPropInterface<T extends FieldValues = FieldValues> {
  semesterNo: number;
  semester: Semester;
}

const SingleSemesterDetailsSection: React.FC<SingleSemesterDetailsFormPropInterface> = ({
  semesterNo,
  semester
}) => {
  // const hasSubjects = semester?.subjects && semester.subjects.length > 0;
  const hasSubjects = true;

  const subjects: Subject[] = [
    {
      subjectId: "MATH101",
      subjectName: "Mathematics",
      subjectCode: "MTH101",
      instructor: ["Dr. Euler"],
      _id: "subj1",
      attendance: [
        {
          lecturePlan: [
            { id: "L1", attended: true },
            { id: "L2", attended: false },
            { id: "L3", attended: true }
          ],
          practicalPlan: [],
          totalLectureAttendance: 5,
          totalPracticalAttendance: 0
        }
      ],
      exams: [
        {
          theory: [
            { type: "Midterm", marks: 20 },
            { type: "Final", marks: 25 }
          ],
          practical: [],
          totalMarks: 100
        }
      ]
    },
    {
      subjectId: "CHEM102",
      subjectName: "Chemistry",
      subjectCode: "CHM102",
      instructor: ["Dr. Curie"],
      _id: "subj2",
      attendance: [
        {
          lecturePlan: [
            { id: "L1", attended: true },
            { id: "L2", attended: true },
            { id: "L3", attended: false }
          ],
          practicalPlan: [
            { id: "P1", attended: true },
            { id: "P2", attended: false }
          ],
          totalLectureAttendance: 5,
          totalPracticalAttendance: 5
        }
      ],
      exams: [
        {
          theory: [
            { type: "Midterm", marks: 10 },
            { type: "Final", marks: 15 }
          ],
          practical: [
            { type: "Lab", marks: 8 }
          ],
          totalMarks: 100
        }
      ]
    },
    {
      subjectId: "PHYS103",
      subjectName: "Physics",
      subjectCode: "PHY103",
      instructor: ["Dr. Newton"],
      _id: "subj3",
      attendance: [
        {
          lecturePlan: [
            { id: "L1", attended: true },
            { id: "L2", attended: true }
          ],
          practicalPlan: [
            { id: "P1", attended: true },
            { id: "P2", attended: true },
            { id: "P3", attended: false }
          ],
          totalLectureAttendance: 20,
          totalPracticalAttendance: 20
        }
      ],
      exams: [
        {
          theory: [
            { type: "Midterm", marks: 18 },
            { type: "Final", marks: 20 }
          ],
          practical: [
            { type: "Experiment 1", marks: 5 },
            { type: "Experiment 2", marks: 3 }
          ],
          totalMarks: 100
        }
      ]
    },
    {
      subjectId: "BIO104",
      subjectName: "Biology",
      subjectCode: "BIO104",
      instructor: ["Dr. Mendel"],
      _id: "subj4",
      attendance: [
        {
          lecturePlan: [
            { id: "L1", attended: false },
            { id: "L2", attended: true }
          ],
          practicalPlan: [
            { id: "P1", attended: false },
            { id: "P2", attended: false }
          ],
          totalLectureAttendance: 10,
          totalPracticalAttendance: 5
        }
      ],
      exams: [
        {
          theory: [
            { type: "Final", marks: 15 }
          ],
          practical: [
            { type: "Lab", marks: 10 }
          ],
          totalMarks: 100
        }
      ]
    },
    {
      subjectId: "ENG105",
      subjectName: "English Literature",
      subjectCode: "ENG105",
      instructor: ["Dr. Austen"],
      _id: "subj5",
      attendance: [
        {
          lecturePlan: [
            { id: "L1", attended: true },
            { id: "L2", attended: true },
            { id: "L3", attended: true },
            { id: "L4", attended: true }
          ],
          practicalPlan: [],
          totalLectureAttendance: 5,
          totalPracticalAttendance: 10
        }
      ],
      exams: [
        {
          theory: [
            { type: "Essay", marks: 30 },
            { type: "Comprehension", marks: 15 }
          ],
          practical: [],
          totalMarks: 100
        }
      ]
    }
  ];
  
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={`${getOrdinalSuffix(semesterNo)}-semester-details`}
    >
      <AccordionItem value={`${getOrdinalSuffix(semesterNo)}-semester-details`}>
        <div className="space-y-2">
          {/* Section Title */}
          <AccordionTrigger className="w-full items-center">
            <h3> {getOrdinalSuffix(semesterNo)} Semester Details</h3>
            <hr className="flex-1 border-t border-[#DADADA] ml-2" />
          </AccordionTrigger>

          <AccordionContent>
            {hasSubjects ? (
              <ResultsTable subjects={subjects || []} />
            ) : (
              <div className="w-full bg-white p-4 rounded-md border">
                <p>There is no record for this semester</p>
              </div>
            )}
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default SingleSemesterDetailsSection;
