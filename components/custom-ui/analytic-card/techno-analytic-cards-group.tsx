import TechnoAnalyticCard from "./techno-analytic-card";

interface CardItem {
    number: number;
    percentage: string;
    title: string;
    color?: string;
}

interface TechnoAnalyticCardsGroupProps {
    cardsData: CardItem[];
}

export default function TechnoAnalyticCardsGroup({ cardsData }: TechnoAnalyticCardsGroupProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-4">
            {cardsData.map(({ number, percentage, title, color }, i) => (
                <TechnoAnalyticCard
                    key={i}
                    number={number}
                    percentage={percentage}
                    title={title}
                    color={color}
                />
            ))}
        </div>
    );
}

