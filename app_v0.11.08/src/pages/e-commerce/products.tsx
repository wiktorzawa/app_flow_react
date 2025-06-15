/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Textarea,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
  HiCog,
  HiDotsVertical,
  HiExclamationCircle,
  HiHome,
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
  HiUpload,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { Pagination } from "../users/list";

const EcommerceProductsPage: FC = function () {
  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 sm:flex dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <BreadcrumbItem href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </BreadcrumbItem>
              <BreadcrumbItem href="/e-commerce/products">
                E-commerce
              </BreadcrumbItem>
              <BreadcrumbItem>Products</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              All products
            </h1>
          </div>
          <div className="block items-center sm:flex">
            <SearchForProducts />
            <div className="hidden space-x-1 border-l border-gray-100 pl-2 md:flex dark:border-gray-700">
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Configure</span>
                <HiCog className="text-2xl" />
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Delete</span>
                <HiTrash className="text-2xl" />
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Purge</span>
                <HiExclamationCircle className="text-2xl" />
              </a>
              <a
                href="#"
                className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Settings</span>
                <HiDotsVertical className="text-2xl" />
              </a>
            </div>
            <div className="flex w-full items-center sm:justify-end">
              <AddProductModal />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <ProductsTable />
            </div>
          </div>
        </div>
      </div>
      <Pagination />
    </NavbarSidebarLayout>
  );
};

const SearchForProducts: FC = function () {
  return (
    <form className="mb-4 sm:mb-0 sm:pr-3" action="#" method="GET">
      <Label htmlFor="products-search" className="sr-only">
        Search
      </Label>
      <div className="relative mt-1 lg:w-64 xl:w-96">
        <TextInput
          id="products-search"
          name="products-search"
          placeholder="Search for products"
        />
      </div>
    </form>
  );
};

const AddProductModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <FaPlus className="mr-3 text-sm" />
        Add product
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <ModalHeader className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add product</strong>
        </ModalHeader>
        <ModalBody>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Product name</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder='Apple iMac 27"'
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <TextInput
                  id="category"
                  name="category"
                  placeholder="Electronics"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <TextInput
                  id="brand"
                  name="brand"
                  placeholder="Apple"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <TextInput
                  id="price"
                  name="price"
                  type="number"
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="producTableCelletails">Product details</Label>
                <Textarea
                  id="producTableCelletails"
                  name="producTableCelletails"
                  placeholder="e.g. 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, Ram 16 GB DDR4 2300Mhz"
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setOpen(false)}>
            Add product
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const EditProductModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="primary" onClick={() => setOpen(!isOpen)}>
        <HiPencilAlt className="mr-2 text-lg" />
        Edit item
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <ModalHeader className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edit product</strong>
        </ModalHeader>
        <ModalBody>
          <form>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <Label htmlFor="productName">Product name</Label>
                <TextInput
                  id="productName"
                  name="productName"
                  placeholder='Apple iMac 27"'
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <TextInput
                  id="category"
                  name="category"
                  placeholder="Electronics"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <TextInput
                  id="brand"
                  name="brand"
                  placeholder="Apple"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <TextInput
                  id="price"
                  name="price"
                  type="number"
                  placeholder="$2300"
                  className="mt-1"
                />
              </div>
              <div className="lg:col-span-2">
                <Label htmlFor="productDetails">Product details</Label>
                <Textarea
                  id="productDetails"
                  name="productDetails"
                  placeholder="e.g. 3.8GHz 8-core 10th-generation Intel Core i7 processor, Turbo Boost up to 5.0GHz, Ram 16 GB DDR4 2300Mhz"
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-5">
                <div>
                  <img
                    alt="Apple iMac 1"
                    src="../../images/products/apple-imac-1.png"
                    className="h-24"
                  />
                  <a href="#" className="cursor-pointer">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="-mt-5 text-2xl text-red-600" />
                  </a>
                </div>
                <div>
                  <img
                    alt="Apple iMac 2"
                    src="../../images/products/apple-imac-2.png"
                    className="h-24"
                  />
                  <a href="#" className="cursor-pointer">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="-mt-5 text-2xl text-red-600" />
                  </a>
                </div>
                <div>
                  <img
                    alt="Apple iMac 3"
                    src="../../images/products/apple-imac-3.png"
                    className="h-24"
                  />
                  <a href="#" className="cursor-pointer">
                    <span className="sr-only">Delete</span>
                    <HiTrash className="-mt-5 text-2xl text-red-600" />
                  </a>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="flex w-full items-center justify-center">
                  <label className="flex h-32 w-full cursor-pointer flex-col rounded border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <HiUpload className="text-4xl text-gray-300" />
                      <p className="py-1 text-sm text-gray-600 dark:text-gray-500">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => setOpen(false)}>
            Save all
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const DeleteProductModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="failure" onClick={() => setOpen(!isOpen)}>
        <HiTrash className="mr-2 text-lg" />
        Delete item
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <ModalHeader className="px-3 pt-3 pb-0">
          <span className="sr-only">Delete product</span>
        </ModalHeader>
        <ModalBody className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-600" />
            <p className="text-lg text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this product?
            </p>
            <div className="flex items-center gap-x-3">
              <Button color="failure" onClick={() => setOpen(false)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

const ProductsTable: FC = function () {
  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <TableHead className="bg-gray-100 dark:bg-gray-700">
        <TableHeadCell>
          <span className="sr-only">Toggle selected</span>
          <Checkbox />
        </TableHeadCell>
        <TableHeadCell>Product Name</TableHeadCell>
        <TableHeadCell>Technology</TableHeadCell>
        <TableHeadCell>ID</TableHeadCell>
        <TableHeadCell>Price</TableHeadCell>
        <TableHeadCell>Actions</TableHeadCell>
      </TableHead>
      <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #194556
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            React JS
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #623232
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $129
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #194356
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            React JS
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #323323
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $129
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #994856
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #194256
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            React JS
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #623378
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $129
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #192856
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            React JS
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #523323
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $129
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #191857
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #914856
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            React JS
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #633293
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $129
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #924856
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            React JS
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #123323
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $129
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #198856
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #132856
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            React JS
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #613223
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $129
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #484856
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              React UI Kit
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            React JS
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #103324
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $129
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-700">
          <TableCell className="w-4 p-4">
            <Checkbox />
          </TableCell>
          <TableCell className="p-4 text-sm font-normal whitespace-nowrap text-gray-500 dark:text-gray-400">
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              Education Dashboard
            </div>
            <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Html templates
            </div>
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            Angular
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            #124859
          </TableCell>
          <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
            $149
          </TableCell>
          <TableCell className="space-x-2 p-4 whitespace-nowrap">
            <div className="flex items-center gap-x-3">
              <EditProductModal />
              <DeleteProductModal />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default EcommerceProductsPage;
