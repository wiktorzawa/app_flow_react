import React, { useState, useEffect } from "react";
import {
  AdsPowerProfile,
  fetchAdsPowerProfiles,
  prepareAdsPowerBatch,
  PreparedProfileDetails,
  LTabelaLocationData,
} from "../../api/adsPowerApi";
import {
  Alert,
  Spinner,
  Button,
  Table,
  Badge,
  Toast,
  Modal,
  Label,
  TextInput,
  Select,
  Textarea,
  Tooltip,
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
  HiCheck,
} from "react-icons/hi";

const AdsPowerDashboardPage: React.FC = () => {
  const [profiles, setProfiles] = useState<AdsPowerProfile[]>([]);
  const [isLoadingAdsPower, setIsLoadingAdsPower] = useState<boolean>(true);
  const [errorAdsPower, setErrorAdsPower] = useState<string | null>(null);

  const [expandedAdsPowerRows, setExpandedAdsPowerRows] = useState<Set<string>>(new Set());
  const [savedProfiles] = useState<Set<string>>(new Set());
  const [isSyncingProfile] = useState<string | null>(null);

  const [isPreparingBatch, setIsPreparingBatch] = useState<boolean>(false);
  const [prepareBatchError, setPrepareBatchError] = useState<string | null>(null);
  const [prepareBatchSuccess, setPrepareBatchSuccess] = useState<string | null>(null);

  const [preparedProfilesList, setPreparedProfilesList] = useState<PreparedProfileDetails[]>([]);
  const [expandedPreparedRows, setExpandedPreparedRows] = useState<Set<string>>(new Set());

  const [showCreateProfileModal, setShowCreateProfileModal] = useState<boolean>(false);
  const [currentProfileConfig, setCurrentProfileConfig] = useState<Partial<PreparedProfileDetails> | null>(null);
  const [lTabelaEntries] = useState<LTabelaLocationData[]>([]);

  useEffect(() => {
    const loadAdsPowerProfiles = async () => {
      setIsLoadingAdsPower(true);
      setErrorAdsPower(null);
      try {
        const response = await fetchAdsPowerProfiles();
        setProfiles(response.list || []);
      } catch (err: any) {
        setErrorAdsPower(err.message || "Wystąpił błąd podczas ładowania profili AdsPower.");
        setProfiles([]);
      }
      setIsLoadingAdsPower(false);
    };

    loadAdsPowerProfiles();
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

  const onDeleteProfile = () => {
    console.log("Delete profile action triggered");
  };

  const onEditProfile = () => {
    console.log("Edit profile action triggered");
  };

  const onSyncProfile = () => {
    console.log("Sync profile action triggered");
  };

  const onAddNewProfile = async () => {
    console.log("Add new profile action triggered - preparing batch...");
    setIsPreparingBatch(true);
    setPrepareBatchError(null);
    setPrepareBatchSuccess(null);
    setPreparedProfilesList([]);
    try {
      const batchResponse = await prepareAdsPowerBatch();

      setPrepareBatchSuccess(`${batchResponse.message} Liczba przygotowanych konfiguracji: ${batchResponse.count}.`);
      setPreparedProfilesList(batchResponse.data);

      console.log("Odpowiedź z przygotowania batcha:", batchResponse);
      console.log("Przygotowane konfiguracje profili:", batchResponse.data);
    } catch (err: any) {
      setPrepareBatchError(err.message || "Wystąpił błąd podczas przygotowywania wsadu profili.");
    } finally {
      setIsPreparingBatch(false);
      setTimeout(() => {
        setPrepareBatchSuccess(null);
        setPrepareBatchError(null);
      }, 7000);
    }
  };

  const handlePreparedRowExpand = (profileName: string) => {
    setExpandedPreparedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(profileName)) {
        newSet.delete(profileName);
      } else {
        newSet.add(profileName);
      }
      return newSet;
    });
  };

  const handleOpenCreateModal = (profileData?: PreparedProfileDetails) => {
    if (profileData) {
      setCurrentProfileConfig({ ...profileData });
    } else {
      setCurrentProfileConfig({
        name: `NowyProfil_${Date.now()}`,
        locationData: lTabelaEntries.length > 0 ? lTabelaEntries[0] : undefined,
      });
    }
    setShowCreateProfileModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateProfileModal(false);
    setCurrentProfileConfig(null);
  };

  const handleSaveProfileConfig = () => {
    if (currentProfileConfig) {
      setPreparedProfilesList((prevList) => {
        const existingIndex = prevList.findIndex((p) => p.name === currentProfileConfig.name);
        if (existingIndex > -1) {
          const newList = [...prevList];
          newList[existingIndex] = currentProfileConfig as PreparedProfileDetails;
          return newList;
        } else {
          return [...prevList, currentProfileConfig as PreparedProfileDetails];
        }
      });
      console.log("Zapisano konfigurację:", currentProfileConfig);
    }
    handleCloseCreateModal();
  };

  const renderAdsPowerLoading = () => (
    <div className="flex justify-center items-center h-64">
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

  if (isLoadingAdsPower) {
    return <NavbarSidebarLayout isFooter={false}>{renderAdsPowerLoading()}</NavbarSidebarLayout>;
  }

  return (
    <NavbarSidebarLayout isFooter={false}>
      <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5">
        <div className="mx-auto max-w-screen-2xl">
          {prepareBatchSuccess && (
            <Toast className="mb-4">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                <HiCheck className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{prepareBatchSuccess}</div>
              <Toast.Toggle onDismiss={() => setPrepareBatchSuccess(null)} />
            </Toast>
          )}
          {prepareBatchError && (
            <Toast className="mb-4">
              <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                <HiInformationCircle className="h-5 w-5" />
              </div>
              <div className="ml-3 text-sm font-normal">{prepareBatchError}</div>
              <Toast.Toggle onDismiss={() => setPrepareBatchError(null)} />
            </Toast>
          )}

          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 border-b dark:border-gray-700">
              <div className="w-full flex items-center space-x-3">
                <h5 className="dark:text-white font-semibold">AdsPower Profiles</h5>
              </div>
              <div className="w-full flex flex-row items-center justify-end space-x-3">
                <Button color="primary" onClick={onAddNewProfile} disabled={isPreparingBatch} className="mr-2">
                  {isPreparingBatch ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Przygotowywanie...
                    </>
                  ) : (
                    <>
                      <HiOutlinePlus className="h-3.5 w-3.5 mr-2" />
                      Przygotuj Batch (L_tabela)
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              {profiles.length === 0 && !isLoadingAdsPower && !errorAdsPower ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Brak profili AdsPower do wyświetlenia.
                </div>
              ) : isLoadingAdsPower ? (
                renderAdsPowerLoading()
              ) : errorAdsPower ? (
                renderAdsPowerError()
              ) : (
                <Table>
                  <Table.Head>
                    <Table.HeadCell className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-adspower"
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500"
                        />
                      </div>
                    </Table.HeadCell>
                    <Table.HeadCell>Rozwiń</Table.HeadCell>
                    <Table.HeadCell>Nazwa profilu</Table.HeadCell>
                    <Table.HeadCell>ID profilu</Table.HeadCell>
                    <Table.HeadCell>Grupa</Table.HeadCell>
                    <Table.HeadCell>Kraj/IP</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Ostatnie użycie</Table.HeadCell>
                    <Table.HeadCell>Akcje</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {profiles.map((profile: AdsPowerProfile) => (
                      <React.Fragment key={profile.user_id}>
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          <Table.Cell className="p-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </Table.Cell>
                          <Table.Cell onClick={() => handleAdsPowerRowExpand(profile.user_id)}>
                            {expandedAdsPowerRows.has(profile.user_id) ? (
                              <HiChevronUp className="w-6 h-6" />
                            ) : (
                              <HiChevronDown className="w-6 h-6" />
                            )}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {profile.name}
                          </Table.Cell>
                          <Table.Cell>{profile.user_id}</Table.Cell>
                          <Table.Cell>{profile.group_name}</Table.Cell>
                          <Table.Cell>{profile.ip_country || profile.ip || "N/A"}</Table.Cell>
                          <Table.Cell>
                            <Badge color={profile.status === "active" ? "success" : "warning"}>
                              {profile.status || "Nieaktywny"}
                            </Badge>
                          </Table.Cell>
                          <Table.Cell>
                            {profile.last_open_time
                              ? new Date(profile.last_open_time * 1000).toLocaleString()
                              : "Nigdy"}
                          </Table.Cell>
                          <Table.Cell>
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
                          </Table.Cell>
                        </Table.Row>
                        {expandedAdsPowerRows.has(profile.user_id) && (
                          <Table.Row>
                            <Table.Cell colSpan={9}>
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
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
                                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      Konfiguracja proxy
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>Typ: {profile.user_proxy_config?.proxy_type || "N/A"}</p>
                                      <p>Port: {profile.user_proxy_config?.proxy_port || "33335"}</p>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      Dodatkowe informacje
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>
                                        Strefa czasowa:{" "}
                                        {profile.fingerprint_config?.automatic_timezone === "1"
                                          ? "Auto (IP)"
                                          : profile.fingerprint_config?.timezone || "N/A"}
                                      </p>
                                      <p>Języki: {profile.fingerprint_config?.language?.join(", ") || "N/A"}</p>
                                      <p>
                                        Rozdzielczość: {profile.fingerprint_config?.screen_resolution || "1920_1080"}
                                      </p>
                                      <p>Notatki: {profile.remark || "Brak"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        )}
                      </React.Fragment>
                    ))}
                  </Table.Body>
                </Table>
              )}
            </div>
          </div>
        </div>
      </section>

      {preparedProfilesList.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900 py-3 sm:py-5 mt-8">
          <div className="mx-auto max-w-screen-2xl">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 border-b dark:border-gray-700">
                <div className="w-full flex items-center space-x-3">
                  <HiOutlinePlus className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h5 className="dark:text-white font-semibold">
                    Przygotowane Konfiguracje Profili ({preparedProfilesList.length})
                  </h5>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell className="p-4">
                      <div className="flex items-center">
                        <input
                          id="checkbox-all-prepared"
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500"
                        />
                      </div>
                    </Table.HeadCell>
                    <Table.HeadCell>Rozwiń</Table.HeadCell>
                    <Table.HeadCell>Nazwa profilu</Table.HeadCell>
                    <Table.HeadCell>ID profilu</Table.HeadCell>
                    <Table.HeadCell>Grupa</Table.HeadCell>
                    <Table.HeadCell>Miasto</Table.HeadCell>
                    <Table.HeadCell>Kod pocztowy</Table.HeadCell>
                    <Table.HeadCell>Kraj/IP</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Ostatnie użycie</Table.HeadCell>
                    <Table.HeadCell>Akcje</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    {preparedProfilesList.map((profile, index) => (
                      <React.Fragment key={profile.name}>
                        <Table.Row className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                          <Table.Cell className="p-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </Table.Cell>
                          <Table.Cell onClick={() => handlePreparedRowExpand(profile.name)}>
                            {expandedPreparedRows.has(profile.name) ? (
                              <HiChevronUp className="w-6 h-6" />
                            ) : (
                              <HiChevronDown className="w-6 h-6" />
                            )}
                          </Table.Cell>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {profile.name}
                          </Table.Cell>
                          <Table.Cell>PREP_{String(index + 1).padStart(5, "0")}</Table.Cell>
                          <Table.Cell>{profile.group_id || "0"}</Table.Cell>
                          <Table.Cell>{profile.locationData?.L_Miasto_Docelowe || "N/A"}</Table.Cell>
                          <Table.Cell>{profile.locationData?.L_KodPocztowy_Docelowy_Przyklad || "N/A"}</Table.Cell>
                          <Table.Cell>{profile.locationData?.L_Kraj_Docelowy || "PL"}</Table.Cell>
                          <Table.Cell>
                            <Badge color="info">Przygotowane</Badge>
                          </Table.Cell>
                          <Table.Cell>{new Date().toLocaleString()}</Table.Cell>
                          <Table.Cell>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="xs"
                                color="warning"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  console.log("Tworzenie profilu w AdsPower:", profile);
                                }}
                              >
                                <HiDatabase className="mr-1 h-3 w-3" />
                                Utwórz
                              </Button>
                              <Button
                                size="xs"
                                color="primary"
                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                  e.stopPropagation();
                                  handleOpenCreateModal(profile);
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
                                  setPreparedProfilesList(preparedProfilesList.filter((p) => p.name !== profile.name));
                                }}
                              >
                                <HiTrash className="mr-1 h-3 w-3" />
                                Usuń
                              </Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                        {expandedPreparedRows.has(profile.name) && (
                          <Table.Row>
                            <Table.Cell colSpan={9}>
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      Konfiguracja lokalizacji
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>Miasto: {profile.locationData.L_Miasto_Docelowe}</p>
                                      <p>Kod pocztowy: {profile.locationData.L_KodPocztowy_Docelowy_Przyklad}</p>
                                      <p>Region: {profile.locationData.L_Region_Docelowy}</p>
                                      <p>Kraj: {profile.locationData.L_Kraj_Docelowy}</p>
                                      <p>ID Master: {profile.locationData.ID_Profilu_Master}</p>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      Konfiguracja proxy
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>Typ: {profile.user_proxy_config?.proxy_type || "http"}</p>
                                      <p>Host: {profile.user_proxy_config?.proxy_host || "N/A"}</p>
                                      <p>Port: {profile.user_proxy_config?.proxy_port || "33335"}</p>
                                      <p>Software: {profile.user_proxy_config?.proxy_soft || "brightdata"}</p>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <h6 className="font-semibold text-gray-900 dark:text-white mb-2">
                                      Dodatkowe informacje
                                    </h6>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      <p>
                                        Strefa czasowa:{" "}
                                        {profile.fingerprint_config?.automatic_timezone === "1"
                                          ? "Auto (IP)"
                                          : profile.fingerprint_config?.timezone || "N/A"}
                                      </p>
                                      <p>Języki: {profile.fingerprint_config?.language?.join(", ") || "N/A"}</p>
                                      <p>
                                        Rozdzielczość: {profile.fingerprint_config?.screen_resolution || "1920_1080"}
                                      </p>
                                      <p>Notatki: {profile.remark || "Brak"}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Table.Cell>
                          </Table.Row>
                        )}
                      </React.Fragment>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>
        </section>
      )}

      <Modal show={showCreateProfileModal} onClose={handleCloseCreateModal} size="xl">
        <div className="modal-header">Edytuj Konfigurację</div>
        <Modal.Body>
          <div className="space-y-6">
            {/* Informacja o domyślnych ustawieniach */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-semibold mb-2 text-blue-800 dark:text-blue-300">ℹ️ Informacje o profilu</h5>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p>• Proxy: Bright Data residential (bd_residential_profile_pl:33335)</p>
                <p>• Lokalizacja: Automatycznie dopasowana do IP proxy</p>
                <p>• Języki i strefa czasowa: Zgodne z krajem</p>
              </div>
            </div>

            {/* Opcjonalne ustawienia */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Opcjonalne modyfikacje</h4>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor="fpUa" value="User Agent (zostaw puste dla losowego)" />
                  <Tooltip content="Najlepiej pozostawić puste - system wybierze naturalny User Agent">
                    <span className="text-gray-400 cursor-help">ⓘ</span>
                  </Tooltip>
                </div>
                <Textarea
                  id="fpUa"
                  rows={2}
                  value={currentProfileConfig?.fingerprint_config?.ua || ""}
                  onChange={(e) =>
                    setCurrentProfileConfig((prev) => ({
                      ...prev,
                      fingerprint_config: { ...prev?.fingerprint_config, ua: e.target.value },
                    }))
                  }
                  placeholder="Pozostaw puste (zalecane)"
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Label htmlFor="fpScreenRes" value="Rozdzielczość" />
                    <Tooltip content="1920x1080 to najbezpieczniejszy wybór">
                      <span className="text-gray-400 cursor-help">ⓘ</span>
                    </Tooltip>
                  </div>
                  <Select
                    id="fpScreenRes"
                    value={currentProfileConfig?.fingerprint_config?.screen_resolution || "1920_1080"}
                    onChange={(e) =>
                      setCurrentProfileConfig((prev) => ({
                        ...prev,
                        fingerprint_config: { ...prev?.fingerprint_config, screen_resolution: e.target.value },
                      }))
                    }
                  >
                    <option value="1920_1080">1920×1080 (najpopularniejsza)</option>
                    <option value="1366_768">1366×768</option>
                    <option value="1536_864">1536×864</option>
                    <option value="1440_900">1440×900</option>
                    <option value="2560_1440">2560×1440</option>
                  </Select>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Label htmlFor="profileRemark" value="Notatka" />
                  </div>
                  <TextInput
                    id="profileRemark"
                    value={currentProfileConfig?.remark || ""}
                    onChange={(e) => setCurrentProfileConfig((prev) => ({ ...prev, remark: e.target.value }))}
                    placeholder="Opcjonalny opis"
                  />
                </div>
              </div>

              {/* Informacja o automatycznych ustawieniach ochrony */}
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>🛡️ Automatyczne zabezpieczenia:</strong> Canvas noise ✓ | WebGL noise ✓ | WebRTC: Forward mode
                  ✓ | Hardware: 8 rdzeni
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="primary" onClick={handleSaveProfileConfig}>
            Zapisz
          </Button>
          <Button color="gray" onClick={handleCloseCreateModal}>
            Anuluj
          </Button>
        </Modal.Footer>
      </Modal>
    </NavbarSidebarLayout>
  );
};

export default AdsPowerDashboardPage;
