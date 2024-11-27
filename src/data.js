export const API_KEY = "AIzaSyBdiHDrApODmB7P1elaIEdrVuRA_3JF7js";


export const value_converter = (value) => {
  if (!value || value < 0) {
    return "0";
  }
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "B";
  } else if (value >= 1_000_000) {
    return Math.floor(value / 1_000_000) + "M";
  } else if (value >= 1_000) {
    return Math.floor(value / 1_000) + "K";
  } else {
    return value.toString();
  }
};
