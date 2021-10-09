import { Dimensions } from "react-native";

const window = Dimensions.get("window");
const WIDTH = window.width;
const HEIGHT = window.height;

const ASPECT_RATIO = WIDTH / HEIGHT;
const LATITUDE_DELTA = 0.35;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const INITIAL_POSITION = {
  latitude: 41.924447,
  longitude: -87.687339,
  latitudeDelta: 1,
  longitudeDelta: 1
};

export const COORDS = [
  {
    location: {
      latitude: 42,
      longitude: -87,
      longitudeDelta: LONGITUDE_DELTA,
      latitudeDelta: LATITUDE_DELTA
    }
  },
  {
    location: {
      latitude: 42.1,
      longitude: -87,
      longitudeDelta: LONGITUDE_DELTA,
      latitudeDelta: LATITUDE_DELTA
    }
  },
  {
    location: {
      latitude: 42.2,
      longitude: -87,
      longitudeDelta: LONGITUDE_DELTA,
      latitudeDelta: LATITUDE_DELTA
    }
  },
  {
    location: {
      latitude: 42.3,
      longitude: -87,
      longitudeDelta: LONGITUDE_DELTA,
      latitudeDelta: LATITUDE_DELTA
    }
  },
  {
    location: {
      latitude: 42.4,
      longitude: -87,
      longitudeDelta: LONGITUDE_DELTA,
      latitudeDelta: LATITUDE_DELTA
    }
  }
];