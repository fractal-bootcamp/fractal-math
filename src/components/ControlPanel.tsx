import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

interface ControlPanelProps {
  title: string;
  parameters: Record<string, number>;
  onParameterChange: (param: string, value: number) => void;
  parameterDescriptions: Record<string, string>;
}

export function ControlPanel({
  title,
  parameters,
  onParameterChange,
  parameterDescriptions,
}: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute top-4 left-4 w-40 bg-black/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-2 flex items-center justify-between text-white hover:bg-black/60"
      >
        <span className="font-medium text-sm">{title}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? "max-h-96" : "max-h-0"
        } overflow-hidden`}
      >
        <div className="p-3 space-y-3">
          {Object.entries(parameters).map(([param, value]) => (
            <div key={param} className="space-y-1">
              <div className="text-xs text-white">
                {parameterDescriptions[param]}
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={value}
                onChange={(e) =>
                  onParameterChange(param, parseFloat(e.target.value))
                }
                className="w-full h-1.5"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
