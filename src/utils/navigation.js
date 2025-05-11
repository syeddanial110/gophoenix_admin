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
    link: "/",
    icon: Home,
  },
  {
    name: "Orders",
    link: "/orders",
    icon: BaggageClaim,
  },
  {
    name: "Products",
    icon: Tag,
    subMenu: [
      {
        name: "Collections",
        link: "/collections",
      },
      {
        name: "Programs",
        link: "/programs",
      },
    ],
  },
  {
    name: "Customers",
    link: "/customers",
    icon: User,
  },
  {
    name: "Content",
    icon: Image,
    subMenu: [
      {
        name: "Blogs",
        link: "/blogs",
      },
      {
        name: "Files",
        link: "/files",
      },
      {
        name: "Menus",
        link: "/menus",
      },
    ],
  },
  {
    name: "Content Editor",
    link: "/content-editor",
    icon: SquarePen,
  },
];

export const pathLocations = {
  dashboard: "/",
  content: {},
  programs: "/",
};
