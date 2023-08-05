import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";

// This is SatPressure in Region 4. I put in a separate file, because Region1 was including Region 4, which
// included region 1, making a circular reference...

// calculate the saturation pressure: R7 Eq. 30
export function SatPressure(temperature) {
  // if (Temperature >= 273.15 && Temperature <= 647.096)
  if (temperature >= Constants.Tmin && temperature <= Constants.Tc_H2O) {
    const theta = temperature + Constants.reg4_sat_eq_n[8] / (temperature - Constants.reg4_sat_eq_n[9]);
    const A = Math.pow(theta, 2) + Constants.reg4_sat_eq_n[0] * theta + Constants.reg4_sat_eq_n[1];
    const B =
      Constants.reg4_sat_eq_n[2] * Math.pow(theta, 2) + Constants.reg4_sat_eq_n[3] * theta + Constants.reg4_sat_eq_n[4];
    const C =
      Constants.reg4_sat_eq_n[5] * Math.pow(theta, 2) + Constants.reg4_sat_eq_n[6] * theta + Constants.reg4_sat_eq_n[7];
    const satPressure = Math.pow((2 * C) / (-B + Math.sqrt(Math.pow(B, 2) - 4 * A * C)), 4);
    return satPressure;
  } else throw Errors.TemperatureNotWithinValidRange;
}

const T3q3r3u3xPoint = 643.15; // point where subregions 3q, 3r, 3u and 3x meet
export const reg4SatPressureT3q3r3u3xPoint = SatPressure(T3q3r3u3xPoint);
export const satPressureT13Boundary = SatPressure(Constants.T13_boundary); // Saturation pressure at the Regions 1-3 boundary temperature of 623.15 K,  equals 16.5292 MPa
export const satPressureTcH2O = SatPressure(Constants.Tc_H2O);  // Saturation pressure at the critical point
