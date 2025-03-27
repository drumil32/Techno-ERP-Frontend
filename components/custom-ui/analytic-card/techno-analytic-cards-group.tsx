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
    <div className="w-full flex flex-row gap-[12px] flex-wrap">
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
