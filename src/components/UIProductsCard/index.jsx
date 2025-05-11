import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import card_img from "../../assets/Images/card_img.webp";
import card_img2 from "../../assets/Images/card_img2.webp";

const UIProductCard = () => {
  return (
    <Card className="group hover:cursor-pointer">
      <CardHeader>
        <div className="h-[300px] w-full relative">
          {/* Main Image */}
          <Image 
            src={card_img}
            alt="Card image"
            fill
            className="object-cover group-hover:opacity-0 transition-opacity duration-300"
          />
          {/* Hover Image */}
          <Image 
            src={card_img2}
            alt="Card hover image"
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-center">
          6/9 - 6/13 | 8:30 - 4:00 Ages 3-7 | Mon - Fri STEM, Sports, Ninja
          Fitness Laguna (Kelly) Park, Carlsbad Separated Age Groups
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-center">13 Spots Open</p>
      </CardFooter>
    </Card>
  );
};

export default UIProductCard;