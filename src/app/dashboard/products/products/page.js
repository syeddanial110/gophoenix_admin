"use client";
import UIButton from "@/components/UIButton/UIButton";
import UITypography from "@/components/UITypography/UITypography";
import AddProductModal from "@/containers/Products/AddProductModal";
import EditProductForm from "@/containers/Products/EditProductForm";
import ProductTable from "@/containers/Products/ProductTable";
import React, { useState } from "react";

const Products = () => {
  const [isProductAdd, setIsProductAdd] = useState(false);
  const [isProductEdit, setIsProductEdit] = useState(false);
  const handleAddProduct = () => {
    if (!isProductEdit) setIsProductAdd(!isProductAdd);
    if (isProductEdit) {
      setIsProductEdit(!isProductEdit);
    }
  };

  return (
    <>
      <div className="flex justify-between gap-4">
        <UITypography variant="h2" text="Products" />
        <UIButton
          type="contained"
          icon={false}
          title={isProductAdd || isProductEdit ? "Cancel" : "Add Product"}
          btnOnclick={handleAddProduct}
        />
      </div>
      {isProductAdd && <AddProductModal setIsProductAdd={setIsProductAdd} />}
      {isProductEdit && <EditProductForm setIsProductEdit={setIsProductEdit} />}
      {!isProductAdd && !isProductEdit && (
        <ProductTable
          setIsProductEdit={setIsProductEdit}
          setIsProductAdd={setIsProductAdd}
        />
      )}
    </>
  );
};

export default Products;
