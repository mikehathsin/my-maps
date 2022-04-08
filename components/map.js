import React, { Component, createRef } from "react";
import {
  Map,
  TileLayer,
  Marker,
  Popup,
  MapControl,
  withLeaflet,
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";

class SearchBox extends MapControl {
  constructor(props) {
    super(props);
    props.leaflet.map.on("geosearch/showlocation", (e) =>
      props.updateMarker(e)
    );
  }

  createLeafletElement() {
    const searchEl = GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: "bar",
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: false,
      searchLabel: "search",
    });
    return searchEl;
  }
}

export default class MyMap extends Component {
  state = {
    center: {
      lat: 31.698956,
      lng: 76.732407,
    },
    marker: {
      lat: 31.698956,
      lng: 76.732407,
    },
    zoom: 13,
    draggable: true,
  };

  refmarker = createRef(this.state.marker);

  toggleDraggable = () => {
    this.setState({ draggable: !this.state.draggable });
  };

  updateMarker = (e) => {
    // const marker = e.marker;
    this.setState({
      marker: e.marker.getLatLng(),
    });
    console.log(e.marker.getLatLng());
  };

  updatePosition = () => {
    const marker = this.refmarker.current;
    if (marker != null) {
      this.setState({
        marker: marker.leafletElement.getLatLng(),
      });
    }
    console.log(marker.leafletElement.getLatLng());
  };

  render() {
    console.log("aca son", this.props);
    const { marks, latitude, longitude } = this.props;
    const position = [this.state.center.lat, this.state.center.lng];
    const markerPosition = [this.state.marker.lat, this.state.marker.lng];
    const SearchBar = withLeaflet(SearchBox);

    return (
      <div className="map-root">
        <Map
          center={position}
          zoom={2}
          style={{
            height: "700px",
          }}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {[
            ...marks,
            { latitude, longitude, createdAt: "La ubicación actual" },
          ].map((mark) => {
            return (
              <Marker
                key={mark.createdAt}
                animate={true}
                ref={this.refmarker}
                position={[mark.latitude, mark.longitude]}
              >
                <Popup minWidth={90}>
                  {typeof mark.createdAt === "string"
                    ? "La ubicación actual"
                    : new Date(mark.createdAt).toString()}
                </Popup>
              </Marker>
            );

            return (
              <Marker
                key={mark.createdAt}
                position={[mark.latitude, mark.longitude]}
              >
                <Popup>{new Date(mark.createdAt).toString()}</Popup>
              </Marker>
            );
          })}

          <SearchBar updateMarker={this.updateMarker} />
        </Map>
        <style jsx>
          {`
            .map-root {
              height: 100%;
            }
            .leaflet-container {
              height: 400px !important;
              width: 80%;
              margin: 0 auto;
            }
          `}
        </style>
      </div>
    );
  }
}
