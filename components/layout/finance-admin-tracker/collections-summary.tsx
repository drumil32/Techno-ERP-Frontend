import { ViewMode } from "./collections";
import { SummaryCard } from "./finance-summary-details";

export default function CollectionSummary({ label, totalCollections, viewMode }: { label: string, totalCollections: number, viewMode: ViewMode }) {
    return (
        <div className="w-full flex flex-col gap-4 px-4 py-5 bg-white shadow-sm border-[1px] rounded-[10px] border-gray-200">
            <div className="w-fit font-semibold text-lg px-2 p-1 rounded-[5px] bg-[#FFF8EE] text-[#D58B18]">{label}</div>
            <SummaryCard 
                totalCollections={totalCollections}
                percentage={100}
                label={viewMode === ViewMode.DAY ? "Daily Collections" : "Total Collections"}
            />
        </div>
    )
}