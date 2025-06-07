import type { CustomFlowbiteTheme } from "flowbite-react";
const fs = require("fs");
const path = require("path");

// Lista plików do migracji (dodaj kolejne wg potrzeb)
const files = [
  "src/pages/users/delete-user-modal.tsx",
  "src/pages/users/list.tsx",
  "src/pages/users/listSuppliers.tsx",
  "src/pages/users/profile.tsx",
  "src/pages/users/settings.tsx",
  "src/pages/kanban.tsx",
  "src/pages/e-commerce/products.tsx",
  "src/pages/e-commerce/billing.tsx",
  "src/pages/e-commerce/invoice.tsx",
  "src/pages/admin/AdsPowerDashboardPage.tsx",
  "src/pages/admin/AdsPowerDashboardPageori.tsx",
  // Dodaj kolejne pliki wg potrzeb
];

const replacements = [
  // Modal
  { from: /<Modal\.Header([^>]*)>/g, to: '<div className="modal-header"$1>' },
  { from: /<\/Modal\.Header>/g, to: "</div>" },
  { from: /<Modal\.Body([^>]*)>/g, to: '<div className="modal-body"$1>' },
  { from: /<\/Modal\.Body>/g, to: "</div>" },
  { from: /<Modal\.Footer([^>]*)>/g, to: '<div className="modal-footer"$1>' },
  { from: /<\/Modal\.Footer>/g, to: "</div>" },
  // Breadcrumb
  { from: /<Breadcrumb\.Item([^>]*)>/g, to: '<a className="breadcrumb-item"$1>' },
  { from: /<\/Breadcrumb\.Item>/g, to: "</a>" },
  // Table
  { from: /<Table\.Head([^>]*)>/g, to: "<thead$1>" },
  { from: /<\/Table\.Head>/g, to: "</thead>" },
  { from: /<Table\.HeadCell([^>]*)>/g, to: "<th$1>" },
  { from: /<\/Table\.HeadCell>/g, to: "</th>" },
  { from: /<Table\.Body([^>]*)>/g, to: "<tbody$1>" },
  { from: /<\/Table\.Body>/g, to: "</tbody>" },
  { from: /<Table\.Row([^>]*)>/g, to: "<tr$1>" },
  { from: /<\/Table\.Row>/g, to: "</tr>" },
  { from: /<Table\.Cell([^>]*)>/g, to: "<td$1>" },
  { from: /<\/Table\.Cell>/g, to: "</td>" },
];

files.forEach((file) => {
  const filePath = path.resolve(file);
  let content = fs.readFileSync(filePath, "utf8");
  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Zmieniono: ${file}`);
});

console.log("Automatyczna migracja zakończona! Sprawdź pliki i przetestuj aplikację.");
const flowbiteTheme: CustomFlowbiteTheme = {
  badge: {
    root: {
      color: {
        info: "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-300",
        primary:
          "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-300",
      },
      size: {
        xl: "px-3 py-2 text-base rounded-md",
      },
    },
    icon: {
      off: "rounded-full px-2 py-1",
    },
  },
  button: {
    color: {
      gray: "text-gray-900 bg-white border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-blue-700 :ring-blue-700 focus:text-blue-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700 focus:ring-2",
      info: "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
      primary:
        "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800",
    },
    inner: {
      base: "flex items-center transition-all duration-200",
    },
    outline: {
      color: {
        gray: "border border-gray-200 dark:border-gray-500",
      },
    },
  },
  dropdown: {
    floating: {
      base: "z-10 w-fit rounded-xl divide-y divide-gray-100 shadow",
      content: "rounded-xl text-sm text-gray-700 dark:text-gray-200",
      target: "w-fit dark:text-white",
    },
    content: "",
  },
  modal: {
    content: {
      inner: "relative rounded-lg bg-white shadow dark:bg-gray-800",
    },
    header: {
      base: "flex items-start justify-between rounded-t px-5 pt-5",
    },
  },
  navbar: {
    root: {
      base: "fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700",
    },
  },
  sidebar: {
    root: {
      base: "flex fixed top-0 left-0 z-20 flex-col flex-shrink-0 pt-16 h-full duration-75 border-r border-gray-200 lg:flex transition-width dark:border-gray-700",
    },
    item: {
      base: "flex items-center justify-center rounded-lg p-2 text-base font-medium text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    },
    collapse: {
      button:
        "group flex w-full items-center rounded-lg p-2 text-base font-medium text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
    },
  },
  textarea: {
    base: "block w-full text-sm p-4 rounded-lg border disabled:cursor-not-allowed disabled:opacity-50",
  },
  textInput: {
    field: {
      input: {
        colors: {
          info: "border-blue-500 bg-blue-50 text-blue-900 placeholder-blue-700 focus:border-blue-500 focus:ring-blue-500 dark:border-blue-400 dark:bg-blue-100 dark:focus:border-blue-500 dark:focus:ring-blue-500",
        },
        withIcon: {
          on: "!pl-12",
        },
      },
    },
  },
  toggleSwitch: {
    toggle: {
      checked: {
        color: {
          blue: "bg-blue-700 border-blue-700",
        },
      },
    },
  },
};

export default flowbiteTheme;
