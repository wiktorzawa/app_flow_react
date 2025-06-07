/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import type { FC } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiCog,
  HiDocumentDownload,
  HiExclamationCircle,
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
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contact_name: "",
    contact_surname: "",
    contact_phone: "",
    nip: "",
    contact_email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedSupplier, setAddedSupplier] = useState<(Dostawca & { password: string }) | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string>("");

  // Funkcja do generowania ID dostawcy
  const generateId = async () => {
    if (!supplierId) {
      setIsLoading(true);
      try {
        console.log("Generowanie ID dostawcy");
        const id = await generujIdDostawcy();
        console.log("Wygenerowane ID:", id);
        setSupplierId(id);
      } catch (err) {
        console.error("Błąd podczas generowania ID:", err);
        setError("Nie udało się wygenerować ID dostawcy");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Generuj ID po otwarciu modalu
  useEffect(() => {
    if (modalState) {
      console.log("Modal otwarty - generowanie ID dostawcy");
      // Reset formularza
      setFormData({
        name: "",
        contact_name: "",
        contact_surname: "",
        contact_phone: "",
        nip: "",
        contact_email: "",
      });
      setError(null);
      setShowSuccess(false);
      setAddedSupplier(null);
      // Generuj ID
      generateId();
    } else {
      // Reset ID przy zamykaniu
      setSupplierId("");
    }
  }, [modalState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" && (name === "website" || name === "address_apartment") ? null : value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const supplierData: NowyDostawcaBezId = {
        company_name: formData.name,
        first_name: formData.contact_name,
        last_name: formData.contact_surname,
        phone: formData.contact_phone,
        nip: formData.nip,
        email: formData.contact_email,
        website: null,
        address_street: "",
        address_building: "",
        address_apartment: null,
        address_city: "",
        address_postal_code: "",
        address_country: "Polska",
      };

      const result = await dodajDostawceZHaslem(supplierData);
      if (result) {
        setAddedSupplier(result);
        setGeneratedPassword(result.password);
        setShowSuccess(true);
      } else {
        setError("Nie udało się dodać dostawcy. Spróbuj ponownie.");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas dodawania dostawcy.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccessView = () => {
    setShowSuccess(false);
    setModalState(false);
    refresh();
  };

  return (
    <>
      <Button onClick={() => setModalState(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Dodaj dostawcę
        </div>
      </Button>
      <Modal onClose={handleCloseSuccessView} show={modalState}>
        <div className="modal-header border-b border-gray-200 !p-6 bg-green-100 dark:bg-green-800 dark:border-gray-700">
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
        </div>
        <ModalBody>
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-gray-800 dark:text-green-300">
            <div className="mb-1 font-medium">Dostawca został pomyślnie dodany do systemu</div>
            <p className="text-sm">Poniżej znajdują się wszystkie dane dostawcy oraz dane do logowania.</p>
          </div>

          {addedSupplier && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-3 text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Dane podstawowe
                </h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">ID dostawcy:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.id_supplier}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Nazwa firmy:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.company_name}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Osoba kontaktowa:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.first_name} {addedSupplier.last_name}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">NIP:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{addedSupplier.nip}</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{addedSupplier.email}</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Telefon:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{addedSupplier.phone}</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Strona WWW:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.website || "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-3 text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Dane adresowe
                </h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Ulica:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.address_street}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Nr budynku:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.address_building}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Nr lokalu:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.address_apartment || "-"}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Miasto:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.address_city}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Kod pocztowy:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.address_postal_code}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Kraj:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.address_country}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h4 className="mb-3 text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  <svg
                    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Dane logowania
                </h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">ID logowania:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {addedSupplier.id_supplier}/LOG
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Login:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{addedSupplier.email}</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Hasło:</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <span className="mr-2">{generatedPassword}</span>
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedPassword);
                            alert("Hasło skopiowane do schowka");
                          }}
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm dark:bg-yellow-900 dark:text-yellow-300">
                  <div className="flex">
                    <svg
                      className="mr-2 h-5 w-5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <div>
                      Prosimy o zapisanie hasła i przekazanie go dostawcy. Ze względów bezpieczeństwa hasło nie zostanie
                      wyświetlone ponownie.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await pobierzDostawcow();
        setDostawcy(data);
      } catch (error) {
        console.error("Błąd podczas pobierania dostawców:", error);
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Ładowanie danych...</p>
      </div>
    );
  }

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <TableHead className="bg-gray-100 dark:bg-gray-700">
        <TableHeadCell className="p-4">
          <div className="flex items-center">
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" && (name === "website" || name === "address_apartment") ? null : value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await aktualizujDostawce(dostawca.id_supplier, formData);
      if (result) {
        setOpen(false);
        onSuccess();
      } else {
        setError("Nie udało się zaktualizować dostawcy. Spróbuj ponownie.");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas aktualizowania dostawcy.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button color="primary" size="sm" onClick={() => setOpen(true)}>
        <HiOutlinePencilAlt className="mr-1" />
        <span>Edytuj</span>
      </Button>
      <Modal show={isOpen} onClose={() => setOpen(false)} size="xl" popup={true}>
        <div className="modal-header border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edytuj dostawcę</h3>
        </div>
        <ModalBody>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900 dark:text-red-300">
              <div className="flex items-center">
                <HiExclamationCircle className="mr-2 h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
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
          <Button color="primary" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
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
