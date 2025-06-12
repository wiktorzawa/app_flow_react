import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Dropdown,
  Modal,
  ModalBody,
  ModalHeader,
  Pagination,
  Table,
  TextInput,
  Card,
  Avatar,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import {
  HiHome,
  HiOutlinePlus,
  HiOutlineAdjustments,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineFilter,
  HiX,
  HiCheck,
  HiCog,
  HiUserCircle,
  HiHeart,
  HiClipboard,
  HiTruck,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import { useState } from "react";
import type { FC } from "react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import { useSidebarContext } from "../../context/SidebarContext";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  date: string;
  amount: string;
  status: "delivered" | "processing" | "failed" | "completed";
}

const getStatusBadge = (status: Order["status"]) => {
  switch (status) {
    case "delivered":
      return <Badge color="success">Dostarczono</Badge>;
    case "processing":
      return <Badge color="warning">W trakcie</Badge>;
    case "failed":
      return <Badge color="failure">Anulowane</Badge>;
    case "completed":
      return <Badge color="info">Zakończone</Badge>;
    default:
      return <Badge>Nieznany</Badge>;
  }
};

const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-12345",
    customer: {
      name: "Jan Kowalski",
      email: "jan.kowalski@example.com",
      avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
    },
    date: "12-04-2023",
    amount: "1499,99 zł",
    status: "delivered",
  },
  {
    id: "2",
    orderNumber: "ORD-23456",
    customer: {
      name: "Anna Nowak",
      email: "anna.nowak@example.com",
      avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png",
    },
    date: "10-04-2023",
    amount: "799,00 zł",
    status: "processing",
  },
  {
    id: "3",
    orderNumber: "ORD-34567",
    customer: {
      name: "Piotr Wiśniewski",
      email: "piotr.wisniewski@example.com",
      avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/thomas-lean.png",
    },
    date: "08-04-2023",
    amount: "2499,99 zł",
    status: "failed",
  },
  {
    id: "4",
    orderNumber: "ORD-45678",
    customer: {
      name: "Agnieszka Zielińska",
      email: "agnieszka.zielinska@example.com",
      avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png",
    },
    date: "05-04-2023",
    amount: "349,99 zł",
    status: "completed",
  },
  {
    id: "5",
    orderNumber: "ORD-56789",
    customer: {
      name: "Marcin Dąbrowski",
      email: "marcin.dabrowski@example.com",
      avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/neil-sims.png",
    },
    date: "01-04-2023",
    amount: "1299,99 zł",
    status: "delivered",
  },
];

const OrderListPage: FC = function () {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const onPageChange = (page: number) => setCurrentPage(page);

  const openDeleteModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedOrderId(null);
    setDeleteModalOpen(false);
  };

  const deleteOrder = () => {
    // Tu powinna być logika usuwania zamówienia
    console.log(`Usuwanie zamówienia o ID: ${selectedOrderId}`);
    closeDeleteModal();
  };

  const filteredOrders = sampleOrders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <Breadcrumb className="mb-4">
            <BreadcrumbItem href="/" icon={HiHome}>
              Home
            </BreadcrumbItem>
            <BreadcrumbItem>E-commerce</BreadcrumbItem>
            <BreadcrumbItem>Zamówienia</BreadcrumbItem>
          </Breadcrumb>
          <div className="flex space-x-2">
            <Button color="primary" className="gap-1">
              <HiOutlinePlus className="h-5 w-5" />
              <span>Dodaj zamówienie</span>
            </Button>
            <Button color="gray" className="gap-1">
              <HiOutlineDownload className="h-5 w-5" />
              <span>Eksportuj</span>
            </Button>
          </div>
        </div>

        <Card>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 pb-4">
            <div className="w-full md:w-1/2">
              <div className="flex items-center">
                <label htmlFor="search-order" className="sr-only">
                  Szukaj
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <HiOutlineSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <TextInput
                    id="search-order"
                    type="text"
                    placeholder="Szukaj zamówień..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    icon={HiOutlineSearch}
                  />
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Button color="gray" className="gap-1">
                <HiOutlineFilter className="h-5 w-5" />
                <span>Filtruj</span>
              </Button>
              <Button color="gray" className="gap-1">
                <HiOutlineAdjustments className="h-5 w-5" />
                <span>Opcje</span>
              </Button>
              <Button color="gray" className="gap-1">
                <HiOutlineRefresh className="h-5 w-5" />
                <span>Odśwież</span>
              </Button>
            </div>
          </div>
          <Table hoverable>
            <TableHead>
              <TableRow>
                <TableHeadCell>Nr zamówienia</TableHeadCell>
                <TableHeadCell>Klient</TableHeadCell>
                <TableHeadCell>Data</TableHeadCell>
                <TableHeadCell>Kwota</TableHeadCell>
                <TableHeadCell>Status</TableHeadCell>
                <TableHeadCell>
                  <span className="sr-only">Akcje</span>
                </TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Avatar img={order.customer.avatar} rounded size="sm" className="mr-3" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{order.customer.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button size="xs" color="info" className="gap-1">
                        <HiOutlineEye className="h-4 w-4" />
                        <span>Podgląd</span>
                      </Button>
                      <Button size="xs" color="warning" className="gap-1">
                        <HiOutlinePencil className="h-4 w-4" />
                        <span>Edytuj</span>
                      </Button>
                      <Button size="xs" color="failure" className="gap-1" onClick={() => openDeleteModal(order.id)}>
                        <HiOutlineTrash className="h-4 w-4" />
                        <span>Usuń</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Pokazano <span className="font-semibold text-gray-900 dark:text-white">1-5</span> z{" "}
              <span className="font-semibold text-gray-900 dark:text-white">100</span> zamówień
            </span>
            <Pagination currentPage={currentPage} totalPages={20} onPageChange={onPageChange} showIcons />
          </div>
        </Card>

        {/* Modal do potwierdzenia usunięcia */}
        <Modal show={isDeleteModalOpen} size="md" onClose={closeDeleteModal} popup>
          <ModalHeader />
          <ModalBody>
            <div className="text-center">
              <HiOutlineTrash className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Czy na pewno chcesz usunąć to zamówienie?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={deleteOrder}>
                  Tak, usuń
                </Button>
                <Button color="gray" onClick={closeDeleteModal}>
                  Nie, anuluj
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </NavbarSidebarLayout>
  );
};

export default OrderListPage;
