import { api } from "../client";

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}
export interface AttributeValue {
  id: number;
  attribute: string;
  attribute_slug: string;
  value: string;
}
export interface PriceTier {
  min_quantity: number;
  max_quantity: number | null;
  unit_price: string;
}
export type StockStatus = "in_stock" | "out_of_stock" | "coming_soon";

export interface RelatedVariant {
  id: number;
  sku: string;
  attribute_values: AttributeValue[];
  images: ProductImage[];
  product_name: string;
  product_slug: string;
  price_tiers: PriceTier[];
}

export interface Variant {
  id: number;
  sku: string;
  images: ProductImage[];
  attribute_values: AttributeValue[];
  stock_status: StockStatus;
  available_from: string | null;
  price_tiers: PriceTier[];
  related_variants: RelatedVariant[];
  created_at: string;
  is_designable: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  category_slug: string;
  images: ProductImage[];
  variants: Variant[];
  is_designable: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number | null;
  is_accessory: boolean;
  description: string;
  image: string | null;
}

export interface TopSellingVariant {
  id: number;
  sku: string;
  images: ProductImage[];
  attribute_values: AttributeValue[];
  stock_status: StockStatus;
  available_from: string | null;
  price_tiers: PriceTier[];
  related_variants?: RelatedVariant[];
  created_at: string;
  is_designable: boolean;
  product_name: string;
  product_slug: string;
}

export function getVariantImage(variant: Variant): string | null {
  const primary = variant.images.find((i) => i.is_primary) || variant.images[0];
  return primary ? primary.image : null;
}

export const catalogApi = {
  categories: () => api.get<Category[]>("/catalog/categories/"),
  products: (categorySlug?: string) =>
    api.get<Product[]>(
      `/catalog/products/${categorySlug ? `?category=${categorySlug}` : ""}`,
    ),
  product: (slug: string) => api.get<Product>(`/catalog/products/${slug}/`),
  topSellingVariants: () =>
    api.get<TopSellingVariant[]>("/catalog/variants/top-selling/"),
  productCards: (params?: Record<string, string>) => {
    const clean = Object.fromEntries(
      Object.entries(params ?? {}).filter(([, v]) => v),
    );
    const qs = new URLSearchParams(clean).toString();
    return api.get<ProductCardData[]>(
      `/catalog/product-cards/${qs ? `?${qs}` : ""}`,
    );
  },
};

export function getPrimaryImage(product: Product): string | null {
  const primary = product.images.find((i) => i.is_primary) || product.images[0];
  return primary ? primary.image : null;
}

export function getStartingPrice(product: Product): number | null {
  const prices = product.variants.flatMap((v) =>
    v.price_tiers.map((t) => parseFloat(t.unit_price)),
  );
  return prices.length ? Math.min(...prices) : null;
}

export interface AttributeGroup {
  slug: string;
  label: string;
  values: string[];
}

export function getAttributeGroups(
  product: Product,
  selected: Record<string, string> = {},
): AttributeGroup[] {
  const labels: Record<string, string> = {};
  const allSlugs = new Set<string>();
  product.variants.forEach((v) =>
    v.attribute_values.forEach((av) => {
      allSlugs.add(av.attribute_slug);
      labels[av.attribute_slug] = av.attribute;
    }),
  );

  return Array.from(allSlugs).map((slug) => {
    const valueSet = new Set<string>();
    product.variants.forEach((v) => {
      const matchesOthers = Object.entries(selected).every(
        ([otherSlug, otherValue]) =>
          otherSlug === slug ||
          v.attribute_values.some(
            (av) => av.attribute_slug === otherSlug && av.value === otherValue,
          ),
      );
      if (!matchesOthers) return;
      const av = v.attribute_values.find((a) => a.attribute_slug === slug);
      if (av) valueSet.add(av.value);
    });
    return { slug, label: labels[slug], values: Array.from(valueSet) };
  });
}

export function getPairwiseReachableValues(
  product: Product,
  selected: Record<string, string>,
): Record<string, Set<string>> {
  const result: Record<string, Set<string>> = {};
  const allSlugs = new Set<string>();
  product.variants.forEach((v) =>
    v.attribute_values.forEach((av) => allSlugs.add(av.attribute_slug)),
  );

  allSlugs.forEach((slug) => {
    const otherSelected = Object.entries(selected).filter(([s]) => s !== slug);
    const allValuesForSlug = new Set<string>();
    product.variants.forEach((v) => {
      const av = v.attribute_values.find((a) => a.attribute_slug === slug);
      if (av) allValuesForSlug.add(av.value);
    });

    const reachable = new Set<string>();
    allValuesForSlug.forEach((val) => {
      const passesAll = otherSelected.every(([otherSlug, otherValue]) =>
        product.variants.some(
          (v) =>
            v.attribute_values.some((a) => a.attribute_slug === slug && a.value === val) &&
            v.attribute_values.some((a) => a.attribute_slug === otherSlug && a.value === otherValue),
        ),
      );
      if (passesAll) reachable.add(val);
    });
    result[slug] = reachable;
  });
  return result;
}

export function getBlockingAttributes(
  product: Product,
  selected: Record<string, string>,
  slug: string,
  value: string,
): { slug: string; label: string; value: string }[] {
  const others = Object.entries(selected).filter(([s]) => s !== slug);
  const labelOf = (s: string) =>
    product.variants
      .flatMap((v) => v.attribute_values)
      .find((a) => a.attribute_slug === s)?.attribute ?? s;

  const combinationExists = (subset: [string, string][]) =>
    product.variants.some(
      (v) =>
        v.attribute_values.some((a) => a.attribute_slug === slug && a.value === value) &&
        subset.every(([s, val]) =>
          v.attribute_values.some((a) => a.attribute_slug === s && a.value === val),
        ),
    );

  const kCombinations = (arr: [string, string][], k: number): [string, string][][] => {
    if (k === 0) return [[]];
    if (arr.length < k) return [];
    const [first, ...rest] = arr;
    const withFirst = kCombinations(rest, k - 1).map((c) => [first, ...c]);
    const withoutFirst = kCombinations(rest, k);
    return [...withFirst, ...withoutFirst];
  };

  for (let size = 1; size <= others.length; size++) {
    for (const combo of kCombinations(others, size)) {
      if (!combinationExists(combo)) {
        return combo.map(([s, val]) => ({ slug: s, label: labelOf(s), value: val }));
      }
    }
  }
  return [];
}

export function findVariant(
  product: Product,
  selected: Record<string, string>,
): Variant | undefined {
  return product.variants.find((v) => {
    if (v.attribute_values.length !== Object.keys(selected).length)
      return false;
    return v.attribute_values.every(
      (av) => selected[av.attribute_slug] === av.value,
    );
  });
}

export function getUnitPrice(variant: Variant, qty: number): number | null {
  const tier = variant.price_tiers.find(
    (t) =>
      qty >= t.min_quantity &&
      (t.max_quantity === null || qty <= t.max_quantity),
  );
  return tier ? parseFloat(tier.unit_price) : null;
}

export function getProductListAttributeGroups(
  products: Product[],
): AttributeGroup[] {
  const groups: Record<string, AttributeGroup & { valueSet: Set<string> }> = {};
  products.forEach((p) => {
    p.variants.forEach((v) => {
      v.attribute_values.forEach((av) => {
        if (!groups[av.attribute_slug]) {
          groups[av.attribute_slug] = {
            slug: av.attribute_slug,
            label: av.attribute,
            values: [],
            valueSet: new Set(),
          };
        }
        groups[av.attribute_slug].valueSet.add(av.value);
      });
    });
  });
  return Object.values(groups).map((g) => ({
    slug: g.slug,
    label: g.label,
    values: Array.from(g.valueSet),
  }));
}

export function productMatchesAttributes(
  product: Product,
  filters: Record<string, string>,
): boolean {
  const active = Object.entries(filters).filter(([, v]) => v);
  if (active.length === 0) return true;
  return product.variants.some((v) =>
    active.every(([slug, value]) =>
      v.attribute_values.some(
        (av) => av.attribute_slug === slug && av.value === value,
      ),
    ),
  );
}
export interface VariantListItem {
  product: Product;
  variant: Variant;
}

export function flattenToVariants(products: Product[]): VariantListItem[] {
  return products.flatMap((product) =>
    product.variants.map((variant) => ({ product, variant })),
  );
}

export function getRelatedVariantImage(variant: RelatedVariant): string | null {
  const primary = variant.images.find((i) => i.is_primary) || variant.images[0];
  return primary ? primary.image : null;
}
export function isNewVariant(variant: Variant, days = 5): boolean {
  const created = new Date(variant.created_at).getTime();
  const diffDays = (Date.now() - created) / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}

export function getRelatedVariantStartingPrice(
  variant: RelatedVariant,
): number | null {
  const prices = variant.price_tiers.map((t) => parseFloat(t.unit_price));
  return prices.length ? Math.min(...prices) : null;
}

export function getVariantHoverImage(variant: Variant): string | null {
  const primary = variant.images.find((i) => i.is_primary) || variant.images[0];
  const sorted = [...variant.images].sort((a, b) => a.order - b.order);
  const secondary = sorted.find((i) => i !== primary);
  return secondary ? secondary.image : null;
}

export function topSellingToVariantItems(
  items: TopSellingVariant[],
): VariantListItem[] {
  return items.map((v) => ({
    product: {
      id: v.id,
      name: v.product_name,
      slug: v.product_slug,
      description: "",
      category: "",
      category_slug: "",
      images: [],
      variants: [],
      is_designable: v.is_designable,
    },
    variant: {
      id: v.id,
      sku: v.sku,
      images: v.images,
      attribute_values: v.attribute_values,
      stock_status: v.stock_status,
      available_from: v.available_from,
      price_tiers: v.price_tiers,
      related_variants: v.related_variants ?? [],
      created_at: v.created_at,
      is_designable: v.is_designable,
    },
  }));
}
export interface ProductCardOption {
  slug: string;
  label: string;
  values: string[];
}
export interface ProductCardData {
  id: number;
  name: string;
  link: string;
  primary_image: string | null;
  hover_image: string | null;
  options: ProductCardOption[];
  filter_data: Record<string, string>;
  price_from: string;
  price_to: string;
  category: number;
}
export function getProductCardAttributeGroups(
  products: ProductCardData[],
): AttributeGroup[] {
  const groups: Record<string, AttributeGroup & { valueSet: Set<string> }> = {};
  products.forEach((p) => {
    p.options.forEach((opt) => {
      if (!groups[opt.slug]) {
        groups[opt.slug] = {
          slug: opt.slug,
          label: opt.label,
          values: [],
          valueSet: new Set(),
        };
      }
      opt.values.forEach((v) => groups[opt.slug].valueSet.add(v));
    });
  });
  return Object.values(groups).map((g) => ({
    slug: g.slug,
    label: g.label,
    values: Array.from(g.valueSet),
  }));
}