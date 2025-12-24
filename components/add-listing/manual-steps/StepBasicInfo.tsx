"use client";

interface StepBasicInfoProps {
  data: any; // Możesz zaimportować dokładny typ FormData z pliku types
  updateData: (field: string, value: any) => void;
}

export default function StepBasicInfo({
  data,
  updateData,
}: StepBasicInfoProps) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-right-8 duration-500">
      <h2 className="text-3xl font-black mb-8">Basic Info</h2>
      <div className="grid gap-6">
        <div>
          <label className="text-xs font-bold uppercase text-gray-500">
            Title
          </label>
          <input
            value={data.title}
            onChange={(e) => updateData("title", e.target.value)}
            className="w-full p-4 bg-gray-50 rounded-xl border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="e.g. 2008 Manchester United Home Shirt"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            value={data.brand}
            onChange={(e) => updateData("brand", e.target.value)}
            placeholder="Brand (e.g. Nike)"
            className="p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            value={data.team}
            onChange={(e) => updateData("team", e.target.value)}
            placeholder="Team"
            className="p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            value={data.year}
            onChange={(e) => updateData("year", e.target.value)}
            placeholder="Year/Season"
            className="p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            value={data.size}
            onChange={(e) => updateData("size", e.target.value)}
            placeholder="Size (e.g. L)"
            className="p-4 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>
    </div>
  );
}
