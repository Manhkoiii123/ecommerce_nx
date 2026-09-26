"use client";

import { Pencil, WandSparkles, X } from "lucide-react";

const ImagePlaceHolder = ({
  onImageChange,
  onRemove,
  setOpenImageModal,
  size,
  imagesPreview,
  index,
  small,
}: {
  size: string;
  small?: boolean;
  onImageChange: (file: File | null, index: number) => void;
  onRemove: (index: number) => void;
  imagesPreview?: string | null;
  setOpenImageModal: (openImageModal: boolean) => void;
  index?: number;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file, index!);
    }
    // allow re-selecting the same file
    e.target.value = "";
  };

  return (
    <div
      className="border border-gray-600 rounded-lg flex flex-col justify-center items-center relative aspect-square w-full overflow-hidden bg-[#1e1e1e]"
    >
      <input
        type="file"
        className="hidden"
        accept="image/*"
        id={`image-upload-${index}`}
        onChange={handleFileChange}
      />
      {imagesPreview ? (
        <>
          <button
            type="button"
            onClick={() => onRemove(index!)}
            className="absolute top-3 right-3 z-10 p-2 rounded bg-red-600 shadow-lg"
          >
            <X size={16} />
          </button>
          <button
            type="button"
            onClick={() => setOpenImageModal(true)}
            className="absolute top-3 right-[70px] z-10 p-2 rounded bg-blue-500 shadow-lg cursor-pointer"
          >
            <WandSparkles size={16} />
          </button>
          <img
            src={imagesPreview}
            alt="preview"
            className="rounded-lg w-full h-full object-cover"
          />
        </>
      ) : (
        <>
          <label
            htmlFor={`image-upload-${index}`}
            className="absolute top-3 right-3 z-10 p-2 rounded bg-slate-700 shadow-lg cursor-pointer"
          >
            <Pencil size={16} />
          </label>
          <p
            className={`text-gray-400 ${small ? "text-xl" : "text-4xl"} font-semibold`}
          >
            {size}
          </p>
          <p
            className={`text-gray-500 ${small ? "text-sm" : "text-lg"} pt-2 text-center`}
          >
            Please choose an image <br /> according to the expected ratio
          </p>
        </>
      )}
    </div>
  );
};

export default ImagePlaceHolder;
