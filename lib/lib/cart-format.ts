export interface ItemSpecSource {
  selected_options?: { group_name: string; choice_name: string }[];
  fabric_color?: string;
  print_color?: string;
  top_color?: string;
  bottom_color?: string;
}

/** مشخصات تولید یک آیتم (آپشن‌ها و رنگ‌ها) به‌صورت لیست متن برای نمایش. */
export function formatItemSpecs(item: ItemSpecSource): string[] {
  const specs: string[] = [];
  (item.selected_options ?? []).forEach((o) =>
    specs.push(`${o.group_name}: ${o.choice_name}`),
  );
  if (item.top_color && item.bottom_color) {
    specs.push(`رنگ بالا: ${item.top_color}`, `رنگ پایین: ${item.bottom_color}`);
  } else if (item.fabric_color) {
    specs.push(`رنگ پارچه: ${item.fabric_color}`);
  }
  if (item.print_color) specs.push(`رنگ چاپ دلخواه: ${item.print_color}`);
  return specs;
}
