interface DescriptionCardProps {
  description: string;
}

/** Card displaying the listing description */
const DescriptionCard = ({ description }: DescriptionCardProps) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-2">
      Description
    </span>
    <p className="text-sm text-gray-600 leading-relaxed">
      {description || "No description provided."}
    </p>
  </div>
);

export default DescriptionCard;
