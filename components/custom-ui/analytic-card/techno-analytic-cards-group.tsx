import TechnoAnalyticCard from './techno-analytic-card';

export interface CardItem {
  heading: string;
  subheading: string;
  title: string;
  color?: string;
}

interface TechnoAnalyticCardsGroupProps {
  cardsData: CardItem[];
}

export default function TechnoAnalyticCardsGroup({ cardsData }: TechnoAnalyticCardsGroupProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-8 gap-4">
      {cardsData.map(({ heading, subheading, title, color }, i) => (
        <TechnoAnalyticCard
          key={i}
          heading={heading}
          subheading={subheading}
          title={title}
          color={color}
        />
      ))}
    </div>
  );
}
