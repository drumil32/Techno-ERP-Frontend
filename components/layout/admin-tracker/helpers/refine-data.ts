import { CardItem } from "@/components/custom-ui/analytic-card/techno-analytic-cards-group";

const calculatePercentage = (count: number, total: number): string => {
  if (!total || total === 0) return "0%";
  return `${Math.round((count / total) * 100)}%`;
};

export const refineAnalytics = (
  data: Record<string, number | undefined>,
  totalKey: string,
  labels: Record<string, string>,
  colors: Record<string, string>
): CardItem[] => {
  const total = data[totalKey] ?? 0;

  return Object.keys(data).map((key) => ({
    heading: (data[key] ?? "").toString(),
    subheading: key === totalKey ? "100%" : calculatePercentage(data[key] ?? 0, total),
    title: labels[key] || key,
    color: colors[key] || "text-black",
  }));
};