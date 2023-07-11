import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { BookDrive } from '../models/BookDrive';
import { africanCountries } from '../lib/enums';
import { CountryPopup } from './CountryPopup'

// for some reason drives was returned as a 2d array and I tried messing
// around with it but I think we just have to cope with this.
interface MapComponentProps {
  drives: BookDrive[];
}

// dictionary where key is the country name (as a string) and the value
// is of type UserMarker
type UserMarkerDict<UserMarker> = {
  [key: string]: UserMarker;
}

// represents a marker on the map
interface UserMarker {
  name: string,
  booksSent: number,
  longitude: number,
  latitude: number,
  xLabelOffset: number,
  yLabelOffset: number,
}

export interface CountryData {
  country: string;
  value: number;
}

// url of the topojson map
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/continents/africa.json"


// hard coded values of markers 
// IF YOU WANT TO CHANGE THIS (like mess with the order or add another
// country if one is created) then also change the africanCountries array in enums
// latitude and longitude will affect the position of the black markers on the map
// xlabel offset and ylabel offset affect the position of the label relative to its corresponding marker
// 
const userMarkers: UserMarkerDict<UserMarker> = {
  "Algeria": { name: 'Algeria', longitude: 2.6326, latitude: 28.1306, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  "Angola": { name: 'Angola', longitude: 17.8739, latitude: -11.2027, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  "Benin": { name: 'Benin', longitude: 2.3158, latitude: 8.3077, booksSent: 0, xLabelOffset: 2, yLabelOffset: 4 },
  'Botswana': { name: 'Botswana', longitude: 24.6849, latitude: -22.3285, booksSent: 0, xLabelOffset: -3, yLabelOffset: 5 },
  'Burkina Faso': { name: 'Burkina Faso', longitude: -1.5616, latitude: 12.2383, booksSent: 0, xLabelOffset: 0, yLabelOffset: -2 },
  'Burundi': { name: 'Burundi', longitude: 29.9189, latitude: -3.3731, booksSent: 0, xLabelOffset: -10, yLabelOffset: 0 },
  'Cabo Verde': { name: 'Cabo Verde', longitude: -23.6052, latitude: 15.4542, booksSent: 0, xLabelOffset: -12, yLabelOffset: 1 },
  "Cameroon": { name: 'Cameroon', longitude: 12.3547, latitude: 3.7, booksSent: 0, xLabelOffset: -11, yLabelOffset: 1 },
  "Central African Republic": { name: 'Central\n African\n Republic', longitude: 20.9394, latitude: 6.6111, booksSent: 0, xLabelOffset: 0, yLabelOffset: 4 },
  "Chad": { name: 'Chad', longitude: 18.7322, latitude: 15.4542, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  "Comoros": { name: 'Comoros', longitude: 43.8722, latitude: -11.6455, booksSent: 0, xLabelOffset: 0, yLabelOffset: -3 },
  "Republic of Congo": { name: 'Republic of Congo', longitude: 15.2663, latitude: -3, booksSent: 0, xLabelOffset: -19, yLabelOffset: 1 },
  "Democratic Republic of the Congo": { name: 'Democratic Republic\n of the Congo', longitude: 23.3222, latitude: .3222, booksSent: 0, xLabelOffset: 0, yLabelOffset: -4 },
  "Ivory Coast": { name: "Ivory Coast", longitude: -5.5471, latitude: 7.5400, booksSent: 0, xLabelOffset: 0, yLabelOffset: -3 },
  "Djibouti": { name: 'Djibouti', longitude: 43.1456, latitude: 11.5806, booksSent: 0, xLabelOffset: 10, yLabelOffset: 1 },
  "Egypt": { name: 'Egypt', longitude: 30.8025, latitude: 26.8206, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  "Equatorial Guinea": { name: 'Equatorial Guinea', longitude: 10.2679, latitude: 1.6508, booksSent: 0, xLabelOffset: -16, yLabelOffset: 1 },
  "Eritrea": { name: 'Eritrea', longitude: 39.7823, latitude: 15.1794, booksSent: 0, xLabelOffset: 0, yLabelOffset: -3 },
  'Eswatini': { name: 'Eswatini', longitude: 31.4659, latitude: -26.5225, booksSent: 0, xLabelOffset: 10, yLabelOffset: 1 },
  'Ethiopia': { name: 'Ethiopia', longitude: 39.7823, latitude: 9.1450, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  'Gabon': { name: 'Gabon', longitude: 11.6094, latitude: -0.8037, booksSent: 0, xLabelOffset: -8, yLabelOffset: 1 },
  'Gambia': { name: 'Gambia', longitude: -15.3101, latitude: 13.4432, booksSent: 0, xLabelOffset: -9, yLabelOffset: 1 },
  'Ghana': { name: 'Ghana', longitude: -1.0232, latitude: 7.9465, booksSent: 0, xLabelOffset: -2, yLabelOffset: 4 },
  'Guinea': { name: 'Guinea', longitude: -9.6966, latitude: 9.9456, booksSent: 0, xLabelOffset: -4, yLabelOffset: -3 },
  'Guinea-Bissau': { name: 'Guinea-Bissau', longitude: -15.1804, latitude: 11.8037, booksSent: 0, xLabelOffset: -14, yLabelOffset: 1 },
  'Kenya': { name: 'Kenya', longitude: 37.9062, latitude: -0.0236, booksSent: 0, xLabelOffset: 0, yLabelOffset: -5 },
  'Lesotho': { name: 'Lesotho', longitude: 28.2336, latitude: -29.6099, booksSent: 0, xLabelOffset: 10, yLabelOffset: 1 },
  'Liberia': { name: 'Liberia', longitude: -9.4250, latitude: 6.4281, booksSent: 0, xLabelOffset: -8, yLabelOffset: 1 },
  'Libya': { name: 'Libya', longitude: 17.2283, latitude: 26.3351, booksSent: 0, xLabelOffset: 0, yLabelOffset: -5 },
  'Madagascar': { name: 'Madagascar', longitude: 46.8691, latitude: -18.8792, booksSent: 0, xLabelOffset: 0, yLabelOffset: -5 },
  'Malawi': { name: 'Malawi', longitude: 34.3015, latitude: -13.2543, booksSent: 0, xLabelOffset: 0, yLabelOffset: -3 },
  'Mali': { name: 'Mali', longitude: -3.9962, latitude: 17.5707, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  'Mauritania': { name: 'Mauritania', longitude: -10.9408, latitude: 20.7984, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  'Mauritius': { name: 'Mauritius', longitude: 57.5522, latitude: -20.3484, booksSent: 0, xLabelOffset: 0, yLabelOffset: -3 },
  'Morocco': { name: 'Morocco', longitude: -7.0926, latitude: 31.7917, booksSent: 0, xLabelOffset: -10, yLabelOffset: 1 },
  'Mozambique': { name: 'Mozambique', longitude: 35.5296, latitude: -18.6657, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  'Namibia': { name: 'Namibia', longitude: 18.4904, latitude: -22.3285, booksSent: 0, xLabelOffset: -4, yLabelOffset: 5 },
  'Niger': { name: 'Niger', longitude: 9.3856, latitude: 17.4199, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  'Nigeria': { name: 'Nigeria', longitude: 8.6753, latitude: 9.0820, booksSent: 0, xLabelOffset: 0, yLabelOffset: -5 },
  'Rwanda': { name: 'Rwanda', longitude: 29.8739, latitude: -1.9403, booksSent: 0, xLabelOffset: -10, yLabelOffset: 0 },
  'Sao Tome and Principe': { name: 'Sao Tome and Principe', longitude: 6.6131, latitude: 0.1864, booksSent: 0, xLabelOffset: -19, yLabelOffset: 1 },
  'Senegal': { name: 'Senegal', longitude: -14.4735, latitude: 14.4974, booksSent: 0, xLabelOffset: 0, yLabelOffset: -3 },
  'Seychelles': { name: 'Seychelles', longitude: 55.4915, latitude: -4.6796, booksSent: 0, xLabelOffset: 0, yLabelOffset: -3 },
  'Sierra Leone': { name: 'Sierra Leone', longitude: -11.7799, latitude: 8.4606, booksSent: 0, xLabelOffset: -12, yLabelOffset: 1 },
  'Somalia': { name: 'Somalia', longitude: 46.1996, latitude: 5.1521, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  'South Africa': { name: 'South Africa', longitude: 22.7482, latitude: -30.0373, booksSent: 0, xLabelOffset: 0, yLabelOffset: -3 },
  'South Sudan': { name: 'South Sudan', longitude: 31.3070, latitude: 6.8769, booksSent: 0, xLabelOffset: -5, yLabelOffset: -4 },
  'Sudan': { name: 'Sudan', longitude: 30.2176, latitude: 12.8628, booksSent: 0, xLabelOffset: 0, yLabelOffset: -5 },
  'Tanzania': { name: 'Tanzania', longitude: 34.8888, latitude: -6.3690, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  'Togo': { name: 'Togo', longitude: 1.2195, latitude: 9.6195, booksSent: 0, xLabelOffset: -3, yLabelOffset: -3 },
  'Tunisia': { name: 'Tunisia', longitude: 9.5375, latitude: 33.8869, booksSent: 0, xLabelOffset: 0, yLabelOffset: -5 },
  'Uganda': { name: 'Uganda', longitude: 32.2903, latitude: 1.3733, booksSent: 0, xLabelOffset: 0, yLabelOffset: 4 },
  'Zambia': { name: 'Zambia', longitude: 27.8493, latitude: -14.1339, booksSent: 0, xLabelOffset: 0, yLabelOffset: 5 },
  'Zimbabwe': { name: 'Zimbabwe', longitude: 29.1549, latitude: -19.0154, booksSent: 0, xLabelOffset: 0, yLabelOffset: -3 },
};

const MapComponent: React.FC<MapComponentProps> = ({ drives }) => {
  console.log(drives)
  let countryData: CountryData[] = africanCountries.map(() => ({ country: "", value: 0 }))
  // drives refers to the completed bookDrives
  // refers to number of books sent to country with most number of books
  let maxVal: number = 0 
  for (let i = 0; i < africanCountries.length; i++) {
    // sets the country field to the corresponding african country name
    countryData[i].country = africanCountries[i]
    // finds all drives whose country corresponds to the current country
    const matchingDrives: BookDrive[] | undefined = drives ? drives.filter((drive) => drive.country === africanCountries[i]) : undefined
    // adds numBooks of each matching drive to the numbooks value of the
    // current country
    if (matchingDrives) matchingDrives.forEach((drive) => countryData[i].value += drive.fl.numBooks)
    if (countryData[i].value > maxVal) maxVal = countryData[i].value
    // sets the booksSent value for the map markers
    userMarkers[africanCountries[i]].booksSent = countryData[i].value
  }

  const getColor = (value: number): string => {
    if (value == 0) return `rgb(255, 250, 250)`
    // Calculate the color based on the value (number of books sent)
    const percentage = value / maxVal;
    const colorValue = Math.round(250 - 250 * percentage);

    return `rgb(255, ${colorValue}, ${colorValue})`;
  };

  // code from https://codesandbox.io/s/zoom-controls-iwo3f?from-embed=&file=/src/MapChart.js
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position: { coordinates: [number, number], zoom: number }) {
    setPosition(position);
  }

  // state that controls which country's info is shown in the box
  const [countryPopupInfo, setCountryPopupInfo] = useState<CountryData>()


  return (
    <div style={{ position: 'relative', height: "100%", display: "flex", flexDirection: "column"}}>
      <div className="controls" style={{
        display: "flex",
        flexDirection: 'row',
        justifyContent: "center",
        position: "absolute",
        top: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        textAlign: "center",
      }}>
        <button onClick={handleZoomIn} style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0',
          height: '2rem',
          width: '2rem',
          background: '#ff5533',
          color: '#fff',
          borderRadius: '100%',
          border: '0',
          marginBottom: '0.25rem',
          marginLeft: '0.25rem'
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            style={{ display: "inline-block", verticalAlign: "middle" }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button onClick={handleZoomOut} style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0',
          height: '2rem',
          width: '2rem',
          background: '#ff5533',
          color: '#fff',
          borderRadius: '100%',
          border: '0',
          marginLeft: '0.25rem'
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
            style={{ display: "inline-block", verticalAlign: "middle" }}

          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
      <div style={{ alignItems: "center", height: "90%", width: "100%"}}>
        <ComposableMap projection="geoMercator" style={{height: "100%", width: "100%"}} viewBox={"320 165 250 250"}>
          <ZoomableGroup zoom={position.zoom}
            center={[position.coordinates[0], position.coordinates[1]]}
            onMoveEnd={handleMoveEnd}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  // finds current country and its correspoding information
                  const country = geo.properties.geounit;
                  const countryInfo = countryData.find((data) => data.country === country);
                  return (
                    <Geography style={{}}
                      key={geo.rsmKey}
                      geography={geo}
                      fill={countryInfo ? getColor(countryInfo.value) : '#FFFFFF'}
                      stroke="#EAEAEC"
                      onMouseEnter={() => {
                        // sets the state of the current country in popup box
                        setCountryPopupInfo(countryInfo)
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {africanCountries.map((country, index) => (
              <Marker key={index} coordinates={[userMarkers[country].longitude, userMarkers[country].latitude]}>
                <circle r={1.3} fill="#000000" />
                <text textAnchor="middle" y={userMarkers[country].yLabelOffset} x={userMarkers[country].xLabelOffset} style={{ fontFamily: 'system-ui', fill: '#5D5A6D', fontSize: 3 }}>
                  {`${userMarkers[country].name}: ${userMarkers[country].booksSent}`}
                </text>
              </Marker>
            ))}

          </ZoomableGroup>
        </ComposableMap>
      </div>
      
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
        <CountryPopup data={countryPopupInfo} />

      </div>
    </div>
  );
};

export default MapComponent;
