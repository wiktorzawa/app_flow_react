/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, Fragment, useRef } from "react";
import { AdsPowerProfile, fetchAdsPowerProfiles, checkApiStatus } from "../../api/adsPowerApi";
import { BrightDataProxy, fetchBrightDataProxies } from "../../api/brightDataApi";
import {
  Alert,
  Spinner,
  Button,
  Table,
  Badge,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell,
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

const API_BASE_URL = "http://localhost:3001/api";

const AdsPowerDashboardPage: React.FC = () => {
  const [profiles, setProfiles] = useState<AdsPowerProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [apiStatus, setApiStatus] = useState<"checking" | "ok" | "error">("checking");
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const apiCheckRef = useRef(false);

  const [expandedAdsPowerRows, setExpandedAdsPowerRows] = useState<Set<string>>(new Set());
  const [savedProfiles] = useState<Set<string>>(new Set());
  const [isSyncingProfile] = useState<string | null>(null);

  const [brightDataZones, setBrightDataZones] = useState<BrightDataProxy[]>([]);
  const [isLoadingBrightData, setIsLoadingBrightData] = useState<boolean>(true);
  const [errorBrightData, setErrorBrightData] = useState<string | null>(null);
  const [expandedBrightDataRows, setExpandedBrightDataRows] = useState<Set<string>>(new Set());

  const isDarkTheme = document.documentElement.classList.contains("dark");

  useEffect(() => {
    if (apiCheckRef.current) {
      return;
    }
    apiCheckRef.current = true;

    const verifyApiStatus = async () => {
      try {
        setApiStatus("checking");
        const response = await checkApiStatus();
        if (response.success) {
          setApiStatus("ok");
        } else {
          setApiStatus("error");
          setApiErrorMessage(response.message || "API AdsPower zwróciło błąd.");
        }
      } catch (err: any) {
        setApiStatus("error");
        setApiErrorMessage(
          err.message || "Nie można połączyć się z serwerem lub aplikacją AdsPower. Upewnij się, że jest uruchomiona."
        );
      }
    };
    verifyApiStatus();
  }, []);

  useEffect(() => {
    if (apiStatus !== "ok") return;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      setIsLoadingBrightData(true);
      setErrorBrightData(null);

      try {
        const profilesResponse = await fetchAdsPowerProfiles();
        setProfiles(profilesResponse.list || []);
      } catch (err: any) {
        setError(err.message || "Wystąpił błąd podczas ładowania profili AdsPower.");
        setProfiles([]);
      }

      try {
        const brightDataResponse = await fetchBrightDataProxies();
        if (brightDataResponse.success) {
          setBrightDataZones(brightDataResponse.data || []);
        } else {
          throw new Error(brightDataResponse.message || "Nie udało się pobrać stref Bright Data.");
        }
      } catch (err: any) {
        setErrorBrightData(err.message || "Wystąpił błąd podczas ładowania stref Bright Data.");
        setBrightDataZones([]);
      }

      setIsLoading(false);
      setIsLoadingBrightData(false);
    };

    loadData();
  }, [apiStatus]);

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

  if (apiStatus === "checking") {
    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
          <p className="ml-4 text-lg">Sprawdzanie statusu API AdsPower...</p>
        </div>
      </NavbarSidebarLayout>
    );
  }

  if (apiStatus === "error") {
    return (
      <NavbarSidebarLayout isFooter={false}>
        <div className="p-4">
          <Alert color="failure" icon={HiInformationCircle}>
            <h3 className="text-lg font-medium">Błąd połączenia z AdsPower API</h3>
            <div className="mt-2 mb-4 text-sm">
              {apiErrorMessage ||
                "Nie udało się nawiązać połączenia. Sprawdź, czy lokalna aplikacja AdsPower jest uruchomiona i czy serwer backendowy działa poprawnie."}
            </div>
            <Button color="failure" onClick={() => window.location.reload()}>
              Spróbuj ponownie
            </Button>
          </Alert>
        </div>
      </NavbarSidebarLayout>
    );
  }

  const renderAdsPowerLoading = () => (
    <div className="flex justify-center items-center h-64">
      <Spinner size="xl" />
      <p className="ml-4 text-lg">Ładowanie profili AdsPower...</p>
    </div>
  );

  const renderAdsPowerError = () => (
    <div className="p-4">
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium">Błąd AdsPower:</span> {error}
      </Alert>
    </div>
  );

  const renderBrightDataLoading = () => (
    <div className="flex justify-center items-center h-64">
      <Spinner size="xl" />
      <p className="ml-4 text-lg">Ładowanie stref Bright Data...</p>
    </div>
  );

  const renderBrightDataError = () => (
    <div className="p-4">
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium">Błąd Bright Data:</span> {errorBrightData}
      </Alert>
    </div>
  );

  if (isLoading || isLoadingBrightData) {
    return (
      <NavbarSidebarLayout isFooter={false}>
        {isLoading && renderAdsPowerLoading()}
        {isLoadingBrightData && renderBrightDataLoading()}
      </NavbarSidebarLayout>
    );
  }

  return (
    <NavbarSidebarLayout isFooter={false}>
      <Fragment>
        <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
          <div className="mx-auto max-w-(--breakpoint-2xl)">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 border-b dark:border-gray-700">
                <div className="w-full flex items-center space-x-3">
                  <h5 className="dark:text-white font-semibold">AdsPower Profiles</h5>
                </div>
                <div className="w-full flex flex-row items-center justify-end space-x-3">
                  <Button color="primary" onClick={onAddNewProfile}>
                    <HiOutlinePlus className="h-3.5 w-3.5 mr-2" />
                    Add new AdsPower profile
                  </Button>
                </div>
              </div>
              {isLoading ? (
                renderAdsPowerLoading()
              ) : error ? (
                renderAdsPowerError()
              ) : (
                <Table hoverable className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <TableRow>
                      <TableHeadCell className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all-adspower"
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 bg-gray-100 rounded-sm border-gray-300 focus:ring-primary-500"
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
                      <TableHeadCell>
                        <span className="sr-only">Akcje</span>
                      </TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y">
                    {profiles.map((profile: AdsPowerProfile) => (
                      <Fragment key={profile.user_id}>
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <TableCell className="p-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-primary-600 bg-gray-100 rounded-sm border-gray-300 focus:ring-primary-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </TableCell>
                          <TableCell
                            onClick={() => handleAdsPowerRowExpand(profile.user_id)}
                            className="cursor-pointer"
                          >
                            {expandedAdsPowerRows.has(profile.user_id) ? (
                              <HiChevronUp className="w-6 h-6" />
                            ) : (
                              <HiChevronDown className="w-6 h-6" />
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {profile.name}
                          </TableCell>
                          <TableCell>{profile.user_id}</TableCell>
                          <TableCell>{profile.group_name}</TableCell>
                          <TableCell>{profile.ip_country || profile.ip || "N/A"}</TableCell>
                          <TableCell>
                            <Badge color={profile.status === "active" ? "success" : "warning"}>
                              {profile.status || "Nieaktywny"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {profile.last_open_time
                              ? new Date(profile.last_open_time * 1000).toLocaleString()
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
                                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                    e.stopPropagation();
                                    onSyncProfile();
                                  }}
                                  disabled={isSyncingProfile === profile.user_id}
                                >
                                  <HiDatabase className="mr-1 h-3 w-3" />
                                  Zapisz
                                </Button>
                              )}
                              <Button
                                size="xs"
                                color="primary"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
                            <TableCell colSpan={9} className="p-0">
                              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="p-3 rounded-lg">
                                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      Konfiguracja przeglądarki
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>
                                        System: {profile.fingerprint_config?.browser_kernel_config?.type || "chrome"}
                                      </p>
                                      <p>
                                        Wersja: {profile.fingerprint_config?.browser_kernel_config?.version || "N/A"}
                                      </p>
                                      <p>
                                        Rozdzielczość: {profile.fingerprint_config?.screen_resolution || "1920x1080"}
                                      </p>
                                      <p>WebRTC: {profile.fingerprint_config?.webrtc || "disabled"}</p>
                                    </div>
                                  </div>
                                  <div className="p-3 rounded-lg">
                                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      Konfiguracja proxy
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>Typ: {profile.user_proxy_config?.proxy_type || "N/A"}</p>
                                      <p>Host: {profile.user_proxy_config?.proxy_host || "N/A"}</p>
                                      <p>Port: {profile.user_proxy_config?.proxy_port || "N/A"}</p>
                                    </div>
                                  </div>
                                  <div className="p-3 rounded-lg">
                                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      Dodatkowe informacje
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>Strefa czasowa: {profile.fingerprint_config?.timezone || "N/A"}</p>
                                      <p>Języki: {profile.fingerprint_config?.language?.join(", ") || "N/A"}</p>
                                      <p>Notatki: {profile.remark || "Brak"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5 mt-8">
          <div className="mx-auto max-w-(--breakpoint-2xl)">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 border-b dark:border-gray-700">
                <div className="w-full flex items-center space-x-3">
                  <HiServer className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h5 className="dark:text-white font-semibold">Bright Data Zones</h5>
                </div>
                <div className="w-full flex flex-row items-center justify-end space-x-3">
                  <Button color="primary" onClick={onAddNewBrightDataZone}>
                    <HiOutlinePlus className="h-3.5 w-3.5 mr-2" />
                    Add new Bright Data zone
                  </Button>
                </div>
              </div>
              {isLoadingBrightData ? (
                renderBrightDataLoading()
              ) : errorBrightData ? (
                renderBrightDataError()
              ) : (
                <Table hoverable className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <TableRow>
                      <TableHeadCell className="p-4">
                        <div className="flex items-center">
                          <input
                            id="checkbox-all-brightdata"
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 bg-gray-100 rounded-sm border-gray-300 focus:ring-primary-500"
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
                      <TableHeadCell>
                        <span className="sr-only">Akcje</span>
                      </TableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y">
                    {brightDataZones.map((zone: BrightDataProxy) => (
                      <Fragment key={zone.zone}>
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <TableCell className="p-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-primary-600 bg-gray-100 rounded-sm border-gray-300 focus:ring-primary-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </TableCell>
                          <TableCell onClick={() => handleBrightDataRowExpand(zone.zone)} className="cursor-pointer">
                            {expandedBrightDataRows.has(zone.zone) ? (
                              <HiChevronUp className="w-6 h-6" />
                            ) : (
                              <HiChevronDown className="w-6 h-6" />
                            )}
                          </TableCell>
                          <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {zone.zone}
                          </TableCell>
                          <TableCell>{zone.plan_details?.product || zone.proxy_type || "N/A"}</TableCell>
                          <TableCell>{zone.country || "Wszystkie"}</TableCell>
                          <TableCell>{zone.password ? `${zone.password.substring(0, 3)}...` : "N/A"}</TableCell>
                          <TableCell>
                            <Badge
                              color={
                                zone.status === "active"
                                  ? "success"
                                  : zone.status === "active_details_unavailable"
                                    ? "purple"
                                    : "warning"
                              }
                            >
                              {zone.status || "Nieznany"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {zone.created_at ? new Date(zone.created_at).toLocaleDateString() : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="xs"
                                color="primary"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
                            <TableCell colSpan={9} className="p-0">
                              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                                <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  Szczegóły Strefy: {zone.zone}
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                                  <div>
                                    <strong>ID Klienta:</strong> {zone.customer_id || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Pełne Hasło:</strong> {zone.password || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Konfiguracja IP:</strong> {zone.ips_config?.join(", ") || "N/A"}
                                  </div>
                                  <div>
                                    <strong>Uprawnienia:</strong> {zone.permissions || "N/A"}
                                  </div>
                                  <div className="md:col-span-full mt-3 pt-3 border-t dark:border-gray-600">
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                                      Informacje Dostępowe (Super Proxy):
                                    </p>
                                    <p>
                                      Host: <strong>brd.superproxy.io</strong>
                                    </p>
                                    <p>
                                      Port:
                                      {zone.zone === "bd_residential_profile_pl" ? (
                                        <strong> 33335</strong>
                                      ) : zone.plan_details?.product === "res_rotating" ? (
                                        " Typowy dla stref rezydencjalnych to np. 22225 lub 33335 (Sprawdź 'Access Details' w panelu Bright Data dla tej konkretnej strefy)."
                                      ) : (
                                        " Sprawdź 'Access Details' w panelu Bright Data dla tej strefy."
                                      )}
                                    </p>
                                    <p>
                                      {" "}
                                      Nazwa użytkownika (do proxy):
                                      <span className="font-mono bg-gray-100 dark:bg-gray-600 px-1 rounded-sm">
                                        brd-customer-{zone.customer_id}-zone-{zone.zone}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="md:col-span-full mt-3 pt-3 border-t dark:border-gray-600">
                                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Detale Planu:</p>
                                    <p>
                                      Start:{" "}
                                      {zone.plan_details?.start_date
                                        ? new Date(zone.plan_details.start_date).toLocaleString()
                                        : "N/A"}
                                    </p>
                                    <p>Typ: {zone.plan_details?.type || "N/A"}</p>
                                    <p>Typ VIP: {zone.plan_details?.vips_type || "N/A"}</p>
                                    <p>Produkt: {zone.plan_details?.product || "N/A"}</p>
                                    <p>
                                      Smart Resi:{" "}
                                      {zone.plan_details?.smart_resi !== undefined
                                        ? zone.plan_details.smart_resi
                                        : "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </section>
      </Fragment>
    </NavbarSidebarLayout>
  );
};

export default AdsPowerDashboardPage;
