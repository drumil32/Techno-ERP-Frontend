import TechnoTopHeaderItem from "./techno-top-header-item";

interface HeaderItem {
    title: string;
}

interface TechnoTopHeaderProps {
    headerItems: HeaderItem[];
}

export default function TechnoTopHeader({ headerItems }: TechnoTopHeaderProps) {
    return (
        <div className="w-full h-16 border-b border-gray-300 flex text-lg">
            {headerItems.map((item, i) => (
                <TechnoTopHeaderItem key={i} item={item} />
            ))}
        </div>
    );
}

