export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'image' | 'badge' | 'actions';
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  title?: string;
  description?: string;
  searchable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  actions?: {
    onAdd?: () => void;
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    onExport?: () => void;
    customActions?: Array<{
      label: string;
      onClick: (row: any) => void;
    }>;
  };
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onSearch?: (query: string) => void;
  onFilter?: (filters: any) => void;
  onSelectionChange?: (selectedRows: any[]) => void;
  loading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
} 