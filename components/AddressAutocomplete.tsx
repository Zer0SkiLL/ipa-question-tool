"use client"; // For Next.js App Router
import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function AddressAutocomplete({ onSelect }) {
  const [address, setAddress] = useState("");
  const inputRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current || geocoderRef.current) return;

    geocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: "address",
      placeholder: "Start typing an address...",
      marker: false,
    });

    geocoderRef.current.addTo(inputRef.current);

    geocoderRef.current.on("result", (event) => {
      setAddress(event.result.place_name);
      onSelect(event.result.place_name);
    });

    return () => geocoderRef.current?.remove();
  }, [onSelect]);

  return <div ref={inputRef} className="w-full" />;
}
