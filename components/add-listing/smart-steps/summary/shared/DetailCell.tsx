/** Small detail cell for verification grid */
const DetailCell = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 rounded-lg p-2.5 min-w-0">
    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5 truncate">
      {label}
    </p>
    <p className="text-xs font-semibold text-gray-800 break-words">{value}</p>
  </div>
);

export default DetailCell;
