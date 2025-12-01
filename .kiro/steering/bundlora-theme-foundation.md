---
inclusion: manual
---

# Bundlora Demo Store Theme Foundation

## Overview
This Dawn theme has been refactored as a demonstration environment for the Bundlora app, showcasing tiered pricing, custom discounts, and visual customization capabilities.

## Phase 2 Status: Data Model Implementation

### Metafield Schema (config/metafields-schema.json)
Complete schema definitions for:
- Product metafields (bundlora namespace, specs namespace, custom namespace)
- Variant metafields (bundle pricing, color swatches)
- Collection metafields (bundle associations)

### Metaobject Definitions
- buying_guide: Detailed buying guides
- comparison_chart: Product comparison tables
- faq_section: FAQ containers
- faq_item: Individual Q&A pairs
- bundle_config: Bundle builder configurations
- tiered_discount: Tiered discount rules

### Admin Setup Required
See `.kiro/steering/bundlora-admin-setup-guide.md` for:
- Test data population instructions
- Metafield creation steps
- Bundlora app configuration
- Bundle builder setup (4 types)

## Color Scheme
- **Primary (scheme-1)**: White background (#FFFFFF), Indigo buttons (#4F46E5)
- **Secondary (scheme-2)**: Light gray background (#F8F9FC)
- **Dark (scheme-3)**: Dark navy background (#1A1A2E)
- **Accent (scheme-4)**: Indigo background (#4F46E5)
- **Success (scheme-5)**: Emerald green (#10B981)

## Typography
- **Headings**: Work Sans Semi-Bold (600)
- **Body**: Work Sans Regular (400)
- **Scale**: 110% headings, 100% body

## Key Integration Points

### Product Template
- Supports variant picker with swatches
- Pickup availability enabled
- Volume pricing ready
- Collapsible tabs for shipping/returns

### Cart Template
- Cart drawer enabled
- Discount display ready
- Cart recommendations section
- Supports automatic discount codes

### Collection/Search
- Faceted filtering enabled (horizontal)
- Quick add enabled
- Rating display ready

## Custom Snippets for Bundlora

### bundle-discount-badge.liquid
Displays tiered pricing badges with percentage or fixed discounts.

### tiered-pricing-table.liquid
Shows volume/quantity-based pricing tiers with active tier highlighting.

### cart-discount-summary.liquid
Displays applied discounts in cart with total savings calculation.

## CSS Files

### component-bundle.css
Bundle builder UI components, product selection cards, summary displays.

### bundlora-enhancements.css
Accessibility improvements, performance optimizations, mobile enhancements.

## Performance Targets
- Lighthouse Performance: 60+ (minimum)
- Lighthouse Accessibility: 90+ (target)
- WCAG 2.1 AA compliant contrast ratios

## Accessibility Features
- Skip link improvements
- Focus-visible states
- Reduced motion support
- High contrast mode support
- Proper ARIA labels on all interactive elements
