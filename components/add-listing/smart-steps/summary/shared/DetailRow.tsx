/** Horizontal detail row for the specs table */
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-3 px-4 py-2.5">
    <span className="text-xs font-medium text-gray-500 shrink-0">{label}</span>
    <span className="text-xs font-bold text-gray-900 text-right capitalize break-words min-w-0">
      {value}
    </span>
  </div>
);

export default DetailRow;
