import { useTopHeaderContext } from "../top-header/top-header-context";

export default function TechnoPageTitle() {
    const { headerActiveItem } = useTopHeaderContext()

    return (
        <div className="my-4 font-black tracking-wider text-3xl text-gray-700">
            {headerActiveItem}
        </div>
    )

}
