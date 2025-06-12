/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import {
  // Nowe importy dla Breadcrumb i jej podkomponentów
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
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiCog,
  HiDocumentDownload,
  HiHome,
  HiOutlinePencilAlt,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import {
  pobierzDostawcow,
  aktualizujDostawce,
  usunDostawce,
  generujIdDostawcy,
  dodajDostawceZHaslem,
  type Dostawca,
  type NowyDostawcaBezId,
  type AktualizacjaDostawcy,
} from "../../api/login_table_suppliers.api";

interface SupplierFormData {
  name: string;
  contact_name: string;
  contact_surname: string;
  contact_phone: string;
  nip: string;
  contact_email: string;
}

interface AddSupplierModalProps {
  refresh: () => void;
}

export const SupplierListPage: FC = function () {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(refreshTrigger + 1);
  };

  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
        <div className="w-full mb-1">
          <div className="mb-4">
            {/* Breadcrumb i BreadcrumbItem są już poprawnie importowane i używane */}
            <Breadcrumb className="mb-4">
              <BreadcrumbItem href="/">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </BreadcrumbItem>
              <BreadcrumbItem>Wszyscy dostawcy</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">Wszyscy dostawcy</h1>
          </div>
          <div className="sm:flex">
            <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
              <form className="lg:pr-3" action="#" method="GET">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  {/* TextInput użycie powinno być OK, jeśli nie ma problemów z propami */}
                  <TextInput id="users-search" name="users-search" placeholder="Szukaj dostawców" />
                </div>
              </form>
              <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Konfiguracja</span>
                  <HiCog className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Eksport</span>
                  <HiDocumentDownload className="text-2xl" />
                </a>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddSupplierModal refresh={handleSuccess} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllSuppliersTable onSuccess={handleSuccess} refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
      <Pagination />
    </NavbarSidebarLayout>
  );
};

export const AddSupplierModal: FC<AddSupplierModalProps> = function ({ refresh }) {
  const [supplierId, setSupplierId] = useState("");
  const [modalState, setModalState] = useState<boolean>(false);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");

  // Funkcja do generowania ID dostawcy
  const generateId = async () => {
    if (!supplierId) {
      try {
        console.log("Generowanie ID dostawcy");
        const id = await generujIdDostawcy();
        console.log("Wygenerowane ID:", id);
        setSupplierId(id);
      } catch (err) {
        console.error("Błąd podczas generowania ID:", err);
      }
    }
  };

  // Generuj ID po otwarciu modalu
  useEffect(() => {
    if (modalState) {
      console.log("Modal otwarty - generowanie ID dostawcy");
      // Generuj ID
      generateId();
    } else {
      // Reset ID przy zamykaniu
      setSupplierId("");
    }
  }, [modalState]);

  const handleCloseSuccessView = () => {
    setModalState(false);
    refresh();
  };

  return (
    <>
      {/* Button użycie powinno być OK */}
      <Button onClick={() => setModalState(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Dodaj dostawcę
        </div>
      </Button>
      {/* Modal użycie powinno być OK, jeśli ModalHeader, ModalBody, ModalFooter są poprawnie importowane i użyte */}
      <Modal onClose={handleCloseSuccessView} show={modalState}>
        <ModalHeader className="border-b border-gray-200 !p-6 bg-green-100 dark:bg-green-800 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-800">
              <svg
                className="h-5 w-5 text-green-700 dark:text-green-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <strong>Dodano nowego dostawcę</strong>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-gray-800 dark:text-green-300">
            <div className="mb-1 font-medium">Dostawca został pomyślnie dodany do systemu</div>
            <p className="text-sm">Poniżej znajdują się wszystkie dane dostawcy oraz dane do logowania.</p>
          </div>
        </ModalBody>
        <ModalFooter>
          {/* Button color="primary" powinno być OK */}
          <Button color="primary" onClick={handleCloseSuccessView}>
            <div className="flex items-center gap-x-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Zamknij
            </div>
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const AllSuppliersTable: FC<{ onSuccess: () => void; refreshTrigger: number }> = function ({
  onSuccess,
  refreshTrigger,
}) {
  const [dostawcy, setDostawcy] = useState<Dostawca[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await pobierzDostawcow();
        setDostawcy(data);
      } catch (error) {
        console.error("Błąd podczas pobierania dostawców:", error);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego dostawcę?")) {
      try {
        const success = await usunDostawce(id);
        if (success) {
          setDostawcy(dostawcy.filter((d) => d.id_supplier !== id));
          onSuccess();
        }
      } catch (err) {
        console.error(`Błąd podczas usuwania dostawcy o ID ${id}:`, err);
      }
    }
  };

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      {/* TableHead, TableHeadCell, TableBody, TableRow, TableCell użycie powinno być OK */}
      <TableHead className="bg-gray-100 dark:bg-gray-700">
        <TableRow>
          <TableHeadCell className="p-4">
            <div className="flex items-center">
              {/* Checkbox i Label użycie powinno być OK */}
              <Checkbox aria-label="Select all" />
              <Label htmlFor="select-all" className="sr-only">
                Select all
              </Label>
            </div>
          </TableHeadCell>
          <TableHeadCell>Nazwa firmy</TableHeadCell>
          <TableHeadCell>Osoba kontaktowa</TableHeadCell>
          <TableHeadCell>NIP</TableHeadCell>
          <TableHeadCell>Email</TableHeadCell>
          <TableHeadCell>Telefon</TableHeadCell>
          <TableHeadCell>Status</TableHeadCell>
          <TableHeadCell>
            <span className="sr-only">Akcje</span>
          </TableHeadCell>
        </TableRow>
      </TableHead>
      <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {dostawcy.map((dostawca) => (
          <TableRow key={dostawca.id_supplier} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <TableCell className="w-4 p-4">
              <div className="flex items-center">
                <Checkbox aria-label="Select row" />
                <Label htmlFor="checkbox-table-search-1" className="sr-only">
                  Select row
                </Label>
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600">
                    {dostawca.company_name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="text-base font-semibold text-gray-900 dark:text-white ml-3">
                  <div>{dostawca.company_name}</div>
                  <div className="text-sm font-normal text-gray-500 dark:text-gray-400">ID: {dostawca.id_supplier}</div>
                </div>
              </div>
            </TableCell>
            <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {dostawca.first_name} {dostawca.last_name}
            </TableCell>
            <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {dostawca.nip}
            </TableCell>
            <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {dostawca.email}
            </TableCell>
            <TableCell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {dostawca.phone}
            </TableCell>
            <TableCell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              <div className="flex items-center">
                <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>
                Aktywny
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-x-3">
                <EditSupplierModal dostawca={dostawca} onSuccess={onSuccess} />
                {/* Button color="failure" i size="sm" powinno być OK */}
                <Button color="failure" size="sm" onClick={() => handleDelete(dostawca.id_supplier)}>
                  <HiTrash className="mr-1" />
                  <span>Usuń</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const EditSupplierModal: FC<{
  dostawca: Dostawca;
  onSuccess: () => void;
}> = function ({ dostawca, onSuccess }) {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<AktualizacjaDostawcy>({
    company_name: dostawca.company_name,
    first_name: dostawca.first_name,
    last_name: dostawca.last_name,
    nip: dostawca.nip,
    email: dostawca.email,
    phone: dostawca.phone,
    website: dostawca.website,
    address_street: dostawca.address_street,
    address_building: dostawca.address_building,
    address_apartment: dostawca.address_apartment,
    address_city: dostawca.address_city,
    address_postal_code: dostawca.address_postal_code,
    address_country: dostawca.address_country,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        company_name: dostawca.company_name,
        first_name: dostawca.first_name,
        last_name: dostawca.last_name,
        nip: dostawca.nip,
        email: dostawca.email,
        phone: dostawca.phone,
        website: dostawca.website,
        address_street: dostawca.address_street,
        address_building: dostawca.address_building,
        address_apartment: dostawca.address_apartment,
        address_city: dostawca.address_city,
        address_postal_code: dostawca.address_postal_code,
        address_country: dostawca.address_country,
      });
    }
  }, [dostawca, isOpen]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" && (name === "website" || name === "address_apartment") ? null : value,
      }));
    },
    []
  );

  const handleSubmit = async () => {
    try {
      const result = await aktualizujDostawce(dostawca.id_supplier, formData);
      if (result) {
        setOpen(false);
        onSuccess();
      }
    } catch (err) {
      console.error("Wystąpił błąd podczas aktualizowania dostawcy.", err);
    }
  };

  return (
    <>
      {/* Button color="primary" i size="sm" powinno być OK */}
      <Button color="primary" size="sm" onClick={() => setOpen(true)}>
        <HiOutlinePencilAlt className="mr-1" />
        <span>Edytuj</span>
      </Button>
      {/* Modal, ModalHeader, ModalBody, ModalFooter, Label, TextInput użycie powinno być OK */}
      <Modal show={isOpen} onClose={() => setOpen(false)} size="xl" popup={true}>
        <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edytuj dostawcę</h3>
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            <p className="text-gray-600">
              ID dostawcy: <strong>{dostawca.id_supplier}</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="company_name">Nazwa firmy</Label>
              <TextInput
                id="company_name"
                name="company_name"
                required
                className="mt-1"
                value={formData.company_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="first_name">Imię osoby kontaktowej</Label>
              <TextInput
                id="first_name"
                name="first_name"
                required
                className="mt-1"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nazwisko osoby kontaktowej</Label>
              <TextInput
                id="last_name"
                name="last_name"
                required
                className="mt-1"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="nip">NIP</Label>
              <TextInput id="nip" name="nip" required className="mt-1" value={formData.nip} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                name="email"
                type="email"
                required
                className="mt-1"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <TextInput
                id="phone"
                name="phone"
                type="tel"
                required
                className="mt-1"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="website">Strona WWW</Label>
              <TextInput
                id="website"
                name="website"
                className="mt-1"
                value={formData.website || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="address_street">Ulica</Label>
              <TextInput
                id="address_street"
                name="address_street"
                required
                className="mt-1"
                value={formData.address_street}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="address_building">Nr budynku</Label>
              <TextInput
                id="address_building"
                name="address_building"
                required
                className="mt-1"
                value={formData.address_building}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="address_apartment">Nr lokalu</Label>
              <TextInput
                id="address_apartment"
                name="address_apartment"
                className="mt-1"
                value={formData.address_apartment || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="address_city">Miasto</Label>
              <TextInput
                id="address_city"
                name="address_city"
                required
                className="mt-1"
                value={formData.address_city}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="address_postal_code">Kod pocztowy</Label>
              <TextInput
                id="address_postal_code"
                name="address_postal_code"
                required
                className="mt-1"
                value={formData.address_postal_code}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="address_country">Kraj</Label>
              <TextInput
                id="address_country"
                name="address_country"
                required
                className="mt-1"
                value={formData.address_country}
                onChange={handleChange}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          {/* Button color="primary" powinno być OK */}
          <Button color="primary" onClick={handleSubmit}>
            Zapisz zmiany
          </Button>
          <Button color="gray" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const Pagination: FC = function () {
  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
      <div className="mb-4 flex items-center sm:mb-0">
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Wyświetlono&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">1-20</span>
          &nbsp;z&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">wszystkich</span>
        </span>
      </div>
      <div className="flex items-center space-x-3">
        {/* Button color="gray" i size="sm" powinno być OK */}
        <Button color="gray" size="sm">
          <div className="flex items-center gap-x-1">
            <HiChevronLeft className="text-xl" />
            Poprzednia
          </div>
        </Button>
        <Button color="gray" size="sm">
          <div className="flex items-center gap-x-1">
            Następna
            <HiChevronRight className="text-xl" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default SupplierListPage;
