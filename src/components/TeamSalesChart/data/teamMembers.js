// Generate optimized avatar URLs for different screen sizes
const generateAvatarUrl = (name, background, size = 48) => {
  const encodedName = encodeURIComponent(name);
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${background}&color=ffffff&size=${size}&bold=true&format=webp`;
};

// Generate avatar sources for responsive images
const generateAvatarSources = (name, background) => ({
  small: generateAvatarUrl(name, background, 48),   // Mobile
  medium: generateAvatarUrl(name, background, 64),  // Tablet
  large: generateAvatarUrl(name, background, 96),   // Desktop
  xlarge: generateAvatarUrl(name, background, 128)  // High DPI
});

// Complete team member data with all details
export const TEAM_MEMBERS = [
  {
    user: "USR001",
    email: "jay.figueroa@company.com",
    linkedin: "https://www.linkedin.com/in/jayfig89/",
    imgUrl: "/optimized/JayFig.webp", // Fix: Use correct WebP file from manifest
    useOptimizedImage: true,
    optimizedImageName: "JayFig",
    avatarSources: generateAvatarSources("Jay Figueroa", "3b82f6"),
    firstName: "Jay",
    lastName: "Figueroa",
    birthday: "1985-03-15",
    role: "Senior Sales Manager",
    region: "North America",
    bio: "Experienced sales professional with over 8 years in B2B software solutions. Passionate about building lasting client relationships and exceeding targets."
  },
  {
    user: "USR002",
    email: "michael.chen@company.com",
    linkedin: "https://linkedin.com/in/michael-chen-tech",
    imgUrl: generateAvatarUrl("Michael Chen", "10b981", 48),
    avatarSources: generateAvatarSources("Michael Chen", "10b981"),
    firstName: "Michael",
    lastName: "Chen",
    birthday: "1990-07-22",
    role: "Account Executive",
    region: "Asia Pacific",
    bio: "Dynamic sales professional specializing in enterprise solutions. Fluent in English, Mandarin, and Japanese with strong technical background."
  },
  {
    user: "USR003",
    email: "emma.rodriguez@company.com",
    linkedin: "https://linkedin.com/in/emma-rodriguez-sales",
    imgUrl: generateAvatarUrl("Emma Rodriguez", "f59e0b", 48),
    avatarSources: generateAvatarSources("Emma Rodriguez", "f59e0b"),
    firstName: "Emma",
    lastName: "Rodriguez",
    birthday: "1988-11-08",
    role: "Regional Sales Director",
    region: "Europe",
    bio: "Strategic sales leader with expertise in market expansion and team development. Successfully launched products in 12+ European markets."
  },
  {
    user: "USR004",
    email: "james.williams@company.com",
    linkedin: "https://linkedin.com/in/james-williams-sales",
    imgUrl: generateAvatarUrl("James Williams", "8b5cf6", 48),
    avatarSources: generateAvatarSources("James Williams", "8b5cf6"),
    firstName: "James",
    lastName: "Williams",
    birthday: "1982-05-30",
    role: "VP of Sales",
    region: "Global",
    bio: "Visionary sales executive with 15+ years experience scaling revenue from startup to IPO. Expert in building high-performing sales organizations."
  },
  {
    user: "USR005",
    email: "priya.patel@company.com",
    linkedin: "https://linkedin.com/in/priya-patel-business",
    imgUrl: generateAvatarUrl("Priya Patel", "ef4444", 48),
    avatarSources: generateAvatarSources("Priya Patel", "ef4444"),
    firstName: "Priya",
    lastName: "Patel",
    birthday: "1993-09-12",
    role: "Business Development Rep",
    region: "North America",
    bio: "Energetic BDR with a knack for identifying new opportunities and qualifying prospects. Strong background in SaaS and fintech industries."
  },
  {
    user: "USR006",
    email: "carlos.mendoza@company.com",
    linkedin: "https://linkedin.com/in/carlos-mendoza-sales",
    imgUrl: generateAvatarUrl("Carlos Mendoza", "06b6d4", 48),
    avatarSources: generateAvatarSources("Carlos Mendoza", "06b6d4"),
    firstName: "Carlos",
    lastName: "Mendoza",
    birthday: "1987-01-25",
    role: "Enterprise Account Manager",
    region: "Latin America",
    bio: "Bilingual sales professional specializing in Fortune 500 accounts. Expert in complex deal structuring and stakeholder management."
  },
  {
    user: "USR007",
    email: "lisa.kim@company.com",
    linkedin: "https://linkedin.com/in/lisa-kim-sales",
    imgUrl: generateAvatarUrl("Lisa Kim", "ec4899", 48),
    avatarSources: generateAvatarSources("Lisa Kim", "ec4899"),
    firstName: "Lisa",
    lastName: "Kim",
    birthday: "1991-06-18",
    role: "Inside Sales Representative",
    region: "Asia Pacific",
    bio: "Results-driven sales rep with expertise in SaaS solutions. Consistently exceeds quotas through strategic prospecting and relationship building."
  },
  {
    user: "USR008",
    email: "david.thompson@company.com",
    linkedin: "https://linkedin.com/in/david-thompson-sales",
    imgUrl: generateAvatarUrl("David Thompson", "84cc16", 48),
    avatarSources: generateAvatarSources("David Thompson", "84cc16"),
    firstName: "David",
    lastName: "Thompson",
    birthday: "1984-12-03",
    role: "Sales Operations Manager",
    region: "North America",
    bio: "Data-driven sales operations expert focused on process optimization and sales enablement. Specializes in CRM implementation and analytics."
  },
  {
    user: "USR009",
    email: "maria.garcia@company.com",
    linkedin: "https://linkedin.com/in/maria-garcia-sales",
    imgUrl: generateAvatarUrl("Maria Garcia", "f97316", 48),
    avatarSources: generateAvatarSources("Maria Garcia", "f97316"),
    firstName: "Maria",
    lastName: "Garcia",
    birthday: "1989-04-14",
    role: "Key Account Manager",
    region: "Latin America",
    bio: "Strategic account manager with deep expertise in enterprise software sales. Fluent in Spanish, English, and Portuguese."
  },
  {
    user: "USR010",
    email: "alex.anderson@company.com",
    linkedin: "https://linkedin.com/in/alex-anderson-sales",
    imgUrl: generateAvatarUrl("Alex Anderson", "6366f1", 48),
    avatarSources: generateAvatarSources("Alex Anderson", "6366f1"),
    firstName: "Alex",
    lastName: "Anderson",
    birthday: "1992-08-27",
    role: "Sales Development Rep",
    region: "Europe",
    bio: "Ambitious SDR with strong prospecting skills and passion for technology sales. Excellent at qualifying leads and setting appointments."
  }
];

export { generateAvatarUrl, generateAvatarSources };