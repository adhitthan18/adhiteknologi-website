import type { Dictionary } from "@/lib/i18n";

export const en: Dictionary = {
  htmlLang: "en",
  localeName: "English",
  ogLocale: "en_US",

  meta: {
    tagline: "A software house for web, IoT, and point-of-sale systems",
    description:
      "PT Adhi Teknologi Indonesia builds websites, IoT hardware and platforms, and POS systems for businesses in Indonesia. Planning through maintenance, handled by one team.",
    keywords: [
      "web development agency",
      "software house Indonesia",
      "IoT development services",
      "POS system",
      "point of sale software",
      "web developer Indonesia",
    ],
  },

  nav: {
    links: [
      { label: "Services", href: "#services" },
      { label: "Products", href: "#products" },
      { label: "Portfolio", href: "#portfolio" },
      { label: "Process", href: "#process" },
      { label: "Technology", href: "#tech" },
      { label: "FAQ", href: "#faq" },
    ],
    contact: "Contact",
    cta: "Free consultation",
    home: "Adhi Teknologi — home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    skipToContent: "Skip to main content",
  },

  theme: {
    neutral: "Switch between light and dark theme",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },

  language: {
    label: "Change language",
    switchTo: "View in Indonesian",
  },

  hero: {
    badge: "Software house · Taking on new projects",
    titleStart: "Websites, ",
    titleHighlight: "IoT",
    titleEnd: ", and point-of-sale — built by one team.",
    subtitle:
      "PT Adhi Teknologi Indonesia builds websites, IoT hardware and platforms, and POS systems for businesses across Indonesia. From planning and development through to support after launch.",
    ctaPrimary: "Start your project",
    ctaSecondary: "See our products",
    photoAlt: "Adhi Teknologi's founder leading a robotics training session",
    pillars: { web: "Websites & Web Apps", iot: "IoT Solutions", pos: "POS Systems" },
  },

  stats: [
    { value: "3", suffix: " pillars", label: "Web, IoT, and POS handled by one team" },
    { value: "2", suffix: " products", label: "Live platforms: IoT Max Hub & Satu Meja" },
    { value: "100", suffix: "%", label: "Code and documentation belong to the client" },
    { value: "24", suffix: " hours", label: "Maximum response time for new enquiries" },
  ],

  services: {
    eyebrow: "Services",
    title: "The three pillars of our work",
    description:
      "Each pillar has different technical demands, but all three go through the same process and quality bar.",
    items: {
      web: {
        title: "Website & Web Application Development",
        summary:
          "Company profiles, landing pages, e-commerce, and internal dashboards. Built to load fast, rank well, and stay easy for your own team to manage.",
        points: [
          "Company profiles & conversion landing pages",
          "Web apps, internal dashboards & CMS",
          "Online stores with payment gateway integration",
          "Technical SEO, Core Web Vitals, and analytics",
        ],
      },
      iot: {
        title: "IoT Solutions & Devices",
        summary:
          "Field sensors, gateways, and real-time monitoring dashboards. We write the firmware and build the platform — not just the screens on top.",
        points: [
          "ESP32 / STM32 firmware & circuit design",
          "MQTT, LoRa, and industrial protocol gateways",
          "Real-time telemetry dashboards + alerting",
          "Device provisioning & OTA updates",
        ],
      },
      pos: {
        title: "POS & Business Operations Systems",
        summary:
          "A till that keeps working when the internet drops, prints to thermal receipt printers, and produces reports owners actually use.",
        points: [
          "Offline-first Android till + background sync",
          "Bluetooth / thermal receipt printing",
          "Stock, shift, and multi-outlet management",
          "Daily sales and margin reporting",
        ],
      },
    },
    support: [
      {
        title: "Integrations & APIs",
        body: "Connecting the systems you already run — accounting, marketplaces, payments, or third-party hardware.",
      },
      {
        title: "Maintenance & Support",
        body: "Uptime monitoring, security patches, scheduled backups, and a clear escalation path when something breaks.",
      },
      {
        title: "UI/UX & Design Systems",
        body: "Flow research, wireframes, and a design system so the product stays coherent as features are added.",
      },
      {
        title: "Training & Workshops",
        body: "Robotics, IoT, and digital-literacy training for teachers and in-house teams — using the equipment and material we prepare ourselves.",
      },
    ],
  },

  products: {
    eyebrow: "Products & Portfolio",
    title: "What we have built and run ourselves",
    description:
      "We developed both of these platforms in-house, so the technology we offer clients is technology we already rely on.",
    newTab: "(opens in a new tab)",
    items: {
      iotmaxhub: {
        name: "IoT Max Hub",
        kicker: "IoT Platform",
        status: "Live product",
        body: "A monitoring hub for IoT devices: it collects sensor data over MQTT, displays it in real time, and sends alerts when readings move outside their thresholds.",
        features: ["Real-time telemetry", "Device management", "Rules & alerts", "Data history"],
      },
      satumeja: {
        name: "Satu Meja",
        kicker: "POS & Till",
        status: "Live product",
        body: "A point-of-sale system for cafés, restaurants, and retail. Transactions still record while offline, receipts print straight away, and sales reports are ready at every shift close.",
        features: ["Offline mode", "Thermal receipts", "Stock control", "Daily reports"],
      },
    },
  },

  portfolio: {
    eyebrow: "Portfolio",
    title: "Sites we have delivered",
    description:
      "Four client sites now live. Two of them belong to the same company, built separately because they serve different markets.",
    newTab: "(opens in a new tab)",
    items: {
      orensaGlobal: {
        name: "Orensa Global",
        sector: "Hospitality · Export",
        body: "An English-language site for a hospitality textile supplier — towels, bed linen, robes, table linen, and amenities — aimed at hotels, resorts, and spas abroad.",
        tags: ["Company profile", "English-language", "Quote requests"],
      },
      indonesiaCommodities: {
        name: "Indonesia Commodities",
        sector: "Commodities · B2B",
        body: "A B2B catalogue for a commodity distributor: native tapioca starch, dextrin, and bubble starch. Connects buyers with three partner producers in Indonesia.",
        tags: ["Product catalogue", "B2B", "Producer pages"],
      },
      jualRumahTangerang: {
        name: "Jual Rumah Tangerang",
        sector: "Property",
        body: "A property agency site for the Greater Tangerang area, listing houses, apartments, shophouses, and land, searchable by district and type.",
        tags: ["Property listings", "Search & filter", "Buyer guides"],
      },
      orensaId: {
        name: "Orensa Indonesia",
        sector: "Hospitality · Domestic",
        body: "Orensa's site for the domestic market: a hotel supplies catalogue across six categories, a downloadable PDF catalogue, and direct consultation over WhatsApp.",
        tags: ["Digital catalogue", "PDF download", "WhatsApp consultation"],
      },
    },
    note: "Orensa Global and Orensa Indonesia are the same client, with two sites for two markets.",
    cta: "Want a site like these?",
  },

  field: {
    eyebrow: "In the field",
    title: "We teach what we build",
    description:
      "Alongside client projects, we train teachers and in-house teams on the same equipment we work with every day — robotics kits, microcontrollers, and the systems we build ourselves.",
    photos: {
      robot: "A training room full of participants, with the LEGO robots they built on the table",
      merakit: "An instructor helping a participant run their robot from a laptop",
      pendampingan: "One-to-one coaching at a participant's laptop",
    },
    note: "Documentation from the Guru Melek Digital training programme, published with the participants' consent.",
  },

  process: {
    eyebrow: "How we work",
    title: "Five stages, no surprises halfway through",
    description:
      "Every stage produces something you can see and sign off on before we move to the next one.",
    steps: [
      {
        title: "Discovery",
        body: "We listen to the problem first rather than pitching features. The output is a list of requirements, constraints, and what success will be measured against.",
      },
      {
        title: "Planning & Estimation",
        body: "Scope, timeline, and cost are written down openly. You know what is included and what is not before any work starts.",
      },
      {
        title: "Design & Prototyping",
        body: "Flows and screens are tested as prototypes first, so the big changes happen during design rather than during development.",
      },
      {
        title: "Development",
        body: "Built in increments with regular demos. Every sprint produces something you can open and try — no waiting until the end.",
      },
      {
        title: "Launch & Maintenance",
        body: "Deployment, documentation handover, training for your team, then ongoing monitoring and support.",
      },
    ],
  },

  why: {
    eyebrow: "Why Adhi Teknologi",
    title: "Why clients stay after the first project",
    description:
      "Not because we are the cheapest, but because you always know what is being built and who is accountable for it.",
    items: [
      {
        title: "One team for hardware and software",
        body: "IoT projects often stall because the device vendor and the software vendor blame each other. Here both sides are handled by the same team.",
      },
      {
        title: "Built from real-world use",
        body: "We built and operate Satu Meja and IoT Max Hub ourselves, so our technical decisions come from running them, not from theory.",
      },
      {
        title: "No vendor lock-in",
        body: "Source code, hosting accounts, and documentation are handed over to you. If you ever change teams, nothing gets left behind.",
      },
      {
        title: "Honest cost estimates",
        body: "Estimates are broken down per piece of work. If something looks likely to grow, we say so upfront rather than midway through.",
      },
    ],
  },

  tech: {
    eyebrow: "Technology",
    title: "The tools we work with every day",
    description:
      "Chosen because they are stable and maintainable over the long run — not because they are trending.",
    groups: {
      frontend: "Frontend",
      backend: "Backend & Data",
      iot: "IoT & Embedded",
      mobile: "Mobile & POS",
      infra: "Infrastructure",
    },
  },

  faq: {
    eyebrow: "FAQ",
    title: "The questions we get asked most",
    description:
      "Not answered here? Send the question through the form below — we usually reply the same day.",
    items: [
      {
        q: "How long does a project take?",
        a: "A company profile site is typically 2–4 weeks. A web app or POS system with custom flows usually runs 6–12 weeks. IoT projects depend on the hardware and field testing, so we estimate those after discovery.",
      },
      {
        q: "How is pricing structured?",
        a: "For clearly defined scope we work on a fixed price per project. For longer-term development we offer a monthly retainer. Either way, the breakdown is sent in writing before work begins.",
      },
      {
        q: "Does the client get the source code?",
        a: "Yes. Once the final payment clears, all source code, design assets, and infrastructure access become yours, along with the documentation.",
      },
      {
        q: "Can you take over an existing system?",
        a: "We can. We start with a short audit of the code and infrastructure, then tell you whether continuing or rewriting makes more sense — and why.",
      },
      {
        q: "Do you supply the hardware as well?",
        a: "For IoT projects we help select and prepare the devices, including prototyping and testing. Bulk procurement can go through us or through your preferred supplier.",
      },
      {
        q: "Is there support after launch?",
        a: "There is a bug-fix warranty period after launch, plus optional monthly maintenance covering monitoring, security updates, and small feature additions.",
      },
    ],
  },

  contact: {
    eyebrow: "Get started",
    title: "Tell us what you need and we will reply with concrete next steps",
    description:
      "You do not need a polished requirements document. Just describe the problem you want solved and we will help shape the scope and the estimate.",
    whatsappNewTab: "(opens WhatsApp in a new tab)",
    labels: {
      nama: "Name / company",
      kontak: "Email or WhatsApp number",
      kebutuhan: "What you need",
      pesan: "Briefly describe what you need",
    },
    placeholders: {
      nama: "e.g. Kopi Senja / Budi Santoso",
      kontak: "name@email.com or +62 8xx xxxx xxxx",
      pesan: "For example: a till system for 2 outlets that keeps working when the internet drops.",
    },
    options: [
      "Website / Web App",
      "IoT Solution",
      "POS / Till System",
      "Maintenance for an existing system",
      "Not sure yet, would like to talk",
    ],
    errors: {
      nama: "Enter your name or company name.",
      kontak: "Enter an email or WhatsApp number we can reach you on.",
      pesan: "Write at least one sentence about what you need.",
    },
    summaryOne: "1 field needs fixing",
    summaryMany: "{n} fields need fixing",
    hint: "Mention your target timeline and rough budget if you have them — it speeds up the estimate.",
    submitWhatsapp: "Send via WhatsApp",
    submitEmail: "Send via email",
    privacy:
      "The fields above are only assembled into a message on your own device — nothing is sent to or stored on this site's server.",
    messageIntro: "Hello PT Adhi Teknologi Indonesia, I would like a consultation.",
    messageName: "Name/Company",
    messageContact: "Contact",
    messageNeed: "Need",
    emailSubject: "Project enquiry",
  },

  footer: {
    columns: { services: "Services", products: "Products", company: "Company" },
    maintenance: "Maintenance & Support",
    rights: "All rights reserved.",
    social: "(opens in a new tab)",
  },
};
