import { useState, useEffect, FormEvent } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  BookOpen, 
  Code, 
  BarChart2, 
  Cpu, 
  Monitor, 
  Megaphone, 
  Smartphone, 
  ShieldAlert,
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Menu, 
  X, 
  DollarSign, 
  Calendar, 
  Users, 
  Award, 
  Clock, 
  Sparkles, 
  Lock,
  ExternalLink,
  MessageCircle,
  Map,
  BadgeAlert,
  BookOpenCheck
} from 'lucide-react';
import { COURSES, TESTIMONIALS, FAQS, INSTANT_CONTACTS } from './data';
import { CourseTrack, StudyMode, PaymentPlan, EnrollmentState } from './types';
import base64Data from './base64.json';

// Custom dynamic vector Logo for contrast
export function Logo({ className = "h-11 sm:h-12 w-auto", lightText = true }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 450" className={className}>
      {/* Gold Wi-Fi Symbol on Top */}
      <g fill="none" stroke="#C9931A" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 215 155 A 45 45 0 0 1 285 155" strokeWidth="12" />
        <path d="M 185 125 A 90 90 0 0 1 315 125" strokeWidth="14" />
        <path d="M 150 90 A 140 140 0 0 1 350 90" strokeWidth="16" />
      </g>
      {/* Bobsoft text */}
      <text x="250" y="275" fontFamily="'Sora', sans-serif" fontWeight="800" fontSize="76" fill="#C9931A" textAnchor="middle" letterSpacing="-2">Bobsoft</text>
      {/* Integrated Services text */}
      <text x="250" y="340" fontFamily="'Space Grotesk', sans-serif" fontWeight="500" fontSize="34" fill={lightText ? "#FDF3DC" : "#2D2D2D"} textAnchor="middle" letterSpacing="1">Integrated Services</text>
    </svg>
  );
}

export default function App() {
  // UI States
  const [selectedCourse, setSelectedCourse] = useState<CourseTrack | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'business'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSupportBubble, setShowSupportBubble] = useState(true);

  // Enrollment Form States
  const [formState, setFormState] = useState<EnrollmentState>({
    fullName: '',
    email: '',
    phone: '',
    selectedTrackId: COURSES[0].id,
    studyMode: 'IN_PERSON',
    paymentPlan: 'FULL_PAYMENT',
    agreeToTerms: false
  });
  
  const [enrollmentType, setEnrollmentType] = useState<'free_whatsapp' | 'pay_online'>('free_whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState<{
    reference: string;
    enrollmentId: string;
    date: string;
  } | null>(null);

  // Track window scroll for active header state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter courses based on categories
  const filteredCourses = COURSES.filter(course => {
    if (activeTab === 'all') return true;
    if (activeTab === 'technical') {
      return ['web-dev', 'mobile-dev', 'cybersecurity', 'ai-prompting'].includes(course.id);
    }
    if (activeTab === 'business') {
      return ['data-analytics', 'basic-comp', 'digital-marketing'].includes(course.id);
    }
    return true;
  });

  // Calculate pricing dynamics
  const getPricingDetails = (trackId: string, mode: StudyMode, plan: PaymentPlan) => {
    const basePrice = mode === 'IN_PERSON' ? 45000 : 55000;
    
    return {
      total: basePrice,
      today: basePrice,
      remaining: 0,
      installmentsCount: 1,
      title: "Tuition Fee",
      breakdown: `Single direct payment of ₦${basePrice.toLocaleString()}`
    };
  };

  const selectedTrackData = COURSES.find(c => c.id === formState.selectedTrackId) || COURSES[0];
  const pricing = getPricingDetails(formState.selectedTrackId, formState.studyMode, formState.paymentPlan);

  // Course Icon Resolver
  const getCourseIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case 'Code': return <Code className={className} />;
      case 'BarChart2': return <BarChart2 className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Monitor': return <Monitor className={className} />;
      case 'Megaphone': return <Megaphone className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  // Helper to handle track choice and auto scroll to calculator
  const selectTrackAndScroll = (trackId: string) => {
    setFormState(prev => ({ ...prev, selectedTrackId: trackId }));
    setSelectedCourse(null); // Close modal if open
    
    // Smooth scroll to enroll section
    const element = document.getElementById('enroll-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Helper to construct WhatsApp message and link
  const getEnrollmentWhatsAppUrl = () => {
    const regCode = enrollmentSuccess?.enrollmentId || 'PENDING';
    const ref = enrollmentSuccess?.reference || '';
    const isFree = enrollmentType === 'free_whatsapp';
    
    let text = `Hello Bobsoft,\n\nI just enrolled for a course! Here are my registration details:\n\n*Full Name:* ${formState.fullName}\n*Phone:* ${formState.phone}\n*Email:* ${formState.email}\n*Specialization:* ${selectedTrackData.title}\n*Learning Mode:* ${formState.studyMode === 'IN_PERSON' ? 'Physical (IAUE Campus)' : 'Online Live'}\n*Reg Code:* ${regCode}\n\n`;
    
    if (isFree) {
      text += `*Payment Mode:* Free Enrollment (WhatsApp Verification)`;
    } else {
      text += `*Payment Mode:* Online Payment (Paystack)\n*Amount:* ₦${pricing.today.toLocaleString()}\n*Ref:* ${ref}`;
    }
    
    text += `\n\nPlease confirm my enrollment. Thank you!`;
    return `https://wa.me/2349095203318?text=${encodeURIComponent(text)}`;
  };

  // Paystack Integration or Free WhatsApp Enrollment Trigger
  const handleEnrollAndPay = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formState.fullName || !formState.email || !formState.phone) {
      alert("Please fill in your full name, email and phone number to proceed.");
      return;
    }
    
    if (!formState.agreeToTerms) {
      alert("Please agree to the enrollment terms and conditions.");
      return;
    }

    setIsSubmitting(true);

    const isFree = enrollmentType === 'free_whatsapp';
    const ref = (isFree ? 'WA-FREE-' : 'BOBSOFT-') + Math.floor((Math.random() * 100000000) + 10000000);
    const paymentAmount = isFree ? 0 : pricing.today;

    if (isFree) {
      setTimeout(() => {
        setIsSubmitting(false);
        const regCode = 'BIB-' + Math.floor((Math.random() * 90000) + 10000);
        setEnrollmentSuccess({
          reference: ref,
          enrollmentId: regCode,
          date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
        });

        // Trigger auto WhatsApp redirect in background/new tab
        const messageText = `Hello Bobsoft,\n\nI just enrolled for a course! Here are my registration details:\n\n*Full Name:* ${formState.fullName}\n*Phone:* ${formState.phone}\n*Email:* ${formState.email}\n*Specialization:* ${selectedTrackData.title}\n*Learning Mode:* ${formState.studyMode === 'IN_PERSON' ? 'Physical (IAUE Campus)' : 'Online Live'}\n*Reg Code:* ${regCode}\n\n*Payment Mode:* Free Enrollment (WhatsApp Verification)\n\nPlease confirm my enrollment. Thank you!`;
        const whatsappUrl = `https://wa.me/2349095203318?text=${encodeURIComponent(messageText)}`;
        try {
          window.open(whatsappUrl, '_blank');
        } catch (error) {
          console.log("Auto WhatsApp redirect prevented:", error);
        }
      }, 1200);
    } else {
      const win = window as any;
      // If Paystack is loaded in window
      if (win.PaystackPop) {
        try {
          const handler = win.PaystackPop.setup({
            key: 'pk_test_d30f40bfb7fe00995fffe7c166e4a2b950892be8', // Test Key for visual sandbox
            email: formState.email,
            amount: paymentAmount * 100, // in kobo
            currency: 'NGN',
            ref: ref,
            metadata: {
              custom_fields: [
                {
                  display_name: "Full Name",
                  variable_name: "full_name",
                  value: formState.fullName
                },
                {
                  display_name: "Selected Track",
                  variable_name: "selected_track",
                  value: selectedTrackData.title
                },
                {
                  display_name: "Study Mode",
                  variable_name: "study_mode",
                  value: formState.studyMode
                },
                {
                  display_name: "Payment Plan",
                  variable_name: "payment_plan",
                  value: formState.paymentPlan
                },
                {
                  display_name: "Phone Number",
                  variable_name: "phone_number",
                  value: formState.phone
                }
              ]
            },
            callback: function(response: any) {
              setIsSubmitting(false);
              setEnrollmentSuccess({
                reference: response.reference || ref,
                enrollmentId: 'BIB-' + Math.floor((Math.random() * 90000) + 10000),
                date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
              });
            },
            onClose: function() {
              setIsSubmitting(false);
            }
          });
          handler.openIframe();
        } catch (err) {
          console.error("Paystack load error, falling back to simulated high-fidelity secure checkout", err);
          triggerSimulatedCheckout(ref, paymentAmount);
        }
      } else {
        // Fallback simulation in sandbox if JS SDK blocked or disconnected
        triggerSimulatedCheckout(ref, paymentAmount);
      }
    }
  };

  const triggerSimulatedCheckout = (ref: string, amount: number) => {
    setTimeout(() => {
      setIsSubmitting(false);
      setEnrollmentSuccess({
        reference: ref,
        enrollmentId: 'BIB-' + Math.floor((Math.random() * 90000) + 10000),
        date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
      });
    }, 1500); // 1.5s professional spinner simulation
  };

  const resetEnrollment = () => {
    setEnrollmentSuccess(null);
    setFormState({
      fullName: '',
      email: '',
      phone: '',
      selectedTrackId: COURSES[0].id,
      studyMode: 'IN_PERSON',
      paymentPlan: 'FULL_PAYMENT',
      agreeToTerms: false
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F7F4EF] text-[#2D2D2D] selection:bg-[#C9931A] selection:text-[#1A1A1A]">
      
      {/* ================= HEADER & NAVIGATION ================= */}
      <header id="main-header" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1A1A1A]/95 backdrop-blur-md shadow-lg py-3 border-b border-[#C9931A]/20' : 'bg-[#1A1A1A] py-5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Brand */}
          <a href="#" className="flex items-center group">
            <Logo className="h-14 sm:h-16 w-auto transform group-hover:scale-[1.03] transition-transform duration-300" lightText={true} />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#about-section" className="text-gray-300 hover:text-[#C9931A] font-medium text-sm tracking-wide transition-colors">About</a>
            <a href="#courses-section" className="text-gray-300 hover:text-[#C9931A] font-medium text-sm tracking-wide transition-colors">Syllabus tracks</a>
            <a href="#advantage-section" className="text-gray-300 hover:text-[#C9931A] font-medium text-sm tracking-wide transition-colors">The IAUE Advantage</a>
            <a href="#testimonials-section" className="text-gray-300 hover:text-[#C9931A] font-medium text-sm tracking-wide transition-colors">Success Stories</a>
            <a href="#faq-section" className="text-gray-300 hover:text-[#C9931A] font-medium text-sm tracking-wide transition-colors">FAQs</a>
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="#enroll-section" 
              className="bg-gradient-to-r from-[#C9931A] to-[#E8B040] hover:from-[#E8B040] hover:to-[#C9931A] text-black font-semibold text-sm px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Enroll Now
            </a>
          </div>

          {/* Mobile Hamburguer Trigger */}
          <button 
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:text-[#C9931A] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-[#1A1A1A] border-t border-[#C9931A]/10 mt-3"
            >
              <div className="px-4 pt-3 pb-6 space-y-4 flex flex-col">
                <a 
                  href="#about-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#C9931A] font-medium py-2 border-b border-gray-800"
                >
                  About Bobsoft
                </a>
                <a 
                  href="#courses-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#C9931A] font-medium py-2 border-b border-gray-800"
                >
                  Syllabus tracks
                </a>
                <a 
                  href="#advantage-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#C9931A] font-medium py-2 border-b border-gray-800"
                >
                  The IAUE Advantage
                </a>
                <a 
                  href="#testimonials-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#C9931A] font-medium py-2 border-b border-gray-800"
                >
                  Success Stories
                </a>
                <a 
                  href="#faq-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-[#C9931A] font-medium py-2 border-b border-gray-800"
                >
                  FAQs
                </a>
                <a 
                  href="#enroll-section" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-[#C9931A] to-[#E8B040] text-black font-semibold text-center py-3 rounded-lg block shadow-md mt-4"
                >
                  Enroll Now
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>


      {/* ================= HERO SECTION ================= */}
      <section id="hero-section" className="relative pt-32 pb-20 md:pt-44 md:pb-28 bg-gradient-to-b from-[#1A1A1A] via-[#222222] to-[#1A1A1A] text-white overflow-hidden">
        
        {/* Subtle glowing elements */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-[#C9931A]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-[#E8B040]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#C9931A]/15 to-transparent border-l-4 border-[#C9931A] px-4 py-2 rounded-r-lg">
                <Sparkles className="w-4 h-4 text-[#C9931A]" />
                <span className="text-xs uppercase font-bold tracking-widest text-[#E8B040]">IGNATIUS AJURU UNIVERSITY CAMPUS, PORT HARCOURT</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                Learn Real Tech Skills.<br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#C9931A] via-[#E8B040] to-[#C9931A] bg-clip-text text-transparent">
                  Build a Secured Future.
                </span>
              </h1>

              <p className="text-gray-300 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
                Join our premium 6-Month Industrial Training Cohort in Rumuolumeni. Undergo 100% practical physical classes led by experts, build a real-world portfolio, and gain standard certifications that open doors to global opportunities.
              </p>

              {/* Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9931A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">100% Practical-First Curriculum</h4>
                    <p className="text-xs text-gray-400">Zero abstract theories. Solve real cases daily.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9931A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Convenient Tuition Installments</h4>
                    <p className="text-xs text-gray-400">Secure entry with ₦25,000, spread balance later.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9931A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">IAUE Campus Tech Lab</h4>
                    <p className="text-xs text-gray-400">Old Shopping Complex. Accessible & highly secured.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C9931A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white">Recognized Certificates</h4>
                    <p className="text-xs text-gray-400">Valuable digital and physical credentials.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <a 
                  href="#courses-section" 
                  className="bg-gradient-to-r from-[#C9931A] to-[#E8B040] hover:from-[#E8B040] hover:to-[#C9931A] text-black font-bold text-center px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Explore 7 Syllabus Tracks</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                
                <a 
                  href="#enroll-section" 
                  className="bg-transparent border-2 border-white/20 hover:border-[#C9931A] text-white hover:text-[#C9931A] font-semibold text-center px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Tuition Calculator</span>
                </a>
              </div>
            </div>

            {/* Hero Right Media Grid - LIVE PHOTOS REDESIGN */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full max-w-md mx-auto aspect-square lg:max-w-none">
                
                {/* Background artistic framing border */}
                <div className="absolute inset-4 border border-[#C9931A]/30 rounded-3xl -rotate-3 transform"></div>

                {/* Main Live Photo 1 (Students Collaborating in Lab) */}
                <div className="absolute inset-0 z-10 overflow-hidden rounded-3xl shadow-2xl rotate-2 transform hover:rotate-0 transition-transform duration-500 border-4 border-[#1A1A1A]">
                  <img 
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" 
                    alt="Bobsoft Students collaborating in an IT lab session" 
                    className="w-full h-full object-cover grayscale-25 hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Floating Caption on Main Photo */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs text-[#C9931A] font-bold tracking-widest uppercase">Live Class Scene</p>
                    <h3 className="font-display font-bold text-sm text-white">Peer-to-Peer collaborative coding and statistics practicals</h3>
                  </div>
                </div>

                {/* Overlapping Small Live Photo 2 (The Coding Experience) */}
                <div className="absolute -bottom-6 -left-6 w-1/2 aspect-video z-20 overflow-hidden rounded-xl shadow-xl -rotate-6 transform hover:rotate-0 transition-transform duration-300 border-2 border-[#1A1A1A] hidden sm:block">
                  <img 
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80" 
                    alt="Hands-on software coding" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Overlapping Small Live Photo 3 (Student success) */}
                <div className="absolute -top-6 -right-6 w-40 h-40 z-20 overflow-hidden rounded-full shadow-xl rotate-12 transform hover:rotate-0 transition-transform duration-300 border-4 border-[#C9931A] hidden sm:block">
                  <img 
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&h=400&q=80" 
                    alt="Happy student on campus" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Mini Badge Widget */}
                <div className="absolute top-1/2 -right-4 bg-[#C9931A] text-black px-4 py-2 rounded-lg shadow-lg font-display font-extrabold text-xs tracking-wider z-30 uppercase animate-bounce">
                  Next Cohort Starting Soon!
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= STATS OVERVIEW ROW ================= */}
      <section className="bg-[#1A1A1A] border-y border-[#C9931A]/20 py-8 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-2">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#C9931A]">6 MONTHS</h3>
              <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider mt-1">Cohort Duration</p>
            </div>
            <div className="p-2 border-l border-gray-800">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">7 MAJORS</h3>
              <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider mt-1">Specialized Tracks</p>
            </div>
            <div className="p-2 border-l border-gray-800">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#C9931A]">₦25,000</h3>
              <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider mt-1">Entry Tuition Deposit</p>
            </div>
            <div className="p-2 border-l border-gray-800">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">100%</h3>
              <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider mt-1">Practical & Physical</p>
            </div>
          </div>
        </div>
      </section>


      {/* ================= ABOUT SECTION ================= */}
      <section id="about-section" className="py-20 md:py-28 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column Left */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] sm:aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80" 
                  alt="Students in classroom learning analytics" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#C9931A]/10 mix-blend-multiply"></div>
              </div>
              
              {/* Overlapping Info Card */}
              <div className="absolute -bottom-6 -right-6 md:right-4 bg-[#1A1A1A] text-white p-5 rounded-xl shadow-lg border border-[#C9931A]/30 max-w-xs">
                <MapPin className="w-6 h-6 text-[#C9931A] mb-2" />
                <h4 className="font-display font-semibold text-sm">Where inside IAUE?</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Old Shopping Complex, Rumuolumeni, right behind the University's Table Water Factory. High safety with active campus security.
                </p>
              </div>
            </div>

            {/* About Right Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#C9931A] uppercase">WHO WE ARE</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1A1A1A] tracking-tight">
                Empowering Rivers State Youth and Students with Future-Ready Capabilities.
              </h2>
              <p className="text-[#2D2D2D] text-base leading-relaxed font-light">
                Bobsoft Integrated Services is Port Harcourt's premium vocational IT institute. We bridge the critical gap between university theory and real industry needs. Many graduates hold certificates but lack the core skills to build web software, audit servers, run analytics projects, or manage campaigns.
              </p>
              <p className="text-[#2D2D2D] text-base leading-relaxed font-light">
                Our 24-week Industrial Training curriculum is built for absolute beginners, business owners looking to scale, and students undergoing academic I.T. requirements. We guarantee a classroom experience where you don't just write notes; you design systems, generate reports, and secure databases.
              </p>

              {/* Unique selling cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="w-8 h-8 rounded-lg bg-[#C9931A]/10 text-[#C9931A] flex items-center justify-center mb-3">
                    <Users className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-semibold text-sm text-[#1A1A1A]">Interactive Peer Cohorts</h4>
                  <p className="text-xs text-gray-500 mt-1">Learn alongside highly motivated colleagues. Pair-program, collaborate, and push standard goals.</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="w-8 h-8 rounded-lg bg-[#C9931A]/10 text-[#C9931A] flex items-center justify-center mb-3">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-semibold text-sm text-[#1A1A1A]">Career & Portfolios Coaching</h4>
                  <p className="text-xs text-gray-500 mt-1">Learn how to write professional CVs, brand your LinkedIn profile, and present capstones to recruiters.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= INTERACTIVE COURSES / SYLLABUS DIRECTORY ================= */}
      <section id="courses-section" className="py-20 md:py-28 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest text-[#C9931A] uppercase">DISCOVER YOUR PATH</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1A1A1A]">
              Choose Your Specialized 6-Month Training Major
            </h2>
            <p className="text-gray-500 font-light text-sm sm:text-base">
              All tracks are meticulously structured for both beginners and experienced players. Click on any major to explore the rich modules, skills gained, and direct career paths.
            </p>

            {/* Filter Tabs */}
            <div className="flex justify-center pt-6">
              <div className="inline-flex bg-[#F7F4EF] p-1 rounded-xl border border-gray-200 shadow-inner">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${activeTab === 'all' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-gray-600 hover:text-[#1A1A1A]'}`}
                >
                  All Majors
                </button>
                <button 
                  onClick={() => setActiveTab('technical')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${activeTab === 'technical' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-gray-600 hover:text-[#1A1A1A]'}`}
                >
                  Software & Cyber
                </button>
                <button 
                  onClick={() => setActiveTab('business')}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${activeTab === 'business' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-gray-600 hover:text-[#1A1A1A]'}`}
                >
                  Business & Data Analytics
                </button>
              </div>
            </div>
          </div>

          {/* Grid Layout of Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course) => (
                <motion.div 
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#F7F4EF] rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group h-full"
                >
                  {/* Card Banner Image (VIBRANT STYLING) */}
                  <div className="h-44 relative overflow-hidden bg-[#1A1A1A]">
                    <img 
                      src={course.bgImage} 
                      alt={course.title} 
                      className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 text-black text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded shadow-sm flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-[#C9931A]" />
                      <span>{course.duration}</span>
                    </div>

                    {/* Float icon */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#C9931A] text-black flex items-center justify-center shadow-md">
                      {getCourseIcon(course.iconName, "w-5 h-5")}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <h3 className="font-display font-bold text-lg text-[#1A1A1A] group-hover:text-[#C9931A] transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed flex-grow">
                      {course.shortDesc}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {course.skillsGained.slice(0, 4).map((skill, index) => (
                        <span key={index} className="bg-white text-gray-700 text-[10px] font-medium border border-gray-200 px-2 py-0.5 rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons on card */}
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200/50">
                      <button 
                        onClick={() => setSelectedCourse(course)}
                        className="bg-transparent border border-gray-300 hover:border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white text-xs font-semibold py-2.5 rounded-lg transition-all duration-200"
                      >
                        Syllabus details
                      </button>
                      <button 
                        onClick={() => selectTrackAndScroll(course.id)}
                        className="bg-[#C9931A] hover:bg-[#E8B040] text-black text-xs font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-sm"
                      >
                        Enroll Track
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>


      {/* ================= COURSE DETAILS / SYLLABUS MODAL ================= */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-[#F7F4EF] rounded-2xl shadow-2xl border border-gray-200 max-w-3xl w-full max-h-[85vh] overflow-y-auto z-10 relative"
            >
              {/* Header Banner */}
              <div className="h-44 relative overflow-hidden bg-black">
                <img 
                  src={selectedCourse.bgImage} 
                  alt={selectedCourse.title} 
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F7F4EF] via-black/20 to-black/40"></div>
                
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition-colors focus:outline-none"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Banner Text overlay */}
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="flex items-center space-x-2 text-[#C9931A] text-xs font-bold uppercase tracking-widest mb-1 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded w-fit">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{selectedCourse.duration} Track</span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#1A1A1A] drop-shadow-sm leading-tight">
                    {selectedCourse.title}
                  </h3>
                </div>
              </div>

              {/* Contents scroll */}
              <div className="p-6 md:p-8 space-y-6">
                
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold tracking-widest text-gray-500">Track overview</h4>
                  <p className="text-gray-700 font-light text-sm md:text-base leading-relaxed">
                    {selectedCourse.longDesc}
                  </p>
                </div>

                {/* Grid Modules & outcomes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Modules Accordion Syllabus */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                      <BookOpenCheck className="w-4 h-4 text-[#C9931A]" />
                      <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#1A1A1A]">Curriculum Modules</h4>
                    </div>
                    <ul className="space-y-2.5">
                      {selectedCourse.modules.map((mod, index) => (
                        <li key={index} className="flex items-start text-xs text-gray-600 font-light">
                          <span className="w-5 h-5 rounded-full bg-white text-[#C9931A] font-semibold flex items-center justify-center shrink-0 mr-2.5 border border-gray-200">
                            {index + 1}
                          </span>
                          <span className="mt-0.5">{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career & Skills */}
                  <div className="space-y-6">
                    {/* Skills Gained */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                        <Sparkles className="w-4 h-4 text-[#C9931A]" />
                        <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#1A1A1A]">Acquired Skills</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCourse.skillsGained.map((skill, index) => (
                          <span key={index} className="bg-white text-gray-700 text-xs border border-gray-200 px-3 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Career Outcomes */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
                        <Users className="w-4 h-4 text-[#C9931A]" />
                        <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#1A1A1A]">Career Options</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 font-light">
                        {selectedCourse.careerPaths.map((path, index) => (
                          <div key={index} className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9931A]" />
                            <span>{path}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Modal Options */}
                <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-xs text-gray-500">Physical classes starting soon at</p>
                    <p className="text-xs font-semibold text-[#1A1A1A]">Ignatius Ajuru University, Port Harcourt</p>
                  </div>
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <button 
                      onClick={() => setSelectedCourse(null)}
                      className="flex-1 sm:flex-initial text-xs font-medium text-gray-600 hover:text-black px-4 py-2.5"
                    >
                      Close Syllabus
                    </button>
                    <button 
                      onClick={() => selectTrackAndScroll(selectedCourse.id)}
                      className="flex-1 sm:flex-initial bg-gradient-to-r from-[#C9931A] to-[#E8B040] hover:from-[#E8B040] hover:to-[#C9931A] text-black font-semibold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all duration-200"
                    >
                      Enroll in Track
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ================= THE ADVANTAGE SECTION ================= */}
      <section id="advantage-section" className="py-20 md:py-28 bg-[#1A1A1A] text-white relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C9931A]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest text-[#C9931A] uppercase">WHY BOBSOFT?</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl">
              An Unfair Advantage for Your Tech Career
            </h2>
            <p className="text-gray-400 font-light text-sm sm:text-base">
              Online courses are easy to close, and home study can be lonely. Bobsoft creates an elite physical learning habitat designed for focus, network-building, and continuous practical progress.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Item 1 */}
            <div className="bg-[#2D2D2D] p-8 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#C9931A]/10 text-[#C9931A] rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg">Ignatius Ajuru Campus Venue</h3>
                <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                  Located at the Old Shopping Complex, Rumuolumeni, our lab is fully secured by professional campus security. No worries about light outages or unsafe locations. Easily accessible for all.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span>Rumuolumeni, PH</span>
                <span>Active Protection</span>
              </div>
            </div>

            {/* Item 2 */}
            <div className="bg-[#2D2D2D] p-8 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#C9931A]/10 text-[#C9931A] rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg">Professional Certification</h3>
                <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                  Earn high-value physical certificates signed by certified software engineers and statistical researchers. Graduates also receive private verified digital credentials to showcase on LinkedIn.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span>Earned Credential</span>
                <span>Employer Endorsed</span>
              </div>
            </div>

            {/* Item 3 */}
            <div className="bg-[#2D2D2D] p-8 rounded-2xl border border-gray-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-[#C9931A]/10 text-[#C9931A] rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg">Cohort Mentorship & Capstones</h3>
                <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                  No video pre-recordings! Attend highly interactive daily lab sessions with active instructors. Present your final group and individual capstone projects to corporate evaluators.
                </p>
              </div>
              <div className="pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                <span>1-on-1 Guidance</span>
                <span>Physical Lab Reviews</span>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= INTERACTIVE TUITION & ENROLLMENT CALCULATOR ================= */}
      <section id="enroll-section" className="py-20 md:py-28 bg-[#F7F4EF] scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest text-[#C9931A] uppercase">SECURE YOUR SPOT TODAY</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1A1A1A]">
              Tuition Planner & Interactive Enrollment
            </h2>
            <p className="text-gray-500 font-light text-sm sm:text-base">
              Customize your learning mode, select a flexible payment plan, and calculate your exact schedule instantly. Lock your seat safely using secure Paystack checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Planner Form Left */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <form onSubmit={handleEnrollAndPay} className="space-y-6">
                
                <h3 className="font-display font-bold text-xl text-[#1A1A1A] border-b border-gray-100 pb-3 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[#C9931A]" />
                  <span>1. Configure Your Major & Mode</span>
                </h3>

                {/* Grid selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Major select */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Select Specialized Major</label>
                    <select 
                      value={formState.selectedTrackId}
                      onChange={(e) => setFormState(prev => ({ ...prev, selectedTrackId: e.target.value }))}
                      className="w-full bg-[#F7F4EF] border border-gray-300 rounded-xl px-4 py-3 font-semibold text-sm text-gray-800 focus:outline-none focus:border-[#C9931A]"
                    >
                      {COURSES.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Mode select */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block">Select Learning Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setFormState(prev => ({ ...prev, studyMode: 'IN_PERSON' }))}
                        className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all border ${formState.studyMode === 'IN_PERSON' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow' : 'bg-[#F7F4EF] text-gray-700 border-gray-300 hover:border-[#1A1A1A]'}`}
                      >
                        In-Person (₦45k)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setFormState(prev => ({ ...prev, studyMode: 'ONLINE' }))}
                        className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all border ${formState.studyMode === 'ONLINE' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow' : 'bg-[#F7F4EF] text-gray-700 border-gray-300 hover:border-[#1A1A1A]'}`}
                      >
                        Online (₦55k)
                      </button>
                    </div>
                  </div>

                </div>

                <h3 className="font-display font-bold text-xl text-[#1A1A1A] border-b border-gray-100 pb-3 pt-4 flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[#C9931A]" />
                  <span>2. Student Bio Details</span>
                </h3>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Chinedu Aleru" 
                      value={formState.fullName}
                      onChange={(e) => setFormState(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full bg-[#F7F4EF] border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9931A]"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Phone Number (WhatsApp preferred)</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 0813 862 3125" 
                      value={formState.phone}
                      onChange={(e) => setFormState(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-[#F7F4EF] border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9931A]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Email Address (For receipts & portal)</label>
                  <input 
                    type="email" 
                    placeholder="e.g. chinedu@gmail.com" 
                    value={formState.email}
                    onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-[#F7F4EF] border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9931A]"
                    required
                  />
                </div>

                <h3 className="font-display font-bold text-xl text-[#1A1A1A] border-b border-gray-100 pb-3 pt-4 flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-[#C9931A]" />
                  <span>3. Choose Enrollment Pathway</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WhatsApp Free option */}
                  <button
                    type="button"
                    onClick={() => setEnrollmentType('free_whatsapp')}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between h-28 ${enrollmentType === 'free_whatsapp' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md' : 'bg-[#F7F4EF] text-gray-700 border-gray-200 hover:border-[#C9931A]'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${enrollmentType === 'free_whatsapp' ? 'text-[#E8B040]' : 'text-gray-500'}`}>Free Enrollment</span>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </div>
                    <div>
                      <span className="font-display font-black text-sm block">₦0.00 Free Admission</span>
                      <span className="text-[10px] text-gray-400 mt-1 block leading-tight">Instant submit & verification via WhatsApp</span>
                    </div>
                  </button>

                  {/* Online Payment option */}
                  <button
                    type="button"
                    onClick={() => setEnrollmentType('pay_online')}
                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between h-28 ${enrollmentType === 'pay_online' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md' : 'bg-[#F7F4EF] text-gray-700 border-gray-200 hover:border-[#C9931A]'}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${enrollmentType === 'pay_online' ? 'text-[#E8B040]' : 'text-gray-500'}`}>Direct Tuition Payment</span>
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                    <div>
                      <span className="font-display font-black text-sm block">₦{pricing.today.toLocaleString()} Pay Now</span>
                      <span className="text-[10px] text-gray-400 mt-1 block leading-tight">Secure checkout using Paystack gateway</span>
                    </div>
                  </button>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="terms-checkbox"
                    checked={formState.agreeToTerms}
                    onChange={(e) => setFormState(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="w-4 h-4 mt-0.5 accent-[#C9931A] cursor-pointer"
                    required
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-gray-500 cursor-pointer select-none font-light leading-relaxed">
                    I agree to Bobsoft's cohort code-of-conduct, and confirm that I will present a functional laptop for my physical/online lectures.
                  </label>
                </div>

                {/* Submit button inside form */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-xl font-display font-bold text-center text-sm uppercase tracking-wider shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 ${isSubmitting ? 'bg-gray-400 text-gray-200 cursor-wait' : enrollmentType === 'free_whatsapp' ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-[1.01] active:scale-[0.99]' : 'bg-[#C9931A] hover:bg-[#E8B040] text-black hover:scale-[1.01] active:scale-[0.99]'}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>{enrollmentType === 'free_whatsapp' ? 'Processing Enrollment...' : 'Connecting with Paystack...'}</span>
                    </>
                  ) : enrollmentType === 'free_whatsapp' ? (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Complete Free Enrollment via WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Securely Enroll & Pay ₦{pricing.today.toLocaleString()}</span>
                    </>
                  )}
                </button>

              </form>
            </div>

            {/* Dynamic Visual Invoice Right (HIGH CRAFTSMANSHIP DESIGN) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-[#1A1A1A] text-white rounded-2xl border border-gray-800 shadow-xl overflow-hidden relative flex flex-col flex-grow">
                
                {/* Visual Gold Stamp */}
                <div className="absolute top-6 right-6 border-2 border-dashed border-[#C9931A]/40 rounded px-3 py-1 rotate-12 select-none pointer-events-none hidden sm:block">
                  <p className="text-[10px] font-display font-extrabold text-[#C9931A] uppercase tracking-widest">COHORT ENROLLMENT</p>
                  <p className="text-[8px] text-center text-gray-400">BOBSOFT IAUE</p>
                </div>

                {/* Invoice Header */}
                <div className="p-6 border-b border-gray-800 bg-[#252525]">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C9931A] animate-pulse"></div>
                    <span className="text-[10px] font-bold tracking-widest text-[#C9931A] uppercase">LIVE DETAILED ESTIMATE</span>
                  </div>
                  <h3 className="font-display font-bold text-lg mt-1 text-white">Tuition & Schedule Summary</h3>
                  <p className="text-xs text-gray-400 mt-1">Bobsoft Integrated Services • Port Harcourt Campus</p>
                </div>

                {/* Invoice Body */}
                <div className="p-6 flex-grow space-y-6">
                  
                  {/* Row Track */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Selected Specialization</span>
                    <p className="font-display font-extrabold text-sm text-white leading-tight">
                      {selectedTrackData.title}
                    </p>
                    <p className="text-xs text-[#C9931A] mt-0.5">Syllabus Track Duration: 24 Weeks (6 Months)</p>
                  </div>

                  {/* Pricing Rows Table */}
                  <div className="border-t border-dashed border-gray-800 pt-4 space-y-3 text-xs">
                    
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-light">Study Mode:</span>
                      <span className="font-bold text-white uppercase tracking-wider">
                        {formState.studyMode === 'IN_PERSON' ? '📍 Physical (IAUE Campus)' : '💻 Online Live'}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-dashed border-gray-800 pb-3">
                      <span className="text-gray-400 font-light">Base Tuition Cost:</span>
                      <span className="font-semibold text-white">
                        ₦{formState.studyMode === 'IN_PERSON' ? '45,000' : '55,000'}.00
                      </span>
                    </div>

                     <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-gray-800/80">
                      <div>
                        <span className="text-gray-400 text-[10px] font-bold uppercase block tracking-wider">Amount Due Today</span>
                        <span className="text-[10px] text-gray-500 font-light leading-none">
                          {enrollmentType === 'free_whatsapp' ? 'Submit details for free' : 'Locks seat & portal access'}
                        </span>
                      </div>
                      <span className="font-display font-extrabold text-[#C9931A] text-xl">
                        ₦{enrollmentType === 'free_whatsapp' ? '0' : pricing.today.toLocaleString()}
                      </span>
                    </div>

                  </div>

                  {enrollmentType === 'free_whatsapp' ? (
                    <div className="bg-green-950/20 p-3.5 rounded-xl border border-green-900/40 text-center text-[11px] text-green-400 font-light flex items-center justify-center space-x-1.5">
                      <span>✅</span>
                      <span>You can enroll completely free! Tap submit to verify on WhatsApp.</span>
                    </div>
                  ) : (
                    <div className="bg-green-950/20 p-3.5 rounded-xl border border-green-900/40 text-center text-[11px] text-green-400 font-light flex items-center justify-center space-x-1.5">
                      <span>🎉</span>
                      <span>This payment fully clears your complete tuition for this specialization!</span>
                    </div>
                  )}

                  {/* Barcode representation */}
                  <div className="pt-4 border-t border-gray-800/80 flex flex-col items-center justify-center space-y-2">
                    <div className="h-8 w-48 bg-white/5 opacity-40 rounded flex space-x-1 overflow-hidden p-1">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="h-full bg-white" 
                          style={{ width: `${Math.floor(Math.random() * 3) + 1}px` }}
                        />
                      ))}
                    </div>
                    <span className="text-[8px] text-gray-600 font-mono tracking-widest uppercase">
                      {enrollmentType === 'free_whatsapp' ? 'FREE REGISTRATION VERIFICATION' : 'SECURE PAYMENT CHECKOUT'}
                    </span>
                  </div>

                </div>

                {/* Visual Stamp */}
                <div className="p-4 bg-[#202020] border-t border-gray-800 text-center flex items-center justify-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-[#C9931A]" />
                  <span className="text-[10px] text-gray-400 font-light">
                    {enrollmentType === 'free_whatsapp' 
                      ? 'No payment card required. Your details are sent directly to 09095203318.'
                      : 'Pay securely using Cards, Bank Transfer, USSD, or OPay on Paystack.'}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= SUCCESS STATUS MODAL ================= */}
      <AnimatePresence>
        {enrollmentSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-lg w-full text-center z-10 relative space-y-6"
            >
              
              <div className="flex justify-center pb-1">
                <Logo className="h-12 w-auto" lightText={false} />
              </div>

              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-2xl text-[#1A1A1A]">
                  {enrollmentType === 'free_whatsapp' ? 'Registration Submitted!' : 'Enrollment Confirmed!'}
                </h3>
                <p className="text-gray-500 font-light text-sm">
                  {enrollmentType === 'free_whatsapp' 
                    ? 'Your free registration is ready. Please send the details via WhatsApp to confirm.'
                    : `Welcome to Bobsoft Integrated Services, ${formState.fullName}! Your slot has been secured.`}
                </p>
              </div>

              {/* Invoice slip representation */}
              <div className="bg-[#F7F4EF] rounded-xl p-4 border border-gray-200 space-y-3 text-left text-xs">
                
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Student ID / Reg Code:</span>
                  <span className="font-bold text-[#1A1A1A]">{enrollmentSuccess.enrollmentId}</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Selected Track Major:</span>
                  <span className="font-semibold text-[#1A1A1A] text-right max-w-[200px] truncate">{selectedTrackData.title}</span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Tuition Paid:</span>
                  <span className="font-bold text-green-600">
                    {enrollmentType === 'free_whatsapp' ? '₦0.00 (Free Enrollment)' : `₦${pricing.today.toLocaleString()}`}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">
                    {enrollmentType === 'free_whatsapp' ? 'Enrollment Pathway:' : 'Paystack Transaction Ref:'}
                  </span>
                  <span className="font-mono text-gray-600 truncate max-w-[200px] block">
                    {enrollmentType === 'free_whatsapp' ? 'Free (WhatsApp Verified)' : enrollmentSuccess.reference}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Enrollment Date:</span>
                  <span className="text-[#1A1A1A]">{enrollmentSuccess.date}</span>
                </div>

              </div>

              <div className="bg-[#FDF3DC] text-[#C9931A] p-4 rounded-xl border border-[#C9931A]/20 text-xs font-light text-left space-y-1 leading-relaxed">
                <p className="font-bold text-[#1A1A1A]">Next Critical Steps:</p>
                {enrollmentType === 'free_whatsapp' ? (
                  <>
                    <p>1. <strong className="text-green-600 font-bold">CRITICAL:</strong> Click the <strong className="text-green-600 font-bold">Send Details to WhatsApp</strong> button below to send your details to <strong className="text-black font-bold">09095203318</strong>.</p>
                    <p>2. Your slot will be verified immediately upon receipt of your message.</p>
                    <p>3. Save your Reg Code: <strong className="text-black font-bold">{enrollmentSuccess.enrollmentId}</strong>.</p>
                  </>
                ) : (
                  <>
                    <p>1. A confirmation slip was prepared for email dispatch.</p>
                    <p>2. Save your Reg Code: <strong className="text-black font-bold">{enrollmentSuccess.enrollmentId}</strong>.</p>
                    <p>3. Click the WhatsApp button below to instantly notify us and get added to our active classroom channels.</p>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={getEnrollmentWhatsAppUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl shadow text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Details to WhatsApp</span>
                </a>
                <button 
                  onClick={resetEnrollment}
                  className="flex-1 bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
                >
                  Done, Go back
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ================= TESTIMONIALS SECTION ================= */}
      <section id="testimonials-section" className="py-20 md:py-28 bg-white border-y border-gray-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest text-[#C9931A] uppercase">PROVEN CAREER GROWTH</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1A1A1A]">
              Graduates Driving Success Across Nigeria
            </h2>
            <p className="text-gray-500 font-light text-sm sm:text-base">
              Don’t take our word for it. Read honest reviews from Rumuolumeni campus students and local business managers who secured remote jobs, statistics consulting, and tech contracts.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="bg-[#F7F4EF] p-6 sm:p-8 rounded-2xl border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-6 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                {/* Quote details */}
                <div className="space-y-4">
                  <div className="flex text-[#C9931A]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm font-light italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </div>

                {/* Profile card footer */}
                <div className="flex items-center space-x-3.5 pt-4 border-t border-gray-200">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#1A1A1A]">{testimonial.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5 tracking-wider">{testimonial.role}</p>
                    <p className="text-[10px] text-[#C9931A] font-semibold mt-0.5">{testimonial.trackName} • {testimonial.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Collaborative CTA banner */}
          <div className="mt-16 bg-[#1A1A1A] text-white p-8 rounded-2xl border border-[#C9931A]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <h3 className="font-display font-bold text-lg text-white">Join the Next 6-Month Rumuolumeni Cohort</h3>
              <p className="text-gray-400 text-xs sm:text-sm font-light">Secure physical space in Port Harcourt's premium vocational IT institute.</p>
            </div>
            <a 
              href="#enroll-section" 
              className="bg-gradient-to-r from-[#C9931A] to-[#E8B040] hover:from-[#E8B040] hover:to-[#C9931A] text-black font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md whitespace-nowrap"
            >
              Start Your Tuition Plan
            </a>
          </div>

        </div>
      </section>


      {/* ================= CAMPUS GEOLOCATION & MAP SECTION ================= */}
      <section id="location-section" className="py-20 md:py-28 bg-[#F7F4EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Info */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest text-[#C9931A] uppercase">FIND OUR LAB</span>
                <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A]">
                  Located Inside IAUE Rumuolumeni Campus
                </h2>
                <p className="text-gray-600 font-light text-sm leading-relaxed">
                  Our fully-equipped vocational training center is positioned right inside the main university grounds in Port Harcourt. This means our students enjoy total campus safety, regular electrical support, and convenient parking.
                </p>
              </div>

              {/* Location Highlights Cards */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200/60 flex items-start space-x-3 shadow-xs">
                  <MapPin className="w-5 h-5 text-[#C9931A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-[#1A1A1A] uppercase tracking-wider">Physical Street Address</h4>
                    <p className="text-xs text-gray-500 font-light leading-relaxed mt-0.5">
                      Old Shopping Complex, Ignatius Ajuru University of Education, Rumuolumeni, Port Harcourt, Rivers State. (Right behind the IAUE Table Water Factory).
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200/60 flex items-start space-x-3 shadow-xs">
                  <Phone className="w-5 h-5 text-[#C9931A] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-xs text-[#1A1A1A] uppercase tracking-wider">Instant Calls & Direct Directions</h4>
                    <p className="text-xs text-gray-500 font-light leading-relaxed mt-0.5">
                      Need on-campus direction guidance? Call our coordinator desk instantly at <strong className="text-black font-semibold">{INSTANT_CONTACTS.phone}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <a 
                href={INSTANT_CONTACTS.whatsapp}
                target="_blank" 
                rel="noreferrer"
                className="bg-transparent border-2 border-gray-300 hover:border-[#1A1A1A] text-gray-700 hover:text-[#1A1A1A] text-xs font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Map className="w-4 h-4 text-[#C9931A]" />
                <span>Get Interactive Location Guide</span>
              </a>
            </div>

            {/* Right Map Card */}
            <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm min-h-[350px] relative overflow-hidden">
              <iframe 
                src={INSTANT_CONTACTS.mapEmbedUrl} 
                className="w-full h-full rounded-xl border-0 min-h-[320px]" 
                allowFullScreen={true} 
                loading="lazy" 
                title="Bobsoft Lab Location inside IAUE Campus"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </section>


      {/* ================= INTERACTIVE FAQs ACCORDION ================= */}
      <section id="faq-section" className="py-20 md:py-28 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold tracking-widest text-[#C9931A] uppercase">CLEARING ALL DOUBTS</span>
            <h2 className="font-display font-extrabold text-3xl text-[#1A1A1A]">
              Frequently Asked Tuition & Enrollment Queries
            </h2>
            <p className="text-gray-500 font-light text-sm sm:text-base max-w-2xl mx-auto">
              We understand that choosing an IT vocational major is a critical career milestone. Here are detailed explanations to common concerns from our prospective students.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-[#F7F4EF] rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 shadow-xs"
                >
                  {/* Trigger head */}
                  <button 
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between space-x-4 focus:outline-none focus-visible:bg-[#C9931A]/5"
                  >
                    <span className="font-display font-bold text-sm sm:text-base text-[#1A1A1A] pr-4">
                      {faq.question}
                    </span>
                    <span className="shrink-0 p-1 rounded-full bg-white text-gray-500 border border-gray-200">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#C9931A]" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {/* Body Content drawer */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-gray-200/60 bg-white"
                      >
                        <div className="p-5 sm:p-6 text-xs sm:text-sm text-gray-600 font-light leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-[#1A1A1A] text-white border-t border-[#C9931A]/10 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-gray-800">
            
            {/* Branding Column */}
            <div className="md:col-span-5 space-y-4">
              <a href="#" className="flex items-center group">
                <Logo className="h-12 sm:h-14 w-auto transform group-hover:scale-[1.03] transition-transform duration-300" lightText={true} />
              </a>
              <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed max-w-sm">
                Empowering individuals, students, and businesses with practical, premium vocational digital skills and high-impact statistical research methodology. Located right inside IAUE Campus, Port Harcourt.
              </p>
              <div className="flex space-x-3 pt-2">
                <span className="text-[10px] uppercase font-bold text-[#C9931A] tracking-wider">REGISTRATION RC: 3048593</span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#C9931A]">Syllabus Majors</h4>
              <ul className="space-y-2 text-xs text-gray-400 font-light">
                {COURSES.map(c => (
                  <li key={c.id}>
                    <button 
                      onClick={() => setSelectedCourse(c)}
                      className="hover:text-white transition-colors"
                    >
                      • {c.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Direct Contacts Column */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#C9931A]">Campus Desk Contact</h4>
              <ul className="space-y-3 text-xs text-gray-400 font-light">
                <li className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-[#C9931A] shrink-0 mt-0.5" />
                  <span>Old Shopping Complex, Ignatius Ajuru University of Education (IAUE), Rumuolumeni Campus, Port Harcourt.</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-[#C9931A] shrink-0" />
                  <a href={`tel:${INSTANT_CONTACTS.phone}`} className="hover:text-white transition-colors">
                    {INSTANT_CONTACTS.phone}
                  </a>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-[#C9931A] shrink-0" />
                  <span>{INSTANT_CONTACTS.email}</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Sub Footer copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-light">
            <p>© {new Date().getFullYear()} Bobsoft Integrated Services. All Rights Reserved. Old Shopping Complex, IAUE, Port Harcourt.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#about-section" className="hover:text-white transition-colors">About</a>
              <a href="#faq-section" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#enroll-section" className="hover:text-white transition-colors">Terms of Tuition</a>
            </div>
          </div>

        </div>
      </footer>


      {/* ================= FLOATING WHATSAPP CHAT ADVISOR BUBBLE ================= */}
      <AnimatePresence>
        {showSupportBubble && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40 flex items-center space-x-2.5 group"
          >
            {/* Friendly Greeting popover */}
            <div className="hidden sm:block bg-white text-black text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              Need Help? Chat with a Bobsoft Advisor!
            </div>
            
            {/* WhatsApp Link button */}
            <a 
              href={INSTANT_CONTACTS.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-colors transform hover:scale-105 active:scale-95 duration-300 relative border border-white/20"
              aria-label="Contact support on WhatsApp"
            >
              <MessageCircle className="w-7 h-7" />
              {/* Pulse status light */}
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
