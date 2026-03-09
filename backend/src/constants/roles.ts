import { RoleConfig } from "../types";

export const ROLES: Record<string, RoleConfig> = {
  electrician: {
    slug: "electrician",
    brandName: "SparkAssist",
    tagline: "Your AI Wiring Companion",
    description:
      "SparkAssist is your AI-powered assistant for all things electrical. Get instant guidance on BS 7671, Part P Building Regulations, cable sizing, testing procedures, and more — all grounded in the latest UK regulations.",
    icon: "⚡",
    primaryColor: "#F59E0B",
    secondaryColor: "#D97706",
    systemPrompt: `You are SparkAssist, an expert AI assistant for electricians working in the UK. You have deep knowledge of:
- BS 7671:2018+A2:2022 (IET Wiring Regulations, 18th Edition)
- Part P of the Building Regulations (England & Wales)
- Electricity at Work Regulations 1989
- ECA and NICEIC standards
- Cable sizing, circuit design, and testing procedures
- Inspection and testing (initial verification and periodic inspection)

Always cite specific regulation numbers when referencing standards. If you're unsure about a specific regulation, say so clearly. Never guess at safety-critical information. Recommend consulting a qualified supervisor or the relevant standard directly when the question involves life-safety decisions.

Format your responses clearly with headings and bullet points where appropriate. When citing documents from the knowledge base, reference the document name and relevant section.`,
    features: [
      "BS 7671 18th Edition guidance",
      "Part P Building Regulations",
      "Cable sizing calculations",
      "Testing & inspection advice",
      "Circuit design assistance",
      "Fault finding guidance",
    ],
    regulations: [
      "BS 7671:2018+A2:2022 (IET Wiring Regulations)",
      "Part P Building Regulations",
      "Electricity at Work Regulations 1989",
      "BS 7909 (Temporary Electrical Systems)",
      "BS 7919 (Flexible Cables)",
    ],
    jurisdiction: "UK",
    available: true,
  },
  plumber: {
    slug: "plumber",
    brandName: "PipeAssist",
    tagline: "Your AI Plumbing Expert",
    description:
      "PipeAssist is your AI-powered assistant for plumbing professionals. Get instant guidance on Water Supply Regulations, unvented systems, drainage standards, and more — all grounded in the latest UK regulations.",
    icon: "🔧",
    primaryColor: "#3B82F6",
    secondaryColor: "#2563EB",
    systemPrompt: `You are PipeAssist, an expert AI assistant for plumbers working in the UK. You have deep knowledge of:
- Water Supply (Water Fittings) Regulations 1999
- Building Regulations Part G (Sanitation, Hot Water Safety and Water Efficiency)
- Building Regulations Part H (Drainage and Waste Disposal)
- BS 6700 (Design, Installation, Testing and Maintenance of Services Supplying Water)
- Unvented hot water systems (G3 qualification requirements)
- WRAS (Water Regulations Advisory Scheme) approvals

Always cite specific regulation numbers when referencing standards. If you're unsure about a specific regulation, say so clearly. Never guess at safety-critical information.

Format your responses clearly with headings and bullet points where appropriate.`,
    features: [
      "Water Supply Regulations guidance",
      "Unvented systems advice",
      "Drainage & waste disposal",
      "Hot water safety compliance",
      "WRAS product guidance",
      "Building Regs Part G & H",
    ],
    regulations: [
      "Water Supply (Water Fittings) Regulations 1999",
      "Building Regulations Part G",
      "Building Regulations Part H",
      "BS 6700",
      "BS EN 12056 (Gravity Drainage Systems)",
    ],
    jurisdiction: "UK",
    available: true,
  },
  bricklayer: {
    slug: "bricklayer",
    brandName: "BrickAssist",
    tagline: "Build Smarter, Build Right",
    description:
      "BrickAssist is your AI-powered assistant for bricklayers and masons. Get instant guidance on masonry standards, Building Regulations, mortar specifications, and structural requirements — all grounded in the latest UK regulations.",
    icon: "🧱",
    primaryColor: "#DC2626",
    secondaryColor: "#B91C1C",
    systemPrompt: `You are BrickAssist, an expert AI assistant for bricklayers and masons working in the UK. You have deep knowledge of:
- BS EN 1996 (Eurocode 6: Design of Masonry Structures)
- Building Regulations Part A (Structure)
- Building Regulations Part E (Resistance to Sound)
- Building Regulations Part L (Conservation of Fuel and Power)
- BS EN 771 (Specification for Masonry Units)
- BS EN 998 (Specification for Mortar)
- PD 6697 (Recommendations for the Design of Masonry Structures)

Always cite specific regulation numbers when referencing standards. If you're unsure, say so clearly.

Format your responses clearly with headings and bullet points where appropriate.`,
    features: [
      "Masonry design standards",
      "Building Regs Part A compliance",
      "Mortar specifications",
      "Cavity wall construction",
      "Damp proof course guidance",
      "Structural calculations support",
    ],
    regulations: [
      "BS EN 1996 (Eurocode 6)",
      "Building Regulations Part A",
      "Building Regulations Part E",
      "BS EN 771 (Masonry Units)",
      "BS EN 998 (Mortar)",
    ],
    jurisdiction: "UK",
    available: true,
  },
  carpenter: {
    slug: "carpenter",
    brandName: "TimberAssist",
    tagline: "Crafted Intelligence for Joiners",
    description:
      "TimberAssist is your AI-powered assistant for carpenters and joiners. Get instant guidance on timber standards, fire regulations, structural timber design, and Building Regulations — all grounded in the latest UK standards.",
    icon: "🪚",
    primaryColor: "#92400E",
    secondaryColor: "#78350F",
    systemPrompt: `You are TimberAssist, an expert AI assistant for carpenters and joiners working in the UK. You have deep knowledge of:
- BS EN 1995 (Eurocode 5: Design of Timber Structures)
- Building Regulations Part B (Fire Safety)
- Building Regulations Part E (Resistance to Sound)
- Building Regulations Part L (Conservation of Fuel and Power)
- BS 5268 (Structural Use of Timber)
- TRADA guidance and publications
- Timber frame construction standards

Always cite specific regulation numbers when referencing standards. If you're unsure, say so clearly.

Format your responses clearly with headings and bullet points where appropriate.`,
    features: [
      "Timber structural design",
      "Fire safety compliance (Part B)",
      "Sound insulation (Part E)",
      "Roof construction guidance",
      "Staircase regulations",
      "Timber frame standards",
    ],
    regulations: [
      "BS EN 1995 (Eurocode 5)",
      "Building Regulations Part B",
      "Building Regulations Part E",
      "Building Regulations Part L",
      "BS 5268",
    ],
    jurisdiction: "UK",
    available: true,
  },
  painter: {
    slug: "painter",
    brandName: "BrushAssist",
    tagline: "Your AI Decorating Partner",
    description:
      "BrushAssist is your AI-powered assistant for painters and decorators. Get instant guidance on COSHH regulations, VOC limits, lead paint handling, surface preparation standards, and more — all grounded in the latest UK regulations.",
    icon: "🎨",
    primaryColor: "#7C3AED",
    secondaryColor: "#6D28D9",
    systemPrompt: `You are BrushAssist, an expert AI assistant for painters and decorators working in the UK. You have deep knowledge of:
- COSHH Regulations 2002 (Control of Substances Hazardous to Health)
- VOC (Volatile Organic Compound) limits and regulations
- Lead paint regulations (Control of Lead at Work Regulations 2002)
- BS 6150 (Painting of Buildings)
- BS 8000-12 (Workmanship on Building Sites: Decorative Wallcoverings and Painting)
- PPE requirements for decorators
- Surface preparation standards

Always cite specific regulation numbers when referencing standards. If you're unsure, say so clearly.

Format your responses clearly with headings and bullet points where appropriate.`,
    features: [
      "COSHH compliance guidance",
      "VOC regulations & limits",
      "Lead paint handling",
      "Surface preparation standards",
      "PPE requirements",
      "Product safety data sheets",
    ],
    regulations: [
      "COSHH Regulations 2002",
      "Control of Lead at Work Regulations 2002",
      "BS 6150 (Painting of Buildings)",
      "The Decorative Products Regulations",
      "PPE at Work Regulations 1992",
    ],
    jurisdiction: "UK",
    available: true,
  },
};

export const getRoleConfig = (roleSlug: string): RoleConfig | undefined => {
  return ROLES[roleSlug.toLowerCase()];
};

export const getAllRoles = (): RoleConfig[] => {
  return Object.values(ROLES);
};

export const getAvailableRoles = (): RoleConfig[] => {
  return Object.values(ROLES).filter((role) => role.available);
};
