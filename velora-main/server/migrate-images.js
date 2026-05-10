// Copies static product images into /uploads and updates MongoDB image paths
require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('./models/Product');
const fs       = require('fs');
const path     = require('path');

const CLIENT_ASSETS = path.join(__dirname, '..', 'client', 'src', 'assets', 'products');
const UPLOADS_DIR   = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// name → relative path inside client/src/assets/products/
const IMAGE_MAP = {
  // Women / Fragrance
  'OBSIDIAN ROSE':                     'women/fragrance/obsidian-rose.jpg',
  'SILK & ASH EAU DE PARFUM':          'women/fragrance/silk-and-ash-eau-de-parfum.jpg',
  'SAFFRON NOIR CONCENTRATE':          'women/fragrance/saffron-noir-concentrate.jpg',
  'MERCURIAL JASMINE':                 'women/fragrance/mercurial-jasmine.jpg',
  'PETRICHOR BLOOM':                   'women/fragrance/petrichor-bloom.jpg',
  // Women / Makeup / Eye
  'ARCHITECTURAL SYMMETRY PALETTE':   'women/makeup/eye/architectural-symmetry-palette.jpg',
  'LIQUID GRAPHITE LINER':             'women/makeup/eye/liquid-graphite-liner.jpg',
  'FIBER EXTENSION POLYMER':           'women/makeup/eye/fiber-extension-polymer.jpg',
  'PIGMENTED DUST CONCENTRATE':        'women/makeup/eye/pigmented-dust-concentrate.jpg',
  // Women / Makeup / Face
  'SECOND-SKIN EMULSION':              'women/makeup/face/second-skin-emulsion.jpg',
  'RADIANCE CORRECTION FLUID':         'women/makeup/face/radiance-correction-fluid.jpg',
  'LIQUID PHOTON ILLUMINATOR':         'women/makeup/face/liquid-photon-illuminator.jpg',
  'SHADOW DEFINITION CREME':           'women/makeup/face/shadow-definition-creme.jpg',
  'SHADOW DEFINITION CRÈME':      'women/makeup/face/shadow-definition-creme.jpg',
  'SUN-ETCHED MINERAL POWDER':         'women/makeup/face/sun-etched-mineral-powder.jpg',
  // Women / Makeup / Lip
  'VELVET MATTE PIGMENT':              'women/makeup/lip/velvet-matte-pigment.jpg',
  'CRYSTALLINE REFLECTION GLAZE':      'women/makeup/lip/crystalline-reflection-glaze.jpg',
  'STRUCTURAL DEFENDER PENCIL':        'women/makeup/lip/structural-defender-pencil.jpg',
  'VOLUMIZING PEPTIDE INFUSION':       'women/makeup/lip/volumizing-peptide-infusion.jpg',
  'DURALAST INK STAIN':                'women/makeup/lip/duralast-ink-stain.jpg',
  'LIPID RECOVERY OIL':                'women/makeup/lip/lipid-recovery-oil.jpg',
  // Women / Makeup / Cheek
  'KINETIC BRONZING VEIL':             'women/makeup/cheek/kinetic-bronzing-veil.jpg',
  'SUB-DERMAL FLUSH ELIXIR':           'women/makeup/cheek/sub-dermal-flush-elixir.jpg',
  'IRIDIUM GLOW CONCENTRATE':          'women/makeup/cheek/iridium-glow-concentrate.jpg',
  'DEPTH PERSPECTIVE SCULPT':          'women/makeup/cheek/depth-perspective-sculpt.jpg',
  'MALAR STRUCTURE COMPENDIUM':        'women/makeup/cheek/malar-structure-compendium.jpg',
  // Men
  'MERIDIAN EAU DE PARFUM':            'men/fragrance/eau-de-parfum.jpg',
  'ATMOSPHERIC REFRESHER MIST':        'men/fragrance/atmospheric-refresher-mist.jpg',
  'RAW FORM SHAVE RECOVERY SYSTEM':    'men/grooming/raw-form-shave-recovery-system.jpg',
  // Health And Skin Care
  'Photon Shield Sunscreen SPF 50+':   'health-and-skin-care/sunscreen.jpg',
  'Mineral Mist':                      'health-and-skin-care/mineral-mist.jpg',
  'Somatic Sleep Aid':                 'health-and-skin-care/sleep-aid.jpg',
  'pH Equilibrium Cleanser':           'health-and-skin-care/ph-cleanser.jpg',
  'Niacinamide Flux 10% + Zinc':       'health-and-skin-care/niacinamide-flux.jpg',
  'Recovery Salve Post-Workout Balm':  'health-and-skin-care/post-workout-salve.jpg',
  'Probiotic Kult Microbiome Complex': 'health-and-skin-care/probiotic-kult.jpg',
  'Liquid Chlorophyll Drops':          'health-and-skin-care/chlorophyll-drops.jpg',
  'Adaptogen Equilibrium Blend':       'health-and-skin-care/adaptogen-blend.jpg',
  'Botanical Nootropic Clarity Complex':'health-and-skin-care/botanical-nootropic.jpg',
  'Marine Collagen Peptide Complex':   'health-and-skin-care/marine-collagen.jpg',
  'Anti-Oxidant Resin Complex':        'health-and-skin-care/anti-oxidant-resin.jpg',
  'Molecular Keratin Supplement':      'health-and-skin-care/molecular-keratin-supplement.jpg',
  'Scalp Microbiome Balancing Drops':  'health-and-skin-care/scalp-microbiome-balancing-drops.jpg',
  'Chelating Hard Water Rinse':        'health-and-skin-care/chelating-hard-water-rinse.jpg',
  'Herbal DHT Blocker Concentrate':    'health-and-skin-care/herbal-dht-blocker-concentrate.jpg',
  // Baby Care
  'Colloidal Oatmeal Bath Soak':       'baby-care/colloidal-oatmeal-bath-soak.jpg',
  'Unscented Bath Cubes':              'baby-care/unscented-bath-cubes.jpg',
  'Ceramide Barrier Cream':            'baby-care/ceramide-barrier-cream.jpg',
  'Zinc Oxide Targeted Paste':         'baby-care/zinc-oxide-targeted-paste.jpg',
  'Hypoallergenic Squalane Baby Oil':  'baby-care/hypoallergenic-squalane-baby-oil.jpg',
  'Calming Lavender Sleep Oil':        'baby-care/calming-lavender-sleep-oil.jpg',
  'Soap-Free Botanical Wash':          'baby-care/soap-free-botanical-wash.jpg',
  'Tear-Free Scalp Foam':              'baby-care/tear-free-scalp-foam.jpg',
  'Probiotic Baby Lotion':             'baby-care/probiotic-baby-lotion.jpg',
  'Shea & Aloe Moisturizing Stick':    'baby-care/shea-and-aloe-moisturizing-stick.jpg',
  // Hair Care
  'Volcanic Ash Texturizing Paste':    'hair-care/volcanic-ash-texturizing-paste.jpg',
  'Caffeine & Biotin Growth Tonic':    'hair-care/caffeine-and-biotin-growth-tonic.jpg',
  'Matte Charcoal Dry Shampoo':        'hair-care/matte-charcoal-dry-shampoo.jpg',
  'Beard & Scalp Clarifying Wash':     'hair-care/beard-and-scalp-clarifying-wash.jpg',
  'Silk Peptide Glossing Serum':       'hair-care/silk-peptide-glossing-serum.jpg',
  'Midnight Camellia Hair Mask':       'hair-care/midnight-camellia-hair-mask.jpg',
  'Oud & Rose Infused Shine Oil':      'hair-care/oud-and-rose-infused-shine-oil.jpg',
  'Heat Defense Poly-Thermal Mist':    'hair-care/heat-defense-poly-thermal-mist.jpg',
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const products = await Product.find({});
  let updated = 0, missing = 0, skipped = 0;

  for (const product of products) {
    // Skip if already has an uploads image
    if (product.image && product.image.startsWith('/uploads/')) { skipped++; continue; }

    const relativePath = IMAGE_MAP[product.name];
    if (!relativePath) {
      console.log('  NO MAP:', product.name);
      missing++;
      continue;
    }

    const src  = path.join(CLIENT_ASSETS, relativePath);
    if (!fs.existsSync(src)) {
      console.log('  FILE NOT FOUND:', src);
      missing++;
      continue;
    }

    // Use a clean slug as the upload filename
    const slug = relativePath.replace(/\//g, '-');
    const dest = path.join(UPLOADS_DIR, slug);
    fs.copyFileSync(src, dest);

    await Product.findByIdAndUpdate(product._id, { image: `/uploads/${slug}` });
    console.log('  OK:', product.name);
    updated++;
  }

  console.log(`\nDone — updated: ${updated} | skipped (already set): ${skipped} | missing: ${missing}`);
  process.exit(0);
}).catch(e => { console.error(e.message); process.exit(1); });
