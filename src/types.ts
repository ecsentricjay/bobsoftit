export interface CourseModule {
  title: string;
  description: string;
}

export interface CourseTrack {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  duration: string;
  modules: string[];
  skillsGained: string[];
  careerPaths: string[];
  bgImage: string;
}

export type StudyMode = 'IN_PERSON' | 'ONLINE';

export type PaymentPlan = 'FULL_PAYMENT';

export interface EnrollmentState {
  fullName: string;
  email: string;
  phone: string;
  selectedTrackId: string;
  studyMode: StudyMode;
  paymentPlan: PaymentPlan;
  agreeToTerms: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  trackName: string;
  avatar: string;
  quote: string;
  year: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
