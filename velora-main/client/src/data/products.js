// src/data/products.js

// Helper function to create image path based on category and product slug
const getImagePath = (category, subcategory, productSlug) => {
  // Special case for health products which are flat
  if (category === 'Health And Skin Care') {
    return `/src/assets/products/health-and-skin-care/${productSlug}.jpg`;
  }
  if (category === 'Baby care') {
    return `/src/assets/products/baby-care/${productSlug}.jpg`;
  }
  if (category === 'Hair care') {
    return `/src/assets/products/hair-care/${productSlug}.jpg`;
  }
  if (category === 'Men') {
    if (subcategory === 'Grooming') {
      return `/src/assets/products/men/grooming/${productSlug}.jpg`;
    }
    return `/src/assets/products/men/fragrance/${productSlug}.jpg`;
  }
  if (category === 'Women') {
    if (subcategory === 'Makeup') {
      // For makeup, we need a third level, but we'll handle this in the product definition
      // to keep it simple, the product object will have the full path.
      // We'll define paths directly in the product list for clarity.
    }
    return `/src/assets/products/women/${subcategory.toLowerCase()}/${productSlug}.jpg`;
  }
  return `/src/assets/products/placeholder.jpg`; // Fallback
};

export const products = [
  // --- WOMEN / FRAGRANCE ---
  { id: 1, name: "OBSIDIAN ROSE", category: "Women", subcategory: "Fragrance", price: "$210", image: "/src/assets/products/women/fragrance/obsidian-rose.jpg", description: "A dark floral composition infused with smoked amber and black rose resin." },
  { id: 2, name: "SILK & ASH EAU DE PARFUM", category: "Women", subcategory: "Fragrance", price: "$240", image: "/src/assets/products/women/fragrance/silk-and-ash-eau-de-parfum.jpg", description: "Velvet musk layered with burned vanilla and silk orchid." },
  { id: 3, name: "SAFFRON NOIR CONCENTRATE", category: "Women", subcategory: "Fragrance", price: "$260", image: "/src/assets/products/women/fragrance/saffron-noir-concentrate.jpg", description: "An intense saffron accord wrapped in incense smoke." },
  { id: 4, name: "MERCURIAL JASMINE", category: "Women", subcategory: "Fragrance", price: "$195", image: "/src/assets/products/women/fragrance/mercurial-jasmine.jpg", description: "Cold jasmine with silver citrus and mineral woods." },
  { id: 5, name: "PETRICHOR BLOOM", category: "Women", subcategory: "Fragrance", price: "$225", image: "/src/assets/products/women/fragrance/petrichor-bloom.jpg", description: "Rain-soaked florals layered over deep moss and wet stone." },

  // --- WOMEN / MAKEUP / EYE ---
  { id: 6, name: "ARCHITECTURAL SYMMETRY PALETTE", category: "Women", subcategory: "Makeup", group: "Eye", price: "$85", image: "/src/assets/products/women/makeup/eye/architectural-symmetry-palette.jpg", description: "Ten-pan palette of matte, satin, and metallic shadows for structural depth." },
  { id: 7, name: "LIQUID GRAPHITE LINER", category: "Women", subcategory: "Makeup", group: "Eye", price: "$32", image: "/src/assets/products/women/makeup/eye/liquid-graphite-liner.jpg", description: "Ultra-fluid, carbon-black liner with a precision brush for architectural lines." },
  { id: 8, name: "FIBER EXTENSION POLYMER", category: "Women", subcategory: "Makeup", group: "Eye", price: "$28", image: "/src/assets/products/women/makeup/eye/fiber-extension-polymer.jpg", description: "Micro-fiber mascara for dramatic, buildable length and volume." },
  { id: 9, name: "PIGMENTED DUST CONCENTRATE", category: "Women", subcategory: "Makeup", group: "Eye", price: "$24", image: "/src/assets/products/women/makeup/eye/pigmented-dust-concentrate.jpg", description: "Loose mineral pigment for high-impact, shimmering effects." },

  // --- WOMEN / MAKEUP / FACE ---
  { id: 10, name: "SECOND-SKIN EMULSION", category: "Women", subcategory: "Makeup", group: "Face", price: "$56", image: "/src/assets/products/women/makeup/face/second-skin-emulsion.jpg", description: "Lightweight, breathable tinted moisturizer for a natural, perfected finish." },
  { id: 11, name: "RADIANCE CORRECTION FLUID", category: "Women", subcategory: "Makeup", group: "Face", price: "$48", image: "/src/assets/products/women/makeup/face/radiance-correction-fluid.jpg", description: "Light-diffusing concealer that erases dark circles and imperfections." },
  { id: 12, name: "LIQUID PHOTON ILLUMINATOR", category: "Women", subcategory: "Makeup", group: "Face", price: "$45", image: "/src/assets/products/women/makeup/face/liquid-photon-illuminator.jpg", description: "Luminous highlighter for a glass-like, wet skin effect." },
  { id: 13, name: "SHADOW DEFINITION CRÈME", category: "Women", subcategory: "Makeup", group: "Face", price: "$38", image: "/src/assets/products/women/makeup/face/shadow-definition-creme.jpg", description: "Cream contour for sculpting and defining facial structure." },
  { id: 14, name: "SUN-ETCHED MINERAL POWDER", category: "Women", subcategory: "Makeup", group: "Face", price: "$52", image: "/src/assets/products/women/makeup/face/sun-etched-mineral-powder.jpg", description: "Weightless, buildable bronzer for a sun-kissed, radiant warmth." },

  // --- WOMEN / MAKEUP / LIP ---
  { id: 15, name: "VELVET MATTE PIGMENT", category: "Women", subcategory: "Makeup", group: "Lip", price: "$38", image: "/src/assets/products/women/makeup/lip/velvet-matte-pigment.jpg", description: "Highly pigmented, comfortable matte lipstick with a soft-focus finish." },
  { id: 16, name: "CRYSTALLINE REFLECTION GLAZE", category: "Women", subcategory: "Makeup", group: "Lip", price: "$32", image: "/src/assets/products/women/makeup/lip/crystalline-reflection-glaze.jpg", description: "High-shine, non-sticky lip gloss for a wet-look luster." },
  { id: 17, name: "STRUCTURAL DEFENDER PENCIL", category: "Women", subcategory: "Makeup", group: "Lip", price: "$22", image: "/src/assets/products/women/makeup/lip/structural-defender-pencil.jpg", description: "Long-wearing, smudge-proof lip liner to define and prevent bleeding." },
  { id: 18, name: "VOLUMIZING PEPTIDE INFUSION", category: "Women", subcategory: "Makeup", group: "Lip", price: "$40", image: "/src/assets/products/women/makeup/lip/volumizing-peptide-infusion.jpg", description: "Plumping lip serum that increases hydration and volume." },
  { id: 19, name: "DURALAST INK STAIN", category: "Women", subcategory: "Makeup", group: "Lip", price: "$28", image: "/src/assets/products/women/makeup/lip/duralast-ink-stain.jpg", description: "Waterweight, 12-hour liquid lip stain that leaves a kiss-proof tint." },
  { id: 20, name: "LIPID RECOVERY OIL", category: "Women", subcategory: "Makeup", group: "Lip", price: "$36", image: "/src/assets/products/women/makeup/lip/lipid-recovery-oil.jpg", description: "Restorative, nutrient-rich oil for overnight lip repair." },

  // --- WOMEN / MAKEUP / CHEEK ---
  { id: 21, name: "KINETIC BRONZING VEIL", category: "Women", subcategory: "Makeup", group: "Cheek", price: "$42", image: "/src/assets/products/women/makeup/cheek/kinetic-bronzing-veil.jpg", description: "Gel-powder hybrid bronzer for a seamless, sun-touched finish." },
  { id: 22, name: "SUB-DERMAL FLUSH ELIXIR", category: "Women", subcategory: "Makeup", group: "Cheek", price: "$35", image: "/src/assets/products/women/makeup/cheek/sub-dermal-flush-elixir.jpg", description: "Waterweight, buildable liquid blush for a natural 'from-within' flush." },
  { id: 23, name: "IRIDIUM GLOW CONCENTRATE", category: "Women", subcategory: "Makeup", group: "Cheek", price: "$48", image: "/src/assets/products/women/makeup/cheek/iridium-glow-concentrate.jpg", description: "Intense, shimmering highlighter for editorial-level radiance." },
  { id: 24, name: "DEPTH PERSPECTIVE SCULPT", category: "Women", subcategory: "Makeup", group: "Cheek", price: "$45", image: "/src/assets/products/women/makeup/cheek/depth-perspective-sculpt.jpg", description: "Cool-toned contour powder for realistic shadow and definition." },
  { id: 25, name: "MALAR STRUCTURE COMPENDIUM", category: "Women", subcategory: "Makeup", group: "Cheek", price: "$55", image: "/src/assets/products/women/makeup/cheek/malar-structure-compendium.jpg", description: "All-in-one face palette with blush, bronzer, and highlighter." },

  // --- MEN ---
  { id: 26, name: "EAU DE PARFUM", category: "Men", subcategory: "Fragrance", price: "$180", image: "/src/assets/products/men/fragrance/eau-de-parfum.jpg", description: "A signature scent of smoky vetiver, black pepper, and aged leather." },
  { id: 27, name: "ATMOSPHERIC REFRESHER MIST", category: "Men", subcategory: "Fragrance", price: "$75", image: "/src/assets/products/men/fragrance/atmospheric-refresher-mist.jpg", description: "A cooling, anti-bacterial fabric and air mist with ozonic notes." },
  { id: 28, name: "RAW FORM SHAVE RECOVERY SYSTEM", category: "Men", subcategory: "Grooming", price: "$95", image: "/src/assets/products/men/grooming/raw-form-shave-recovery-system.jpg", description: "Dual-action pre-shave oil and post-shave serum to prevent irritation." },

  // --- HEALTH AND SKIN CARE (Flat list) ---
  { id: 29, name: "Sunscreen", category: "Health And Skin Care", subcategory: null, price: "$42", image: "/src/assets/products/health-and-skin-care/sunscreen.jpg", description: "Mineral SPF 30 with zinc oxide and titanium dioxide." },
  { id: 30, name: "Mineral Mist", category: "Health And Skin Care", subcategory: null, price: "$28", image: "/src/assets/products/health-and-skin-care/mineral-mist.jpg", description: "Hydrating, pH-balancing facial mist with silver and copper peptides." },
  { id: 31, name: "Sleep Aid", category: "Health And Skin Care", subcategory: null, price: "$68", image: "/src/assets/products/health-and-skin-care/sleep-aid.jpg", description: "Liposomal melatonin and magnesium spray for deep, restorative sleep." },
  { id: 32, name: "pH Cleanser", category: "Health And Skin Care", subcategory: null, price: "$35", image: "/src/assets/products/health-and-skin-care/ph-cleanser.jpg", description: "Gentle, non-stripping gel cleanser that respects the skin's acid mantle." },
  // ... (add all other health products from your list following the same pattern)
  // I'll add a few more as examples. You MUST complete the rest from your PDF.
  { id: 33, name: "Niacinamide Flux", category: "Health And Skin Care", subcategory: null, price: "$52", image: "/src/assets/products/health-and-skin-care/niacinamide-flux.jpg", description: "10% Niacinamide + 1% Zinc serum to control sebum and brighten." },
  { id: 34, name: "Post Workout Salve", category: "Health And Skin Care", subcategory: null, price: "$48", image: "/src/assets/products/health-and-skin-care/post-workout-salve.jpg", description: "Cooling arnica and CBD balm for sore muscles and inflammation." },
  // ... (continue for all ~20+ health products)

  // --- BABY CARE ---
  { id: 50, name: "Colloidal Oatmeal Bath Soak", category: "Baby care", subcategory: null, price: "$34", image: "/src/assets/products/baby-care/colloidal-oatmeal-bath-soak.jpg", description: "Soothing, anti-itch bath treatment for eczema-prone, delicate skin." },
  { id: 51, name: "Unscented Bath Cubes", category: "Baby care", subcategory: null, price: "$28", image: "/src/assets/products/baby-care/unscented-bath-cubes.jpg", description: "100% natural, fragrance-free, fizzing bath cubes for gentle cleansing." },
  // ... (add the rest of baby care products)

  // --- HAIR CARE ---
  { id: 60, name: "Volcanic Ash Texturizing Paste", category: "Hair care", subcategory: null, price: "$38", image: "/src/assets/products/hair-care/volcanic-ash-texturizing-paste.jpg", description: "Matte-finish, high-hold styling paste with oil-absorbing volcanic ash." },
  { id: 61, name: "Caffeine & Biotin Growth Tonic", category: "Hair care", subcategory: null, price: "$45", image: "/src/assets/products/hair-care/caffeine-and-biotin-growth-tonic.jpg", description: "Leave-in scalp treatment to stimulate follicles and reduce shedding." },
  // ... (add the rest of hair care products)
];