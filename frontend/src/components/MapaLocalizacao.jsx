import { useEffect, useRef } from "react";
import { Map, View } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import { Point } from "ol/geom";
import { Feature } from "ol";
import { Icon, Style } from "ol/style";
import { fromLonLat } from "ol/proj";

const MapaLocalizacao = ({ localizacao }) => {
  const mapRef = useRef();

  useEffect(() => {
    if (!localizacao) return;

    const { latitude, longitude } = localizacao;

    const marker = new Feature({
      geometry: new Point(fromLonLat([longitude, latitude])),
    });

    marker.setStyle(new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: "/public/icone-pet.png",
        scale: 0.1,
      }),
    }));

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: new VectorSource({ features: [marker] }) }),
      ],
      view: new View({
        center: fromLonLat([longitude, latitude]),
        zoom: 15,
      }),
    });

    return () => map.setTarget(null);
  }, [localizacao]);

  return <div ref={mapRef} className="w-full h-[400px] mt-4" />;
};

export default MapaLocalizacao;
