export enum FinalConversionStatus {
    PENDING = 'Campus Visited',
    CONVERTED = 'Not Interested',
    NOT_CONVERTED = 'Admission'
}

const conversionStyles = {
    [FinalConversionStatus.PENDING]: "bg-pink-100 text-pink-700",
    [FinalConversionStatus.CONVERTED]: "bg-red-100 text-red-700",
    [FinalConversionStatus.NOT_CONVERTED]: "bg-green-100 text-green-700",
};

interface FinalConversionTagProps {
    status: FinalConversionStatus;
}

export default function FinalConversionTag({ status }: FinalConversionTagProps) {
    const style = conversionStyles[status] || "bg-gray-100 text-gray-700";

    return (
        <span className={`px-2 py-1 rounded-md text-sm font-medium ${style}`}>
            {status?.replace(/_/g, ' ')}
        </span>
    );
}
