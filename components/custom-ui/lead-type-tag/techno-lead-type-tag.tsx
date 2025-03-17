export enum TechnoLeadType {
  OPEN = "Open Lead",
  NotSureYet = "Not Sure Yet",
  INTERESTED = "Interested",
  DID_NOT_PICK = "Did Not Pick",
  COURSE_UNAVAILABLE = "Course NA",
  NOT_INTERESTED = "Not Interested",
  ADMISSION = "Admission",
}


const typeStyles = {
  [TechnoLeadType.OPEN]: "bg-orange-100 text-orange-700",
  [TechnoLeadType.NotSureYet]: "bg-blue-100 text-blue-700",
  [TechnoLeadType.INTERESTED]: "bg-yellow-100 text-yellow-700",
  [TechnoLeadType.DID_NOT_PICK]: "bg-slate-100 text-slate-700",
  [TechnoLeadType.COURSE_UNAVAILABLE]: "bg-gray-100 text-gray-700",
  [TechnoLeadType.NOT_INTERESTED]: "bg-rose-100 text-rose-700",
  [TechnoLeadType.ADMISSION]: "bg-green-100 text-green-700",
};

interface TechnoLeadTypeTagProps {
  type: TechnoLeadType;
}

export default function TechnoLeadTypeTag({ type }: TechnoLeadTypeTagProps) {
  const style = typeStyles[type] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${style}`}>
      {type}
    </span>
  );
}

