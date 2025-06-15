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
  TextInput,
  Select,
} from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiCog,
  HiDocumentDownload,
  HiDotsVertical,
  HiExclamationCircle,
  HiHome,
  HiOutlineExclamationCircle,
  HiOutlinePencilAlt,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import {
  pobierzPracownikow,
  aktualizujPracownika,
  usunPracownika,
  generujIdPracownika,
  dodajPracownikaZHaslem,
  type Pracownik,
  type NowyPracownikBezId,
  type AktualizacjaPracownika,
} from "../../api/login_table_staff.api";

const UserListPage: FC = function () {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

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
              <BreadcrumbItem href="/users/list">Użytkownicy</BreadcrumbItem>
              <BreadcrumbItem>Lista</BreadcrumbItem>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              Wszyscy pracownicy
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100 dark:divide-gray-700">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Szukaj
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput
                    id="users-search"
                    name="users-search"
                    placeholder="Szukaj pracowników"
                  />
                </div>
              </form>
              <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
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
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddUserModal onSuccess={handleSuccess} />
              <Button color="gray">
                <div className="flex items-center gap-x-3">
                  <HiDocumentDownload className="text-xl" />
                  <span>Eksportuj</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <AllUsersTable key={refreshTrigger} onSuccess={handleSuccess} />
            </div>
          </div>
        </div>
      </div>
      <Pagination />
    </NavbarSidebarLayout>
  );
};

const AddUserModal: FC<{ onSuccess: () => void }> = function ({ onSuccess }) {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<NowyPracownikBezId>({
    first_name: "",
    last_name: "",
    role: "staff",
    email: "",
    phone: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedUser, setAddedUser] = useState<Pracownik | null>(null);

  const handleRoleChange = async (role: "admin" | "staff") => {
    setIsLoading(true);
    try {
      console.log("Generowanie ID dla roli:", role);
      const newId = await generujIdPracownika(role);
      console.log("Wygenerowane ID:", newId);
      setGeneratedId(newId);
    } catch (err) {
      console.error("Błąd podczas generowania ID:", err);
      setError("Nie udało się wygenerować ID");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "role") {
      console.log("Zmieniono rolę na:", value);
      if (value === "staff" || value === "admin") {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
        await handleRoleChange(value as "admin" | "staff");
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" && name === "phone" ? null : value,
      }));
    }
  };

  useEffect(() => {
    if (isOpen) {
      console.log("Modal otwarty - generowanie początkowego ID dla roli staff");
      setFormData({
        first_name: "",
        last_name: "",
        role: "staff",
        email: "",
        phone: null,
      });
      setError(null);
      setShowSuccess(false);
      setAddedUser(null);

      handleRoleChange("staff");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await dodajPracownikaZHaslem(formData);
      if (result) {
        setAddedUser(result);
        setShowSuccess(true);
      } else {
        setError("Nie udało się dodać pracownika");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas dodawania pracownika");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatedPassword = generatedId
    ? `pracownika${generatedId.charAt(generatedId.length - 1)}`
    : "";

  const handleCloseSuccessView = () => {
    setOpen(false);
    onSuccess();
  };

  if (showSuccess && addedUser) {
    return (
      <Modal onClose={handleCloseSuccessView} show={isOpen}>
        <ModalHeader className="border-b border-gray-200 bg-green-100 !p-6 dark:border-gray-700 dark:bg-green-800">
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
            <strong>Dodano nowego pracownika</strong>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-gray-800 dark:text-green-300">
            <div className="mb-1 font-medium">
              Pracownik został pomyślnie dodany do systemu
            </div>
            <p className="text-sm">
              Poniżej znajdują się wszystkie dane pracownika oraz dane do
              logowania.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-3 flex items-center text-lg font-medium text-gray-900 dark:text-white">
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
                Dane pracownika
              </h4>
              <div className="space-y-2">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ID:
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {addedUser.id_staff}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Imię i nazwisko:
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {addedUser.first_name} {addedUser.last_name}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Rola:
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        addedUser.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {addedUser.role === "admin"
                        ? "Administrator"
                        : "Pracownik"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email:
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {addedUser.email}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Telefon:
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {addedUser.phone || "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="mb-3 flex items-center text-lg font-medium text-gray-900 dark:text-white">
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
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    ID logowania:
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {addedUser.id_staff}/LOG
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Login:
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {addedUser.email}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Hasło:
                  </div>
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
              <div className="mt-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
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
                    Prosimy o zapisanie hasła i przekazanie go pracownikowi. Ze
                    względów bezpieczeństwa hasło nie zostanie wyświetlone
                    ponownie.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCloseSuccessView}>
            <div className="flex items-center gap-x-2">
              <svg
                className="h-5 w-5"
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
              Zamknij
            </div>
          </Button>
        </ModalFooter>
      </Modal>
    );
  }

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Dodaj pracownika
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <ModalHeader className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Dodaj nowego pracownika</strong>
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
          {isLoading && (
            <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Generowanie ID pracownika...
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="role">Rola</Label>
              <Select
                id="role"
                name="role"
                className="mt-1"
                value={formData.role}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="staff">Pracownik</option>
                <option value="admin">Administrator</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="id_staff">ID Pracownika</Label>
              <TextInput
                id="id_staff"
                name="id_staff"
                className="mt-1"
                value={generatedId}
                disabled={true}
              />
              <p className="mt-1 text-xs text-gray-500">
                ID generowane automatycznie na podstawie roli
              </p>
            </div>
            <div>
              <Label htmlFor="first_name">Imię</Label>
              <TextInput
                id="first_name"
                name="first_name"
                placeholder="Jan"
                className="mt-1"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Nazwisko</Label>
              <TextInput
                id="last_name"
                name="last_name"
                placeholder="Kowalski"
                className="mt-1"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                name="email"
                placeholder="example@company.com"
                className="mt-1"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <TextInput
                id="phone"
                name="phone"
                placeholder="123456789"
                className="mt-1"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              isLoading ||
              !generatedId ||
              !formData.first_name ||
              !formData.last_name ||
              !formData.email
            }
          >
            {isSubmitting ? "Dodawanie..." : "Dodaj pracownika"}
          </Button>
          <Button color="gray" onClick={() => setOpen(false)}>
            Anuluj
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const AllUsersTable: FC<{ onSuccess: () => void }> = function ({ onSuccess }) {
  const [pracownicy, setPracownicy] = useState<Pracownik[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await pobierzPracownikow();
        setPracownicy(data);
        setError(null);
      } catch (err) {
        setError("Nie udało się pobrać danych pracowników");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Czy na pewno chcesz usunąć tego pracownika?")) {
      try {
        const success = await usunPracownika(id);
        if (success) {
          setPracownicy(pracownicy.filter((p) => p.id_staff !== id));
          onSuccess();
        }
      } catch (err) {
        console.error("Błąd podczas usuwania pracownika:", err);
      }
    }
  };

  if (isLoading)
    return <div className="p-4 text-center">Ładowanie danych...</div>;
  if (error)
    return <div className="p-4 text-center text-red-500">Błąd: {error}</div>;
  if (pracownicy.length === 0)
    return (
      <div className="p-4 text-center">Brak pracowników do wyświetlenia</div>
    );

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <TableHead className="bg-gray-100 dark:bg-gray-700">
        <TableHeadCell>
          <Label htmlFor="select-all" className="sr-only">
            Zaznacz wszystko
          </Label>
          <Checkbox id="select-all" name="select-all" />
        </TableHeadCell>
        <TableHeadCell>Imię i Nazwisko</TableHeadCell>
        <TableHeadCell>Rola</TableHeadCell>
        <TableHeadCell>Email</TableHeadCell>
        <TableHeadCell>Telefon</TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell>Akcje</TableHeadCell>
      </TableHead>
      <TableBody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {pracownicy.map((pracownik) => (
          <TableRow
            key={pracownik.id_staff}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <TableCell className="w-4 p-4">
              <div className="flex items-center">
                <Checkbox
                  aria-describedby={`checkbox-${pracownik.id_staff}`}
                  id={`checkbox-${pracownik.id_staff}`}
                />
                <label
                  htmlFor={`checkbox-${pracownik.id_staff}`}
                  className="sr-only"
                >
                  checkbox
                </label>
              </div>
            </TableCell>
            <TableCell className="mr-12 flex items-center space-x-6 p-4 whitespace-nowrap lg:mr-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <span className="text-lg font-bold text-gray-600">
                  {pracownik.first_name[0]}
                  {pracownik.last_name[0]}
                </span>
              </div>
              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                <div className="text-base font-semibold text-gray-900 dark:text-white">
                  {pracownik.first_name} {pracownik.last_name}
                </div>
                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ID: {pracownik.id_staff}
                </div>
              </div>
            </TableCell>
            <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
              {pracownik.role === "admin" ? "Administrator" : "Pracownik"}
            </TableCell>
            <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
              {pracownik.email}
            </TableCell>
            <TableCell className="p-4 text-base font-medium whitespace-nowrap text-gray-900 dark:text-white">
              {pracownik.phone || "-"}
            </TableCell>
            <TableCell className="p-4 text-base font-normal whitespace-nowrap text-gray-900 dark:text-white">
              <div className="flex items-center">
                <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
                Aktywny
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-x-3 whitespace-nowrap">
                <EditUserModal pracownik={pracownik} onSuccess={onSuccess} />
                <Button
                  color="failure"
                  onClick={() => handleDelete(pracownik.id_staff)}
                >
                  <HiTrash className="text-lg" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const EditUserModal: FC<{
  pracownik: Pracownik;
  onSuccess: () => void;
}> = function ({ pracownik, onSuccess }) {
  const [isOpen, setOpen] = useState(false);
  const [formData, setFormData] = useState<AktualizacjaPracownika>({
    first_name: pracownik.first_name,
    last_name: pracownik.last_name,
    role: pracownik.role,
    email: pracownik.email,
    phone: pracownik.phone,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      first_name: pracownik.first_name,
      last_name: pracownik.last_name,
      role: pracownik.role,
      email: pracownik.email,
      phone: pracownik.phone,
    });
  }, [pracownik]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" && name === "phone" ? null : value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await aktualizujPracownika(pracownik.id_staff, formData);
      if (result) {
        setOpen(false);
        onSuccess();
      } else {
        setError("Nie udało się zaktualizować pracownika");
      }
    } catch (err) {
      setError("Wystąpił błąd podczas aktualizacji pracownika");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <HiOutlinePencilAlt className="text-lg" />
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <ModalHeader className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edytuj pracownika</strong>
        </ModalHeader>
        <ModalBody>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
          <div className="mb-4">
            <p className="text-gray-600">
              ID pracownika: <strong>{pracownik.id_staff}</strong>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="first_name">Imię</Label>
              <div className="mt-1">
                <TextInput
                  id="first_name"
                  name="first_name"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="last_name">Nazwisko</Label>
              <div className="mt-1">
                <TextInput
                  id="last_name"
                  name="last_name"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Rola</Label>
              <div className="mt-1">
                <Select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="staff">Pracownik</option>
                  <option value="admin">Administrator</option>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <div className="mt-1">
                <TextInput
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
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

const DeleteUserModal: FC = function () {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button color="failure" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-2">
          <HiTrash className="text-lg" />
          Delete user
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen} size="md">
        <ModalHeader className="px-6 pt-6 pb-0">
          <span className="sr-only">Delete user</span>
        </ModalHeader>
        <ModalBody className="px-6 pt-0 pb-6">
          <div className="flex flex-col items-center gap-y-6 text-center">
            <HiOutlineExclamationCircle className="text-7xl text-red-500" />
            <p className="text-xl text-gray-500">
              Are you sure you want to delete this user?
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

export const Pagination: FC = function () {
  return (
    <div className="sticky right-0 bottom-0 w-full items-center border-t border-gray-200 bg-white p-4 sm:flex sm:justify-between dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center sm:mb-0">
        <a
          href="#"
          className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Previous page</span>
          <HiChevronLeft className="text-2xl" />
        </a>
        <a
          href="#"
          className="mr-2 inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Next page</span>
          <HiChevronRight className="text-2xl" />
        </a>
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          Showing&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            1-20
          </span>
          &nbsp;of&nbsp;
          <span className="font-semibold text-gray-900 dark:text-white">
            2290
          </span>
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <a
          href="#"
          className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:ring-4"
        >
          <HiChevronLeft className="mr-1 text-base" />
          Previous
        </a>
        <a
          href="#"
          className="bg-primary-700 hover:bg-primary-800 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 inline-flex flex-1 items-center justify-center rounded-lg px-3 py-2 text-center text-sm font-medium text-white focus:ring-4"
        >
          Next
          <HiChevronRight className="ml-1 text-base" />
        </a>
      </div>
    </div>
  );
};

export default UserListPage;
