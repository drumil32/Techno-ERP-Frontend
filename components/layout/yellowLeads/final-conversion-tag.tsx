export enum FinalConversionStatus {
    PINK = 'PENDING',
    GREEN = 'CONVERTED',
    RED = 'NOT_CONVERTED'
}
    
const conversionStyles = {
    [FinalConversionStatus.PINK]: "bg-pink-100 text-pink-700",
    [FinalConversionStatus.GREEN]: "bg-green-100 text-green-700",
    [FinalConversionStatus.RED]: "bg-red-100 text-red-700",
};
function toPascal(title: string) {
    if(!title.includes('_'))
    {
        return title[0].toUpperCase() + title.slice(1).toLowerCase();
    }
    var words = title.split('_');
    var convertedTitle = '';
    words.forEach((word) => {
        let formatedWord = word[0].toUpperCase() + word.slice(1).toLowerCase();
        convertedTitle += formatedWord;
        convertedTitle += ' ';
    })

    return convertedTitle;
}
interface FinalConversionTagProps {
    status: FinalConversionStatus;
}

export default function FinalConversionTag({ status }: FinalConversionTagProps) {
    const style = conversionStyles[status] || "bg-gray-100 text-gray-700";

    return (
        status && 
        <span className={`px-2 py-1 rounded-md text-sm font-medium ${style}`}>
            {toPascal(status)}
        </span>
    );
}
