import { useContext, useEffect, useRef, useState } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import { useGetGoogleApiKeyQuery } from "../../hooks/orderHooks";

const defaultLocation = { lat: 52.54428, lng: 13.44094 };

export default function MapPage() {
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  const [googleApiKey, setGoogleApiKey] = useState("");
  const [center] = useState(defaultLocation);
  const [location, setLocation] = useState(center);
  const [inputValue, setInputValue] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const { data: googleConfig } = useGetGoogleApiKeyQuery();

  useEffect(() => {
    if (googleConfig) {
      setGoogleApiKey(googleConfig.key);
      dispatch({
        type: "SET_FULLBOX_ON",
      });
    }
  }, [dispatch, googleConfig]);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onIdle = () => {
    setLocation({
      lat: defaultLocation.lat,
      lng: defaultLocation.lng,
    });
  };

  const onMarkerLoad = (marker: google.maps.Marker) => {
    markerRef.current = marker;
  };

  const onConfirm = () => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS_MAP_LOCATION",
      payload: {
        lat: location.lat,
        lng: location.lng,
      },
    });
    toast.success("Location selected successfully.");
    navigate("/shipping");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="full-box">
      <LoadScript googleMapsApiKey={googleApiKey}>
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <div className="map-input-box">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter address"
            />
            <Button type="button" onClick={onConfirm}>
              Confirm
            </Button>
          </div>
          <Marker position={location} onLoad={onMarkerLoad} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
