import React, { useState, useEffect } from "react";
import { storiesOf } from "@storybook/react";
import useGeolocation from "@rooks/use-geolocation";
import README from "@rooks/use-geolocation/README.md";

function App() {
  const [when, setWhen] = React.useState(false);

  const geoObj = useGeolocation({ when });

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      flexDirection: "column"
    }}>
      <button
        onClick={() => {
          setWhen(true);
        }}
      >
        Get Geolocation
      </button>
      <p>{geoObj && JSON.stringify(geoObj)}</p>
    </div>
  );
}

function AppWithoutWhen() {
  const geoObj = useGeolocation();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <p>{geoObj && JSON.stringify(geoObj)}</p>
    </div>
  );
}
storiesOf("useGeolocation", module)
  .addParameters({
    readme: {
      sidebar: README
    }
  })
  .add("Basic Example Geolocation", () => <AppWithoutWhen />)
  .add("Basic Example Geolocation (conditional)", () => <App />)

