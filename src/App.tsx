import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

// images & icon
import ArrowIcon from "./images/icon-arrow.svg";

// api-key
const MAP_API_KEY = import.meta.env.VITE_API_KEY;

type ResultState = {
  ip: string;
  timezone: string;
  city: string;
  isp: string;

  lat: number;
  lng: number;
};

const App = () => {
  const [displayRes, setDisplayRes] = useState<ResultState | null>(null);
  const [search, setSearch] = useState<string | number>("8.8.8.8");

  const searchIp = async () => {
    try {
      const fetchMap = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${MAP_API_KEY}&ipAddress=${search}`
      );
      const data = await fetchMap.json();
      setDisplayRes({
        ip: data.ip,
        timezone: data.location.timezone,
        city: data.location.city,
        isp: data.isp,
        lat: data.location.lat,
        lng: data.location.lng,
      });
    } catch (error) {
      console.log("internal error: ", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchIp();
    }
  };

  useEffect(() => {
    const fetchApi = async () => {
      await searchIp();
    };
    fetchApi();
  }, []);

  return (
    <div className="relative min-h-screen max-h-full bg-gray-400">
      <div className="bg-app px-10 py-10 pb-40 flex flex-col items-center gap-10">
        <h3 className="text-3xl text-white">IP Address Tracker</h3>

        <div className="flex justify-between w-96 items-center ">
          <input
            type="text"
            placeholder="Search for any IP address or domain"
            className="w-[88%] bg-white h-10 outline-0 pl-5 pr-2 rounded-tl-full rounded-bl-full"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <div
            onClick={searchIp}
            className="flex justify-center items-center rounded-tr-full rounded-br-full cursor-pointer bg-black h-10 w-[12%]"
          >
            <img src={ArrowIcon} alt="arrow icon" className="" />
          </div>
        </div>
      </div>

      <div className="absolute w-full max-sm:top-44 top-56 max-sm:h-auto h-40 rounded-md flex justify-center gap-5 z-50">
        <div className="w-[80%] bg-white rounded-lg max-sm:p-5 p-10">
          {displayRes && (
            <div className="flex text-center max-sm:flex-col flex-row justify-center max-sm:gap-3 gap-5">
              <ul className="max-sm:border-0 max-sm:pr-0 border-r pr-20">
                <li className="uppercase text-sm mb-2 opacity-50 font-semibold">
                  ip address
                </li>
                <li className="font-semibold text-2xl">{displayRes.ip}</li>
              </ul>
              <ul className="max-sm:border-0 max-sm:px-0 border-r px-20">
                <li className="uppercase text-sm mb-2 opacity-50 font-semibold">
                  location
                </li>
                <li className="font-semibold text-2xl">{displayRes.city}</li>
              </ul>
              <ul className="max-sm:border-0 max-sm:px-0 border-r px-20">
                <li className="uppercase text-sm mb-2 opacity-50 font-semibold">
                  timezone
                </li>
                <li className="font-semibold text-2xl">
                  UTC{displayRes.timezone}
                </li>
              </ul>
              <ul className="max-sm:pl-0 pl-20">
                <li className="uppercase text-sm mb-2 opacity-50 font-semibold">
                  isp
                </li>
                <li className="font-semibold text-2xl">
                  {displayRes.isp || "Google LCC"}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-sm:h-full z-10">
        {displayRes && (
          <MapContainer
            // @ts-ignore
            center={[displayRes.lat, displayRes.lng] as [number, number]}
            zoom={13}
            scrollWheelZoom
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[displayRes.lat, displayRes.lng]}>
              <Popup>
                IP: {displayRes.ip} <br />
                Location: {displayRes.city}
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default App;
