import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import card_img from "../../assets/Images/card_img.webp";
import UIButton from "../UIButton/UIButton";
import UITypography from "../UITypography/UITypography";

const UIProgramCard = ({ text }) => {
  return (
    <Card>
      <CardHeader>
        {/* <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription> */}
        <Image
          src={card_img}
          alt="Logo"
          width="100%"
          height="400"
          style={{ borderRadius: "16px" }}
        />
      </CardHeader>
      <CardContent>
        <UITypography text={text} className="text-center" />
      </CardContent>
      <CardFooter className="flex justify-center">
        <UIButton type="contained" title="See More" className="bg-main" />
      </CardFooter>
    </Card>
  );
};

export default UIProgramCard;
