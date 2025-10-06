import { useEffect, useState } from "react";

function CityInfoWikidata({ city }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    async function fetchCityData() {
      setLoading(true);
      setError(null);

      try {
        // Wikidata-ID über Wikipedia holen
        const wikiRes = await fetch(
          `https://de.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
            city
          )}&prop=pageprops&format=json&origin=*`
        );
        const wikiJson = await wikiRes.json();
        const pages = wikiJson.query.pages;
        const pageId = Object.keys(pages)[0];
        const page = pages[pageId];
        const wikidataId = page?.pageprops?.wikibase_item;
        if (!wikidataId) throw new Error("Wikidata-ID nicht gefunden");

        // Daten von Wikidata holen
        const wdRes = await fetch(
          `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`
        );
        const wdJson = await wdRes.json();
        const entity = wdJson.entities[wikidataId];

        // Relevante Daten extrahieren
        const officialName = entity.labels.de?.value || entity.labels.en?.value || city;

        const population =
          entity.claims.P1082?.[0]?.mainsnak?.datavalue?.value?.amount
            ? parseInt(entity.claims.P1082[0].mainsnak.datavalue.value.amount)
            : "unbekannt";

        const postalCode =
          entity.claims.P281?.[0]?.mainsnak?.datavalue?.value || "unbekannt";

        const inception =
          entity.claims.P571?.[0]?.mainsnak?.datavalue?.value?.time
            ? entity.claims.P571[0].mainsnak.datavalue.value.time.slice(1, 11)
            : "unbekannt";

        const mayor =
          entity.claims.P6?.[0]?.mainsnak?.datavalue?.value?.id || null;

        const timezone =
          entity.claims.P421?.[0]?.mainsnak?.datavalue?.value?.id || null;

        const website =
          entity.claims.P856?.[0]?.mainsnak?.datavalue?.value || null;

        setData({
          officialName,
          population,
          postalCode,
          inception,
          mayor,
          timezone,
          website,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCityData();
  }, [city]);

  if (!city) return null;
  if (loading) return <p>Lädt Daten über {city}...</p>;
  if (error) return <p className="text-red-400">Fehler: {error}</p>;
  if (!data) return null;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-gray-100">
      <h2 className="text-2xl font-semibold mb-3">{data.officialName}</h2>

      <ul className="space-y-2">
        <li>
          <strong>Bevölkerung:</strong>{" "}
          {data.population !== "unbekannt"
            ? data.population.toLocaleString()
            : "unbekannt"}
        </li>
        <li>
          <strong>Gegründet am:</strong> {data.inception}
        </li>
        <li>
          <strong>Postleitzahl:</strong> {data.postalCode}
        </li>
        
        {data.website && (
          <li>
            <strong>Offizielle Website:</strong>{" "}
            <a
              href={data.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              {data.website}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default CityInfoWikidata;
