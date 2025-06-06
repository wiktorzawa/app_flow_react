import type { FC } from "react";
import { useState } from "react";
import {
  Card,
  Button,
  TextInput,
  Select,
  Label,
  Checkbox,
  Progress,
  Badge,
  Spinner,
  Breadcrumb,
} from "flowbite-react";
import {
  HiUser,
  HiUsers,
  HiRefresh,
  HiEye,
  HiCheckCircle,
  HiPhotograph,
  HiPencil,
  HiShieldCheck,
  HiGlobe,
  HiClock,
  HiChartBar,
  HiHome,
  HiLightningBolt,
  HiDesktopComputer,
} from "react-icons/hi";

import DashboardLayout from "../../layouts/DashboardLayout";
import { UserProfile, ProfileStatus, Gender, EducationLevel } from "@shared-types/UserProfile";

interface GeneratedProfile extends UserProfile {
  profilePhotos: string[];
  adsPowerConfig?: AdsPowerConfig;
  proxyConfig?: ProxyConfig;
  anonymityScore?: number;
  automationSchedule?: AutomationSchedule;
}

interface AdsPowerConfig {
  fingerprintId: string;
  browserVersion: string;
  screenResolution: string;
  timezone: string;
  language: string;
  webgl: string;
  canvas: string;
}

interface ProxyConfig {
  provider: "brightdata" | "other";
  ip: string;
  port: number;
  username: string;
  password: string;
  location: string;
  isp: string;
}

interface AutomationSchedule {
  dailyActivities: Activity[];
  weeklyGoals: string[];
  interests: string[];
  websites: string[];
  searchTerms: string[];
}

interface Activity {
  time: string;
  action: string;
  duration: number;
  websites: string[];
}

const InkubatorProfilowy: FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [generatedProfiles, setGeneratedProfiles] = useState<GeneratedProfile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const stages = [
    { title: "Generowanie Profili", icon: HiUsers, color: "blue" },
    { title: "AdsPower + Proxy", icon: HiDesktopComputer, color: "purple" },
    { title: "Testy + Harmonogram", icon: HiShieldCheck, color: "green" },
  ];

  const cities = [
    "Warszawa",
    "Kraków",
    "Gdańsk",
    "Wrocław",
    "Poznań",
    "Łódź",
    "Szczecin",
    "Lublin",
    "Katowice",
    "Bydgoszcz",
  ];

  // Generator Configuration State
  const [generatorConfig, setGeneratorConfig] = useState({
    count: 5,
    manualConfig: false, // gdy count === 1, możliwość ręcznej konfiguracji
  });

  // Manual Profile Data (z UP_tabela.json)
  const [manualProfileData, setManualProfileData] = useState({
    UP_Imie: "",
    UP_Nazwisko: "",
    UP_Plec: "",
    UP_DataUrodzenia: "",
    UP_AdresEmail_Glowny: "",
    UP_Haslo_Email_Glowny: "",
    UP_AdresEmail_Pomocniczy: "",
    UP_Haslo_Email_Pomocniczy: "",
    UP_NumerTelefonu: "",
    UP_Zainteresowania_Hobby: "",
    UP_Wyksztalcenie: "",
    UP_StanowiskoPracy_Zawod: "",
    UP_Branza_Pracy: "",
    UP_JezykUzytkownika: "pl",
    UP_Notatki_Ogolne_Persona: "",
    UP_ZrodloDanych_Persona: "manual",
  });

  // Photo Configuration State
  const [photoConfig, setPhotoConfig] = useState({
    selectedPhotos: [] as string[],
    mainPhotoIndex: 0,
    generateAI: true,
    useStock: true,
    photoCount: 3,
    style: "professional", // professional, casual, lifestyle
  });

  // Content Generation State
  const [contentConfig, setContentConfig] = useState({
    generateBio: true,
    generatePosts: true,
    generateLinks: true,
    interests: [] as string[],
    bioText: "",
    postTexts: [] as string[],
    interestLinks: [] as string[],
  });

  // Show generated profiles module after generation
  const [showProfilesModule, setShowProfilesModule] = useState(false);

  // AI Assistant State
  const [aiAssistant, setAiAssistant] = useState({
    isActive: true,
    suggestions: [] as string[],
    warnings: [] as string[],
    profileScore: 0,
    currentAdvice: "",
  });

  // Modal state for photo enlargement
  const [photoModal, setPhotoModal] = useState({
    isOpen: false,
    photoUrl: "",
    photoIndex: 0,
  });

  // STAGE 1: Compact Profile Generation (4 Cards)
  const Stage1ProfileGeneration = () => (
    <div className="space-y-4">
      {!showProfilesModule ? (
        <>
          {/* AI ASSISTANT PANEL */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 border-purple-200 dark:border-purple-700">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">🤖</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">
                  AI Asystent - Ekspert od Kontentu i Fotografii
                </h4>
                <p className="text-sm text-purple-700 dark:text-purple-200 mb-3">
                  {aiAssistant.currentAdvice || "Witaj! Pomogę Ci stworzyć naturalny i spójny profil. Zacznij od wyboru liczby profili."}
                </p>
                
                {aiAssistant.suggestions.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-green-700 dark:text-green-300">💡 Sugestie:</p>
                    {aiAssistant.suggestions.map((suggestion, i) => (
                      <p key={i} className="text-xs text-green-600 dark:text-green-300">• {suggestion}</p>
                    ))}
                  </div>
                )}
                
                {aiAssistant.warnings.length > 0 && (
                  <div className="space-y-1 mt-2">
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-300">⚠️ Ostrzeżenia:</p>
                    {aiAssistant.warnings.map((warning, i) => (
                      <p key={i} className="text-xs text-amber-600 dark:text-amber-300">• {warning}</p>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                  {aiAssistant.profileScore}%
                </div>
                <p className="text-xs text-purple-500 dark:text-purple-400">Naturalność</p>
              </div>
            </div>
          </Card>

          {/* CARD 1: COMPACT PROFILE CONFIG */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              🎯 Konfiguracja Profili
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label value="Liczba profili" className="text-sm" />
                <TextInput
                  type="number"
                  min="1"
                  max="50"
                  value={generatorConfig.count}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    setGeneratorConfig({ 
                      ...generatorConfig, 
                      count,
                      manualConfig: count === 1 
                    });
                    updateAIAdvice(count);
                  }}
                  className="mt-1"
                />
              </div>
              
              {generatorConfig.count === 1 && (
                <div className="flex items-center">
                  <Checkbox
                    id="manualConfig"
                    checked={generatorConfig.manualConfig}
                    onChange={(e) => setGeneratorConfig({ ...generatorConfig, manualConfig: e.target.checked })}
                  />
                  <Label htmlFor="manualConfig" className="ml-2 text-sm">Ręczna konfiguracja</Label>
                </div>
              )}
            </div>

            {/* COMPACT MANUAL CONFIG */}
            {generatorConfig.count === 1 && generatorConfig.manualConfig && (
              <div className="mt-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <TextInput placeholder="Imię" value={manualProfileData.UP_Imie} 
                    onChange={(e) => setManualProfileData({ ...manualProfileData, UP_Imie: e.target.value })} />
                  <TextInput placeholder="Nazwisko" value={manualProfileData.UP_Nazwisko}
                    onChange={(e) => setManualProfileData({ ...manualProfileData, UP_Nazwisko: e.target.value })} />
                  <Select value={manualProfileData.UP_Plec}
                    onChange={(e) => setManualProfileData({ ...manualProfileData, UP_Plec: e.target.value })}>
                    <option value="">Płeć</option>
                    <option value="kobieta">Kobieta</option>
                    <option value="mężczyzna">Mężczyzna</option>
                  </Select>
                  <TextInput type="date" value={manualProfileData.UP_DataUrodzenia}
                    onChange={(e) => setManualProfileData({ ...manualProfileData, UP_DataUrodzenia: e.target.value })} />
                  <TextInput placeholder="Email" value={manualProfileData.UP_AdresEmail_Glowny}
                    onChange={(e) => setManualProfileData({ ...manualProfileData, UP_AdresEmail_Glowny: e.target.value })} />
                  <TextInput placeholder="Zawód" value={manualProfileData.UP_StanowiskoPracy_Zawod}
                    onChange={(e) => setManualProfileData({ ...manualProfileData, UP_StanowiskoPracy_Zawod: e.target.value })} />
                </div>
              </div>
            )}
          </Card>

          {/* CARD 2: SMART PHOTO EDITOR */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              📸 Inteligentny Edytor Zdjęć
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: Settings */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label value="Liczba zdjęć" className="text-sm" />
                    <Select value={photoConfig.photoCount}
                      onChange={(e) => setPhotoConfig({ ...photoConfig, photoCount: parseInt(e.target.value) })}>
                      <option value="1">1</option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                    </Select>
                  </div>
                  <div>
                    <Label value="Styl" className="text-sm" />
                    <Select value={photoConfig.style}
                      onChange={(e) => {
                        setPhotoConfig({ ...photoConfig, style: e.target.value });
                        updatePhotoStyleBasedOnInterests(e.target.value);
                      }}>
                      <option value="professional">Profesjonalny</option>
                      <option value="casual">Casualowy</option>
                      <option value="lifestyle">Lifestyle</option>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={generateSmartPhotos} className="flex-1">
                    🎲 Generuj na podstawie zainteresowań
                  </Button>
                </div>
                
                <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  💡 AI automatycznie dobierze styl zdjęć do wybranych zainteresowań
                </div>
              </div>
              
              {/* Right: Square Photo Grid */}
              <div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: photoConfig.photoCount }, (_, index) => (
                    <div
                      key={index}
                      className={`aspect-square relative cursor-pointer group border-2 rounded-lg overflow-hidden ${
                        index === photoConfig.mainPhotoIndex ? "border-blue-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                      onClick={() => {
                        setPhotoConfig({ ...photoConfig, mainPhotoIndex: index });
                        if (photoConfig.selectedPhotos[index]) {
                          setPhotoModal({
                            isOpen: true,
                            photoUrl: photoConfig.selectedPhotos[index],
                            photoIndex: index
                          });
                        }
                      }}
                    >
                      <img
                        src={photoConfig.selectedPhotos[index] || `https://via.placeholder.com/200x200?text=${index + 1}`}
                        alt={`Zdjęcie ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {index === photoConfig.mainPhotoIndex && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white px-1 py-0.5 rounded text-xs">
                          Główne
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs opacity-0 group-hover:opacity-100">Kliknij aby powiększyć</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* CARD 3: COMPACT CONTENT GENERATOR */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              🧠 Generator Treści
            </h3>
            
            <div className="space-y-3">
              {/* Interests Selection */}
              <div>
                <Label value="Zainteresowania (wpłyną na styl zdjęć)" className="text-sm font-medium" />
                <div className="grid grid-cols-4 md:grid-cols-7 gap-1 mt-1">
                  {["Sport", "Muzyka", "Podróże", "Fotografia", "Kulinaria", "Technologia", "Książki", "Filmy", "Gry", "Sztuka", "Moda", "Fitness", "Natura", "Historia"].map((interest) => (
                    <label key={interest} className="flex items-center space-x-1 text-xs cursor-pointer">
                      <Checkbox
                        checked={contentConfig.interests.includes(interest)}
                        onChange={(e) => {
                          let newInterests;
                          if (e.target.checked) {
                            newInterests = [...contentConfig.interests, interest];
                          } else {
                            newInterests = contentConfig.interests.filter(i => i !== interest);
                          }
                          setContentConfig({ ...contentConfig, interests: newInterests });
                          updateAIAnalysis(newInterests);
                        }}
                      />
                      <span className="truncate">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Content Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label value="Biografia" className="text-sm" />
                  <TextInput
                    placeholder="Generowana biografia..."
                    value={contentConfig.bioText}
                    onChange={(e) => setContentConfig({ ...contentConfig, bioText: e.target.value })}
                  />
                  <Button onClick={generateBio} className="mt-1">🔄 Generuj</Button>
                </div>
                <div>
                  <Label value="Linki zainteresowań" className="text-sm" />
                  <TextInput
                    placeholder="Auto-generowane linki..."
                    value={contentConfig.interestLinks[0] || ""}
                    onChange={(e) => {
                      const newLinks = [...contentConfig.interestLinks];
                      newLinks[0] = e.target.value;
                      setContentConfig({ ...contentConfig, interestLinks: newLinks });
                    }}
                  />
                  <Button onClick={generateInterestLinks} className="mt-1">🔄 Generuj</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* CARD 4: COMPACT GENERATION BUTTON */}
          <Card>
            <div className="text-center">
              <Button onClick={generateProfiles} disabled={isGenerating} size="lg" className="px-8">
                {isGenerating ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Generowanie {generatorConfig.count} profili...
                  </>
                ) : (
                  <>
                    <HiLightningBolt className="mr-2 h-5 w-5" />
                    Wygeneruj {generatorConfig.count} {generatorConfig.count === 1 ? "profil" : "profile"}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </>
      ) : (
        /* MODUŁ USTAWIEŃ BOTÓW */
        <BotSettingsModule onBack={() => setShowProfilesModule(false)} />
      )}
      
      {/* PHOTO ENLARGEMENT MODAL */}
      {photoModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setPhotoModal({ ...photoModal, isOpen: false })}>
          <div className="max-w-2xl max-h-[90vh] relative">
            <img
              src={photoModal.photoUrl}
              alt={`Powiększone zdjęcie ${photoModal.photoIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setPhotoModal({ ...photoModal, isOpen: false })}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-75"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // STAGE 2: AdsPower + Proxy Configuration
  const Stage2AdsPowerProxy = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ADSPOWER CONFIGURATION */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🖥️ Konfiguracja AdsPower
          </h3>
          <div className="space-y-4">
            <div>
              <Label value="Browser Version" />
              <Select>
                <option>Chrome 120.0</option>
                <option>Chrome 119.0</option>
                <option>Firefox 120.0</option>
              </Select>
            </div>
            <div>
              <Label value="Screen Resolution" />
              <Select>
                <option>1920x1080</option>
                <option>1366x768</option>
                <option>1440x900</option>
              </Select>
            </div>
            <div>
              <Label value="Timezone" />
              <Select>
                <option>Europe/Warsaw</option>
                <option>Europe/London</option>
                <option>America/New_York</option>
              </Select>
            </div>
            <Button>
              <HiDesktopComputer className="mr-2 h-4 w-4" />
              Konfiguruj AdsPower
            </Button>
          </div>
        </Card>

        {/* BRIGHT DATA PROXY */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🌐 Konfiguracja Bright Data Proxy
          </h3>
          <div className="space-y-4">
            <div>
              <Label value="Lokalizacja Proxy" />
              <Select>
                <option>Poland - Warsaw</option>
                <option>Germany - Frankfurt</option>
                <option>USA - New York</option>
              </Select>
            </div>
            <div>
              <Label value="ISP Provider" />
              <Select>
                <option>Orange Polska</option>
                <option>Play</option>
                <option>T-Mobile</option>
              </Select>
            </div>
            <div>
              <Label value="Connection Type" />
              <Select>
                <option>Residential</option>
                <option>Datacenter</option>
                <option>Mobile</option>
              </Select>
            </div>
            <Button color="purple">
              <HiGlobe className="mr-2 h-4 w-4" />
              Test Proxy Connection
            </Button>
          </div>
        </Card>
      </div>

      {/* PROFILE ASSIGNMENT */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          🔗 Przypisanie do Profili
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedProfiles.map((profile) => (
            <div key={profile.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={profile.profilePhotos?.[0] || `https://i.pravatar.cc/50?img=${profile.id}`}
                  alt={profile.full_name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{profile.full_name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{profile.city}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">AdsPower:</span>
                  <Badge color={profile.adsPowerConfig ? "green" : "gray"}>
                    {profile.adsPowerConfig ? "Skonfigurowane" : "Brak"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Proxy:</span>
                  <Badge color={profile.proxyConfig ? "green" : "gray"}>
                    {profile.proxyConfig ? "Połączone" : "Brak"}
                  </Badge>
                </div>
              </div>
              <Button size="xs" className="w-full mt-3">
                Konfiguruj
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // STAGE 3: Anonymity Testing + Automation Schedule
  const Stage3TestingSchedule = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ANONYMITY TESTING */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🛡️ Testy Anonimowości
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-900 dark:text-white">Fingerprint Test</span>
              <Button size="xs">Test</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-900 dark:text-white">WebRTC Leak Test</span>
              <Button size="xs">Test</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-900 dark:text-white">DNS Leak Test</span>
              <Button size="xs">Test</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-900 dark:text-white">Geolocation Test</span>
              <Button size="xs">Test</Button>
            </div>
            <Button color="green" className="w-full">
              <HiShieldCheck className="mr-2 h-4 w-4" />
              Uruchom Wszystkie Testy
            </Button>
          </div>
        </Card>

        {/* AUTOMATION SCHEDULE */}
        <Card>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            🕒 Harmonogram Automatyzacji
          </h3>
          <div className="space-y-4">
            <div>
              <Label value="Aktywność dzienna (godz.)" />
              <div className="flex gap-2">
                <TextInput placeholder="Od" type="time" />
                <TextInput placeholder="Do" type="time" />
              </div>
            </div>
            <div>
              <Label value="Częstotliwość sesji" />
              <Select>
                <option>2-3 razy dziennie</option>
                <option>4-6 razy dziennie</option>
                <option>Całą dobę</option>
              </Select>
            </div>
            <div>
              <Label value="Typu aktywności" />
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="social" defaultChecked />
                  <Label htmlFor="social">Social Media</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="shopping" defaultChecked />
                  <Label htmlFor="shopping">Zakupy online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="news" defaultChecked />
                  <Label htmlFor="news">Czytanie newsów</Label>
                </div>
              </div>
            </div>
            <Button>
              <HiClock className="mr-2 h-4 w-4" />
              Generuj Harmonogram
            </Button>
          </div>
        </Card>
      </div>

      {/* PROFILE ANALYTICS */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          📊 Analityka Profili
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {generatedProfiles.map((profile) => (
            <div key={profile.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={profile.profilePhotos?.[0] || `https://i.pravatar.cc/50?img=${profile.id}`}
                  alt={profile.full_name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{profile.full_name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{profile.city}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-300">Anonimowość</span>
                    <span className="text-gray-900 dark:text-white">
                      {profile.anonymityScore || Math.floor(Math.random() * 30) + 70}%
                    </span>
                  </div>
                  <Progress
                    progress={profile.anonymityScore || Math.floor(Math.random() * 30) + 70}
                    color="green"
                    size="sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Badge color="green">Fingerprint ✓</Badge>
                  <Badge color="green">Proxy ✓</Badge>
                  <Badge color="yellow">Geolocation ⚠</Badge>
                  <Badge color="green">WebRTC ✓</Badge>
                </div>

                <Button size="xs" className="w-full">
                  <HiChartBar className="mr-2 h-3 w-3" />
                  Zobacz Szczegóły
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const generateProfiles = async () => {
    setIsGenerating(true);
    try {
      // Simulate advanced profile generation with multiple steps
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newProfiles: GeneratedProfile[] = Array.from({ length: generatorConfig.count }, (_, i) => {
        // Use manual data if configured, otherwise generate random
        const useManualData = generatorConfig.manualConfig && generatorConfig.count === 1;
        
        const genderChoice = useManualData 
          ? (manualProfileData.UP_Plec === "kobieta" ? Gender.FEMALE : Gender.MALE)
          : [Gender.MALE, Gender.FEMALE][i % 2];

        const age = useManualData 
          ? (new Date().getFullYear() - new Date(manualProfileData.UP_DataUrodzenia).getFullYear())
          : Math.floor(Math.random() * 30) + 25;

        const firstNames = genderChoice === Gender.FEMALE
          ? ["Anna", "Maria", "Katarzyna", "Agnieszka", "Barbara", "Ewa", "Krystyna", "Elżbieta", "Joanna", "Magdalena"]
          : ["Jan", "Piotr", "Krzysztof", "Stanisław", "Tomasz", "Paweł", "Józef", "Marcin", "Marek", "Michał"];

        const lastNames = ["Kowalski", "Nowak", "Wiśniewski", "Dąbrowski", "Lewandowski", "Wójcik", "Kowalczyk", "Kamiński", "Kwiatkowski", "Szymański"];

        const firstName = useManualData ? manualProfileData.UP_Imie : firstNames[i % firstNames.length];
        const lastName = useManualData ? manualProfileData.UP_Nazwisko : lastNames[i % lastNames.length];

        return {
          id: `profile-${Date.now()}-${i}`,
          profile_code: `PROF_${Date.now()}_${i}`,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          gender: genderChoice,
          age,
          date_of_birth: useManualData 
            ? new Date(manualProfileData.UP_DataUrodzenia)
            : new Date(new Date().getFullYear() - age, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          nationality: "Polska",
          city: useManualData ? "Warszawa" : cities[i % cities.length],
          region: "Mazowieckie",
          country: "Polska",
          country_code: "PL",
          postal_code: `${Math.floor(Math.random() * 90000) + 10000}`,
          primary_email: useManualData 
            ? manualProfileData.UP_AdresEmail_Glowny
            : `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@${["gmail.com", "wp.pl", "onet.pl", "yahoo.com"][i % 4]}`,
          primary_email_password: useManualData ? manualProfileData.UP_Haslo_Email_Glowny : "",
          phone_number: useManualData ? manualProfileData.UP_NumerTelefonu : `+48${Math.floor(Math.random() * 900000000) + 100000000}`,
          phone_country_code: "+48",
          avatar_url: `https://i.pravatar.cc/150?img=${i + 10}`,
          status: ProfileStatus.ACTIVE,
          created_at: new Date(),
          updated_at: new Date(),
          interests: useManualData 
            ? manualProfileData.UP_Zainteresowania_Hobby.split(",").map(s => s.trim())
            : contentConfig.interests.length > 0 ? contentConfig.interests : generateInterests(genderChoice, age),
          education_level: useManualData 
            ? (manualProfileData.UP_Wyksztalcenie as EducationLevel) || "bachelor"
            : "bachelor" as EducationLevel,
          primary_language: useManualData ? manualProfileData.UP_JezykUzytkownika : "pl",
          secondary_languages: [],
          timezone: "Europe/Warsaw",
          locale: "pl_PL",
          username_preferences: [],
          photos: [],
          profilePhotos: photoConfig.selectedPhotos.length > 0 
            ? photoConfig.selectedPhotos 
            : generatePhotoPaths(i, photoConfig.photoCount),
          data_source: useManualData ? "manual" as any : "ai_generated" as any,
          verification_status: "unverified" as any,
          risk_level: "low" as any,
          notes: useManualData ? manualProfileData.UP_Notatki_Ogolne_Persona : "",
          tags: useManualData ? ["manual", "inkubator"] : ["ai-generated", "inkubator"],
        };
      });

      setGeneratedProfiles(newProfiles);
      setShowProfilesModule(true); // Pokaż moduł ustawień botów
    } catch (error) {
      console.error("Error generating profiles:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateInterests = (gender: Gender, age: number): string[] => {
    const baseInterests = ["Sport", "Muzyka", "Podróże", "Kultura", "Technologia"];
    const ageSpecific = age < 30 
      ? ["Gaming", "Social Media", "Festiwale", "Fitness"]
      : age > 50 
      ? ["Ogrodnictwo", "Czytanie", "Historia", "Kulinaria"]
      : ["Kariera", "Inwestycje", "Dom", "Rodzina"];
    
    return [...baseInterests.slice(0, 3), ...ageSpecific.slice(0, 2)];
  };

  const generatePhotoPaths = (index: number, count: number): string[] => {
    return Array.from({ length: count }, (_, photoIndex) => 
      `https://i.pravatar.cc/300?img=${index * 10 + photoIndex + 10}`
    );
  };

  const regenerateProfile = async (profileId: string) => {
    console.log("Regenerating profile:", profileId);
    // Implementation for regenerating single profile
  };

  const deleteProfile = (profileId: string) => {
    setGeneratedProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  // Helper functions for content generation
  const generateSamplePhotos = () => {
    const samplePhotos = Array.from({ length: photoConfig.photoCount }, (_, i) => 
      `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70) + 1}`
    );
    setPhotoConfig({ ...photoConfig, selectedPhotos: samplePhotos });
  };

  const generateBio = () => {
    const bios = [
      "Pasjonatka podróży i fotografii. Uwielbiam odkrywać nowe miejsca i kultury. W wolnym czasie czytam książki i uprawiam jogę.",
      "Entuzjasta technologii i innowacji. Pracuję w branży IT, ale po godzinach oddaję się gotowaniu i eksperymentowaniu w kuchni.",
      "Miłośniczka sztuki i muzyki. Spędzam weekendy w galeriach i na koncertach. Interesuję się także modą i designem.",
    ];
    setContentConfig({ 
      ...contentConfig, 
      bioText: bios[Math.floor(Math.random() * bios.length)]
    });
  };

  const generatePosts = () => {
    const posts = [
      "Cudowny dzień na spacerze w parku! Natura zawsze dodaje mi energii. Czy macie swoje ulubione miejsce na relaks?",
      "Próbowałam dziś nowego przepisu na lasagne. Wyszła pyszna! Uwielbiam eksperymentować w kuchni.",
      "Weekend z książką i herbatą to mój sposób na odpoczynek. Co polecacie do przeczytania?",
    ];
    setContentConfig({ ...contentConfig, postTexts: posts });
  };

  const generateInterestLinks = () => {
    const baseLinks = [
      "https://www.youtube.com/cooking",
      "https://www.goodreads.com",
      "https://www.spotify.com",
      "https://www.instagram.com/travel",
      "https://www.pinterest.com/photography",
    ];
    setContentConfig({ 
      ...contentConfig, 
      interestLinks: baseLinks.slice(0, Math.min(5, contentConfig.interests.length))
    });
  };

  // AI Assistant Functions
  const updateAIAdvice = (profileCount: number) => {
    if (profileCount === 1) {
      setAiAssistant(prev => ({
        ...prev,
        currentAdvice: "Świetny wybór! Dla 1 profilu polecam ręczną konfigurację - będzie bardziej naturalny.",
        suggestions: ["Włącz ręczną konfigurację", "Wybierz zainteresowania przed generowaniem zdjęć"],
        profileScore: 60
      }));
    } else {
      setAiAssistant(prev => ({
        ...prev,
        currentAdvice: `Generuję ${profileCount} profili automatycznie. Zainteresowania wpłyną na styl zdjęć.`,
        suggestions: ["Wybierz różnorodne zainteresowania", "AI dobierze style zdjęć automatycznie"],
        profileScore: 75
      }));
    }
  };

  const updateAIAnalysis = (interests: string[]) => {
    const suggestions: string[] = [];
    const warnings: string[] = [];
    let score = 70;

    if (interests.length === 0) {
      warnings.push("Brak zainteresowań - zdjęcia będą w stylu neutralnym");
      score -= 15;
    } else if (interests.length > 5) {
      warnings.push("Zbyt wiele zainteresowań - profil może wyglądać nierealistycznie");
      score -= 10;
    } else {
      suggestions.push(`Dobrana liczba zainteresowań (${interests.length}) - styl zdjęć zostanie dopasowany`);
      score += 10;
    }

    // Check interest coherence
    const hasOutdoor = interests.some(i => ["Sport", "Podróże", "Natura"].includes(i));
    const hasIndoor = interests.some(i => ["Książki", "Gry", "Technologia"].includes(i));
    
    if (hasOutdoor && hasIndoor) {
      suggestions.push("Zbalansowane zainteresowania - profil będzie wyglądał naturalnie");
      score += 5;
    }

    setAiAssistant(prev => ({
      ...prev,
      suggestions,
      warnings,
      profileScore: Math.min(100, score),
      currentAdvice: interests.length > 0 
        ? `Zainteresowania: ${interests.join(", ")}. Dobiorę odpowiedni styl zdjęć.`
        : "Wybierz zainteresowania, a ja dopasuję styl zdjęć do profilu."
    }));
  };

  const updatePhotoStyleBasedOnInterests = (style: string) => {
    const interests = contentConfig.interests;
    const suggestions: string[] = [];
    
    if (interests.includes("Sport") || interests.includes("Fitness")) {
      if (style !== "casual") {
        suggestions.push("Dla zainteresowań sportowych polecam styl 'casualowy'");
      }
    }
    
    if (interests.includes("Technologia") || interests.includes("Książki")) {
      if (style !== "professional") {
        suggestions.push("Dla zainteresowań intelektualnych polecam styl 'profesjonalny'");
      }
    }

    setAiAssistant(prev => ({
      ...prev,
      suggestions: suggestions.length > 0 ? suggestions : ["Styl zdjęć pasuje do zainteresowań"]
    }));
  };

  const generateSmartPhotos = () => {
    const interests = contentConfig.interests;
    let baseStyle = photoConfig.style;
    
    // Smart style selection based on interests
    if (interests.includes("Sport") || interests.includes("Fitness") || interests.includes("Natura")) {
      baseStyle = "casual";
    } else if (interests.includes("Technologia") || interests.includes("Książki")) {
      baseStyle = "professional";
    } else if (interests.includes("Sztuka") || interests.includes("Moda") || interests.includes("Fotografia")) {
      baseStyle = "lifestyle";
    }

    // Generate photos with smart seed based on interests
    const seedModifier = interests.length * 7 + interests.join("").length;
    const samplePhotos = Array.from({ length: photoConfig.photoCount }, (_, i) => {
      const seed = (seedModifier + i * 13) % 70 + 1;
      return `https://i.pravatar.cc/300?img=${seed}`;
    });
    
    setPhotoConfig({ ...photoConfig, selectedPhotos: samplePhotos, style: baseStyle });
    
    setAiAssistant(prev => ({
      ...prev,
      currentAdvice: `Wygenerowałem zdjęcia w stylu '${baseStyle}' dopasowane do zainteresowań: ${interests.slice(0, 3).join(", ")}`,
      profileScore: Math.min(100, prev.profileScore + 15)
    }));
  };

  return (
    <DashboardLayout title="🚀 Inkubator Profilowy">
      {/* BREADCRUMB */}
      <div className="mb-6">
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <div className="flex items-center gap-x-3">
              <HiHome className="text-xl" />
              <span className="dark:text-white">Dashboard</span>
            </div>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/boty">Boty</Breadcrumb.Item>
          <Breadcrumb.Item>Inkubator Profilowy</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* STAGES HEADER */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {stages.map((stage, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 cursor-pointer ${
                  currentStage >= index
                    ? `text-${stage.color}-600 dark:text-${stage.color}-400`
                    : "text-gray-400 dark:text-gray-500"
                }`}
                onClick={() => setCurrentStage(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setCurrentStage(index);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStage >= index
                      ? `border-${stage.color}-600 bg-${stage.color}-600 text-white`
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {currentStage > index ? (
                    <HiCheckCircle className="w-6 h-6" />
                  ) : (
                    <stage.icon className="w-5 h-5" />
                  )}
                </div>
                <span className="font-medium text-lg">{stage.title}</span>
                {index < stages.length - 1 && <div className="w-20 h-px bg-gray-300 dark:bg-gray-600 ml-4" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STAGE CONTENT */}
      <div className="mb-8">
        {currentStage === 0 && <Stage1ProfileGeneration />}
        {currentStage === 1 && <Stage2AdsPowerProxy />}
        {currentStage === 2 && <Stage3TestingSchedule />}
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between">
        <Button
          color="gray"
          onClick={() => setCurrentStage(Math.max(0, currentStage - 1))}
          disabled={currentStage === 0}
        >
          ← Poprzedni Etap
        </Button>

        <Button
          onClick={() => setCurrentStage(Math.min(2, currentStage + 1))}
          disabled={currentStage === 2}
        >
          Następny Etap →
        </Button>
      </div>
    </DashboardLayout>
  );
};

// ENHANCED PROFILE CARD COMPONENT
const EnhancedProfileCard: FC<{
  profile: GeneratedProfile;
  onEdit: () => void;
  onSelect: () => void;
  isEditing: boolean;
  onRegenerate: () => void;
  onDelete: () => void;
}> = ({ profile, onEdit, onSelect, isEditing, onRegenerate, onDelete }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* PHOTOS */}
        <div className="grid grid-cols-3 gap-2">
          {profile.profilePhotos?.slice(0, 3).map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`${profile.full_name} foto ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                <HiPhotograph className="text-white opacity-0 group-hover:opacity-100 w-6 h-6" />
              </div>
            </div>
          )) || (
            <div className="col-span-3 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
              <HiUser className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* PROFILE INFO */}
        <div>
          {isEditing ? (
            <div className="space-y-2">
              <TextInput value={profile.first_name} placeholder="Imię" />
              <TextInput value={profile.last_name} placeholder="Nazwisko" />
              <TextInput value={profile.city} placeholder="Miasto" />
            </div>
          ) : (
            <>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white">{profile.full_name}</h4>
              <p className="text-gray-600 dark:text-gray-300">
                {profile.city}, {profile.age} lat
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile.primary_email}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {profile.interests?.slice(0, 3).join(", ")}
              </p>
            </>
          )}
        </div>

        {/* BADGES */}
        <div className="flex gap-2 flex-wrap">
          <Badge color="blue">{profile.gender}</Badge>
          <Badge color="green">{profile.status}</Badge>
          <Badge color="gray" size="sm">
            {profile.education_level}
          </Badge>
          {profile.adsPowerConfig && <Badge color="purple">AdsPower</Badge>}
          {profile.proxyConfig && <Badge color="yellow">Proxy</Badge>}
        </div>

        {/* ENHANCED ACTIONS */}
        <div className="grid grid-cols-2 gap-2">
          <Button size="xs" onClick={onEdit}>
            <HiPencil className="mr-1 h-3 w-3" />
            {isEditing ? "Zapisz" : "Edytuj"}
          </Button>
          <Button size="xs" color="gray" onClick={onSelect}>
            <HiEye className="mr-1 h-3 w-3" />
            Szczegóły
          </Button>
          <Button size="xs" color="purple" onClick={onRegenerate}>
            <HiRefresh className="mr-1 h-3 w-3" />
            Regeneruj
          </Button>
          <Button size="xs" color="red" onClick={onDelete}>
            <HiPhotograph className="mr-1 h-3 w-3" />
            Usuń
          </Button>
        </div>

        {/* QUALITY INDICATORS */}
        <div className="grid grid-cols-3 gap-1 text-xs">
          <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded text-center">
            📸 {profile.profilePhotos?.length || 0}
          </div>
          <div className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-center">
            🎯 {profile.interests?.length || 0}
          </div>
          <div className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-center">
            ⭐ {Math.floor(Math.random() * 20) + 80}%
          </div>
        </div>
      </div>
    </Card>
  );
};

// BotSettingsModule Component - pokazuje się po wygenerowaniu profili
const BotSettingsModule: FC<{ onBack: () => void }> = ({ onBack }) => (
  <Card>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
      🖥️ Ustawienia Botów - Konfiguracja Wygenerowanych Profili
    </h3>
    
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
        <p className="text-green-800 dark:text-green-200">
          ✅ <strong>Profile zostały wygenerowane!</strong> Teraz możesz skonfigurować ustawienia botów dla każdego profilu.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AdsPower Configuration */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🖥️ Konfiguracja AdsPower</h4>
          <div className="space-y-3">
            <div>
              <Label value="Browser Version" />
              <Select>
                <option>Chrome 120.0</option>
                <option>Chrome 119.0</option>
                <option>Firefox 120.0</option>
              </Select>
            </div>
            <div>
              <Label value="Screen Resolution" />
              <Select>
                <option>1920x1080</option>
                <option>1366x768</option>
                <option>1440x900</option>
              </Select>
            </div>
            <Button color="purple">
              <HiDesktopComputer className="mr-2 h-4 w-4" />
              Konfiguruj AdsPower
            </Button>
          </div>
        </div>
        
        {/* Proxy Configuration */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🌐 Konfiguracja Proxy</h4>
          <div className="space-y-3">
            <div>
              <Label value="Lokalizacja Proxy" />
              <Select>
                <option>Poland - Warsaw</option>
                <option>Germany - Frankfurt</option>
                <option>USA - New York</option>
              </Select>
            </div>
            <div>
              <Label value="ISP Provider" />
              <Select>
                <option>Orange Polska</option>
                <option>Play</option>
                <option>T-Mobile</option>
              </Select>
            </div>
            <Button color="green">
              <HiGlobe className="mr-2 h-4 w-4" />
              Test Proxy Connection
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <Button onClick={onBack} color="gray">
          ← Powrót do generatora
        </Button>
        <Button color="blue">
          Przejdź do następnego etapu →
        </Button>
      </div>
    </div>
  </Card>
);

export default InkubatorProfilowy; 