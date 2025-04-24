/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Breadcrumb,
  Button,
  Checkbox,
  Label,
  Modal,
  Table,
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
  dodajPracownika, 
  aktualizujPracownika, 
  usunPracownika,
  type Pracownik,
  type NowyPracownik,
  type AktualizacjaPracownika
} from "../../api/login_table_staff.api";

const UserListPage: FC = function () {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  return (
    <NavbarSidebarLayout isFooter={false}>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <Breadcrumb className="mb-4">
              <Breadcrumb.Item href="#">
                <div className="flex items-center gap-x-3">
                  <HiHome className="text-xl" />
                  <span className="dark:text-white">Home</span>
                </div>
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/users/list">Użytkownicy</Breadcrumb.Item>
              <Breadcrumb.Item>Lista</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              Wszyscy pracownicy
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
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
  const [formData, setFormData] = useState<NowyPracownik>({
    id_staff: "",
    first_name: "",
    last_name: "",
    role: "staff",
    email: "",
    phone: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value === "" && name === "phone" ? null : value 
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await dodajPracownika(formData);
      if (result) {
        setOpen(false);
        setFormData({
          id_staff: "",
          first_name: "",
          last_name: "",
          role: "staff",
          email: "",
          phone: null
        });
        onSuccess();
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

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Dodaj pracownika
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} show={isOpen}>
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Dodaj nowego pracownika</strong>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="id_staff">ID pracownika</Label>
              <div className="mt-1">
                <TextInput
                  id="id_staff"
                  name="id_staff"
                  placeholder="np. STF/00003"
                  required
                  value={formData.id_staff}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="first_name">Imię</Label>
              <div className="mt-1">
                <TextInput
                  id="first_name"
                  name="first_name"
                  placeholder="Jan"
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
                  placeholder="Kowalski"
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
                  placeholder="jan.kowalski@msbox.com"
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
                  placeholder="500100200"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            color="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Dodawanie..." : "Dodaj pracownika"}
          </Button>
          <Button 
            color="gray" 
            onClick={() => setOpen(false)}
          >
            Anuluj
          </Button>
        </Modal.Footer>
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
          setPracownicy(pracownicy.filter(p => p.id_staff !== id));
          onSuccess();
        }
      } catch (err) {
        console.error("Błąd podczas usuwania pracownika:", err);
      }
    }
  };

  if (isLoading) return <div className="p-4 text-center">Ładowanie danych...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Błąd: {error}</div>;
  if (pracownicy.length === 0) return <div className="p-4 text-center">Brak pracowników do wyświetlenia</div>;

  return (
    <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
      <Table.Head className="bg-gray-100 dark:bg-gray-700">
        <Table.HeadCell>
          <Label htmlFor="select-all" className="sr-only">
            Zaznacz wszystko
          </Label>
          <Checkbox id="select-all" name="select-all" />
        </Table.HeadCell>
        <Table.HeadCell>Imię i Nazwisko</Table.HeadCell>
        <Table.HeadCell>Rola</Table.HeadCell>
        <Table.HeadCell>Email</Table.HeadCell>
        <Table.HeadCell>Telefon</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Akcje</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
        {pracownicy.map((pracownik) => (
          <Table.Row key={pracownik.id_staff} className="hover:bg-gray-100 dark:hover:bg-gray-700">
            <Table.Cell className="w-4 p-4">
              <div className="flex items-center">
                <Checkbox aria-describedby={`checkbox-${pracownik.id_staff}`} id={`checkbox-${pracownik.id_staff}`} />
                <label htmlFor={`checkbox-${pracownik.id_staff}`} className="sr-only">
                  checkbox
                </label>
              </div>
            </Table.Cell>
            <Table.Cell className="mr-12 flex items-center space-x-6 whitespace-nowrap p-4 lg:mr-0">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-lg font-bold text-gray-600">
                  {pracownik.first_name[0]}{pracownik.last_name[0]}
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
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {pracownik.role === "admin" ? "Administrator" : "Pracownik"}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {pracownik.email}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
              {pracownik.phone || "-"}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap p-4 text-base font-normal text-gray-900 dark:text-white">
              <div className="flex items-center">
                <div className="mr-2 h-2.5 w-2.5 rounded-full bg-green-400"></div>{" "}
                Aktywny
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-x-3 whitespace-nowrap">
                <EditUserModal pracownik={pracownik} onSuccess={onSuccess} />
                <Button color="failure" onClick={() => handleDelete(pracownik.id_staff)}>
                  <HiTrash className="text-lg" />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
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
    phone: pracownik.phone
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      first_name: pracownik.first_name,
      last_name: pracownik.last_name,
      role: pracownik.role,
      email: pracownik.email,
      phone: pracownik.phone
    });
  }, [pracownik]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value === "" && name === "phone" ? null : value 
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
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Edytuj pracownika</strong>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
          <div className="mb-4">
            <p className="text-gray-600">ID pracownika: <strong>{pracownik.id_staff}</strong></p>
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
        </Modal.Body>
        <Modal.Footer>
          <Button 
            color="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
          <Button 
            color="gray" 
            onClick={() => setOpen(false)}
          >
            Anuluj
          </Button>
        </Modal.Footer>
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
        <Modal.Header className="px-6 pb-0 pt-6">
          <span className="sr-only">Delete user</span>
        </Modal.Header>
        <Modal.Body className="px-6 pb-6 pt-0">
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export const Pagination: FC = function () {
  return (
    <div className="sticky bottom-0 right-0 w-full items-center border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex sm:justify-between">
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
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <HiChevronLeft className="mr-1 text-base" />
          Previous
        </a>
        <a
          href="#"
          className="inline-flex flex-1 items-center justify-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Next
          <HiChevronRight className="ml-1 text-base" />
        </a>
      </div>
    </div>
  );
};

export default UserListPage;
