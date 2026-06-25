'use client';

import L, { LatLngExpression } from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useRef } from "react";

import { BairroFeature, saoLuisBairrosGeoJson } from "@/data/sao-luis-bairros";

const defaultCenter: LatLngExpression = [-2.53874, -44.2825];
const leafletMarkerIcon = typeof markerIcon === "string" ? markerIcon : markerIcon.src;
const leafletMarkerIcon2x = typeof markerIcon2x === "string" ? markerIcon2x : markerIcon2x.src;
const leafletMarkerShadow = typeof markerShadow === "string" ? markerShadow : markerShadow.src;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: leafletMarkerIcon2x,
  iconUrl: leafletMarkerIcon,
  shadowUrl: leafletMarkerShadow,
});

const tileAttribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

type LeafletContainer = HTMLDivElement & {
  _leaflet_id?: number | null;
};

export type AddressMarker = {
  lat: number;
  lng: number;
  label: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

export default function BairroMap({
  selectedFeature,
  addressMarker,
  variant = "light",
  size = "default",
}: {
  selectedFeature: BairroFeature | null;
  addressMarker?: AddressMarker | null;
  variant?: "light" | "dark";
  size?: "default" | "compact";
}) {
  const isDark = variant === "dark";
  const mapHeightClass = size === "compact" ? "min-h-[220px]" : "min-h-[420px]";
  const mapElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mapElement = mapElementRef.current;

    if (!mapElement) {
      return;
    }

    const leafletContainer = mapElement as LeafletContainer;
    leafletContainer._leaflet_id = null;

    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    const map = L.map(mapElement, {
      center: defaultCenter,
      zoom: 12,
      scrollWheelZoom: false,
    });

    L.tileLayer(tileUrl, {
      attribution: tileAttribution,
    }).addTo(map);

    const selectedFeatureId = selectedFeature?.properties.id;
    const hasSelectedBaseFeature = saoLuisBairrosGeoJson.features.some(
      (feature) => feature.properties.id === selectedFeatureId,
    );

    saoLuisBairrosGeoJson.features.forEach((feature) => {
      const [lng, lat] = feature.properties.centroid;
      const isSelected = feature.properties.id === selectedFeatureId;

      L.circle([lat, lng], {
        radius: feature.properties.radiusKm * 1000,
        color: isSelected ? (isDark ? "#67e8f9" : "#0f766e") : isDark ? "#334155" : "#94a3b8",
        fillColor: isSelected ? (isDark ? "#22d3ee" : "#14b8a6") : isDark ? "#1e293b" : "#cbd5e1",
        fillOpacity: isSelected ? 0.28 : isDark ? 0.12 : 0.08,
        opacity: isSelected ? 0.95 : isDark ? 0.5 : 0.45,
        weight: isSelected ? 3 : 0,
        stroke: isSelected,
      })
        .bindPopup(`<strong>${escapeHtml(feature.properties.name)}</strong><br />${escapeHtml(feature.properties.zone)}`)
        .addTo(map);
    });

    if (selectedFeature && !hasSelectedBaseFeature) {
      const [lng, lat] = selectedFeature.properties.centroid;

      L.circle([lat, lng], {
        radius: selectedFeature.properties.radiusKm * 1000,
        color: isDark ? "#67e8f9" : "#0f766e",
        fillColor: isDark ? "#22d3ee" : "#14b8a6",
        fillOpacity: 0.28,
        opacity: 0.95,
        weight: 3,
        stroke: true,
      })
        .bindPopup(
          `<strong>${escapeHtml(selectedFeature.properties.name)}</strong><br />${escapeHtml(
            selectedFeature.properties.zone,
          )}`,
        )
        .addTo(map);
    }

    if (selectedFeature) {
      L.marker([selectedFeature.properties.centroid[1], selectedFeature.properties.centroid[0]])
        .bindPopup(
          `<strong>${escapeHtml(selectedFeature.properties.name)}</strong><br />${escapeHtml(
            selectedFeature.properties.zone,
          )}`,
        )
        .addTo(map);
    }

    if (addressMarker) {
      L.marker([addressMarker.lat, addressMarker.lng])
        .bindPopup(`<strong>Endereço selecionado</strong><br />${escapeHtml(addressMarker.label)}`)
        .addTo(map);
    }

    if (addressMarker) {
      map.setView([addressMarker.lat, addressMarker.lng], 17);
    } else if (selectedFeature) {
      const [lng, lat] = selectedFeature.properties.centroid;
      const radiusMeters = selectedFeature.properties.radiusKm * 1000;
      map.fitBounds(L.latLng(lat, lng).toBounds(radiusMeters * 2.8), {
        maxZoom: 14,
      });
    }

    const frameId = window.requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      map.remove();
      leafletContainer._leaflet_id = null;
    };
  }, [addressMarker, isDark, selectedFeature]);

  return (
    <div
      ref={mapElementRef}
      className={`h-full ${mapHeightClass} w-full ${isDark ? "map-dark-color" : "map-low-color"}`}
    />
  );
}
