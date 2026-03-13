/** Horizontal detail row for the specs table */
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between px-4 py-2.5">
    <span className="text-xs font-medium text-gray-500">{label}</span>
    <span className="text-xs font-bold text-gray-900 text-right capitalize">
      {value}
    </span>
  </div>
);

export default DetailRow;
