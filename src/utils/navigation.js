import { PersonIcon } from "@radix-ui/react-icons";
import {
  BaggageClaim,
  BookCopy,
  Dock,
  File,
  Home,
  Image,
  ImagePlus,
  Logs,
  SquarePen,
  Tag,
  User,
} from "lucide-react";

export const Navigation_Menu = [
  {
    name: "Home",
    link: "/dashboard/home",
    icon: Home,
  },
  {
    name: "Orders",
    link: "/dashboard/orders",
    icon: BaggageClaim,
  },
  {
    name: "Users",
    link: "/dashboard/users",
    icon: PersonIcon,
  },
  {
    name: "Programs",
    icon: Tag,
    subMenu: [
      {
        name: "Collection",
        link: "/dashboard/products/category",
      },
      // {
      //   name: "Class Group",
      //   link: "/dashboard/products/sub-category",
      // },
      {
        name: "Class",
        link: "/dashboard/products/products",
      },
    ],
  },
  // {
  //   name: "Customers",
  //   link: "/dashboard/customers",
  //   icon: User,
  // },
  {
    name: "Content",
    icon: Image,
    subMenu: [
      {
        name: "Blogs",
        link: "/dashboard/content/blogs",
      },
      {
        name: "Home Page Content",
        link: "/dashboard/content/home-page",
      },
      {
        name: "Pages",
        link: "/dashboard/content/pages",
      },
      {
        name: "Menu",
        link: "/dashboard/content/menu",
      },
    ],
  },
  {
    name: "Content Editor",
    link: "/dashboard/content-editor",
    icon: SquarePen,
  },
];

export const pathLocations = {
  login: "/auth/login",
  dashboard: "/dashboard/home",
  content: {},
  programs: "/",
  userById : "/dashboard/users",
  users: "/dashboard/users",
  orderById: "/dashboard/orders"
};
