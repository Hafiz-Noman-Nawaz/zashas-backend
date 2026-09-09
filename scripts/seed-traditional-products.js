/**
 * Seed 10 Authentic Pakistani Traditional Couture Products through the CMS API
 * 
 * Usage:
 *   node scripts/seed-traditional-products.js
 *   node scripts/seed-traditional-products.js --api https://zashas-backend.onrender.com/api
 */

const API_BASE = process.env.API_BASE_URL || "https://zashas-backend.onrender.com/api";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "nawaznoman7766@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "@Noman668626";

const CATEGORIES_DATA = [
  {
    name: "Unstitched Luxury",
    slug: "unstitched-luxury",
    description: "Premium unstitched 3-piece festive lawns, pure raw silks, and regal velvet ensembles.",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&q=80",
    isVisible: true,
    sortOrder: 1
  },
  {
    name: "Pret & Formals",
    slug: "pret-formals",
    description: "Artisanal ready-to-wear tailored kalidars, angrakhas, and contemporary festive kurtas.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1000&q=80",
    isVisible: true,
    sortOrder: 2
  },
  {
    name: "Bridal & Haute Couture",
    slug: "bridal-couture",
    description: "Handcrafted heirloom masterworks embellished with traditional zardozi, dabka, and gotta patti.",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1000&q=80",
    isVisible: true,
    sortOrder: 3
  },
  {
    name: "Heritage Shawls & Dupattas",
    slug: "heritage-shawls",
    description: "Woven Banarasi brocades, hand-printed kashmiri pashmina, and embroidered organza wraps.",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1000&q=80",
    isVisible: true,
    sortOrder: 4
  }
];

const PRODUCTS_DATA = [
  {
    title: "Zarrin — Royal Crimson Zardozi Bridal Peshwas",
    categorySlug: "bridal-couture",
    subcategory: "Bridal Peshwas",
    description:
      "A breathtaking 60-kali bridal peshwas rendered in deep carmine raw silk. Heavily embellished with hand-hammered antique gold zardozi, marodi needlework, French knots, and dusted micro-pearls along the flare. Paired with a gossamer tissue organza veil with scalloped matha patti borders.",
    price: 85000,
    discountedPrice: 76500,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=85",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=85"
    ],
    fabric: "Pure Italian Raw Silk & Silk Organza Veil",
    colors: ["Crimson Red", "Antique Gold", "Ruby"],
    stock: 4,
    tags: ["Bridal", "Handcrafted", "Peshwas", "Zardozi", "Festive"],
    isFeatured: true,
    isOnSale: true,
    isNewArrival: true,
    isVisible: true
  },
  {
    title: "Firouzeh — Emerald Hand-Embroidered Velvet Angrakha",
    categorySlug: "pret-formals",
    subcategory: "Festive Angrakha",
    description:
      "Crafted from plush micro-velvet in imperial emerald green. Detailed with traditional asymmetrical angrakha neckline adorned with tilla dori work, sequins, and metallic bullion wire. Finished with handmade silk tassel dori closures and crushed silk culottes.",
    price: 42000,
    discountedPrice: 38500,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&q=85",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1200&q=85"
    ],
    fabric: "Premium Silk Micro-Velvet with Crushed Silk Bottom",
    colors: ["Emerald Green", "Antique Bronze"],
    stock: 8,
    tags: ["Velvet", "Pret", "Formal", "Winter Festive", "Angrakha"],
    isFeatured: true,
    isOnSale: false,
    isNewArrival: true,
    isVisible: true
  },
  {
    title: "Gul-e-Noor — Champagne & Rose Gold Organza Formal",
    categorySlug: "pret-formals",
    subcategory: "3-Piece Stitched Formal",
    description:
      "A serene champagne organza silhouette embroidered with delicate rose-gold resham and micro-pearls. The shirt features an intricate botanical lattice pattern across the front and flared sleeves. Accompanied by a 4-sided embroidered dupatta and dyed raw silk cigarette pants.",
    price: 32500,
    discountedPrice: 29500,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&q=85",
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1200&q=85"
    ],
    fabric: "Pure Sheer Organza with Viscose Raw Silk Lining",
    colors: ["Champagne", "Rose Gold", "Soft Ivory"],
    stock: 10,
    tags: ["Formal", "Luxury", "Pastel", "Day Wedding", "Pret"],
    isFeatured: true,
    isOnSale: true,
    isNewArrival: false,
    isVisible: true
  },
  {
    title: "Meher — Mustard Ochre Banarasi Brocade Kalidar",
    categorySlug: "unstitched-luxury",
    subcategory: "3-Piece Festive Unstitched",
    description:
      "Warm mustard ochre pure raw silk unstitched 3-piece suit. Showcases handcrafted neckline motifs with gota patti, dabka wire, and cut-dana work. Includes a rich Banarasi zari jacquard dupatta with hand-twisted tassels and matching dyed silk trousers.",
    price: 24500,
    discountedPrice: 22000,
    images: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1200&q=85",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=85"
    ],
    fabric: "Pure Katan Silk & Handloom Banarasi Brocade",
    colors: ["Mustard Ochre", "Rust", "Gilded Gold"],
    stock: 12,
    tags: ["Unstitched", "Festive Lawn", "Gota Patti", "Mehndi", "Haldi"],
    isFeatured: true,
    isOnSale: false,
    isNewArrival: true,
    isVisible: true
  },
  {
    title: "Sultana — Midnight Navy Velvet Shawl & Raw Silk Suit",
    categorySlug: "heritage-shawls",
    subcategory: "Heirloom Shawl Set",
    description:
      "An archival statement piece. Plush midnight navy velvet shawl adorned with opulent 4-sided zardozi cutwork borders and scattered sitara spray. Paired with a tonal deep navy pure raw silk straight shirt and tailored trousers.",
    price: 49500,
    discountedPrice: 45000,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=85",
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&q=85"
    ],
    fabric: "Midnight Velvet with Pure Raw Silk",
    colors: ["Midnight Blue", "Tilla Gold", "Deep Indigo"],
    stock: 6,
    tags: ["Shawl", "Heirloom", "Winter Wedding", "Velvet", "Statement"],
    isFeatured: true,
    isOnSale: true,
    isNewArrival: true,
    isVisible: true
  },
  {
    title: "Parisa — Powder Mint Chanderi Festive Ensemble",
    categorySlug: "unstitched-luxury",
    subcategory: "Unstitched 3-Piece",
    description:
      "Ethereal powder mint green woven Chanderi silk adorned with shimmering sequin borders and resham floral vines. Comes with an organza jacquard dupatta adorned with delicate laser-cut scallops and premium slub cotton pants.",
    price: 19500,
    discountedPrice: 17500,
    images: [
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1200&q=85",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&q=85"
    ],
    fabric: "Hand-spun Chanderi Silk & Silk Organza",
    colors: ["Powder Mint", "Sage Green", "Silver"],
    stock: 14,
    tags: ["Unstitched", "Summer Festive", "Chanderi", "Pastel"],
    isFeatured: false,
    isOnSale: false,
    isNewArrival: true,
    isVisible: true
  },
  {
    title: "Roohi — Dusty Rose Hand-Block Printed Silk Kurti",
    categorySlug: "pret-formals",
    subcategory: "Pret Kurta",
    description:
      "Artisanally crafted dusty rose raw silk kurta with traditional hand-carved wooden block prints in antique metallic gold. Embellished neckline with mirror-work detailing and mother-of-pearl button accents along the placket.",
    price: 14500,
    discountedPrice: 12900,
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1200&q=85",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=1200&q=85"
    ],
    fabric: "100% Pure Silk with Hand-Block Printing",
    colors: ["Dusty Rose", "Blush Pink", "Gold"],
    stock: 16,
    tags: ["Pret", "Block Print", "Mirror Work", "Casual Luxury", "Kurta"],
    isFeatured: false,
    isOnSale: true,
    isNewArrival: false,
    isVisible: true
  },
  {
    title: "Shahzadi — Plum Velvet Farshi Gharara Ensemble",
    categorySlug: "bridal-couture",
    subcategory: "Farshi Gharara",
    description:
      "A grand royal silhouette reminiscent of Mughal court regalia. Rich plum velvet short kurti accented with mukaish and marodi needlework. Accompanied by a dramatic flared farshi gharara in brocade with antique tilla trims.",
    price: 68000,
    discountedPrice: 62000,
    images: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1200&q=85",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=85"
    ],
    fabric: "Micro-Velvet & Heavy Banarasi Zari Brocade",
    colors: ["Royal Plum", "Antique Bronze", "Gilded Copper"],
    stock: 5,
    tags: ["Bridal", "Gharara", "Mughal Heritage", "Velvet", "Couture"],
    isFeatured: true,
    isOnSale: false,
    isNewArrival: true,
    isVisible: true
  },
  {
    title: "Noor-e-Jahan — Ivory & Gold Cutwork Organza Dupatta",
    categorySlug: "heritage-shawls",
    subcategory: "Luxury Dupatta",
    description:
      "An exquisite heirloom dupatta rendered in sheer ivory silk organza. All 4 borders feature magnificent architectural jali cutwork embroidered in glistening tilla wire and seed pearls. The perfect celebratory drape for bridals and festive formals.",
    price: 18500,
    discountedPrice: 16500,
    images: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1200&q=85",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=85"
    ],
    fabric: "Pure Silk Organza with Hand-Tilla Cutwork",
    colors: ["Ivory White", "Pure Gold"],
    stock: 9,
    tags: ["Dupatta", "Heirloom", "Cutwork", "Ivory", "Wedding Accessory"],
    isFeatured: false,
    isOnSale: true,
    isNewArrival: false,
    isVisible: true
  },
  {
    title: "Afreen — Terracotta Rust Embroidered Silk Peshwas",
    categorySlug: "bridal-couture",
    subcategory: "Festive Peshwas",
    description:
      "Rich earthy terracotta rust pure raw silk peshwas featuring heavy marodi embroidery across the bodice and tiered ghair. Bordered with contrasting mustard raw silk appliqués and accompanied by a mukaish-dotted chiffon dupatta.",
    price: 52000,
    discountedPrice: 47500,
    images: [
      "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=1200&q=85",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&q=85"
    ],
    fabric: "Pure Raw Silk with Pure Chiffon Dupatta",
    colors: ["Terracotta Rust", "Mustard", "Copper Tilla"],
    stock: 7,
    tags: ["Peshwas", "Bespoke", "Rust", "Formal", "Handcrafted"],
    isFeatured: true,
    isOnSale: false,
    isNewArrival: true,
    isVisible: true
  }
];

async function main() {
  console.log("==================================================");
  console.log("🌸 ZASHA'S COLLECTION — CMS MOCK DATA SEEDER 🌸");
  console.log(`Target API: ${API_BASE}`);
  console.log("==================================================");

  // 1. Authenticate with CMS
  console.log(`\n🔑 Authenticating as ${ADMIN_EMAIL}...`);
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });

  const loginData = await loginRes.json();
  if (!loginData.success || !loginData.data?.accessToken) {
    console.error("❌ Authentication failed:", loginData);
    process.exit(1);
  }

  const token = loginData.data.accessToken;
  console.log("✅ Authenticated successfully! Bearer token obtained.");

  // 2. Fetch or create categories
  console.log("\n📁 Setting up categories...");
  const catListRes = await fetch(`${API_BASE}/categories?limit=50`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const catListData = await catListRes.json();
  const existingCategories = catListData.data || [];

  const categoryMap = new Map(); // slug -> id & name
  existingCategories.forEach((c) => {
    categoryMap.set(c.slug, c);
  });

  for (const cat of CATEGORIES_DATA) {
    if (!categoryMap.has(cat.slug)) {
      console.log(`  ➕ Creating category: ${cat.name} (${cat.slug})...`);
      const createRes = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cat)
      });
      const createdData = await createRes.json();
      if (createdData.success && createdData.data) {
        categoryMap.set(cat.slug, createdData.data);
        console.log(`     ✅ Created: ${createdData.data.name} [ID: ${createdData.data._id || createdData.data.id}]`);
      } else {
        console.warn(`     ⚠️ Error creating category ${cat.name}:`, createdData.message || createdData);
      }
    } else {
      console.log(`  ℹ️ Category exists: ${cat.name} [ID: ${categoryMap.get(cat.slug)._id || categoryMap.get(cat.slug).id}]`);
    }
  }

  // 3. Check existing products to prevent duplicates
  console.log("\n👗 Inspecting existing products in CMS...");
  const prodListRes = await fetch(`${API_BASE}/products?limit=100`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const prodListData = await prodListRes.json();
  const existingProducts = prodListData.data || [];
  const existingTitles = new Set(existingProducts.map((p) => p.title.toLowerCase().trim()));

  console.log(`Found ${existingProducts.length} existing products in system.`);

  // 4. Seed 10 Pakistani traditional products
  console.log("\n✨ Seeding 10 Authentic Pakistani Traditional Couture Products...");
  let createdCount = 0;

  for (let i = 0; i < PRODUCTS_DATA.length; i++) {
    const item = PRODUCTS_DATA[i];
    const catObj = categoryMap.get(item.categorySlug);

    if (existingTitles.has(item.title.toLowerCase().trim())) {
      console.log(`  ⏭️  [${i + 1}/10] Skipping already existing: "${item.title}"`);
      continue;
    }

    const payload = {
      title: item.title,
      category: catObj ? catObj.name : "Unstitched Luxury",
      categoryId: catObj ? (catObj._id || catObj.id) : undefined,
      subcategory: item.subcategory,
      description: item.description,
      price: item.price,
      discountedPrice: item.discountedPrice,
      images: item.images,
      fabric: item.fabric,
      colors: item.colors,
      stock: item.stock,
      tags: item.tags,
      isFeatured: item.isFeatured,
      isOnSale: item.isOnSale,
      isNewArrival: item.isNewArrival,
      isVisible: item.isVisible
    };

    const prodRes = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const prodData = await prodRes.json();
    if (prodData.success && prodData.data) {
      createdCount++;
      console.log(`  🎉 [${i + 1}/10] Created: "${item.title}" — PKR ${item.price.toLocaleString()}`);
    } else {
      console.error(`  ❌ [${i + 1}/10] Failed: "${item.title}":`, prodData.message || prodData);
    }
  }

  console.log("\n==================================================");
  console.log(`✅ COMPLETE! Successfully added ${createdCount} new couture products.`);
  console.log("You can now view and edit them in the CMS dashboard");
  console.log("and explore the interactive storefront with all animations!");
  console.log("==================================================\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
