import TechnoTopHeaderItem from "./techno-top-header-item";

interface TechnoTopHeaderProps {
  headerItems: Record<string, { title: string; route: string }>;
}

export default function TechnoTopHeader({ headerItems }: TechnoTopHeaderProps) {
  return (
    <div className="flex gap-4">
      {Object.values(headerItems).map((item) => (
        <TechnoTopHeaderItem key={item.title} item={item} />
      ))}
    </div>
  );
}
