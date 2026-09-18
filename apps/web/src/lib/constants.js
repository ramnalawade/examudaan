// ============================================================
// lib/constants.js — Central Site Constants & Contact Config
// Single source of truth for all contact info, addresses,
// geo-coordinates, operating hours, and grievance details.
// ============================================================

export const SITE_CONFIG = {
  name: 'ExamUdaan.in',
  brandName: 'ExamUdaan',
  tagline: 'Your Exam. Your Career. Your Udaan.',
  subtitle: "Maharashtra's AI-Powered Sarkari Job & Exam Alerts Aggregator",
  domain: 'examudaan.in',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost'))
    ? process.env.NEXT_PUBLIC_SITE_URL
    : 'https://examudaan.in',

  // Contact Information
  contact: {
    email: 'support@examudaan.in',
    privacyEmail: 'privacy@examudaan.in',
    phone: '+91 91523 44889',
    phoneFormatted: '+91 91523 44889',
    phoneRaw: '919152344889',
    whatsappNumber: '+91 91523 44889',
    whatsappRaw: '919152344889',
    whatsappLink: 'https://wa.me/919152344889',
    whatsappAlertQueryLink: 'https://wa.me/919152344889?text=Hi%20ExamUdaan%20Support,%20I%20have%20a%20query%20regarding%20my%20alerts',
    whatsappGeneralQueryLink: 'https://wa.me/919152344889?text=Hi%20ExamUdaan,%20I%20have%20a%20question%20regarding%20the%20platform',
  },

  // Physical Location & Geo Coordinates (Pune, Maharashtra)
  location: {
    company: 'ExamUdaan EdTech',
    addressLine1: 'FC Road, Shivaji Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411005',
    fullAddress: 'FC Road, Shivaji Nagar, Pune, Maharashtra 411005',
    latitude: 18.5204,
    longitude: 73.8567,
    googleMapsUrl: 'https://maps.google.com/?q=18.5204,73.8567',
  },

  // Operating Hours
  hours: {
    workingDays: 'Monday to Saturday',
    timing: '9:00 AM – 7:00 PM IST',
    fullText: 'Monday to Saturday: 9:00 AM – 7:00 PM IST',
    weekendNote: 'Sunday & Public Holidays: Automated WhatsApp alerts operate 24x7; human helpdesk handles urgent payment issues only.',
  },

  // Statutory Grievance Redressal (DPDP Act 2023 & IT Act 2000)
  grievanceOfficer: {
    title: 'Designated Grievance Officer: Legal & Data Privacy',
    email: 'privacy@examudaan.in',
    supportEmail: 'support@examudaan.in',
    resolutionDays: 15,
  },

  // Subscription Pricing
  pricing: {
    alertMonthly: '₹49',
    alertMonthlyPeriod: '/month',
    formAssist: '₹99',
    formAssistPeriod: '/per form',
  },
}
