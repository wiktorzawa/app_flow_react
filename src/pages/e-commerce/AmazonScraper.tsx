import type { FC } from "react";
import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Label,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { HiDownload, HiEye } from "react-icons/hi";
import axiosInstance from "../../api/axios";

interface AmazonProduct {
  id: number;
  title: string;
  asin: string;
  upc?: string;
  initial_price?: number;
  final_price?: number;
  currency?: string;
  brand?: string;
  categories?: string[];
  domain?: string;
  url: string;
  image_url?: string;
  model_number?: string;
  from_the_brand?: string;
  features?: string[];
  images?: string[];
  product_details?: any;
  createdAt: string;
  updatedAt: string;
}

const AmazonScraper: FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleScrape = async () => {
    if (!url.trim()) {
      setError("Proszę podać URL produktu Amazon");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosInstance.post("/amazon-scraper/scrape", { url });

      if (response.data.success) {
        setSuccess("Produkt został pomyślnie zescrapowany!");
        setUrl("");
        fetchProducts();
      } else {
        setError(response.data.message || "Błąd podczas scrapowania");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Wystąpił błąd podczas scrapowania");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/amazon-scraper/products");
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error("Błąd podczas pobierania produktów:", err);
    }
  };

  // Pobierz produkty przy pierwszym załadowaniu
  useState(() => {
    fetchProducts();
  });

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold dark:text-white">Amazon Product Scraper</h1>

      {/* Formularz scrapowania */}
      <Card className="mb-6">
        <h2 className="mb-4 text-xl font-semibold dark:text-white">Scrapuj nowy produkt</h2>

        {error && (
          <Alert color="failure" className="mb-4">
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="success" className="mb-4">
            {success}
          </Alert>
        )}

        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="url">URL produktu Amazon</Label>
            <TextInput
              id="url"
              type="url"
              placeholder="https://www.amazon.com/dp/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleScrape} disabled={loading} color="primary">
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Scrapowanie...
                </>
              ) : (
                <>
                  <HiDownload className="mr-2" />
                  Scrapuj
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabela produktów */}
      <Card>
        <h2 className="mb-4 text-xl font-semibold dark:text-white">Zescrapowane produkty ({products.length})</h2>

        <div className="overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Obraz</TableHeadCell>
              <TableHeadCell>Tytuł</TableHeadCell>
              <TableHeadCell>ASIN</TableHeadCell>
              <TableHeadCell>Marka</TableHeadCell>
              <TableHeadCell>Cena</TableHeadCell>
              <TableHeadCell>Kategorie</TableHeadCell>
              <TableHeadCell>Akcje</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {products.map((product) => (
                <TableRow key={product.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="h-16 w-16 object-cover rounded" />
                    ) : (
                      <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400">Brak</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate font-medium text-gray-900 dark:text-white">{product.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge color="info">{product.asin}</Badge>
                  </TableCell>
                  <TableCell>{product.brand || "-"}</TableCell>
                  <TableCell>
                    {product.final_price ? (
                      <span className="font-semibold">
                        {product.final_price} {product.currency || "EUR"}
                      </span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {product.categories && product.categories.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.categories.slice(0, 2).map((cat, idx) => (
                          <Badge key={idx} color="gray" size="sm">
                            {cat}
                          </Badge>
                        ))}
                        {product.categories.length > 2 && (
                          <Badge color="gray" size="sm">
                            +{product.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="xs" color="gray" href={product.url}>
                        <HiEye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {products.length === 0 && <div className="text-center py-8 text-gray-500">Brak zescrapowanych produktów</div>}
        </div>
      </Card>
    </div>
  );
};

export default AmazonScraper;
