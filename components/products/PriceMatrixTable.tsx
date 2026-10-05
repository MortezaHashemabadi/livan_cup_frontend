"use client";
import type {
  PriceTableAxes,
  VariantListItem,
} from "@/lib/api/endpoints/catalog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function getAttrValue(item: VariantListItem, slug: string): string {
  return (
    item.variant.attribute_values.find((av) => av.attribute_slug === slug)
      ?.value ?? ""
  );
}

function getAttrLabel(items: VariantListItem[], slug: string): string {
  for (const item of items) {
    const av = item.variant.attribute_values.find(
      (a) => a.attribute_slug === slug,
    );
    if (av) return av.attribute;
  }
  return slug;
}

interface ColNode {
  value: string;
  children: ColNode[];
}

function buildColTree(
  items: VariantListItem[],
  columns: string[],
  level: number,
): ColNode[] {
  if (level >= columns.length) return [];
  const slug = columns[level];
  const seen: string[] = [];
  items.forEach((item) => {
    const v = getAttrValue(item, slug);
    if (!seen.includes(v)) seen.push(v);
  });
  return seen.map((value) => {
    const subset = items.filter((item) => getAttrValue(item, slug) === value);
    return { value, children: buildColTree(subset, columns, level + 1) };
  });
}

function flattenLeaves(nodes: ColNode[], path: string[] = []): string[][] {
  if (nodes.length === 0) return [path];
  return nodes.flatMap((n) => flattenLeaves(n.children, [...path, n.value]));
}

function countLeaves(node: ColNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, c) => sum + countLeaves(c), 0);
}

export default function PriceMatrixTable({
  items,
  axes,
}: {
  items: VariantListItem[];
  axes: PriceTableAxes;
}) {
  const { rows, columns } = axes;

  const rowKeys: string[] = [];
  const rowCombos: Record<string, string[]> = {};
  items.forEach((item) => {
    const combo = rows.map((slug) => getAttrValue(item, slug));
    const key = combo.join("|");
    if (!(key in rowCombos)) {
      rowKeys.push(key);
      rowCombos[key] = combo;
    }
  });

  const colTree = buildColTree(items, columns, 0);
  const leafPaths = flattenLeaves(colTree);
  const headerDepth = columns.length;
  const rowLabel = rows.map((slug) => getAttrLabel(items, slug)).join(" / ");

  const findItem = (rowKey: string, colPath: string[]) =>
    items.find((item) => {
      const rowMatch = rows.every(
        (slug, i) => getAttrValue(item, slug) === rowCombos[rowKey][i],
      );
      const colMatch = columns.every(
        (slug, i) => getAttrValue(item, slug) === colPath[i],
      );
      return rowMatch && colMatch;
    });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          {headerDepth > 1 && (
            <TableRow>
              <TableHead
                rowSpan={headerDepth}
                className="text-right align-bottom"
              >
                {rowLabel}
              </TableHead>
              {colTree.map((node) => (
                <TableHead
                  key={node.value}
                  colSpan={countLeaves(node)}
                  className="text-center border-s"
                >
                  {node.value}
                </TableHead>
              ))}
            </TableRow>
          )}
          <TableRow>
            {headerDepth <= 1 && (
              <TableHead className="text-right">{rowLabel}</TableHead>
            )}
            {leafPaths.map((path) => (
              <TableHead key={path.join("|")} className="text-center">
                {path[path.length - 1]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rowKeys.map((rowKey) => (
            <TableRow key={rowKey}>
              <TableCell className="font-medium whitespace-nowrap">
                {rowCombos[rowKey].join(" × ")}
              </TableCell>
              {leafPaths.map((path) => {
                const match = findItem(rowKey, path);
                const price = match?.variant.price_tiers.length
                  ? Math.min(
                      ...match.variant.price_tiers.map((t) =>
                        parseFloat(t.unit_price),
                      ),
                    )
                  : null;
                return (
                  <TableCell key={path.join("|")} className="text-center">
                    {price !== null ? (
                      price.toLocaleString("fa-IR")
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
