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
    link: "/dashboard",
    icon: Home,
  },
  {
    name: "Orders",
    link: "/dashboard/orders",
    icon: BaggageClaim,
  },
  {
    name: "Products",
    icon: Tag,
    subMenu: [
      {
        name: "Collections",
        link: "/dashboard/collections",
      },
      {
        name: "Programs",
        link: "/dashboard/programs",
      },
    ],
  },
  {
    name: "Customers",
    link: "/dashboard/customers",
    icon: User,
  },
  {
    name: "Content",
    icon: Image,
    subMenu: [
      {
        name: "Blogs",
        link: "/dashboard/blogs",
      },
      {
        name: "Files",
        link: "/dashboard/files",
      },
      {
        name: "Menus",
        link: "/dashboard/menus",
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
  dashboard: "/dashboard/home",
  content: {},
  programs: "/",
};
