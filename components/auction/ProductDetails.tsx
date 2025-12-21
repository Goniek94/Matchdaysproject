interface ProductDetail {
  label: string;
  value: string;
}

interface ProductDetailsProps {
  description: string;
  details: ProductDetail[];
}

export default function ProductDetails({
  description,
  details,
}: ProductDetailsProps) {
  return (
    <div className="mb-12">
      {/* Description */}
      <h2 className="text-2xl font-light mb-6 pb-3 border-b border-gray-200">
        Product Details
      </h2>

      <p className="text-base text-gray-700 leading-relaxed mb-8">
        {description}
      </p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-px bg-gray-200">
        {details.map((detail, index) => (
          <div
            key={index}
            className="bg-white p-4 flex justify-between items-center"
          >
            <span className="text-sm text-gray-600">{detail.label}</span>
            <span className="text-sm font-medium text-black">
              {detail.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
