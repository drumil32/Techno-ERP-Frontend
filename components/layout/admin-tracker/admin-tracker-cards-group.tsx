import { motion } from 'framer-motion';
import AdminTrackerCard from './admin-tracker-card';

export interface CardItem {
  heading: string;
  subheading: string;
  title: string;
  color?: string;
}

interface TechnoAnalyticCardsGroupProps {
  cardsData: CardItem[];
}

export default function AdminTrackerCardGroup({ cardsData }: TechnoAnalyticCardsGroupProps) {
  return (
    <div className="w-full flex flex-row gap-3 flex-wrap">
      {cardsData.map(({ heading, subheading, title, color }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <AdminTrackerCard heading={heading} subheading={subheading} title={title} color={color} />
        </motion.div>
      ))}
    </div>
  );
}
