import Link from "next/link";
import {
  Activity,
  ShieldAlert,
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Clock,
  HousePlus,
  UtensilsCrossed,
  Pill,
  Building2,
  MapPin,
  FlaskConical,
  Video,
} from "lucide-react";
import mockData from "@/lib/mockData.json";
import HealthCentersNearby from "@/components/HealthCentersNearby";

const serviceIcons = {
  "Home Services": HousePlus,
  "Food Services": UtensilsCrossed,
  "Tablets & Medicines": Pill,
  "Nearby Hospitals": Building2,
  "Diagnostics & Labs": FlaskConical,
  "Telehealth": Video,
} as const;

export default function Home() {
  return (
    <main className="flex-1 flex flex-col bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 text-health-600">
              <Activity className="h-8 w-8" />
              <span className="font-bold text-xl tracking-tight text-slate-900">SymptomSense <span className="text-health-500">AI</span></span>
            </div>
            <div>
              <Link href="/chat" className="text-sm font-medium text-slate-600 hover:text-health-600 mr-4">
                Start Check
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Emergency Warning Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-start sm:items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-sm text-red-800">
            <strong>MEDICAL EMERGENCY:</strong> If you are experiencing severe symptoms such as chest pain, extreme difficulty breathing, signs of stroke, severe bleeding, or suicidal thoughts, please call your local emergency number (e.g., 911) or go to the nearest emergency room immediately.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-white pt-16 pb-32 overflow-hidden border-b">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:pb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-navy-900 tracking-tight mb-6">
            Understand your symptoms <br className="hidden md:block"/> with AI-powered clarity
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 mb-8">
            Answer a few questions about how you're feeling and receive informational insights on possible causes and recommended next steps.
          </p>
          <div className="flex justify-center flex-col sm:flex-row gap-4">
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-health-500 hover:bg-health-600 transition-colors"
            >
              Start Symptom Check
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">Takes about 3 minutes - 100% Free - Private</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-health-50 text-health-500 rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-health-100">
              <HeartPulse className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">AI-Guided Analysis</h3>
            <p className="text-slate-600">Our advanced AI asks personalized follow-up questions to understand your unique condition accurately.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-health-50 text-health-500 rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-health-100">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">Possible Causes</h3>
            <p className="text-slate-600">Receive a breakdown of potential conditions structured by likelihood, though not a medical diagnosis.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-health-50 text-health-500 rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-health-100">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-navy-900 mb-3">Clear Next Steps</h3>
            <p className="text-slate-600">Get guidance on urgency, whether you need emergency care, to see a doctor soon, or if self-care is appropriate.</p>
          </div>
        </div>
      </div>

      <div className="border-y bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-health-600 mb-4">
              Recovery Support
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              From symptoms to nearby help in one place
            </h2>
            <p className="text-slate-600 text-lg">
              After the AI assessment, users can continue to nearby hospitals, home services,
              food support, and medicine access without leaving the experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-12">
            {mockData.serviceCategories.map((service) => {
              const Icon = serviceIcons[service.name as keyof typeof serviceIcons] ?? Activity;

              return (
                <div
                  key={service.name}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:bg-white"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-health-50 text-health-600 shadow-sm ring-1 ring-health-100">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-navy-900">{service.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-health-600">
                    {service.availability}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {service.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-white px-2.5 py-1 text-slate-600 shadow-sm ring-1 ring-slate-200"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-health-600">
                    {service.cta}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 rounded-3xl bg-navy-900 px-6 py-8 text-white sm:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="flex items-center gap-2 text-health-300 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Nearby recommendations
                </p>
                <h3 className="mt-2 text-2xl font-bold">Hospitals, food, and medicine around the user</h3>
                <p className="mt-2 max-w-2xl text-sm text-slate-300">
                  This section can later be connected to live maps and location APIs. For now, the
                  site highlights service types users expect after a symptom check.
                </p>
              </div>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy-900 shadow-sm"
              >
                Try the Full Flow
              </Link>
            </div>
          </div>
        </div>
      </div>

      <HealthCentersNearby />

      {/* Footer / Disclaimer */}
      <footer className="mt-auto bg-navy-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p className="mb-4">
            <strong>Disclaimer:</strong> SymptomSense AI provides information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p>&copy; {new Date().getFullYear()} SymptomSense AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
