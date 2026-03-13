"use client";

/**
 * EditSectionBasic
 * Title and description fields for the edit form
 */

import type { EditFormState, EditFormErrors } from "./useEditForm";

interface EditSectionBasicProps {
  form: EditFormState;
  errors: EditFormErrors;
  setField: <K extends keyof EditFormState>(
    key: K,
    value: EditFormState[K],
  ) => void;
}

export default function EditSectionBasic({
  form,
  errors,
  setField,
}: EditSectionBasicProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
        Basic Info
      </h3>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setField("title", e.target.value)}
          maxLength={120}
          placeholder="e.g. Manchester United 1999 Home Jersey"
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-black/10 ${
            errors.title
              ? "border-red-400 bg-red-50"
              : "border-gray-200 focus:border-gray-400"
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.title ? (
            <p className="text-xs text-red-500">{errors.title}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-gray-400 ml-auto">
            {form.title.length}/120
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-gray-700 mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Describe the condition, history, authenticity details..."
          className={`w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 focus:ring-black/10 resize-none ${
            errors.description
              ? "border-red-400 bg-red-50"
              : "border-gray-200 focus:border-gray-400"
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.description ? (
            <p className="text-xs text-red-500">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-gray-400 ml-auto">
            {form.description.length}/2000
          </p>
        </div>
      </div>
    </div>
  );
}
