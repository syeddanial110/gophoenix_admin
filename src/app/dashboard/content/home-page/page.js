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
import { apiGet, apiPost, apiPut } from "@/apis/ApiRequest";
import { ApiEndpoints } from "@/utils/ApiEndpoints";
import SEOForm from "@/containers/Products/SEOForm";
import HomePageSEOForm from "@/containers/Blogs/HomePageSEOForm";
import { toast } from "sonner";
import { getAllCategories } from "@/store/actions/category";
import { getAllProducts } from "@/store/actions/products";
import UIInputField from "@/components/InputFields/UIInputField";
import RichTextEditor from "@/components/UIRichTextEditor/UIRichTextEditor";

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
  const [headingVal, setHeadingVal] = useState({
    heading2Val: "",
  });
  const [selectedLatestClasses, setSelectedLatestClasses] = useState([]);
  const [latestClassesDropdownOpen, setLatestClassesDropdownOpen] =
    useState(false);

  const MAX_TOTAL_SELECTIONS = 10;

  const createEmptySection = () => ({
    heading: "",
    selectedProducts: [],
    selectedCategories: [],
    productsDropdownOpen: false,
    categoriesDropdownOpen: false,
  });

  const [topSellingSections, setTopSellingSections] = useState([
    createEmptySection(),
  ]);
  const [rawTopSelling, setRawTopSelling] = useState(null);

  const handleInputChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const updateSection = (index, updater) => {
    setTopSellingSections((prev) =>
      prev.map((section, i) => (i === index ? updater(section) : section)),
    );
  };

  const handleSectionHeading = (index, html) => {
    updateSection(index, (s) => ({ ...s, heading: html }));
  };

  const handleProductSelect = (index, product) => {
    updateSection(index, (s) => {
      const remainingSlots = MAX_TOTAL_SELECTIONS - s.selectedCategories.length;
      const existingIndex = s.selectedProducts.findIndex(
        (item) => item.id === product.id,
      );
      if (existingIndex > -1) {
        return {
          ...s,
          selectedProducts: s.selectedProducts.filter(
            (_, i) => i !== existingIndex,
          ),
        };
      }
      if (s.selectedProducts.length < remainingSlots) {
        return { ...s, selectedProducts: [...s.selectedProducts, product] };
      }
      return s;
    });
  };

  const handleCategorySelect = (index, category) => {
    updateSection(index, (s) => {
      const remainingSlots = MAX_TOTAL_SELECTIONS - s.selectedProducts.length;
      const existingIndex = s.selectedCategories.findIndex(
        (item) => item.id === category.id,
      );
      if (existingIndex > -1) {
        return {
          ...s,
          selectedCategories: s.selectedCategories.filter(
            (_, i) => i !== existingIndex,
          ),
        };
      }
      if (s.selectedCategories.length < remainingSlots) {
        return { ...s, selectedCategories: [...s.selectedCategories, category] };
      }
      return s;
    });
  };

  const toggleProductsDropdown = (index) => {
    updateSection(index, (s) => ({
      ...s,
      productsDropdownOpen: !s.productsDropdownOpen,
      categoriesDropdownOpen: false,
    }));
  };

  const toggleCategoriesDropdown = (index) => {
    updateSection(index, (s) => ({
      ...s,
      categoriesDropdownOpen: !s.categoriesDropdownOpen,
      productsDropdownOpen: false,
    }));
  };

  const addSection = () => {
    setTopSellingSections((prev) => [...prev, createEmptySection()]);
  };

  const removeSection = (index) => {
    setTopSellingSections((prev) => prev.filter((_, i) => i !== index));
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
    const dataObj = topSellingSections.map((section) => ({
      section1Heading: section.heading,
      topSelling: [
        ...section.selectedCategories.map((category) => ({
          type: "collection",
          id: category.id,
        })),
        ...section.selectedProducts.map((product) => ({
          type: "class",
          id: product.id,
        })),
      ],
    }));
    console.log("dataObj", dataObj);
    apiPut(
      `${ApiEndpoints.home.updateTopSelling}`,
      {sections: dataObj},
      (res) => {
        console.log("res", res);
        toast.success(res?.data?.message);
      },
      (err) => {
        console.log("err", err);
      },
    );
  }

  const handleHeadingUpdate = (e) => {
    setHeadingVal({ ...headingVal, [e.target.name]: e.target.value });
  };

  function onSubmitLatestClases() {
    const latestSelingsArray = selectedLatestClasses.map((product) => ({
      type: "class",
      id: product.id,
    }));

    const dataObj = {
      section2Heading: headingVal.heading2Val,
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
    apiGet(
      `${ApiEndpoints.home.get}`,
      (res) => {
        const data = res?.data?.topSelling;
        if (data?.length > 0) {
          setRawTopSelling(data);
        }
      },
      (err) => {
        console.log("err", err);
      },
    );
  }, []);

  useEffect(() => {
    if (!rawTopSelling) return;
    const products = allProducts?.res?.data?.data;
    const categories = getAllCategoriesData?.res?.data;
    if (!products || !categories) return;

    const populated = rawTopSelling.map((section) => {
      const selectedProducts = section.topSelling
        .filter((item) => item.type === "class")
        .map((item) => products.find((p) => p.id === item.id))
        .filter(Boolean);

      const selectedCategories = section.topSelling
        .filter((item) => item.type === "collection")
        .map((item) => categories.find((c) => c.id === item.id))
        .filter(Boolean);

      return {
        heading: section.section1Heading || "",
        selectedProducts,
        selectedCategories,
        productsDropdownOpen: false,
        categoriesDropdownOpen: false,
      };
    });

    setTopSellingSections(populated);
    setRawTopSelling(null);
  }, [rawTopSelling, allProducts, getAllCategoriesData]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Home Page Content" />
      </div>
      <div className="flex flex-col gap-3 w-[50%]">
        {topSellingSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <UITypography
                variant="h6"
                text={`Section ${sectionIndex + 1}`}
                className="!text-[14px] font-semibold"
              />
              {topSellingSections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(sectionIndex)}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-300 hover:border-red-500 rounded px-2 py-1"
                >
                  Remove Section
                </button>
              )}
            </div>

            <div>
              <UITypography
                variant="h6"
                text="Enter the heading for this section"
                className="!text-[14px] mb-1"
              />
              <RichTextEditor
                placeholder="Start typing here..."
                htmlOutput={section.heading}
                setHtmlOutput={(html) => handleSectionHeading(sectionIndex, html)}
              />
              <p className="text-sm text-gray-600 mt-2">
                Total selections:{" "}
                {section.selectedProducts.length + section.selectedCategories.length}/
                {MAX_TOTAL_SELECTIONS}
              </p>
            </div>

            {/* Classes Dropdown */}
            <div className="relative w-full">
              <UITypography
                variant="h6"
                text="Select Classes"
                className="!text-[14px] mb-2"
              />
              <button
                type="button"
                onClick={() => toggleProductsDropdown(sectionIndex)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50"
              >
                <span className="text-sm">
                  {section.selectedProducts?.length > 0
                    ? `${section.selectedProducts.length} selected`
                    : "Select Classes"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    section.productsDropdownOpen ? "rotate-180" : ""
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

              {section.productsDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {allProducts?.res?.data?.data?.length > 0 ? (
                    allProducts.res.data.data.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={section.selectedProducts.some(
                            (selected) => selected.id === item.id,
                          )}
                          onChange={() => handleProductSelect(sectionIndex, item)}
                          disabled={
                            section.selectedProducts.length +
                              section.selectedCategories.length >=
                              MAX_TOTAL_SELECTIONS &&
                            !section.selectedProducts.some(
                              (selected) => selected.id === item.id,
                            )
                          }
                          className="w-4 h-4 mr-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div
                          className="prose max-w-none [&>h1]:text-[16px] [&>h1]:font-bold [&>h2]:text-[15px] [&>h2]:font-semibold [&>h3]:text-[14px] [&>h3]:font-semibold [&>p]:text-[14px]"
                          dangerouslySetInnerHTML={{ __html: item.productName }}
                        />
                      </label>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No products available
                    </div>
                  )}
                </div>
              )}

              {section.selectedProducts.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                  {section.selectedProducts.map((product, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-4 py-2 text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <div
                        className="prose max-w-none flex-1 [&>*]:!m-0 [&>*]:!text-[13px] [&>*]:!font-normal [&>*]:!text-gray-700"
                        dangerouslySetInnerHTML={{ __html: product.productName }}
                      />
                      <button
                        type="button"
                        onClick={() => handleProductSelect(sectionIndex, product)}
                        className="ml-3 text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Categories Dropdown */}
            <div className="relative w-full">
              <UITypography
                variant="h6"
                text="Select Categories"
                className="!text-[14px] mb-2"
              />
              <button
                type="button"
                onClick={() => toggleCategoriesDropdown(sectionIndex)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between bg-white hover:bg-gray-50"
              >
                <span className="text-sm">
                  {section.selectedCategories?.length > 0
                    ? `${section.selectedCategories.length} selected`
                    : "Select Categories"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    section.categoriesDropdownOpen ? "rotate-180" : ""
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

              {section.categoriesDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {getAllCategoriesData?.res?.data?.length > 0 ? (
                    getAllCategoriesData.res.data.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={section.selectedCategories.some(
                            (selected) => selected.id === item.id,
                          )}
                          onChange={() => handleCategorySelect(sectionIndex, item)}
                          disabled={
                            section.selectedProducts.length +
                              section.selectedCategories.length >=
                              MAX_TOTAL_SELECTIONS &&
                            !section.selectedCategories.some(
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

              {section.selectedCategories.length > 0 && (
                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                  {section.selectedCategories.map((category, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-4 py-2 text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <button
                        type="button"
                        onClick={() => handleCategorySelect(sectionIndex, category)}
                        className="ml-3 text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addSection}
            className="px-4 py-2 text-sm border border-dashed border-gray-400 rounded-lg text-gray-600 hover:border-gray-600 hover:text-gray-800 hover:bg-gray-50"
          >
            + Add Section
          </button>
          <UIButton
            type="contained"
            title="Submit"
            icon={false}
            btnOnclick={onSubmitTopSelling}
          />
        </div>




        {/* Latest Classes Section */}
        <div className="mt-8 pt-6 border-t border-gray-300">
          <div>
            <UIInputField
              isLable={true}
              lableName="Enter the heading for the second section"
              name="heading2Val"
              value={headingVal.heading2Val}
              onChange={handleHeadingUpdate}
            />
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
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
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
                      <div
                        className="mt-6 prose max-w-none [&>h1]:text-[16px] [&>h1]:font-bold [&>h2]:text-[15px] [&>h2]:font-semibold [&>h3]:text-[14px] [&>h3]:font-semibold [&>h4]:text-[14px] [&>h4]:font-semibold [&>h5]:text-[14px] [&>h5]:font-semibold [&>h6]:text-[14px] [&>h6]:font-semibold [&>p]:text-[14px]"
                        dangerouslySetInnerHTML={{ __html: item.productName }}
                      />
                      {/* <span className="text-sm">{item.productName}</span> */}
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
              <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                {selectedLatestClasses?.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-2 text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    <div
                      className="mt-6 prose max-w-none [&>h1]:text-[16px] [&>h1]:font-bold [&>h2]:text-[15px] [&>h2]:font-semibold [&>h3]:text-[14px] [&>h3]:font-semibold [&>h4]:text-[14px] [&>h4]:font-semibold [&>h5]:text-[14px] [&>h5]:font-semibold [&>h6]:text-[14px] [&>h6]:font-semibold [&>p]:text-[14px]"
                      dangerouslySetInnerHTML={{ __html: product.productName }}
                    />
                    {/* <span className="text-gray-700">{product.productName}</span> */}
                    <button
                      type="button"
                      onClick={() => handleLatestClassSelect(product)}
                      className="ml-3 text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0"
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
          <HomePageSEOForm
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
