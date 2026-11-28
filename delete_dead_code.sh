#!/bin/sh
# حذف فایل‌های بلااستفاده‌ی فرانت (هیچ‌جا import نشده‌اند). از ریشه‌ی پروژه اجرا کن.
set -e
for f in \
  hooks/use-mobile.jsx \
  lib/hooks/useGenerateDesignImage.ts \
  components/products/BulkPricingCalculator.tsx \
  components/products/ProductAIDesigner.jsx \
  components/customize/AIDesignIdeas.jsx \
  components/customize/ConfigPanel.jsx \
  components/customize/CupPreview.jsx \
  components/customize/DesignTabs.jsx \
  components/customize/ExportSummary.jsx \
  components/customize/RecommendedProducts.jsx \
  components/customize/ReviewsSection.jsx
do
  rm -f "$f"
done
rmdir components/customize 2>/dev/null || true
echo "done"
