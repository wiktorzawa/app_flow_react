import { UniversalTable } from "../../components/UniversalTable";
import type { TableColumn } from "../../types/table.types";
import { useState, useEffect } from "react";

export default function OrderListPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Przykładowe kolumny
  const columns: TableColumn[] = [
    {
      key: "id",
      title: "Order ID",
      sortable: true,
    },
    {
      key: "customerName",
      title: "Customer",
      sortable: true,
    },
    {
      key: "status",
      title: "Status",
      type: "badge",
      sortable: true,
    },
    {
      key: "total",
      title: "Total",
      sortable: true,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "date",
      title: "Order Date",
      sortable: true,
    }
  ];

  // Przykładowe pobieranie danych
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Tu będzie twoje API call
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handlery dla akcji
  const handleSearch = (query: string) => {
    // Implementacja wyszukiwania
    console.log('Searching:', query);
  };

  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    // Implementacja sortowania
    console.log('Sorting:', key, direction);
  };

  const handleEdit = (row: any) => {
    // Implementacja edycji
    console.log('Editing:', row);
  };

  const handleDelete = (row: any) => {
    // Implementacja usuwania
    console.log('Deleting:', row);
  };

  return (
    <div className="p-4">
      <UniversalTable
        title="Orders List"
        description="Manage your orders"
        columns={columns}
        data={orders}
        loading={loading}
        searchable
        filterable
        selectable
        actions={{
          onAdd: () => console.log('Adding new order'),
          onEdit: handleEdit,
          onDelete: handleDelete,
          onExport: () => console.log('Exporting data'),
        }}
        onSort={handleSort}
        onSearch={handleSearch}
        pagination={{
          currentPage: 1,
          totalPages: Math.ceil(orders.length / 10),
          onPageChange: (page) => console.log('Page changed:', page),
        }}
      />
    </div>
  );
} 