import React, { useState, useEffect } from "react";
import {
  fetchAdsPowerProfiles,
  startAdsPowerBrowser,
  stopAdsPowerBrowser,
  checkAdsPowerBrowserStatus,
} from "../../api/adsPowerApi";

const AdsPowerBrowserTest: React.FC = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [browserStatus, setBrowserStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true);
        const data = await fetchAdsPowerProfiles();
        setProfiles(data.list || []);
      } catch (err: any) {
        setError(err.message || "Błąd podczas pobierania profili");
      } finally {
        setLoading(false);
      }
    };
    loadProfiles();
  }, []);

  const handleCheckStatus = async () => {
    if (!selectedProfileId) {
      setError("Wybierz profil");
      return;
    }
    try {
      setLoading(true);
      const result = await checkAdsPowerBrowserStatus(selectedProfileId);
      setBrowserStatus(result.status);
    } catch (err: any) {
      setError(err.message || "Błąd podczas sprawdzania statusu");
    } finally {
      setLoading(false);
    }
  };

  const handleStartBrowser = async () => {
    if (!selectedProfileId) {
      setError("Wybierz profil");
      return;
    }
    try {
      setLoading(true);
      await startAdsPowerBrowser(selectedProfileId, { ipTab: true });
      setBrowserStatus("Active");
    } catch (err: any) {
      setError(err.message || "Błąd podczas uruchamiania przeglądarki");
    } finally {
      setLoading(false);
    }
  };

  const handleStopBrowser = async () => {
    if (!selectedProfileId) {
      setError("Wybierz profil");
      return;
    }
    try {
      setLoading(true);
      await stopAdsPowerBrowser(selectedProfileId);
      setBrowserStatus("Inactive");
    } catch (err: any) {
      setError(err.message || "Błąd podczas zatrzymywania przeglądarki");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test AdsPower Browser API</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block mb-2">Wybierz profil:</label>
        <select
          className="border rounded p-2 w-full"
          value={selectedProfileId}
          onChange={(e) => setSelectedProfileId(e.target.value)}
          disabled={loading}
        >
          <option value="">-- Wybierz profil --</option>
          {profiles.map((profile) => (
            <option key={profile.user_id} value={profile.user_id}>
              {profile.name} (ID: {profile.user_id})
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <p>
          <strong>Status przeglądarki:</strong> {browserStatus || "Nieznany"}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleCheckStatus}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading || !selectedProfileId}
        >
          Sprawdź status
        </button>
        <button
          onClick={handleStartBrowser}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading || !selectedProfileId || browserStatus === "Active"}
        >
          Uruchom przeglądarkę
        </button>
        <button
          onClick={handleStopBrowser}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading || !selectedProfileId || browserStatus !== "Active"}
        >
          Zatrzymaj przeglądarkę
        </button>
      </div>
    </div>
  );
};

export default AdsPowerBrowserTest;
