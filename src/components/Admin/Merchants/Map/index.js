import React from "react";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from "react-google-maps";

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyD6KWwywlg2RCoUXQ-dBdauv8JeRcwTeaI",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={18}
    defaultCenter={{
      lat: parseFloat(props.data.latitude),
      lng: parseFloat(props.data.longitude)
    }}
  >
    {props.isMarkerShown && (
      <Marker
        position={{
          lat: parseFloat(props.data.latitude),
          lng: parseFloat(props.data.longitude)
        }}
        onClick={props.onMarkerClick}
      />
    )}
  </GoogleMap>
));

export default class SimpleMap extends React.PureComponent {
  state = {
    isMarkerShown: false
  };

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true });
    }, 3000);
  };

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false });
    this.delayedShowMarker();
  };

  render() {
    return this.props.data &&
      this.props.data.latitude &&
      this.props.data.longitude ? (
      <MyMapComponent
        data={this.props.data}
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
      />
    ) : null;
  }
}
