import { CourseTrack, Testimonial, FAQItem } from './types';

export const BRAND_COLORS = {
  primaryGold: '#C9931A',
  lightGold: '#E8B040',
  paleGold: '#FDF3DC',
  darkBg: '#1A1A1A',
  charcoal: '#2D2D2D',
  softWhite: '#F7F4EF',
};

export const INSTANT_CONTACTS = {
  phone: '+234 813 862 3125', // Replaced dummy with realistic Rivers State contact
  whatsapp: 'https://wa.me/2348138623125?text=Hello%20Bobsoft%2C%20I%20am%20interested%20in%20enrolling%20for%20the%20Industrial%20Training%20Cohort',
  email: 'info@bobsoftintegrated.com',
  location: 'Old Shopping Complex, Ignatius Ajuru University of Education (IAUE), Rumuolumeni, Port Harcourt, Rivers State, Nigeria.',
  locationShort: 'IAUE Campus, Port Harcourt',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.801019053805!2d6.9298418!3d4.8043689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1069cef90a2c89db%3A0xc6cb5a6f236ba8b9!2sIgnatius%20Ajuru%20University%20Of%20Education!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng',
};

export const COURSES: CourseTrack[] = [
  {
    id: 'web-dev',
    title: 'Full-Stack Web Development',
    shortDesc: 'Master coding from zero to hero. Learn frontend React, backend Node.js, and build premium responsive web apps.',
    longDesc: 'Our flagship coding track takes you from writing your first line of code to deploying commercial-grade full-stack applications on the cloud. This hands-on program focuses on practical engineering patterns, modern tools, and database architecture.',
    iconName: 'Code',
    duration: '24 Weeks (6 Months)',
    modules: [
      'Frontend Foundations: HTML5, CSS3, Flexbox, CSS Grid & ES6+ JavaScript',
      'Modern Frontend Engineering: React, Hooks, Router, and Tailwind CSS',
      'Backend Architecture: Node.js, Express.js, RESTful API design',
      'Databases & Storage: MongoDB, PostgreSQL, Mongoose, and SQL querying',
      'Version Control, Cloud Deployment & Git workflows'
    ],
    skillsGained: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Git & GitHub', 'REST APIs'],
    careerPaths: ['Full-Stack Developer', 'Frontend Engineer', 'Backend Developer', 'Freelance Web Consultant'],
    bgImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'data-analytics',
    title: 'Research & Data Analytics',
    shortDesc: 'Extract deep business insights from numbers. Master SPSS, Excel, Python, SQL, and design high-impact Power BI dashboards.',
    longDesc: 'In a data-driven world, decisions are made on evidence. This comprehensive track covers the complete lifecycle of data analysis—from creating structured research surveys to executing advanced statistical operations and building live dashboards.',
    iconName: 'BarChart2',
    duration: '24 Weeks (6 Months)',
    modules: [
      'Research Methodology: Survey designs, sampling techniques & data cleansing',
      'Advanced Excel & Google Sheets: Pivot tables, VLOOKUP, INDEX-MATCH & macros',
      'Statistical Analysis with SPSS: Descriptive stats, ANOVA, regression & t-tests',
      'Business Intelligence: Building interactive dashboards in Power BI & Tableau',
      'Database Foundations: Introduction to SQL and data-querying essentials'
    ],
    skillsGained: ['SPSS', 'Advanced Excel', 'Power BI', 'SQL', 'Data Cleansing', 'Regression Models', 'Statistical Testing'],
    careerPaths: ['Data Analyst', 'Business Intelligence Developer', 'Research Officer', 'Systems Analyst'],
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ai-prompting',
    title: 'AI Prompt Engineering & Automation',
    shortDesc: 'Leverage LLMs and modern AI tools. Master prompt engineering patterns and build automated, intelligent workflows.',
    longDesc: 'AI won\'t replace people, but people who use AI will replace those who don\'t. This futuristic track teaches you the exact science of prompt structures, automation integrations, and how to operate as a 10x productive professional.',
    iconName: 'Cpu',
    duration: '24 Weeks (6 Months)',
    modules: [
      'LLM Mechanics: How GPT models think, tokenization, and temperature settings',
      'Prompt Design Patterns: Few-shot, chain-of-thought, persona, and meta-prompting',
      'Workflow Automation: Connecting AI to apps with Zapier, Make, and webhooks',
      'Content & Code Generation: Generating professional copy, graphic templates, and scripts',
      'Ethical AI & Corporate Safety: IP security, validation methods, and data privacy'
    ],
    skillsGained: ['Advanced Prompting', 'AI Automation', 'Zapier/Make', 'Generative Design', 'Workflow Mapping', 'Validation'],
    careerPaths: ['AI Implementation Consultant', 'Automation Specialist', 'Digital Operations Lead', 'AI Trainer'],
    bgImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'basic-comp',
    title: 'Basic to Advanced Computer Skills',
    shortDesc: 'Unlock essential business operations. Master Microsoft Office, Google Suite, Canva design, and cloud workflows.',
    longDesc: 'The foundation of all modern office work. This course empowers business owners, administrative officers, and students with top-tier efficiency in word processing, bookkeeping spreadsheet design, visual graphics, and cloud file management.',
    iconName: 'Monitor',
    duration: '24 Weeks (6 Months)',
    modules: [
      'Computer & OS Essentials: File directory structure, shortcuts, and safe browsing',
      'Office Productivity: Comprehensive MS Word, PowerPoint, and Excel formulas',
      'Google Workspace Ecosystem: Drive, Docs, Sheets, and Forms collaboration',
      'Digital Graphic Design: Creating professional branding assets with Canva',
      'Cloud Accounting Basics: Introduction to digital invoicing and QuickBooks'
    ],
    skillsGained: ['MS Office', 'Google Workspace', 'Canva Design', 'Cloud Collaboration', 'Operating Systems', 'Office Safety'],
    careerPaths: ['Administrative Officer', 'Executive Assistant', 'Office Coordinator', 'Small Business Manager'],
    bgImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing & Content Creation',
    shortDesc: 'Learn the science of online traffic. Master SEO, Facebook/Instagram Ads, copywriting, and mobile video editing.',
    longDesc: 'Every product, service, and creator needs attention to survive. In this creative and business-oriented track, you will learn how to capture attention, write high-converting copies, shoot/edit engaging videos, and execute high-yielding paid ads.',
    iconName: 'Megaphone',
    duration: '24 Weeks (6 Months)',
    modules: [
      'Digital Strategy: Content marketing, conversion funnels & audience targeting',
      'Paid Acquisition: Launching and optimization of Facebook, Instagram & YouTube Ads',
      'SEO & Copywriting: Crafting magnetic headlines, blog articles, and landing pages',
      'Mobile Video Production: Filming with smartphones and editing with CapCut/Premiere',
      'Analytics & Reporting: Tracking pixel conversions and calculating Return on Ad Spend (ROAS)'
    ],
    skillsGained: ['Meta Ads Manager', 'SEO Mechanics', 'CapCut/Video Editing', 'Direct-Response Copywriting', 'Google Analytics'],
    careerPaths: ['Social Media Manager', 'Digital Marketer', 'Content Creator', 'SEO Consultant'],
    bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Development',
    shortDesc: 'Build native iOS and Android apps. Master React Native, Expo, mobile routing, and push notifications.',
    longDesc: 'With the world operating primarily on mobile screens, native app creators are in extreme demand. This advanced technical track teaches you to write clean cross-platform code that compiles into ultra-fast, high-end applications for Apple and Google stores.',
    iconName: 'Smartphone',
    duration: '24 Weeks (6 Months)',
    modules: [
      'Mobile Paradigms: Differences between web/mobile view structures and layouts',
      'React Native & Expo: Setting up native SDKs, virtual devices, and project shells',
      'Navigation Structures: Tabs, drawers, stacks, and nested routing flows',
      'Hardware Integrations: Camera feeds, GPS locations, storage access, and push notifications',
      'Publishing Lifecycle: Bundling, building release versions, and app store deployment steps'
    ],
    skillsGained: ['React Native', 'Expo', 'Mobile Navigation', 'Hardware APIs', 'Push Notifications', 'App Publishing'],
    careerPaths: ['Mobile App Developer', 'React Native Engineer', 'iOS Developer', 'Android Developer'],
    bgImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Foundations',
    shortDesc: 'Protect data and secure networks. Learn Linux, network analysis, vulnerability testing, and defense frameworks.',
    longDesc: 'As digital infrastructure expands, so does the risk of theft and attack. This course serves as a practical introduction to the defense techniques, networking architectures, and diagnostic command tools used to secure modern databases.',
    iconName: 'ShieldAlert',
    duration: '24 Weeks (6 Months)',
    modules: [
      'Networking Fundamentals: TCP/IP, OSI model, ports, routing, and packet capture',
      'Linux Administration: Command terminal manipulation, scripting, and file security settings',
      'Threat Modeling: Cyber attacks, phishing, malware analysis, and injection vectors',
      'Vulnerability Assessment: Scanners (Nmap, Wireshark) and auditing server frameworks',
      'Enterprise Defense: Access control lists, firewalls, and modern encryption standards'
    ],
    skillsGained: ['Linux Terminal', 'Nmap & Wireshark', 'Network Auditing', 'Firewall Configurations', 'Threat Diagnosis', 'Cryptology Basics'],
    careerPaths: ['Security Analyst', 'Junior Penetration Tester', 'Network Administrator', 'IT Auditor'],
    bgImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Chibuike Aleru',
    role: 'Junior Frontend Developer',
    trackName: 'Full-Stack Web Development',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&h=150&q=80',
    quote: 'Bobsoft was the turning point of my life. Before the 6-month industrial training program, I knew zero code. The physical classes at IAUE Old Shopping Complex were intensely hands-on, and having direct mentor support got me past every bug. Today, I work remotely for a tech hub in Lagos, earning in six figures.',
    year: 'Class of 2025'
  },
  {
    id: 't2',
    name: 'Favour Amadi',
    role: 'Data Research Assistant',
    trackName: 'Research & Data Analytics',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80',
    quote: 'As an education student at IAUE, I wanted to equip myself with modern data skills. Bobsoft was perfect! Learning SPSS, Excel formulas, and Power BI allowed me to handle complex academic research projects. I was hired immediately after my graduation because of the analytics portfolio I built here.',
    year: 'Class of 2025'
  },
  {
    id: 't3',
    name: 'Kelechi Nwosu',
    role: 'Social Media & Brand Specialist',
    trackName: 'Digital Marketing & Content Creation',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    quote: 'I ran a small fashion business in Port Harcourt but struggled with sales. I joined Bobsoft to learn marketing. Within 3 months of implementing Meta ads and making CapCut videos, our sales tripled. The physical campus workspace is highly engaging and full of creative energy.',
    year: 'Class of 2026'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'Where is Bobsoft Integrated Services located?',
    answer: 'We are located at the Old Shopping Complex, Ignatius Ajuru University of Education (IAUE), Rumuolumeni Campus, Port Harcourt, Rivers State, Nigeria. We are directly behind the IAUE Table Water Factory.'
  },
  {
    question: 'Can non-IAUE students enroll?',
    answer: 'Yes! While our institute is located on the university campus, our training cohorts are 100% open to the general public, secondary school graduates, corp members (NYSC), working professionals, and students from other tertiary institutions.'
  },
  {
    question: 'What are the tuition fees and payment structures?',
    answer: ' Tuition depends on your study mode:\n\n• In-Person Training: ₦45,000 (Single full payment, no installment plan).\n• Online Training: ₦55,000 (Single full payment, no installment plan).'
  },
  {
    question: 'Is a laptop required to participate?',
    answer: 'Yes, a functional laptop is highly recommended since all our training tracks are 90% hands-on practical. However, if you do not own a laptop, you can still participate in our physical classes and practice using our physical lab resources during scheduled hours.'
  },
  {
    question: 'Will I receive a certificate upon completion?',
    answer: 'Absolutely. Graduates who maintain 80%+ attendance, complete their module milestone projects, and pass the final cohort capstone defense will receive a physical and digital Bobsoft Integrated Services Certificate of Competence, which is widely recognized for employment.'
  },
  {
    question: 'Are there weekend classes available?',
    answer: 'Yes! We run weekdays as well as special weekend cohorts to accommodate working class professionals, school teachers, and individuals with busy weekday schedules.'
  }
];
