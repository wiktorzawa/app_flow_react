import React, { useState, useEffect } from "react";
import { AdsPowerProfile, fetchAdsPowerProfiles } from "../../api/adsPowerApi";
import {
  BrightDataProxy,
  fetchBrightDataProxies,
} from "../../api/brightDataApi";
import {
  Alert,
  Spinner,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeadCell,
  Badge,
} from "flowbite-react";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import {
  HiOutlinePlus,
  HiChevronDown,
  HiChevronUp,
  HiDatabase,
  HiOutlinePencil,
  HiTrash,
  HiInformationCircle,
  HiServer,
} from "react-icons/hi";

const AdsPowerDashboardPage: React.FC = () => {
  const [profiles, setProfiles] = useState<AdsPowerProfile[]>([]);
  const [isLoadingAdsPower, setIsLoadingAdsPower] = useState<boolean>(true);
  const [errorAdsPower, setErrorAdsPower] = useState<string | null>(null);

  const [expandedAdsPowerRows, setExpandedAdsPowerRows] = useState<Set<string>>(
    new Set(),
  );
  const [savedProfiles] = useState<Set<string>>(new Set());
  const [isSyncingProfile] = useState<string | null>(null);

  const [brightDataZones, setBrightDataZones] = useState<BrightDataProxy[]>([]);
  const [isLoadingBrightData, setIsLoadingBrightData] = useState<boolean>(true);
  const [errorBrightData, setErrorBrightData] = useState<string | null>(null);
  const [expandedBrightDataRows, setExpandedBrightDataRows] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    const loadAdsPowerProfiles = async () => {
      setIsLoadingAdsPower(true);
      setErrorAdsPower(null);
      try {
        const response = await fetchAdsPowerProfiles();
        setProfiles(response.list || []);
      } catch (err: any) {
        setErrorAdsPower(
          err.message || "Wystąpił błąd podczas ładowania profili AdsPower.",
        );
        setProfiles([]);
      }
      setIsLoadingAdsPower(false);
    };

    loadAdsPowerProfiles();
  }, []);

  useEffect(() => {
    const loadBrightDataZones = async () => {
      setIsLoadingBrightData(true);
      setErrorBrightData(null);
      try {
        const response = await fetchBrightDataProxies();
        if (response.success) {
          setBrightDataZones(response.data || []);
        } else {
          throw new Error(
            response.message || "Nie udało się pobrać stref Bright Data.",
          );
        }
      } catch (err: any) {
        setErrorBrightData(
          err.message || "Wystąpił błąd podczas ładowania stref Bright Data.",
        );
        setBrightDataZones([]);
      }
      setIsLoadingBrightData(false);
    };

    loadBrightDataZones();
  }, []);

  const handleAdsPowerRowExpand = (id: string) => {
    setExpandedAdsPowerRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBrightDataRowExpand = (zoneName: string) => {
    setExpandedBrightDataRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(zoneName)) {
        newSet.delete(zoneName);
      } else {
        newSet.add(zoneName);
      }
      return newSet;
    });
  };

  const onDeleteProfile = () => {
    console.log("Delete profile action triggered");
  };

  const onEditProfile = () => {
    console.log("Edit profile action triggered");
  };

  const onSyncProfile = () => {
    console.log("Sync profile action triggered");
  };

  const onAddNewProfile = () => {
    console.log("Add new profile action triggered");
  };

  const onEditBrightDataZone = (zoneName: string) => {
    console.log("Edit Bright Data zone:", zoneName);
  };

  const onDeleteBrightDataZone = (zoneName: string) => {
    console.log("Delete Bright Data zone:", zoneName);
  };

  const onAddNewBrightDataZone = () => {
    console.log("Add new Bright Data zone action triggered");
  };

  const renderAdsPowerLoading = () => (
    <div className="flex h-64 items-center justify-center">
      <Spinner size="xl" />
      <p className="ml-4 text-lg">Ładowanie profili AdsPower...</p>
    </div>
  );

  const renderAdsPowerError = () => (
    <div className="p-4">
      <Alert color="failure">
        <HiInformationCircle className="mr-2 h-5 w-5" />
        <strong>Błąd AdsPower:</strong> {errorAdsPower}
      </Alert>
    </div>
  );

  const renderBrightDataLoading = () => (
    <div className="flex h-64 items-center justify-center">
      <Spinner size="xl" />
      <p className="ml-4 text-lg">Ładowanie stref Bright Data...</p>
    </div>
  );

  const renderBrightDataError = () => (
    <div className="p-4">
      <Alert color="failure">
        <HiInformationCircle className="mr-2 h-5 w-5" />
        <strong>Błąd Bright Data:</strong> {errorBrightData}
      </Alert>
    </div>
  );

  if (isLoadingAdsPower && isLoadingBrightData) {
    return (
      <NavbarSidebarLayout isFooter={false}>
        {renderAdsPowerLoading()}
        {renderBrightDataLoading()}
      </NavbarSidebarLayout>
    );
  }

  return (
    <NavbarSidebarLayout isFooter={false}>
      <section className="bg-gray-50 py-3 sm:py-5 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-2xl">
          <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
            <div className="flex flex-col items-center justify-between space-y-3 border-b p-4 md:flex-row md:space-y-0 md:space-x-4 dark:border-gray-700">
              <div className="flex w-full items-center space-x-3">
                <h5 className="font-semibold dark:text-white">
                  AdsPower Profiles
                </h5>
              </div>
              <div className="flex w-full flex-row items-center justify-end space-x-3">
                <Button color="primary" onClick={onAddNewProfile}>
                  <HiOutlinePlus className="mr-2 h-3.5 w-3.5" />
                  Add new AdsPower profile
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {profiles.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Brak profili AdsPower do wyświetlenia.
                </div>
              ) : (
                <Table>
                  <TableHead>
                    <TableHeadCell className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-adspower"
                          type="checkbox"
                          className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 bg-gray-100"
                        />
                      </div>
                    </TableHeadCell>
                    <TableHeadCell>Rozwiń</TableHeadCell>
                    <TableHeadCell>Nazwa profilu</TableHeadCell>
                    <TableHeadCell>ID profilu</TableHeadCell>
                    <TableHeadCell>Grupa</TableHeadCell>
                    <TableHeadCell>Kraj/IP</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell>Ostatnie użycie</TableHeadCell>
                    <TableHeadCell>Akcje</TableHeadCell>
                  </TableHead>
                  <TableBody>
                    {profiles.map((profile: AdsPowerProfile) => (
                      <React.Fragment key={profile.user_id}>
                        <TableRow className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          <TableCell className="p-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 bg-gray-100"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </TableCell>
                          <TableCell
                            onClick={() =>
                              handleAdsPowerRowExpand(profile.user_id)
                            }
                          >
                            {expandedAdsPowerRows.has(profile.user_id) ? (
                              <HiChevronUp className="h-6 w-6" />
                            ) : (
                              <HiChevronDown className="h-6 w-6" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                            {profile.name}
                          </TableCell>
                          <TableCell>{profile.user_id}</TableCell>
                          <TableCell>{profile.group_name}</TableCell>
                          <TableCell>
                            {profile.ip_country || profile.ip || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                profile.status === "active"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {profile.status || "Nieaktywny"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {profile.last_open_time
                              ? new Date(
                                  profile.last_open_time * 1000,
                                ).toLocaleString()
                              : "Nigdy"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {savedProfiles.has(profile.user_id) ? (
                                <Button size="xs" color="success" disabled>
                                  <HiDatabase className="mr-1 h-3 w-3" />W bazie
                                </Button>
                              ) : (
                                <Button
                                  size="xs"
                                  color="warning"
                                  onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    e.stopPropagation();
                                    onSyncProfile();
                                  }}
                                  disabled={
                                    isSyncingProfile === profile.user_id
                                  }
                                >
                                  <HiDatabase className="mr-1 h-3 w-3" />
                                  Zapisz
                                </Button>
                              )}
                              <Button
                                size="xs"
                                color="primary"
                                onClick={(
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => {
                                  e.stopPropagation();
                                  onEditProfile();
                                }}
                              >
                                <HiOutlinePencil className="mr-1 h-3 w-3" />
                                Edytuj
                              </Button>
                              <Button
                                size="xs"
                                color="failure"
                                onClick={(
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => {
                                  e.stopPropagation();
                                  onDeleteProfile();
                                }}
                              >
                                <HiTrash className="mr-1 h-3 w-3" />
                                Usuń
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedAdsPowerRows.has(profile.user_id) && (
                          <TableRow>
                            <TableCell colSpan={9}>
                              <div className="p-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                    <h6 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                      Konfiguracja przeglądarki
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>
                                        System:{" "}
                                        {profile.fingerprint_config
                                          ?.browser_kernel_config?.type ||
                                          "chrome"}
                                      </p>
                                      <p>
                                        Wersja:{" "}
                                        {profile.fingerprint_config
                                          ?.browser_kernel_config?.version ||
                                          "N/A"}
                                      </p>
                                      <p>
                                        Rozdzielczość:{" "}
                                        {profile.fingerprint_config
                                          ?.screen_resolution || "1920x1080"}
                                      </p>
                                      <p>
                                        WebRTC:{" "}
                                        {profile.fingerprint_config?.webrtc ||
                                          "disabled"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                    <h6 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                      Konfiguracja proxy
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>
                                        Typ:{" "}
                                        {profile.user_proxy_config
                                          ?.proxy_type || "N/A"}
                                      </p>
                                      <p>
                                        Host:{" "}
                                        {profile.user_proxy_config
                                          ?.proxy_host || "N/A"}
                                      </p>
                                      <p>
                                        Port:{" "}
                                        {profile.user_proxy_config
                                          ?.proxy_port || "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                                    <h6 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                      Dodatkowe informacje
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>
                                        Strefa czasowa:{" "}
                                        {profile.fingerprint_config?.timezone ||
                                          "N/A"}
                                      </p>
                                      <p>
                                        Języki:{" "}
                                        {profile.fingerprint_config?.language?.join(
                                          ", ",
                                        ) || "N/A"}
                                      </p>
                                      <p>Notatki: {profile.remark || "Brak"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 bg-gray-50 py-3 sm:py-5 dark:bg-gray-900">
        <div className="mx-auto max-w-screen-2xl">
          <div className="relative overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
            <div className="flex flex-col items-center justify-between space-y-3 border-b p-4 md:flex-row md:space-y-0 md:space-x-4 dark:border-gray-700">
              <div className="flex w-full items-center space-x-3">
                <HiServer className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h5 className="font-semibold dark:text-white">
                  Bright Data Zones
                </h5>
              </div>
              <div className="flex w-full flex-row items-center justify-end space-x-3">
                <Button color="primary" onClick={onAddNewBrightDataZone}>
                  <HiOutlinePlus className="mr-2 h-3.5 w-3.5" />
                  Add new Bright Data zone
                </Button>
              </div>
            </div>
            {isLoadingBrightData ? (
              renderBrightDataLoading()
            ) : errorBrightData ? (
              renderBrightDataError()
            ) : (
              <div className="overflow-x-auto">
                {brightDataZones.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    Brak stref Bright Data do wyświetlenia.
                  </div>
                ) : (
                  <Table>
                    <TableHead>
                      <TableHeadCell className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all-brightdata"
                            type="checkbox"
                            className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 bg-gray-100"
                          />
                        </div>
                      </TableHeadCell>
                      <TableHeadCell>Rozwiń</TableHeadCell>
                      <TableHeadCell>Nazwa Strefy</TableHeadCell>
                      <TableHeadCell>Typ Produktu</TableHeadCell>
                      <TableHeadCell>Kraj</TableHeadCell>
                      <TableHeadCell>Hasło</TableHeadCell>
                      <TableHeadCell>Status</TableHeadCell>
                      <TableHeadCell>Utworzono</TableHeadCell>
                      <TableHeadCell>Akcje</TableHeadCell>
                    </TableHead>
                    <TableBody>
                      {brightDataZones.map((zone: BrightDataProxy) => (
                        <React.Fragment key={zone.zone}>
                          <TableRow className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                            <TableCell className="p-4">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="text-primary-600 focus:ring-primary-500 h-4 w-4 rounded border-gray-300 bg-gray-100"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </TableCell>
                            <TableCell
                              onClick={() =>
                                handleBrightDataRowExpand(zone.zone)
                              }
                            >
                              {expandedBrightDataRows.has(zone.zone) ? (
                                <HiChevronUp className="h-6 w-6" />
                              ) : (
                                <HiChevronDown className="h-6 w-6" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium whitespace-nowrap text-gray-900 dark:text-white">
                              {zone.zone}
                            </TableCell>
                            <TableCell>
                              {zone.plan_details?.product ||
                                zone.proxy_type ||
                                "N/A"}
                            </TableCell>
                            <TableCell>{zone.country || "Wszystkie"}</TableCell>
                            <TableCell>
                              {zone.password
                                ? `${zone.password.substring(0, 3)}...`
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                color={
                                  zone.status === "active"
                                    ? "success"
                                    : zone.status ===
                                        "active_details_unavailable"
                                      ? "purple"
                                      : "warning"
                                }
                              >
                                {zone.status || "Nieznany"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {zone.created_at
                                ? new Date(zone.created_at).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="xs"
                                  color="primary"
                                  onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    e.stopPropagation();
                                    onEditBrightDataZone(zone.zone);
                                  }}
                                >
                                  <HiOutlinePencil className="mr-1 h-3 w-3" />
                                  Edytuj
                                </Button>
                                <Button
                                  size="xs"
                                  color="failure"
                                  onClick={(
                                    e: React.MouseEvent<HTMLButtonElement>,
                                  ) => {
                                    e.stopPropagation();
                                    onDeleteBrightDataZone(zone.zone);
                                  }}
                                >
                                  <HiTrash className="mr-1 h-3 w-3" />
                                  Usuń
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {expandedBrightDataRows.has(zone.zone) && (
                            <TableRow>
                              <TableCell colSpan={9}>
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                  <h6 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                    Szczegóły Strefy: {zone.zone}
                                  </h6>
                                  <div className="grid grid-cols-1 gap-4 text-sm text-gray-500 md:grid-cols-2 lg:grid-cols-3 dark:text-gray-400">
                                    <div>
                                      <strong>ID Klienta:</strong>{" "}
                                      {zone.customer_id || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Pełne Hasło:</strong>{" "}
                                      {zone.password || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Konfiguracja IP:</strong>{" "}
                                      {zone.ips_config?.join(", ") || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Uprawnienia:</strong>{" "}
                                      {zone.permissions || "N/A"}
                                    </div>
                                    <div className="mt-3 border-t pt-3 md:col-span-full dark:border-gray-600">
                                      <p className="mb-1 font-semibold text-gray-900 dark:text-white">
                                        Informacje Dostępowe (Super Proxy):
                                      </p>
                                      <p>
                                        Host: <strong>brd.superproxy.io</strong>
                                      </p>
                                      <p>
                                        Port:
                                        {zone.zone ===
                                        "bd_residential_profile_pl" ? (
                                          <strong> 33335</strong>
                                        ) : zone.plan_details?.product ===
                                          "res_rotating" ? (
                                          " Typowy dla stref rezydencjalnych to np. 22225 lub 33335 (Sprawdź 'Access Details' w panelu Bright Data dla tej konkretnej strefy)."
                                        ) : (
                                          " Sprawdź 'Access Details' w panelu Bright Data dla tej strefy."
                                        )}
                                      </p>
                                      <p>
                                        {" "}
                                        Nazwa użytkownika (do proxy):
                                        <span className="rounded bg-gray-100 px-1 font-mono dark:bg-gray-600">
                                          brd-customer-{zone.customer_id}-zone-
                                          {zone.zone}
                                        </span>
                                      </p>
                                    </div>
                                    <div className="mt-3 border-t pt-3 md:col-span-full dark:border-gray-600">
                                      <p className="mb-1 font-semibold text-gray-900 dark:text-white">
                                        Detale Planu:
                                      </p>
                                      <p>
                                        Start:{" "}
                                        {zone.plan_details?.start_date
                                          ? new Date(
                                              zone.plan_details.start_date,
                                            ).toLocaleString()
                                          : "N/A"}
                                      </p>
                                      <p>
                                        Typ: {zone.plan_details?.type || "N/A"}
                                      </p>
                                      <p>
                                        Typ VIP:{" "}
                                        {zone.plan_details?.vips_type || "N/A"}
                                      </p>
                                      <p>
                                        Produkt:{" "}
                                        {zone.plan_details?.product || "N/A"}
                                      </p>
                                      <p>
                                        Smart Resi:{" "}
                                        {zone.plan_details?.smart_resi !==
                                        undefined
                                          ? zone.plan_details.smart_resi
                                          : "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </NavbarSidebarLayout>
  );
};

export default AdsPowerDashboardPage;
