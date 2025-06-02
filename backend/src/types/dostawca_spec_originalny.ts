export interface SupplierProductInput {
  // Pola z nowego, wyraźniejszego zrzutu ekranu
  nr_palety?: string | number | null;
  item_desc?: string | null;
  ean?: string | null;
  asin_dostawcy?: string | null;
  lpn?: string | null;
  unit_retail?: number | null;
  wartosc?: number | null;
  department_dostawcy?: string | null;
  gl_description?: string | null;
  category_code?: string | null;
  category_dostawcy?: string | null;
  sub_cat_code?: string | null;
  sub_category_dostawcy?: string | null;

  // Pola zidentyfikowane z poprzedniego zrzutu (mogą nadal występować)
  ilosc?: number | null;
  cena_eur?: number | null;
  vat?: number | string | null;
  grupa?: string | null;
  url_dostawcy?: string | null;

  // Pozostałe pola
  nazwa_produktu_dostawcy?: string | null;
  waga_dostawcy?: string | number | null;
  wymiary_dostawcy?: string | null;
  raw_supplier_row?: Record<string, any> | null;
}
