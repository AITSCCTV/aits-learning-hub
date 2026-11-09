import { useState } from "react";

export function SopChecklist({ content }: { content: string }) {
  const [checked, setChecked] = useState<number[]>([]);
  return (
    <div className="space-y-3">
      {content.split("\n").map((line, index) => {
        if (!/^\d+[.)]\s/.test(line))
          return (
            <p key={index} className="whitespace-pre-wrap leading-7">
              {line}
            </p>
          );
        return (
          <label key={index} className="flex items-start gap-3 rounded-lg border p-3">
            <input
              className="mt-1"
              type="checkbox"
              checked={checked.includes(index)}
              onChange={(event) =>
                setChecked(
                  event.target.checked
                    ? [...checked, index]
                    : checked.filter((item) => item !== index),
                )
              }
            />
            <span>{line}</span>
          </label>
        );
      })}
    </div>
  );
}
