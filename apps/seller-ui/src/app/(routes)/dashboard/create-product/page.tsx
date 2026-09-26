"use client";
import ImagePlaceHolder from "../../../../shared/components/image-placeholder/index";
import { ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "@packages/components/input";
import ColorSelector from "@packages/components/color-selector";
import CustomSpecifications from "@packages/components/custom-specifications";
import CustomProperties from "@packages/components/custom-properties";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import RichTextEditor from "@/shared/components/rich-text-editor";
import SizeSelector from "@/shared/components/size-selector";

const CreateProductPage = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [images, setImages] = useState<(File | null)[]>([null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null]);
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/product/api/get-categories");
        return res.data;
      } catch (error) {}
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
  const categories = data?.categories || [];
  const subCategoriesData = data?.subCategories || [];

  const selectedCategory = watch("category");
  const regularPrice = watch("regular_price");

  const subCategories = useMemo(() => {
    return selectedCategory ? subCategoriesData[selectedCategory] : [];
  }, [selectedCategory, subCategoriesData]);

  const onSubmit = () => {};

  const handleImageChange = (file: File | null, index: number) => {
    setImages((prev) => {
      const updatedImages = [...prev];
      updatedImages[index] = file;

      if (index === prev.length - 1 && prev.length < 8) {
        updatedImages.push(null);
      }

      setValue("images", updatedImages);
      setIsChanged(true);
      return updatedImages;
    });

    setPreviews((prev) => {
      const updatedPreviews = [...prev];
      if (updatedPreviews[index]) {
        URL.revokeObjectURL(updatedPreviews[index]!);
      }
      updatedPreviews[index] = file ? URL.createObjectURL(file) : null;

      if (index === prev.length - 1 && prev.length < 8) {
        updatedPreviews.push(null);
      }

      return updatedPreviews;
    });
  };

  const handleRemoveImage = (index: number) => {
    setPreviews((prev) => {
      const updatedPreviews = [...prev];
      if (updatedPreviews[index]) {
        URL.revokeObjectURL(updatedPreviews[index]!);
      }
      updatedPreviews.splice(index, 1);

      if (
        updatedPreviews.length === 0 ||
        (!updatedPreviews.includes(null) && updatedPreviews.length < 8)
      ) {
        updatedPreviews.push(null);
      }

      return updatedPreviews;
    });

    setImages((prev) => {
      const updatedImages = prev.filter((_, i) => i !== index);

      if (
        updatedImages.length === 0 ||
        (!updatedImages.includes(null) && updatedImages.length < 8)
      ) {
        updatedImages.push(null);
      }

      setValue("images", updatedImages);
      setIsChanged(true);
      return updatedImages;
    });
  };
  const handleSaveDraft = () => {};

  return (
    <form
      className="w-full mx-auto p-8 shadow-md rounded-lg text-white"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-2xl py-2 font-semibold font-poppins text-white">
        Create product
      </h2>
      <div className="flex items-center">
        <span className="text-[#80Deea] cursor-pointer">Dashboard</span>
        <ChevronRight className="opacity-[0.8]" size={20} />
        <span>Create Product</span>
      </div>
      <div className="py-4 w-full flex gap-6">
        <div className="md:w-[35%] shrink-0">
          {images.length > 0 && (
            <ImagePlaceHolder
              setOpenImageModal={setOpenImageModal}
              size="1 : 1"
              small={false}
              index={0}
              imagesPreview={previews[0]}
              onImageChange={handleImageChange}
              onRemove={handleRemoveImage}
            />
          )}
          <div className="w-[280px] shrink-0 grid grid-cols-2 gap-3 mt-4 self-start">
            {images.slice(1).map((_, index) => (
              <ImagePlaceHolder
                key={`slot-${index + 1}`}
                setOpenImageModal={setOpenImageModal}
                size="1 : 1"
                small
                index={index + 1}
                imagesPreview={previews[index + 1]}
                onImageChange={handleImageChange}
                onRemove={handleRemoveImage}
              />
            ))}
          </div>
        </div>
        <div className="w-[65%] min-w-0">
          <div className="w-full flex gap-6">
            <div className="w-2/4">
              <Input
                label="Product title *"
                placeholder="Enter product title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message as string}
                </p>
              )}
              <div className="mt-2">
                <Input
                  type="textarea"
                  rows={7}
                  cols={10}
                  label="Short product description for quick view"
                  {...register("description", {
                    required: "Description is required",
                    validate: (value) => {
                      const wordCount = value.trim().split(/\s+/).length;
                      return (
                        wordCount <= 150 ||
                        `Description cannot exceed 150 words (Current: ${wordCount})`
                      );
                    },
                  })}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description.message as string}
                  </p>
                )}
                <div className="mt-2">
                  <Input
                    label="Tags *"
                    placeholder="apple,flagship"
                    {...register("tags", {
                      required: "Seperate related products tags with a coma,",
                    })}
                  />
                  {errors.tags && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.tags.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    label="Warranty *"
                    placeholder="1 Year / No Warranty"
                    {...register("warranty", {
                      required: "Warranty is required",
                    })}
                  />
                  {errors.warranty && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.warranty.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    label="Slug *"
                    placeholder="product_slug"
                    {...register("slug", {
                      required: "Product slug is required",
                      pattern: {
                        value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        message:
                          "Invalid slug format. Use only lowercase letters, numbers, and",
                      },
                      minLength: {
                        value: 3,
                        message: "Slug must be at least 3 characters long.",
                      },
                      maxLength: {
                        value: 50,
                        message:
                          "Slug cannot be longer than 50 characters long.",
                      },
                    })}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.slug.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <Input
                    label="Brand"
                    placeholder="Apple"
                    {...register("brand")}
                  />
                  {errors.brand && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.brand.message as string}
                    </p>
                  )}
                </div>
                <div className="mt-2">
                  <ColorSelector control={control} errors={errors} />
                </div>
                <div className="mt-2">
                  <CustomSpecifications control={control} errors={errors} />
                </div>
                <div className="mt-2">
                  <CustomProperties control={control} errors={errors} />
                </div>
                <div className="mt-2">
                  <label className="block font-semibold text-gray-300 mb-1">
                    Cash On Delivery *
                  </label>
                  <select
                    {...register("cash_on_delivery", {
                      required: "Cash on delivery is required",
                    })}
                    defaultValue={"yes"}
                    className="w-full border outline-none border-gray-700 bg-transparent"
                  >
                    <option value="yes" className="bg-black">
                      Yes
                    </option>
                    <option value="no" className="bg-black">
                      No
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div className="w-2/4">
              <label className="block font-semibold text-gray-300 mb-1">
                Category*
              </label>
              {isLoading ? (
                <p className="text-gray-700">Loading...</p>
              ) : isError ? (
                <p className="text-red-500">Failed to load categories</p>
              ) : (
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Category is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border outline-none border-gray-700 bg-transparent"
                    >
                      <option value="" className="bg-black">
                        Select category
                      </option>
                      {categories.map((item: string) => (
                        <option value={item} key={item} className="bg-black">
                          {item}
                        </option>
                      ))}
                    </select>
                  )}
                ></Controller>
              )}

              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message as string}
                </p>
              )}

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Subcategory*
                </label>
                {isLoading ? (
                  <p className="text-gray-700">Loading...</p>
                ) : isError ? (
                  <p className="text-red-500">Failed to load categories</p>
                ) : (
                  <Controller
                    name="subcategory"
                    control={control}
                    rules={{ required: "Sub category is required" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full border outline-none border-gray-700 bg-transparent"
                      >
                        <option value="" className="bg-black">
                          Select sub-category
                        </option>
                        {subCategories.map((item: string) => (
                          <option value={item} key={item} className="bg-black">
                            {item}
                          </option>
                        ))}
                      </select>
                    )}
                  ></Controller>
                )}
                {errors.subcategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subcategory.message as string}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Detail description* (Min 100 words)
                </label>
                <Controller
                  name="detailed_description"
                  control={control}
                  rules={{
                    required: "Detailed description is required",
                    validate: (value) => {
                      const wordCount = value
                        ?.split(/\s+/)
                        .filter((word: string) => word).length;
                      return (
                        wordCount >= 100 ||
                        "Description must be at least 100 words!"
                      );
                    },
                  }}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.detailed_description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.detailed_description.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Video URL"
                  placeholder="https://www.youtube.com/embed/xyz123"
                  {...register("video_url", {
                    pattern: {
                      value:
                        /^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+$/,
                      message:
                        "Invalid YouTube embed URL! Use format: https://www.youtube.com/embed/...",
                    },
                  })}
                />

                {errors.video_url && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.video_url.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Regular Price"
                  placeholder="20$"
                  {...register("regular_price", {
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be at least 1" },
                    validate: (value) =>
                      !isNaN(value) || "Only numbers are allowed",
                  })}
                />
                {errors.regular_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.regular_price.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Sale Price*"
                  placeholder="20$"
                  {...register("sale_price", {
                    required: "Sale price is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Price must be at least 1" },
                    validate: (value) => {
                      if (isNaN(value)) return "Only numbers are allowed";
                      if (regularPrice && value >= regularPrice) {
                        return "Sale price must be less than regular price";
                      }
                      return true;
                    },
                  })}
                />
                {errors.sale_price && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.sale_price.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <Input
                  label="Stock *"
                  placeholder="100"
                  {...register("stock", {
                    required: "Stock is required!",
                    valueAsNumber: true,
                    min: { value: 1, message: "Stock must be at least 1" },
                    max: {
                      value: 1000,
                      message: "Stock cannot exceed 1,000",
                    },
                    validate: (value) => {
                      if (isNaN(value)) return "Only numbers are allowed!";
                      if (!Number.isInteger(value))
                        return "Stock must be a whole number!";
                      return true;
                    },
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.stock.message as string}
                  </p>
                )}
              </div>
              <div className="mt-2">
                <SizeSelector control={control} errors={errors} />
              </div>
              <div className="mt-2">
                <label className="block font-semibold text-gray-300 mb-1">
                  Select discount codes (optional)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        {isChanged && (
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2 bg-gray-700 text-white rounded-md"
          >
            Save draft
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CreateProductPage;
