"use client";

import {
  AlertTriangle,
  ShieldCheck,
  Activity,
  Stethoscope,
  Clock,
  FileText,
  ArrowRight,
  Home,
  HousePlus,
  UtensilsCrossed,
  Pill,
  Building2,
  MapPin,
  FlaskConical,
  Video,
  BadgeCheck,
  PhoneCall,
} from "lucide-react";
import mockData from "@/lib/mockData.json";
import Link from "next/link";
import { useMemo } from "react";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ResourceType = "hospital" | "food" | "home" | "medicine" | "diagnostics" | "telehealth";

type NearbyResource = {
  type: ResourceType;
  name: string;
  distance: string;
  description: string;
  actionLabel: string;
  rating?: string;
  hours?: string;
  phone?: string;
  address?: string;
  deliveryTime?: string;
  nurseContact?: string;
  responseTime?: string;
  waitTime?: string;
  insurance?: string[];
  languages?: string[];
  verified?: boolean;
  services?: string[];
  dietTags?: string[];
};

export default function ResultsDisplay({
  messages,
  onRestart,
}: {
  messages: ChatMessage[];
  onRestart: () => void;
}) {
  // Simple heuristic: check user messages for keywords to pick scenario
  const userText = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase()).join(" ");
  
  const scenario = useMemo(() => {
    return mockData.scenarios.find(s => userText.includes(s.trigger)) || mockData.scenarios.find(s => s.trigger === "default")!;
  }, [userText]);

  const serviceResources = useMemo(() => {
    const recommended = scenario.recommendedServices ?? [];
    return (mockData.nearbyResources as NearbyResource[]).filter((resource) =>
      recommended.includes(resource.type)
    );
  }, [scenario]);

  const serviceIcons = {
    hospital: Building2,
    food: UtensilsCrossed,
    home: HousePlus,
    medicine: Pill,
    diagnostics: FlaskConical,
    telehealth: Video,
  } as const;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Emergency": return "bg-red-500 border-red-600 text-white";
      case "Urgent care": return "bg-orange-500 border-orange-600 text-white";
      case "See doctor soon": return "bg-yellow-100 border-yellow-300 text-yellow-800";
      default: return "bg-green-100 border-green-300 text-green-800";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "Emergency": return <AlertTriangle className="h-5 w-5" />;
      case "Urgent care": return <Clock className="h-5 w-5" />;
      default: return <ShieldCheck className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto w-full bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Action */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-navy-900 transition-colors">
            <Home className="mr-2 h-4 w-4" /> Home
          </Link>
          <button onClick={onRestart} className="text-sm font-medium text-health-600 hover:text-health-700 bg-health-50 px-4 py-2 rounded-full">
            Start New Assessment
          </button>
        </div>

        {/* Assessment Card */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-fade-in">
          <div className="bg-navy-900 text-white p-6 pb-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
              <Activity className="h-40 w-40" />
            </div>
            <h1 className="relative text-2xl font-bold mb-2">Assessment Complete</h1>
            <p className="relative text-slate-300 text-sm max-w-lg mx-auto">
              Based on the symptoms you shared, our AI has generated an informational overview. This is NOT a medical diagnosis.
            </p>
          </div>

          <div className="-mt-6 mb-6 px-6 relative z-10 flex justify-center">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full shadow-lg border-2 font-bold ${getUrgencyColor(scenario.urgency)}`}>
              {getUrgencyIcon(scenario.urgency)}
              Recommended Urgency: {scenario.urgency}
            </div>
          </div>

          <div className="px-6 pb-6 space-y-8">
            
            {/* Possible Conditions */}
            <div>
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2 border-b pb-2">
                <Stethoscope className="h-5 w-5 text-health-500" />
                Possible Considerations
              </h3>
              <div className="space-y-4">
                {scenario.conditions.map((cond, i) => (
                  <div key={i} className="flex p-4 rounded-xl border bg-slate-50 hover:bg-white transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-800">{cond.name}</h4>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          cond.probability === 'High' ? 'bg-orange-100 text-orange-800' :
                          cond.probability === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {cond.probability} Match
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{cond.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Next Actions */}
            <div>
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2 border-b pb-2">
                <FileText className="h-5 w-5 text-health-500" />
                Suggested Next Actions
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {scenario.actions.map((action, i) => (
                  <li key={i} className="flex bg-white border p-3 rounded-lg shadow-sm text-sm text-slate-700 items-start">
                    <ArrowRight className="h-4 w-4 text-health-500 mr-2 mt-0.5 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2 border-b pb-2">
                <MapPin className="h-5 w-5 text-health-500" />
                Nearby Support Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceResources.map((resource) => {
                  const Icon = serviceIcons[resource.type as keyof typeof serviceIcons] ?? Activity;

                  return (
                    <div key={resource.name} className="rounded-2xl border bg-white p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-health-50 text-health-600 ring-1 ring-health-100">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-semibold text-slate-900">{resource.name}</h4>
                              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-health-600">
                                {resource.distance}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                                {resource.type}
                              </span>
                              {resource.verified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                  <BadgeCheck className="h-3 w-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            {resource.rating && (
                              <span className="rounded-full bg-health-50 px-2.5 py-1 font-semibold text-health-700">
                                Rating {resource.rating}
                              </span>
                            )}
                            {resource.hours && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">{resource.hours}</span>
                            )}
                            {resource.deliveryTime && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                Delivery {resource.deliveryTime}
                              </span>
                            )}
                            {resource.responseTime && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                Response {resource.responseTime}
                              </span>
                            )}
                            {resource.waitTime && (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1">
                                Wait {resource.waitTime}
                              </span>
                            )}
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{resource.description}</p>
                          <div className="mt-3 space-y-1 text-xs text-slate-500">
                            {resource.address && <p>Address: {resource.address}</p>}
                            {resource.phone && <p>Phone: {resource.phone}</p>}
                            {resource.nurseContact && <p>Nurse: {resource.nurseContact}</p>}
                          </div>
                          {(resource.services?.length ||
                            resource.dietTags?.length ||
                            resource.insurance?.length ||
                            resource.languages?.length) && (
                            <div className="mt-3 flex flex-wrap gap-2 text-xs">
                              {(resource.services ?? []).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-white px-2.5 py-1 text-slate-600 shadow-sm ring-1 ring-slate-200"
                                >
                                  {tag}
                                </span>
                              ))}
                              {(resource.dietTags ?? []).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-white px-2.5 py-1 text-slate-600 shadow-sm ring-1 ring-slate-200"
                                >
                                  {tag}
                                </span>
                              ))}
                              {(resource.insurance ?? []).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 shadow-sm ring-1 ring-blue-100"
                                >
                                  {tag}
                                </span>
                              ))}
                              {(resource.languages ?? []).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 shadow-sm ring-1 ring-slate-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-medium text-white">
                              {resource.actionLabel}
                              <ArrowRight className="h-4 w-4" />
                            </button>
                            {resource.phone && (
                              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
                                <PhoneCall className="h-4 w-4 text-health-600" />
                                Call Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {serviceResources.length === 0 && (
                <div className="rounded-2xl border bg-white p-5 text-sm text-slate-600">
                  No nearby services are available for this assessment yet. Please check again later or contact a local provider.
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-500 text-center">
              The information provided by SymptomSense AI is for educational and informational purposes only and does not constitute medical advice or professional services. Please consult a licensed medical professional for formal diagnosis and treatment.
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}
