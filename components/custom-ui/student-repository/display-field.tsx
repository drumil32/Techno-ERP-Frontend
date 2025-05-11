export const DisplayField: React.FC<{ label: string; value: string | null }> = ({
  label,
  value
}) => (
  <div className="col-span-1 min-h-[50px] gap-y-0">
    <div className="font-inter font-normal text-xs text-gray-500">{label}</div>
    <div className="text-sm font-medium py-2">{value || '-'}</div>
    <div className="h-5" />
  </div>
);
