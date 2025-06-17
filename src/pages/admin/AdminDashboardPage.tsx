/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Badge,
  Dropdown,
  Table,
  // useTheme, // Prawdopodobnie usunięty/zmieniony w nowszych wersjach lub ma inne zastosowanie
  DropdownItem, // Nowy import
  DropdownDivider, // Nowy import
  TableHead, // Nowy import
  TableHeadCell, // Nowy import
  TableBody, // Nowy import
  TableRow, // Nowy import
  TableCell, // Nowy import
} from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import svgMap from "svgmap";
import "svgmap/dist/svgMap.min.css";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

const AdminDashboardPage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <SalesThisWeek />
        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NewProductsThisWeek />
          <VisitorsThisWeek />
          <UserSignupsThisWeek />
        </div>
        <div className="my-4 grid grid-cols-1 xl:gap-4 2xl:grid-cols-3">
          <SessionsByCountry />
          <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-1">
            <LatestCustomers />
            <AcquisitionOverview />
          </div>
        </div>
        <Transactions />
      </div>
    </NavbarSidebarLayout>
  );
};

const SalesThisWeek: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">45,385</span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">Sales this week</h3>
        </div>
        <div className="flex flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          12.5%
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <SalesChart />
      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Sales Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const SalesChart: FC = function () {
  // Poprawione sprawdzanie dark mode
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const darkMode = document.documentElement.classList.contains("dark");
      setIsDarkTheme(darkMode);
    };

    checkTheme();
    // Obserwuj zmiany theme
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const borderColor = isDarkTheme ? "#374151" : "#F3F4F6";
  const labelColor = isDarkTheme ? "#93ACAF" : "#6B7280";
  const opacityFrom = isDarkTheme ? 0 : 0.45;
  const opacityTo = isDarkTheme ? 0.15 : 0;
  const options: ApexCharts.ApexOptions = {
    stroke: {
      curve: "smooth",
    },
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      foreColor: labelColor,
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom,
        opacityTo,
        type: "vertical",
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    grid: {
      show: true,
      borderColor: borderColor,
      strokeDashArray: 1,
      padding: {
        left: 35,
        bottom: 15,
      },
    },
    markers: {
      size: 5,
      strokeColors: "#ffffff",
      hover: {
        size: undefined,
        sizeOffset: 3,
      },
    },
    xaxis: {
      categories: ["01 Feb", "02 Feb", "03 Feb", "04 Feb", "05 Feb", "06 Feb", "07 Feb"],
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
      },
      axisBorder: {
        color: borderColor,
      },
      axisTicks: {
        color: borderColor,
      },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: borderColor,
          width: 1,
          dashArray: 10,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: [labelColor],
          fontSize: "14px",
          fontWeight: 500,
        },
        formatter: function (value) {
          return "$" + value.toLocaleString(); // ✅ Poprawiony formatter
        },
      },
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: [labelColor],
      },
      itemMargin: {
        horizontal: 10,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          xaxis: {
            labels: {
              show: false,
            },
          },
        },
      },
    ],
  };
  const series = [
    {
      name: "Revenue",
      data: [6356, 6218, 6156, 6526, 6356, 6256, 6056],
      color: "#1A56DB",
    },
    {
      name: "Revenue (previous period)",
      data: [6556, 6725, 6424, 6356, 6586, 6756, 6616],
      color: "#FDBA8C",
    },
  ];

  return (
    <div className="chart-container">
      <Chart height={420} options={options} series={series} type="area" />
    </div>
  );
};

const Datepicker: FC = function () {
  return (
    <span className="text-sm text-gray-600">
      <Dropdown inline label="Last 7 days">
        {/* Zmieniono Dropdown.Item na DropdownItem */}
        <DropdownItem>
          <strong>Sep 16, 2021 - Sep 22, 2021</strong>
        </DropdownItem>
        {/* Zmieniono Dropdown.Divider na DropdownDivider */}
        <DropdownDivider />
        <DropdownItem>Yesterday</DropdownItem>
        <DropdownItem>Today</DropdownItem>
        <DropdownItem>Last 7 days</DropdownItem>
        <DropdownItem>Last 30 days</DropdownItem>
        <DropdownItem>Last 90 days</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Custom...</DropdownItem>
      </Dropdown>
    </span>
  );
};

const NewProductsThisWeek: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">2,340</span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">New products this week</h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          14.6%
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <NewProductsChart />
      <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Products Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const NewProductsChart: FC = function () {
  const options: ApexCharts.ApexOptions = {
    colors: ["#1A56DB", "#FDBA8C"],
    chart: {
      fontFamily: "Inter, sans-serif",
      foreColor: "#4B5563",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
        borderRadius: 3,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
        },
      },
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: true,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  };
  const series = [
    {
      name: "Digital",
      color: "#1A56DB",
      data: [
        { x: "01 Feb", y: 170 },
        { x: "02 Feb", y: 180 },
        { x: "03 Feb", y: 164 },
        { x: "04 Feb", y: 145 },
        { x: "05 Feb", y: 174 },
        { x: "06 Feb", y: 170 },
        { x: "07 Feb", y: 155 },
      ],
    },
    {
      name: "Goods",
      color: "#FDBA8C",
      data: [
        { x: "01 Feb", y: 120 },
        { x: "02 Feb", y: 134 },
        { x: "03 Feb", y: 167 },
        { x: "04 Feb", y: 179 },
        { x: "05 Feb", y: 145 },
        { x: "06 Feb", y: 182 },
        { x: "07 Feb", y: 143 },
      ],
    },
  ];

  return (
    <div className="chart-container">
      <Chart height={305} options={options} series={series} type="bar" />
    </div>
  );
};

const VisitorsThisWeek: FC = function () {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">5,355</span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">Visitors this week</h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-green-600 dark:text-green-400">
          32.9%
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      <VisitorsChart />
      <div className="mt-3.5 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Datepicker />
        <div className="shrink-0">
          <a
            href="#"
            className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
          >
            Visits Report
            <svg
              className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const VisitorsChart: FC = function () {
  // Poprawione sprawdzanie dark mode
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.documentElement.classList.contains("dark"));
    };

    checkTheme();
    // Obserwuj zmiany theme
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const fillGradientShade = isDarkTheme ? "dark" : "light";
  const fillGradientShadeIntensity = isDarkTheme ? 0.45 : 1;

  const options: ApexCharts.ApexOptions = {
    labels: ["01 Feb", "02 Feb", "03 Feb", "04 Feb", "05 Feb", "06 Feb", "07 Feb"],
    chart: {
      fontFamily: "Inter, sans-serif",
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: fillGradientShade,
        shadeIntensity: fillGradientShadeIntensity,
      },
    },
    plotOptions: {
      area: {
        fillTo: "end",
      },
    },
    theme: {
      monochrome: {
        enabled: true,
        color: "#1A56DB",
      },
    },
    tooltip: {
      style: {
        fontSize: "14px",
        fontFamily: "Inter, sans-serif",
      },
    },
  };
  const series = [
    {
      name: "Visitors",
      data: [500, 590, 600, 520, 610, 550, 600],
    },
  ];

  return (
    <div className="chart-container">
      <Chart height={305} options={options} series={series} type="area" />
    </div>
  );
};

const UserSignupsThisWeek: FC = function () {
  // Przykładowe dane
  const userSignups = 120; // Możesz pobrać te dane z API
  const sessionsByCountry = [
    { country: "USA", sessions: 300 },
    { country: "Poland", sessions: 150 },
  ];

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            {userSignups}
          </span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">User signups this week</h3>
        </div>
        <div className="ml-5 flex w-0 flex-1 items-center justify-end text-base font-bold text-red-600 dark:text-red-400">
          -2.7%
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const SessionsByCountry: FC = function () {
  // Przykładowe dane
  const sessionsByCountry = [
    { country: "USA", sessions: 300 },
    { country: "Poland", sessions: 150 },
  ];

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="flex items-center">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            Sessions by country
          </span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">Sessions by country</h3>
        </div>
      </div>
      <div className="mt-4">
        <ul>
          {sessionsByCountry.map((session) => (
            <li key={session.country}>
              {session.country}: {session.sessions}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const LatestCustomers: FC = function () {
  return <div>LatestCustomers</div>;
};

const AcquisitionOverview: FC = function () {
  return <div>AcquisitionOverview</div>;
};

const Transactions: FC = function () {
  return <div>Transactions</div>;
};

export default AdminDashboardPage;
