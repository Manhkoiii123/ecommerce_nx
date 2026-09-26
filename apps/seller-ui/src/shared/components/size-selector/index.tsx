"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";

const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

const SizeSelector = ({ control, errors }: any) => {
  const [customSizes, setCustomSizes] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [newSize, setNewSize] = useState("");

  return (
    <div className="mt-2">
      <label className="block font-semibold text-gray-300 mb-1">Sizes</label>
      <Controller
        name="sizes"
        control={control}
        render={({ field }) => (
          <div className="flex gap-2 flex-wrap items-center">
            {[...defaultSizes, ...customSizes].map((size) => {
              const isSelected = (field.value || []).includes(size);
              return (
                <button
                  type="button"
                  key={size}
                  onClick={() =>
                    field.onChange(
                      isSelected
                        ? field.value.filter((s: string) => s !== size)
                        : [...(field.value || []), size],
                    )
                  }
                  className={`min-w-10 h-9 px-3 rounded-md text-sm font-medium border transition ${
                    isSelected
                      ? "bg-blue-600 border-blue-500 text-white scale-105"
                      : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {size}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-500 bg-gray-800 hover:bg-gray-700 transition"
            >
              <Plus size={16} color="white" />
            </button>

            {showCustomInput && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value.toUpperCase())}
                  placeholder="e.g. 42"
                  className="w-24 border outline-none border-gray-700 bg-gray-800 p-2 rounded-md text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const size = newSize.trim();
                    if (!size) return;
                    if (![...defaultSizes, ...customSizes].includes(size)) {
                      setCustomSizes([...customSizes, size]);
                    }
                    setNewSize("");
                    setShowCustomInput(false);
                  }}
                  className="px-3 py-1 bg-gray-700 text-white rounded-md text-sm"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        )}
      />
      {errors?.sizes && (
        <p className="text-red-500 text-xs mt-1">
          {errors.sizes.message as string}
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
