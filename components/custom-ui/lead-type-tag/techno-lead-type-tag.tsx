
export enum TechnoLeadType {
    ORANGE = 'OPEN',
    RED = 'NOT_INTERESTED',
    BLACK = 'COURSE_UNAVAILABLE',
    BLUE = 'NO_CLARITY',
    YELLOW = 'INTERESTED',
    GREEN = 'ADMISSION',
    WHITE = 'DID_NOT_PICK'
}

const typeStyles = {
    [TechnoLeadType.ORANGE]: "bg-orange-100 text-orange-700",
    [TechnoLeadType.BLUE]: "bg-blue-100 text-blue-700",
    [TechnoLeadType.YELLOW]: "bg-yellow-100 text-yellow-700",
    [TechnoLeadType.WHITE]: "bg-slate-100 text-slate-700",
    [TechnoLeadType.BLACK]: "bg-gray-100 text-gray-700",
    [TechnoLeadType.RED]: "bg-rose-100 text-rose-700",
    [TechnoLeadType.GREEN]: "bg-green-100 text-green-700",
};

interface TechnoLeadTypeTagProps {
    type: TechnoLeadType;
}

export default function TechnoLeadTypeTag({ type }: TechnoLeadTypeTagProps) {
    const style = typeStyles[type] || "bg-gray-100 text-gray-700";

    return (
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${style}`}>
            {type.replace(/_/g, ' ')}
        </span>
    );
}

