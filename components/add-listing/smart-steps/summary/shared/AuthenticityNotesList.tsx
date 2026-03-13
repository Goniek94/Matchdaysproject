import { CheckCircle2 } from "lucide-react";

interface AuthenticityNotesListProps {
  notes: string;
}

/** Parse and render authenticity notes as a numbered list */
const AuthenticityNotesList = ({ notes }: AuthenticityNotesListProps) => {
  // Split notes by numbered points (e.g. "1. ...\n2. ...") or by newlines
  const lines = notes
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Check if notes are already numbered (starts with "1." or similar)
  const isNumbered = lines.some((line) => /^\d+\.\s/.test(line));

  if (isNumbered && lines.length > 1) {
    return (
      <ol className="mt-3 space-y-2">
        {lines.map((line, i) => {
          const match = line.match(/^(\d+)\.\s*(.*)/);
          const number = match ? match[1] : String(i + 1);
          const content = match ? match[2] : line;

          const colonIdx = content.indexOf(":");
          const label = colonIdx > -1 ? content.slice(0, colonIdx) : null;
          const desc =
            colonIdx > -1 ? content.slice(colonIdx + 1).trim() : content;

          return (
            <li key={i} className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {number}
              </span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {label && (
                  <span className="font-semibold text-gray-800">{label}: </span>
                )}
                {desc}
              </p>
            </li>
          );
        })}
      </ol>
    );
  }

  // Fallback: try splitting by bullet points (• or -) for backward compatibility
  const bulletLines = notes
    .split(/[•\-]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (bulletLines.length > 1) {
    return (
      <ol className="mt-3 space-y-2">
        {bulletLines.map((line, i) => {
          const colonIdx = line.indexOf(":");
          const label = colonIdx > -1 ? line.slice(0, colonIdx) : null;
          const desc = colonIdx > -1 ? line.slice(colonIdx + 1).trim() : line;

          return (
            <li key={i} className="flex items-start gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {label && (
                  <span className="font-semibold text-gray-800">{label}: </span>
                )}
                {desc}
              </p>
            </li>
          );
        })}
      </ol>
    );
  }

  // Ultimate fallback: single paragraph
  return (
    <p className="text-[11px] text-gray-500 mt-2 leading-relaxed flex items-start gap-1.5">
      <CheckCircle2 size={10} className="shrink-0 mt-0.5 text-green-500" />
      {notes}
    </p>
  );
};

export default AuthenticityNotesList;
