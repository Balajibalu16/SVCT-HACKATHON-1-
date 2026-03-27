"use client";

import { useMemo, useState } from "react";
import {
  MapPin,
  Navigation,
  Building2,
  Phone,
  Clock,
  ShieldAlert,
} from "lucide-react";
import cities from "@/lib/indiaCities.json";
import centers from "@/lib/healthCenters.json";

type City = {
  name: string;
  state: string;
  lat: number;
  lon: number;
};

type Center = {
  name: string;
  type: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lon: number;
};

type GeoPoint = {
  lat: number;
  lon: number;
};

const toRad = (value: number) => (value * Math.PI) / 180;

const distanceKm = (a: GeoPoint, b: GeoPoint) => {
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h =
    sinLat * sinLat +
    Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;

  return 2 * earthRadiusKm * Math.asin(Math.min(1, Math.sqrt(h)));
};

export default function HealthCentersNearby() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [coords, setCoords] = useState<GeoPoint | null>(null);
  const [status, setStatus] = useState<string>("Location not enabled");

  const nearestCity = useMemo(() => {
    if (!coords) return null;
    let closest: City | null = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    (cities as City[]).forEach((city) => {
      const dist = distanceKm(coords, { lat: city.lat, lon: city.lon });
      if (dist < closestDistance) {
        closestDistance = dist;
        closest = city;
      }
    });

    return closest ? { ...closest, distance: closestDistance } : null;
  }, [coords]);

  const effectiveCity = selectedCity || nearestCity?.name || "";

  const centerList = useMemo(() => {
    const list = centers as Center[];
    if (!effectiveCity) return list.slice(0, 4);
    return list.filter((center) => center.city === effectiveCity);
  }, [effectiveCity]);

  const centerCards = useMemo(() => {
    if (!coords) return centerList;
    return centerList
      .map((center) => ({
        ...center,
        distance: distanceKm(coords, { lat: center.lat, lon: center.lon }),
      }))
      .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  }, [centerList, coords]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Location is not supported in this browser");
      return;
    }
    setStatus("Requesting location permission...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setStatus("Location enabled");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setStatus("Location permission denied. Select a city instead.");
        } else {
          setStatus("Unable to access location. Select a city instead.");
        }
      }
    );
  };

  return (
    <section className="border-t bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-health-600">
              Nearby Health Care Centres
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-navy-900">
              Enable location to find care around you
            </h2>
            <p className="mt-4 text-slate-600 text-lg">
              Allow location access to show the closest health care centres. You can also select a city
              if you prefer not to share your location.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={requestLocation}
                className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white"
              >
                <Navigation className="h-4 w-4" />
                Enable Location
              </button>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
                <MapPin className="h-4 w-4 text-health-600" />
                {status}
              </div>
              {nearestCity && (
                <div className="inline-flex items-center gap-2 rounded-full bg-health-50 px-4 py-2 text-xs font-semibold text-health-700">
                  Nearest city: {nearestCity.name}, {nearestCity.state}
                </div>
              )}
            </div>
          </div>

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-health-50 text-health-600">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-navy-900">Choose City</h3>
                <p className="text-xs text-slate-500">
                  Use this if location permission is not enabled.
                </p>
              </div>
            </div>
            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-inner focus:outline-none focus:ring-2 focus:ring-health-500"
            >
              <option value="">Select a city</option>
              {(cities as City[]).map((city) => (
                <option key={`${city.name}-${city.state}`} value={city.name}>
                  {city.name}, {city.state}
                </option>
              ))}
            </select>
            <div className="mt-4 rounded-2xl border border-yellow-100 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
              <ShieldAlert className="mr-2 inline-block h-3 w-3" />
              This is a mock list. Replace with live city and hospital data for production.
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {centerCards.map((center) => (
            <div key={center.name} className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-navy-900">{center.name}</h4>
                  <p className="text-xs font-semibold uppercase tracking-wide text-health-600">
                    {center.type} - {center.city}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-health-50 text-health-600">
                  <Building2 className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">{center.address}</p>
              <div className="mt-4 space-y-2 text-xs text-slate-500">
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-health-600" />
                  {center.phone}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-health-600" />
                  {center.hours}
                </p>
                {"distance" in center && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-health-600" />
                    {center.distance.toFixed(1)} km away
                  </p>
                )}
              </div>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white">
                Call Centre
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
