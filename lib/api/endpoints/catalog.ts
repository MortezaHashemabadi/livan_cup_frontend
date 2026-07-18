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

export function getAttributeGroups(product: Product): AttributeGroup[] {
  const groups: Record<string, AttributeGroup & { valueSet: Set<string> }> = {};
  product.variants.forEach((v) => {
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
  return Object.values(groups).map((g) => ({
    slug: g.slug,
    label: g.label,
    values: Array.from(g.valueSet),
  }));
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