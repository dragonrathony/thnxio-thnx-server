import React from "react";
import Script from "react-load-script";

export default function ExternalMap() {
  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <Script url="https://stagingaz.blob.core.windows.net/thnx-embedded-map/thnx-embedded-map.js" />
      <thnx-embedded-map />
    </div>
  );
}
