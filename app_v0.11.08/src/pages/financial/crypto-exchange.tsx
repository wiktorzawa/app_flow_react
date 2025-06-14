import type { FC } from "react";
import { Button, Label, Tabs, TabItem, TextInput } from "flowbite-react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";

const FinancialExchangeCryptoHero: FC = function () {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-12 lg:py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-4xl leading-none font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            Decentralized for a better tomorrow
          </h1>
          <p className="text-lg font-normal text-gray-500 lg:mb-8 lg:text-xl xl:mb-12 dark:text-gray-400">
            Buy, trade, and hold&nbsp;
            <span className="font-medium text-gray-900 dark:text-white">
              600+
            </span>
            &nbsp;cryptocurrencies on Flowbite
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8 xl:grid-cols-5">
          <div className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 rounded-lg p-4">
            <h2 className="text-3xl leading-tight font-extrabold">
              $76 billion
            </h2>
            <span className="text-primary-500 dark:text-primary-400">
              24h trading volume
            </span>
          </div>
          <div className="rounded-lg bg-teal-100 p-4 text-teal-600 dark:bg-teal-900 dark:text-teal-300">
            <h2 className="text-3xl leading-tight font-extrabold">600+</h2>
            <span className="text-teal-500 dark:text-teal-400">
              Cryptocurrencies listed
            </span>
          </div>
          <div className="rounded-lg bg-indigo-100 p-4 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
            <h2 className="text-3xl leading-tight font-extrabold">
              34 million
            </h2>
            <span className="text-indigo-500 dark:text-indigo-400">
              Diluted market cap
            </span>
          </div>
          <div className="rounded-lg bg-purple-100 p-4 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            <h2 className="text-3xl leading-tight font-extrabold">
              90 million
            </h2>
            <span className="text-purple-500 dark:text-purple-400">
              Registered users
            </span>
          </div>
          <div className="rounded-lg bg-green-100 p-4 text-green-600 dark:bg-green-900 dark:text-green-300">
            <h2 className="text-3xl leading-tight font-extrabold">0.10%</h2>
            <span className="text-green-500 dark:text-green-400">
              Low transaction fees
            </span>
          </div>
        </div>
        <div className="mt-8 rounded-lg border border-gray-200 p-8 lg:mt-12 dark:border-gray-700">
          <div className="mx-auto mb-4 w-fit lg:mb-8">
            <Tabs
              variant="underline"
              className="items-center"
              theme={{
                tablist: {
                  tabitem: {
                    base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
                    variant: {
                      underline: {
                        active: {
                          on: "active border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500 rounded-t-lg border-b-2",
                        },
                      },
                    },
                  },
                },
              }}
            >
              <TabItem title="Buy">
                <div className="block items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-8">
                  <div className="w-full">
                    <Label htmlFor="euro-form" className="sr-only">
                      Amount to buy, euro
                    </Label>
                    <div className="flex">
                      <TextInput
                        addon={
                          <svg
                            aria-hidden
                            className="w-4 text-gray-900 dark:text-white"
                            viewBox="0 0 15 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_12679_7638)">
                              <path
                                d="M13.8102 12.4801C13.6532 12.0964 13.4933 11.7126 13.3189 11.3347C13.1648 10.9975 12.9671 10.8986 12.5979 10.9829C12.1298 11.0905 11.6705 11.2329 11.2024 11.3289C10.2983 11.5178 9.39129 11.5353 8.49879 11.2533C7.37953 10.9015 6.78356 10.0904 6.41726 9.04384H9.45234C9.69072 9.04384 9.8826 8.85196 9.8826 8.61358V7.65712C9.8826 7.41873 9.69072 7.22686 9.45234 7.22686H6.12654C6.12654 6.9594 6.12363 6.70357 6.12654 6.44774H9.45234C9.69072 6.44774 9.8826 6.25586 9.8826 6.01748V5.06102C9.8826 4.82263 9.69072 4.63076 9.45234 4.63076H6.54517C6.54517 4.61913 6.54517 4.6075 6.55099 4.60169C6.89985 3.80803 7.4086 3.17136 8.24296 2.83994C9.21395 2.4562 10.2053 2.46492 11.2054 2.67133C11.6792 2.76726 12.1444 2.91262 12.6182 3.02019C12.9642 3.09868 13.1648 2.99693 13.313 2.67424C13.4846 2.30212 13.6416 1.92419 13.7985 1.54335C13.9468 1.18577 13.8596 0.932843 13.5224 0.735156C13.4381 0.685734 13.3508 0.645033 13.2607 0.610147C11.8595 0.0636002 10.4146 -0.139901 8.92323 0.0984862C7.87375 0.267102 6.89403 0.62759 6.04805 1.28461C4.98112 2.11025 4.28921 3.20043 3.88803 4.48249L3.8386 4.63076H2.34432C2.10594 4.63076 1.91406 4.82263 1.91406 5.06102V6.01748C1.91406 6.25586 2.10594 6.44774 2.34432 6.44774H3.52172C3.52172 6.70938 3.52172 6.96231 3.52172 7.22686H2.34432C2.10594 7.22686 1.91406 7.41873 1.91406 7.65712V8.61358C1.91406 8.85196 2.10594 9.04384 2.34432 9.04384H3.76302C3.87058 9.3927 3.96071 9.74737 4.09734 10.0817C4.81541 11.8144 6.01898 13.047 7.83014 13.6343C9.32733 14.1197 10.8361 14.1052 12.345 13.6895C12.7374 13.5819 13.127 13.4424 13.4991 13.2709C13.8596 13.1051 13.9526 12.8261 13.8102 12.4801Z"
                                fill="currentColor"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_12679_7638">
                                <rect
                                  width="14"
                                  height="14"
                                  fill="white"
                                  transform="translate(0.894531)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        }
                        id="euro-form"
                        placeholder="1000"
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <Label htmlFor="bitcoin-form" className="sr-only">
                      Amount to buy, BTC
                    </Label>
                    <div className="flex">
                      <TextInput
                        addon={
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 15 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_12679_13602)">
                              <path
                                d="M14.6837 8.69347C13.7487 12.4435 9.95037 14.7255 6.19989 13.7906C2.45117 12.8556 0.168953 9.05725 1.10411 5.30744C2.03861 1.55697 5.83677 -0.725463 9.58615 0.209474C13.3364 1.14441 15.6184 4.94322 14.6835 8.69347H14.6837Z"
                                fill="#F7931A"
                              />
                              <path
                                d="M10.9803 6.00311C11.1194 5.07167 10.4102 4.57095 9.44053 4.23692L9.75509 2.97517L8.98684 2.78377L8.68059 4.01227C8.47891 3.96195 8.27153 3.91448 8.06547 3.86745L8.37391 2.63086L7.60631 2.43945L7.29153 3.70077C7.12441 3.6627 6.96034 3.62508 6.80109 3.58548L6.80197 3.58155L5.74278 3.31708L5.53847 4.13739C5.53847 4.13739 6.10831 4.26798 6.09628 4.27608C6.40734 4.35373 6.46378 4.55958 6.45416 4.72277L6.09584 6.16017C6.11728 6.16564 6.14506 6.17352 6.17569 6.18577L6.09475 6.16564L5.59228 8.17923C5.55422 8.27373 5.45775 8.41548 5.24031 8.36167C5.24797 8.37283 4.68206 8.22233 4.68206 8.22233L4.30078 9.1017L5.30047 9.35086C5.48641 9.39745 5.66862 9.44623 5.84778 9.49217L5.52994 10.7686L6.29709 10.96L6.61209 9.69736C6.82144 9.75423 7.02487 9.80673 7.22394 9.85617L6.91025 11.1129L7.67828 11.3043L7.99612 10.0305C9.30578 10.2784 10.2908 10.1784 10.7049 8.99408C11.0389 8.04033 10.6885 7.49017 9.99944 7.1312C10.5012 7.01505 10.8792 6.68495 10.9801 6.00311H10.9803ZM9.22528 8.46383C8.98772 9.41758 7.38209 8.9022 6.86125 8.7727L7.283 7.08198C7.80362 7.21192 9.47291 7.46917 9.2255 8.46383H9.22528ZM9.46262 5.98933C9.24606 6.85689 7.9095 6.41611 7.47572 6.30805L7.85809 4.77461C8.29187 4.88267 9.68837 5.08436 9.46262 5.98933Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_12679_13602">
                                <rect
                                  width="14"
                                  height="14"
                                  fill="white"
                                  transform="translate(0.894531)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        }
                        id="bitcoin-form"
                        placeholder="1000"
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              </TabItem>
              <TabItem title="Sell">
                <div className="block items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-8">
                  <div className="w-full">
                    <Label htmlFor="sell-bitcoin-form" className="sr-only">
                      Amount to sell, BTC
                    </Label>
                    <div className="flex">
                      <TextInput
                        addon={
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 15 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_12679_13602)">
                              <path
                                d="M14.6837 8.69347C13.7487 12.4435 9.95037 14.7255 6.19989 13.7906C2.45117 12.8556 0.168953 9.05725 1.10411 5.30744C2.03861 1.55697 5.83677 -0.725463 9.58615 0.209474C13.3364 1.14441 15.6184 4.94322 14.6835 8.69347H14.6837Z"
                                fill="#F7931A"
                              />
                              <path
                                d="M10.9803 6.00311C11.1194 5.07167 10.4102 4.57095 9.44053 4.23692L9.75509 2.97517L8.98684 2.78377L8.68059 4.01227C8.47891 3.96195 8.27153 3.91448 8.06547 3.86745L8.37391 2.63086L7.60631 2.43945L7.29153 3.70077C7.12441 3.6627 6.96034 3.62508 6.80109 3.58548L6.80197 3.58155L5.74278 3.31708L5.53847 4.13739C5.53847 4.13739 6.10831 4.26798 6.09628 4.27608C6.40734 4.35373 6.46378 4.55958 6.45416 4.72277L6.09584 6.16017C6.11728 6.16564 6.14506 6.17352 6.17569 6.18577L6.09475 6.16564L5.59228 8.17923C5.55422 8.27373 5.45775 8.41548 5.24031 8.36167C5.24797 8.37283 4.68206 8.22233 4.68206 8.22233L4.30078 9.1017L5.30047 9.35086C5.48641 9.39745 5.66862 9.44623 5.84778 9.49217L5.52994 10.7686L6.29709 10.96L6.61209 9.69736C6.82144 9.75423 7.02487 9.80673 7.22394 9.85617L6.91025 11.1129L7.67828 11.3043L7.99612 10.0305C9.30578 10.2784 10.2908 10.1784 10.7049 8.99408C11.0389 8.04033 10.6885 7.49017 9.99944 7.1312C10.5012 7.01505 10.8792 6.68495 10.9801 6.00311H10.9803ZM9.22528 8.46383C8.98772 9.41758 7.38209 8.9022 6.86125 8.7727L7.283 7.08198C7.80362 7.21192 9.47291 7.46917 9.2255 8.46383H9.22528ZM9.46262 5.98933C9.24606 6.85689 7.9095 6.41611 7.47572 6.30805L7.85809 4.77461C8.29187 4.88267 9.68837 5.08436 9.46262 5.98933Z"
                                fill="white"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_12679_13602">
                                <rect
                                  width="14"
                                  height="14"
                                  fill="white"
                                  transform="translate(0.894531)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        }
                        id="sell-bitcoin-form"
                        placeholder="1000"
                        type="number"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <Label htmlFor="sell-euro-form" className="sr-only">
                      Amount to sell, Euro
                    </Label>
                    <div className="flex">
                      <TextInput
                        addon={
                          <svg
                            className="w-4 text-gray-900 dark:text-white"
                            viewBox="0 0 15 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_12679_7638)">
                              <path
                                d="M13.8102 12.4801C13.6532 12.0964 13.4933 11.7126 13.3189 11.3347C13.1648 10.9975 12.9671 10.8986 12.5979 10.9829C12.1298 11.0905 11.6705 11.2329 11.2024 11.3289C10.2983 11.5178 9.39129 11.5353 8.49879 11.2533C7.37953 10.9015 6.78356 10.0904 6.41726 9.04384H9.45234C9.69072 9.04384 9.8826 8.85196 9.8826 8.61358V7.65712C9.8826 7.41873 9.69072 7.22686 9.45234 7.22686H6.12654C6.12654 6.9594 6.12363 6.70357 6.12654 6.44774H9.45234C9.69072 6.44774 9.8826 6.25586 9.8826 6.01748V5.06102C9.8826 4.82263 9.69072 4.63076 9.45234 4.63076H6.54517C6.54517 4.61913 6.54517 4.6075 6.55099 4.60169C6.89985 3.80803 7.4086 3.17136 8.24296 2.83994C9.21395 2.4562 10.2053 2.46492 11.2054 2.67133C11.6792 2.76726 12.1444 2.91262 12.6182 3.02019C12.9642 3.09868 13.1648 2.99693 13.313 2.67424C13.4846 2.30212 13.6416 1.92419 13.7985 1.54335C13.9468 1.18577 13.8596 0.932843 13.5224 0.735156C13.4381 0.685734 13.3508 0.645033 13.2607 0.610147C11.8595 0.0636002 10.4146 -0.139901 8.92323 0.0984862C7.87375 0.267102 6.89403 0.62759 6.04805 1.28461C4.98112 2.11025 4.28921 3.20043 3.88803 4.48249L3.8386 4.63076H2.34432C2.10594 4.63076 1.91406 4.82263 1.91406 5.06102V6.01748C1.91406 6.25586 2.10594 6.44774 2.34432 6.44774H3.52172C3.52172 6.70938 3.52172 6.96231 3.52172 7.22686H2.34432C2.10594 7.22686 1.91406 7.41873 1.91406 7.65712V8.61358C1.91406 8.85196 2.10594 9.04384 2.34432 9.04384H3.76302C3.87058 9.3927 3.96071 9.74737 4.09734 10.0817C4.81541 11.8144 6.01898 13.047 7.83014 13.6343C9.32733 14.1197 10.8361 14.1052 12.345 13.6895C12.7374 13.5819 13.127 13.4424 13.4991 13.2709C13.8596 13.1051 13.9526 12.8261 13.8102 12.4801Z"
                                fill="currentColor"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_12679_7638">
                                <rect
                                  width="14"
                                  height="14"
                                  fill="white"
                                  transform="translate(0.894531)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        }
                        id="sell-euro-form"
                        placeholder="1000"
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              </TabItem>
            </Tabs>
          </div>
          <Button href="#" className="mx-auto w-full md:w-fit">
            Connect your wallet
          </Button>
        </div>
      </div>
    </section>
  );
};

const CryptoExchangePage: FC = function () {
  return (
    <NavbarSidebarLayout>
      <FinancialExchangeCryptoHero />
    </NavbarSidebarLayout>
  );
};

export default CryptoExchangePage;
