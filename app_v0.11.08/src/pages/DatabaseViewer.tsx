import React, { useState, useEffect } from "react";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

interface TableInfo {
  TABLE_SCHEMA: string;
  TABLE_NAME: string;
}

const DatabaseViewer: React.FC = () => {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Pobierz listę tabel z proxy_manager
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: "SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'proxy_manager'",
          params: [],
        }),
      });
      const result = await response.json();
      console.log("Tables response:", result); // Debug log
      if (result.success) {
        setTables(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error fetching tables:", err); // Debug log
      setError("Błąd połączenia z bazą danych");
    }
  };

  const fetchTableData = async (tableName: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:3001/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: `SELECT * FROM proxy_manager.${tableName} LIMIT 100`,
          params: [],
        }),
      });
      const result = await response.json();
      console.log("Table data response:", result); // Debug log
      if (result.success) {
        setTableData(result.data);
        setSelectedTable(tableName);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error fetching table data:", err); // Debug log
      setError("Błąd podczas pobierania danych");
    } finally {
      setLoading(false);
    }
  };

  return (
    <NavbarSidebarLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Przeglądarka bazy danych - Proxy Manager</h1>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Panel z listą tabel */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Tabele w proxy_manager:</h2>
            <div className="space-y-2">
              {tables.map((table) => (
                <button
                  key={table.TABLE_NAME}
                  onClick={() => fetchTableData(table.TABLE_NAME)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    selectedTable === table.TABLE_NAME ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {table.TABLE_NAME}
                </button>
              ))}
            </div>
          </div>

          {/* Panel z danymi tabeli */}
          <div className="md:col-span-3">
            {selectedTable && (
              <>
                <h2 className="text-xl font-semibold mb-4">Dane z tabeli: {selectedTable}</h2>
                {loading ? (
                  <div className="text-center py-8">Ładowanie...</div>
                ) : tableData.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          {Object.keys(tableData[0]).map((key) => (
                            <th key={key} className="px-4 py-2 border-b text-left">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((row, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {Object.values(row).map((value: any, i) => (
                              <td key={i} className="px-4 py-2 border-b">
                                {value !== null ? String(value) : "NULL"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">Tabela jest pusta</div>
                )}
              </>
            )}
            {!selectedTable && (
              <div className="text-center py-8 text-gray-500">Wybierz tabelę z listy po lewej stronie</div>
            )}
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default DatabaseViewer; 