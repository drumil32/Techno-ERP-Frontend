import { useTopHeaderContext } from '../top-header/top-header-context';

export default function TechnoPageTitle() {
  const { headerActiveItem } = useTopHeaderContext();

  return (
    headerActiveItem == 'Admin Tracker' && (
      <div className=" font-[700]  text-3xl text-[#4E4E4E]">{headerActiveItem}</div>
    )
  );
}
