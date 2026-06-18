'use client';

import L, { LatLngExpression } from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

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

function MapViewport({ selectedFeature }: { selectedFeature: BairroFeature | null }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedFeature) {
      map.setView(defaultCenter, 12);
      return;
    }

    const [lng, lat] = selectedFeature.properties.centroid;
    const radiusMeters = selectedFeature.properties.radiusKm * 1000;
    map.fitBounds(L.latLng(lat, lng).toBounds(radiusMeters * 2.8), {
      maxZoom: 14,
    });
  }, [map, selectedFeature]);

  return null;
}

export default function BairroMap({
  selectedFeature,
}: {
  selectedFeature: BairroFeature | null;
}) {
  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      scrollWheelZoom={false}
      className="map-low-color h-full min-h-[420px] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapViewport selectedFeature={selectedFeature} />
      {saoLuisBairrosGeoJson.features.map((feature) => {
        const [lng, lat] = feature.properties.centroid;
        const isSelected = feature.properties.id === selectedFeature?.properties.id;

        return (
          <Circle
            key={feature.properties.id}
            center={[lat, lng]}
            radius={feature.properties.radiusKm * 1000}
            pathOptions={{
              color: isSelected ? "#0f766e" : "#94a3b8",
              fillColor: isSelected ? "#14b8a6" : "#cbd5e1",
              fillOpacity: isSelected ? 0.24 : 0.08,
              opacity: isSelected ? 0.9 : 0.45,
              weight: isSelected ? 3 : 0,
              stroke: isSelected,
            }}
          >
            <Popup>
              <strong>{feature.properties.name}</strong>
              <br />
              {feature.properties.zone}
            </Popup>
          </Circle>
        );
      })}
      {selectedFeature ? (
        <Marker position={[
          selectedFeature.properties.centroid[1],
          selectedFeature.properties.centroid[0],
        ]}>
          <Popup>
            <strong>{selectedFeature.properties.name}</strong>
            <br />
            {selectedFeature.properties.zone}
          </Popup>
        </Marker>
      ) : null}
    </MapContainer>
  );
}
