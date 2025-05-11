import Image from "next/image";
import { Button } from "@/components/ui/button";
import UICard from "@/components/UICard";
import UIAccordion from "@/components/UIAccordion/UIAccordion";
import UIButton from "@/components/UIButton/UIButton";
import UIProductCard from "@/components/UIProductsCard";
import UIProgramCard from "@/components/UIProgramCard";
import UIIconCard from "@/components/UIIconCard/UIIconCard";
import icon from "../assets/Images/icon.webp";
import Head from "next/head";
import UITypography from "@/components/UITypography/UITypography";
import ImageCarousel from "@/components/UICarousel/ImageCarousel";
import IconCardCarousel from "@/components/UICarousel/IconCardCarousel";

export default function Home() {
  return (
    <div className="flex flex-col items-center h3 pt-10 gap-3">
      <UITypography variant="h2" text="Why Phoenix Sports 😎" />
      <UITypography
        variant="p"
        text="✅ Full Credits | No expiration, no fees."
      />
      <UITypography
        variant="p"
        text="✅ Flexible Credits | Any Sports or Day"
      />
      <UITypography variant="p" text="✅ Unlimited Make-Ups | Hassle-Free" />
      <UITypography
        variant="p"
        text="✅ No Registration Fees | Full Transparency"
      />
      <UITypography
        variant="p"
        text="✅ Flexible Scheduling | To fit your needs."
      />
      <UITypography variant="p" text="✅ Diverse Program Offerings" />
      <UITypography variant="h2" text="VS The Other Programs 😢" />
      <UITypography
        variant="p"
        text="❌ Limited Refunds | Strict deadlines and fees."
      />
      <UITypography
        variant="p"
        text="❌ Restricted Credits | Expire or non-transferable."
      />
      <UITypography
        variant="p"
        text="❌ Few Make-Ups | Only 1–2 make-ups per season"
      />
      <UITypography variant="p" text="❌ Extra Fees | For just signing up! " />
      <UITypography
        variant="p"
        text="❌ Inflexible Scheduling | Strict cancellation policies."
      />
      <UITypography
        variant="p"
        text="❌ Limited Programs | Specific sports, few options."
      />
      <div className="flex flex-col items-center gap-2">
        <UITypography variant="h4" text="Sign In | Create an Account" />
        <UITypography variant="h5" text="For a Lightning-Fast Experience!" />
        <UITypography
          variant="p"
          text="Sign in now | Save child details | Plug it in easily next time"
        />
        <UIButton type="contained" title="Sign-In | Create Account" />
      </div>
      <div className="w-[90%] mt-5">
        <ImageCarousel />
      </div>
      <div className="flex flex-col items-center mt-5 gap-3">
        <UITypography
          variant="h3"
          text="The Phoenix Sports Experience"
          className="text-center"
        />
        <UITypography
          text="Building Confidence, Character & Community with Child-Led Sports Programs Led by a Teacher with a Master’s in Education and 9 Years as a Classroom Teacher."
          className="text-center"
        />
        <div className="w-[80%] mt-6">
          <IconCardCarousel />
        </div>
      </div>
    </div>
  );
}
