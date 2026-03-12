"use client";
import UITypography from "@/components/UITypography/UITypography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { homepageContentSchema } from "@/utils/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import UITextField from "@/components/InputFields/UITextField";
import UIButton from "@/components/UIButton/UIButton";
import { apiPost, apiPut } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import SEOForm from "@/containers/Products/SEOForm";
import BlogSEOForm from "@/containers/Blogs/BlogSEOForm";
import { toast } from "sonner";
import { getAllCategories } from "@/store/actions/category";
import { getAllProducts } from "@/store/actions/products";

const page = () => {
  const dispatch = useDispatch();

  const allProducts = useSelector((state) => state?.GetAllProductsReducer?.res);
  const getAllCategoriesData = useSelector(
    (state) => state?.GetAllCategoriesReducer?.res,
  );

  const [inputData, setInputData] = useState({
    metaTitle: "",
    metaDescription: "",
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLatestClasses, setSelectedLatestClasses] = useState([]);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [latestClassesDropdownOpen, setLatestClassesDropdownOpen] =
    useState(false);

  const MAX_TOTAL_SELECTIONS = 10;

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleProductSelect = (product) => {
    const remainingSlots = MAX_TOTAL_SELECTIONS - selectedCategories.length;

    setSelectedProducts((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Remove if already selected
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        // Add if not selected and within limit
        if (prev.length < remainingSlots) {
          return [...prev, product];
        }
        return prev;
      }
    });
  };

  const handleCategorySelect = (category) => {
    const remainingSlots = MAX_TOTAL_SELECTIONS - selectedProducts.length;

    setSelectedCategories((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === category.id);

      if (existingIndex > -1) {
        // Remove if already selected
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        // Add if not selected and within limit
        if (prev.length < remainingSlots) {
          return [...prev, category];
        }
        return prev;
      }
    });
  };

  const handleLatestClassSelect = (product) => {
    const MAX_LATEST_CLASSES = 9;

    setSelectedLatestClasses((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Remove if already selected
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        // Add if not selected and within limit
        if (prev.length < MAX_LATEST_CLASSES) {
          return [...prev, product];
        }
        return prev;
      }
    });
  };

  function onSubmitSeo() {
    const dataObj = {
      metaTitle: inputData.metaTitle,
      metaDescription: inputData.metaDescription,
    };
    apiPost(
      `${ApiEndpoints.home.create}`,
      dataObj,
      (res) => {
        console.log("res", res);
        toast.success(res?.data?.message);
      },
      (err) => {
        console.log("err", err);
      },
    );
  }
  function onSubmitTopSelling() {
    const topSellingArray = [
      ...selectedCategories.map((category) => ({
        type: "collection",
        id: category.id,
      })),
      ...selectedProducts.map((product) => ({
        type: "class",
        id: product.id,
      })),
    ];

    const dataObj = {
      topSelling: topSellingArray,
    };
    console.log("dataObj", dataObj);
    apiPut(
      `${ApiEndpoints.home.updateTopSelling}`,
      dataObj,
      (res) => {
        console.log("res", res);
        toast.success(res?.data?.message);
      },
      (err) => {
        console.log("err", err);
      },
    );
  }
  function onSubmitLatestClases() {
    const latestSelingsArray = selectedLatestClasses.map((product) => ({
      type: "class",
      id: product.id,
    }));

    const dataObj = {
      latestSellings: latestSelingsArray,
    };
    console.log("dataObj", dataObj);
    apiPut(
      `${ApiEndpoints.home.updateLatestSelling}`,
      dataObj,
      (res) => {
        console.log("res", res);
        toast.success(res?.data?.message);
      },
      (err) => {
        console.log("err", err);
      },
    );
  }

  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllProducts());
  }, []);

  console.log("getAllCategoriesData", getAllCategoriesData);
  console.log("allProducts", allProducts);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Home Page Content" />
      </div>
      <div className="flex flex-col gap-3 w-[50%]">
        <div>
          <UITypography variant="h5" text="Top Selling Collections" />
          <p className="text-sm text-gray-600 mt-2">
            Total selections:{" "}
            {selectedProducts.length + selectedCategories.length}/
            {MAX_TOTAL_SELECTIONS}
          </p>
        </div>

        {/* Products Dropdown */}
        <div className="relative w-full mt-4">
          <UITypography
            variant="h6"
            text="Select Classes"
            className="!text-[14px] mb-2"
          />
          <button
            type="button"
            onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50"
          >
            <span className="text-sm">
              {selectedProducts?.length > 0
                ? `${selectedProducts?.length} selected`
                : "Select Classes"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                productsDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          {productsDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {allProducts?.res?.data?.data?.length > 0 ? (
                allProducts?.res?.data?.data?.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProducts?.some(
                        (selected) => selected.id === item.id,
                      )}
                      onChange={() => handleProductSelect(item)}
                      disabled={
                        selectedProducts.length + selectedCategories.length >=
                          MAX_TOTAL_SELECTIONS &&
                        !selectedProducts.some(
                          (selected) => selected.id === item.id,
                        )
                      }
                      className="w-4 h-4 mr-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm">{item.productName}</span>
                  </label>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No products available
                </div>
              )}
            </div>
          )}

          {selectedProducts?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedProducts?.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{product.productName}</span>
                  <button
                    type="button"
                    onClick={() => handleProductSelect(product)}
                    className="cursor-pointer hover:text-blue-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Categories Dropdown */}
        <div className="relative w-full mt-4">
          <UITypography
            variant="h6"
            text="Select Categories"
            className="!text-[14px] mb-2"
          />
          <button
            type="button"
            onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50"
          >
            <span className="text-sm">
              {selectedCategories?.length > 0
                ? `${selectedCategories?.length} selected`
                : "Select Categories"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                categoriesDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>

          {categoriesDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {getAllCategoriesData?.res?.data?.length > 0 ? (
                getAllCategoriesData?.res?.data?.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories?.some(
                        (selected) => selected.id === item.id,
                      )}
                      onChange={() => handleCategorySelect(item)}
                      disabled={
                        selectedProducts.length + selectedCategories.length >=
                          MAX_TOTAL_SELECTIONS &&
                        !selectedCategories.some(
                          (selected) => selected.id === item.id,
                        )
                      }
                      className="w-4 h-4 mr-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm">{item.name}</span>
                  </label>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No categories available
                </div>
              )}
            </div>
          )}

          {selectedCategories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories?.map((category, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{category.name}</span>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className="cursor-pointer hover:text-green-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <UIButton
          type="contained"
          title="Submit"
          icon={false}
          btnOnclick={onSubmitTopSelling}
        />

        {/* Latest Classes Section */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <div>
            <UITypography variant="h5" text="Latest Classes" />
            <p className="text-sm text-gray-600 mt-2">
              Total selections: {selectedLatestClasses.length}/9
            </p>
          </div>

          {/* Latest Classes Dropdown */}
          <div className="relative w-full mt-4">
            <UITypography
              variant="h6"
              text="Select Classes"
              className="!text-[14px] mb-2"
            />
            <button
              type="button"
              onClick={() =>
                setLatestClassesDropdownOpen(!latestClassesDropdownOpen)
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <span className="text-sm">
                {selectedLatestClasses?.length > 0
                  ? `${selectedLatestClasses?.length} selected`
                  : "Select Classes"}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  latestClassesDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {latestClassesDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {allProducts?.res?.data?.data?.length > 0 ? (
                  allProducts?.res?.data?.data?.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLatestClasses?.some(
                          (selected) => selected.id === item.id,
                        )}
                        onChange={() => handleLatestClassSelect(item)}
                        disabled={
                          selectedLatestClasses.length >= 9 &&
                          !selectedLatestClasses.some(
                            (selected) => selected.id === item.id,
                          )
                        }
                        className="w-4 h-4 mr-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <span className="text-sm">{item.productName}</span>
                    </label>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No products available
                  </div>
                )}
              </div>
            )}

            {selectedLatestClasses?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedLatestClasses?.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{product.productName}</span>
                    <button
                      type="button"
                      onClick={() => handleLatestClassSelect(product)}
                      className="cursor-pointer hover:text-purple-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <UIButton
            type="contained"
            title="Submit"
            icon={false}
            btnOnclick={onSubmitLatestClases}
            className="mt-4"
          />
        </div>

        <div className="mt-6">
          <UITypography variant="h5" text="SEO Details" />
          <BlogSEOForm
            shortDescription={inputData.shortDescription}
            metaTitle={inputData.metaTitle}
            metaDescription={inputData.metaDescription}
            onChange={(e) => handleInputChange(e)}
          />
          <UIButton
            type="contained"
            title="Submit"
            icon={false}
            btnOnclick={onSubmitSeo}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
