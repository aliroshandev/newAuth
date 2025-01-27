import React from "react";
import { CgProfile } from "react-icons/cg";
import { CgUserList } from "react-icons/cg";
import { TiLightbulb } from "react-icons/ti";
import { HiOutlineUsers } from "react-icons/hi";
import { BiHotel } from "react-icons/bi";
import { BsFileCheck } from "react-icons/bs";

import { AiOutlineLogout } from "react-icons/ai";
import { RiAdminFill } from "react-icons/ri";

import { MenuItemsType } from "../../components/RightMenu/types/MenuItemsTypes";

const MENU_ITEMS: Array<MenuItemsType> = [
  {
    name: "مدیریت کاربران",
    link: "users",
    key: "user-management",
    icon: <TiLightbulb />,
  },
  {
    name: "مدیریت منو و منابع منو",
    link: "menu",
    key: "menu-resource-management",
    icon: <TiLightbulb />,
  },
  // {
  //   name: "نوع منابع (حذف)",
  //   link: "resources-type",
  //   icon: <TiLightbulb />,
  // },
  // {
  //   name: "نمایش دسترسی ها",
  //   link: "show-access",
  //   icon: <TiLightbulb />,
  // },
  // {
  //   name: "نقش ها",
  //   link: "roles",
  //   icon: <TiLightbulb />,
  // },
  {
    name: "مدیریت نقش ها",
    link: "roles-management",
    key: "role-management",
    icon: <TiLightbulb />,
  },
  {
    name: "مدیریت مجوز ها",
    link: "permissions",
    key: "permission-management",
    icon: <TiLightbulb />,
  },
  {
    name: "انتخاب دسترسی های منابع",
    link: "resource-permissions",
    key: "access-resource",
    icon: <TiLightbulb />,
  },
  {
    name: "انتخاب دسترسی های نقش",
    link: "access",
    key: "access-role",
    icon: <TiLightbulb />,
  },
  {
    name: "مدیریت سیستم",
    link: "system-management",
    key: "system-management",
    icon: <TiLightbulb />
  },
  {
    name: "وقایع",
    link: "events",
    key: "events-log",
    icon: <TiLightbulb />
  },
];

export default MENU_ITEMS;
