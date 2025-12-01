---
inclusion: manual
---

# Bundlora Demo Store - Admin Setup Guide

This guide documents the required Shopify Admin configurations to complete the demo store setup. These tasks cannot be performed through theme files and must be done in the Shopify Admin interface.

## Task 1: Populate Demo Store with Test Data

### Option A: Use Simple Sample Data App
1. Go to Shopify Admin > Apps
2. Search for "Simple Sample Data" in the App Store
3. Install the app
4. Select "Clothes/Accessories" theme for multi-variant products
5. Generate: Products, Collections, Customers, Orders

### Option B: Use Shopify CLI (Development Stores)
```bash
shopify theme dev --store your-store.myshopify.com
# Test data is auto-generated for development stores
```

### Recommended Product Structure
For effective Bundlora demonstration, ensure products include:

**Base Products (Snowboard variants example):**
- Dawn Snowboard (multiple sizes: 154cm, 158cm, 162cm)
- Electric Snowboard (multiple colors: Blue, Red, Black)
- Ice Snowboard (multiple sizes and colors)
- Powder Snowboard
- Sunset Snowboard

**Accessory Products:**
- Snowboard Bindings (S, M, L, XL)
- Snowboard Boots (sizes 7-13)
- Snowboard Bag
- Wax Kit
- Helmet (S, M, L)
- Goggles (multiple lens colors)

---

## Task 2: Configure Metafields

### Navigate to Settings > Custom Data > Metafields

#### Product Metafields
Create the following metafield definitions:

| Namespace | Key | Type | Description |
|-----------|-----|------|-------------|
| bundlora | bundle_eligible | Boolean | Can be included in bundles |
| bundlora | bundle_category | Single line text | base, accessory, upgrade, add-on |
| bundlora | max_bundle_quantity | Integer | Max qty in bundle (1-100) |
| specs | materials | Single line text | Product materials |
| specs | dimensions | Single line text | L x W x H |
| specs | weight | Weight | Product weight |
| specs | warranty | Single line text | Warranty info |
| specs | features | List (text) | Key features list |
| custom | short_description | Multi-line text | Brief description (max 200 chars) |
| custom | usp_highlights | List (text) | Unique selling points |

#### Variant Metafields
| Namespace | Key | Type | Description |
|-----------|-----|------|-------------|
| bundlora | bundle_price_override | Money | Special bundle price |
| specs | color_hex | Single line text | Hex color for swatches |

#### Collection Metafields
| Namespace | Key | Type | Description |
|-----------|-----|------|-------------|
| bundlora | bundle_collection | Boolean | Used for bundle products |
| bundlora | bundle_builder_id | Single line text | Associated builder ID |

---

## Task 3: Configure Metaobjects

### Navigate to Settings > Custom Data > Metaobjects

#### Create Metaobject: FAQ Item
- Type: `faq_item`
- Fields:
  - question (Single line text, required)
  - answer (Rich text, required)
  - category (Single line text)

#### Create Metaobject: FAQ Section
- Type: `faq_section`
- Fields:
  - title (Single line text, required)
  - questions (List of faq_item references, required)

#### Create Metaobject: Comparison Chart
- Type: `comparison_chart`
- Fields:
  - title (Single line text, required)
  - description (Multi-line text)
  - products (List of product references, 2-5 items)
  - comparison_attributes (List of text)
  - highlight_winner (Boolean)

#### Create Metaobject: Buying Guide
- Type: `buying_guide`
- Fields:
  - title (Single line text, required)
  - introduction (Multi-line text, required)
  - sections (List of mixed references)
  - featured_products (List of product references)
  - related_collections (List of collection references)

---

## Task 4: Configure Bundlora App

### Install Bundlora App
1. Go to Shopify Admin > Apps
2. Install Bundlora from the App Store
3. Complete initial setup wizard

### Create Bundle Builder 1: Quick Bundle (Quantity-Based Tiered Discount)
**Name:** "Build Your Snowboard Kit"
**Type:** Quick Bundle
**Products:** All products from Snowboard collection
**Discount Configuration:**
- 2 items: 5% off
- 3 items: 10% off
- 4 items: 15% off
- 5+ items: 20% off

### Create Bundle Builder 2: Volume Discount (Amount-Based Tiered Discount)
**Name:** "Gear Up & Save"
**Type:** Volume Discount
**Products:** All accessories
**Discount Configuration:**
- $100+ spend: $10 off
- $200+ spend: $30 off
- $300+ spend: $60 off
- $500+ spend: $125 off (25%)

### Create Bundle Builder 3: Guided Bundle (Fixed Percentage)
**Name:** "Complete Snowboard Setup"
**Type:** Guided Bundle
**Steps:**
1. Choose your board (required)
2. Select bindings (required)
3. Pick boots (required)
4. Add accessories (optional)
**Discount:** 15% off entire bundle

### Create Bundle Builder 4: Mix & Match (Fixed Amount)
**Name:** "Accessory Bundle"
**Type:** Mix & Match
**Products:** Helmet, Goggles, Gloves, Bag
**Requirement:** Select any 3 items
**Discount:** $25 off

---

## Task 5: Populate Sample Content

### Create FAQ Entries
Navigate to Content > Metaobjects > FAQ Item

**Entry 1:**
- Question: "How do bundle discounts work?"
- Answer: "When you add qualifying products to your bundle, discounts are automatically applied at checkout. The more you add, the more you save!"

**Entry 2:**
- Question: "Can I customize my bundle?"
- Answer: "Absolutely! Our bundle builders let you mix and match products to create your perfect combination. Choose from our curated selections or build your own."

**Entry 3:**
- Question: "What's included in the Complete Snowboard Setup?"
- Answer: "The Complete Snowboard Setup includes a board, bindings, and boots of your choice, plus optional accessories. You'll save 15% on the entire bundle."

### Create Comparison Chart
Navigate to Content > Metaobjects > Comparison Chart

**Chart: Snowboard Comparison**
- Products: Dawn, Electric, Ice, Powder, Sunset
- Attributes: Skill Level, Terrain, Flex Rating, Length Options, Price

---

## Task 6: Configure Collections

### Create Bundle Collections
1. **"Bundle Eligible Products"** - All products with bundlora.bundle_eligible = true
2. **"Snowboard Bundles"** - Featured bundle landing page
3. **"Accessory Bundles"** - Accessory-focused bundles

### Set Collection Metafields
For each bundle collection, set:
- bundlora.bundle_collection = true
- bundlora.bundle_builder_id = [corresponding builder ID from Bundlora app]

---

## Verification Checklist

- [ ] Test data populated (products, collections, customers, orders)
- [ ] Product metafields created and populated
- [ ] Variant metafields created (color_hex for swatches)
- [ ] Collection metafields configured
- [ ] Metaobject definitions created
- [ ] FAQ content populated
- [ ] Comparison chart created
- [ ] Bundlora app installed
- [ ] 4 bundle builders configured
- [ ] Bundle collections created
- [ ] Test purchase completed with bundle discount applied
- [ ] Cart displays individual item discounts
- [ ] Cart displays total order discount

---

## Next Steps

Once admin configuration is complete:
1. Return to theme development
2. Implement bundle builder pages
3. Create custom sections for bundle display
4. Test discount display in cart
5. Optimize for mobile experience
