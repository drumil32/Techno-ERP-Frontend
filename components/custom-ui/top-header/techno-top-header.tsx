import TechnoTopHeaderItem from './techno-top-header-item';

interface TechnoTopHeaderProps {
  headerItems: Record<string, string>;
}

export default function TechnoTopHeader({ headerItems }: TechnoTopHeaderProps) {
  return (
    <div className="w-full h-16 border-b border-gray-300 flex items-center bg-white px-4">
      {Object.entries(headerItems).map(([key, title]) => (
        <TechnoTopHeaderItem key={key} item={{ title }} />
      ))}
    </div>
  );
}