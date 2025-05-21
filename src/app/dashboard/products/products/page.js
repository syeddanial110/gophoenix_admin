"use client";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import AddProductModal from "@/containers/Products/AddProductModal";
import ProductTable from "@/containers/Products/ProductTable";
import React, { useState } from "react";

const Products = () => {
  const [isProductAdd, setIsProductAdd] = useState(false);
  const handleAddProduct = () => {
    setIsProductAdd(!isProductAdd);
  };

  return (
    <>
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Products" />
        <UIButton
          type="contained"
          icon={false}
          title={isProductAdd ? "Cancel" : "Add Product"}
          btnOnclick={handleAddProduct}
        />
      </div>
      {isProductAdd && <AddProductModal setIsProductAdd={setIsProductAdd} />}
      {!isProductAdd && <ProductTable />}
    </>
  );
};

export default Products;
