import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { VegaLite } from "react-vega";

export function VegaPlot() {
  const [spec, setSpec] = useState(null);
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/vega-datasets@2.11.0/data/movies.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error > ("Fehler bei Laden der Daten", error));

    const vegaSpec = {
      $schema: "https://vega.github.io/schema/vega-lite/v5.json",
      data: {
        values: data,
      },
      transform: [
        {
          filter: {
            and: [
              { field: "IMDB Rating", valid: true },
              { field: "Rotten Tomatoes Rating", valid: true },
            ],
          },
        },
      ],
      mark: "rect",
      width: 300,
      height: 200,
      encoding: {
        x: {
          bin: { maxbins: 60 },
          field: "IMDB Rating",
          type: "quantitative",
        },
        y: {
          bin: { maxbins: 40 },
          field: "Rotten Tomatoes Rating",
          type: "quantitative",
        },
        color: {
          aggregate: "count",
          type: "quantitative",
        },
      },
      config: {
        view: {
          stroke: "transparent",
        },
      },
    };
    setSpec(vegaSpec); // Die Spezifikation in den Zustand setzen
  }, [data]); // Das effect wird ausgelöst, wenn die Daten geladen sind

  // Wenn noch keine Daten geladen sind, zeige einen Lade-Indikator an
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <VegaLite spec={spec} />
    </div>
  );
}

function App() {
  return (
    <>
      <Typography variant="h3">Hello React + MUI!</Typography>;
      <VegaPlot />
    </>
  );
}

export default App;
