import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-search";

// Core API import
import Graphic from "@arcgis/core/Graphic.js";


function Home() {
  const handleViewReady = (event) => {
    const viewElement = event.target;

    const point = {
      type: "point",
      longitude: 13.54008,
      latitude: 52.45714,
    };

    const markerSymbol = {
      type: "simple-marker",
      style: "path",
      size: 8,
      color: "red",
      outline: {
        color: "white",
        width: 1,
      },
    };

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
    });

    viewElement.graphics.add(pointGraphic);
  };

  return (
    <arcgis-map 
      class="w-full h-full"
      item-id="f56c2695190f4f4da032f79b2d51aaa9" 
      onarcgisViewReadyChange={handleViewReady}>
        
      <arcgis-zoom position="top-left" />
      <arcgis-search position="top-right" />
      <arcgis-legend position="bottom-left" />
    </arcgis-map>
  );
}

export default Home;