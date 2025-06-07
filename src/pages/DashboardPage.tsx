import type { FC } from "react";
import { useState, useEffect } from "react";
import { Card, Button, Progress, Badge, Table } from "flowbite-react";
import { HiUsers, HiPhotograph, HiChartPie, HiTrendingUp, HiEye, HiDownload, HiRefresh } from "react-icons/hi";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserProfile, ProfileStatus } from "@shared-types/UserProfile";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  totalProfiles: number;
  activeProfiles: number;
  profilesWithPhotos: number;
  generatedToday: number;
  popularCities: Array<{ city: string; count: number }>;
  genderDistribution: { male: number; female: number; other: number };
  ageDistribution: Array<{ range: string; count: number; percentage: number }>;
}

const DashboardPage: FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProfiles: 0,
    activeProfiles: 0,
    profilesWithPhotos: 0,
    generatedToday: 0,
    popularCities: [],
    genderDistribution: { male: 0, female: 0, other: 0 },
    ageDistribution: [],
  });
  const [recentProfiles, setRecentProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - w rzeczywistości byłaby to fetch z API
      setTimeout(() => {
        setStats({
          totalProfiles: 12847,
          activeProfiles: 11203,
          profilesWithPhotos: 8943,
          generatedToday: 127,
          popularCities: [
            { city: "Warszawa", count: 2847 },
            { city: "Kraków", count: 1943 },
            { city: "Gdańsk", count: 1532 },
            { city: "Wrocław", count: 1284 },
            { city: "Poznań", count: 1076 },
          ],
          genderDistribution: { male: 6234, female: 5847, other: 766 },
          ageDistribution: [
            { range: "18-25", count: 2456, percentage: 19.1 },
            { range: "26-35", count: 4821, percentage: 37.5 },
            { range: "36-45", count: 3402, percentage: 26.5 },
            { range: "46-55", count: 1584, percentage: 12.3 },
            { range: "55+", count: 584, percentage: 4.6 },
          ],
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setLoading(false);
    }
  };

  const StatCard: FC<{
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color: string;
  }> = ({ title, value, icon: Icon, trend, color }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <HiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 dark:bg-${color}-900`}>
          <Icon className={`h-8 w-8 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Przegląd systemu</h2>
          <p className="text-gray-600 dark:text-gray-400">Ostatnia aktualizacja: {new Date().toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button color="gray" onClick={loadDashboardData}>
            <HiRefresh className="mr-2 h-4 w-4" />
            Odśwież
          </Button>
          <Button>
            <HiDownload className="mr-2 h-4 w-4" />
            Eksportuj raport
          </Button>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Łączna liczba profili"
          value={stats.totalProfiles}
          icon={HiUsers}
          trend="+12% w tym miesiącu"
          color="blue"
        />
        <StatCard
          title="Aktywne profile"
          value={stats.activeProfiles}
          icon={HiChartPie}
          trend="+8% w tym tygodniu"
          color="green"
        />
        <StatCard
          title="Profile ze zdjęciami"
          value={stats.profilesWithPhotos}
          icon={HiPhotograph}
          trend="+15% w tym miesiącu"
          color="purple"
        />
        <StatCard title="Wygenerowane dzisiaj" value={stats.generatedToday} icon={HiTrendingUp} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* POPULAR CITIES */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Najpopularniejsze miasta</h3>
            <Badge color="blue">{stats.popularCities.length} miast</Badge>
          </div>
          <div className="space-y-4">
            {stats.popularCities.map((city, index) => (
              <div key={city.city} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {index + 1}. {city.city}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{city.count.toLocaleString()}</span>
                  <Progress
                    progress={(city.count / stats.totalProfiles) * 100}
                    size="sm"
                    color="blue"
                    className="w-16"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* GENDER DISTRIBUTION */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rozkład płci</h3>
            <HiChartPie className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mężczyźni</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.genderDistribution.male.toLocaleString()}
                </span>
                <Progress
                  progress={(stats.genderDistribution.male / stats.totalProfiles) * 100}
                  size="sm"
                  color="blue"
                  className="w-20"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Kobiety</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.genderDistribution.female.toLocaleString()}
                </span>
                <Progress
                  progress={(stats.genderDistribution.female / stats.totalProfiles) * 100}
                  size="sm"
                  color="pink"
                  className="w-20"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Inne</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.genderDistribution.other.toLocaleString()}
                </span>
                <Progress
                  progress={(stats.genderDistribution.other / stats.totalProfiles) * 100}
                  size="sm"
                  color="purple"
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* AGE DISTRIBUTION */}
        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rozkład wieku</h3>
            <Badge color="gray">5 grup</Badge>
          </div>
          <div className="space-y-4">
            {stats.ageDistribution.map((age) => (
              <div key={age.range} className="flex items-center justify-between">
                <span className="text-sm font-medium">{age.range} lat</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{age.percentage}%</span>
                  <Progress progress={age.percentage} size="sm" color="green" className="w-16" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Szybkie akcje</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button size="lg" className="h-20 flex-col" onClick={() => navigate("/profiles/generator")}>
            <HiUsers className="h-8 w-8 mb-2" />
            Wygeneruj nowe profile
          </Button>
          <Button
            size="lg"
            color="purple"
            className="h-20 flex-col"
            onClick={() => navigate("/profiles/advanced-generator")}
          >
            <HiPhotograph className="h-8 w-8 mb-2" />
            Generator zaawansowany
          </Button>
          <Button size="lg" color="gray" className="h-20 flex-col" onClick={() => navigate("/profiles")}>
            <HiEye className="h-8 w-8 mb-2" />
            Przeglądaj profile
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardPage;
