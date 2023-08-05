import * as Constants from "./Constants.js";

/// <summary>
/// calculate the region 2-3 boundary pressure as a function of temperature; p f(T) R7 eq 5
/// </summary>
/// <param name="temperature"></param>
/// <returns>"region 2-3 boundary pressure p(T)"</returns>
export function reg23BoundaryPfT(temperature) {
  // if (Temperature>= 623.15 && Temperature<= 863.15 )
  var pi =
    Constants.reg2_3Boundary[0] +
    Constants.reg2_3Boundary[1] * temperature +
    Constants.reg2_3Boundary[2] * Math.pow(temperature, 2);
  return pi;
}

/// <summary>
/// calculate the region 2-3 boundary pressure as function of temperature; p f(T): R7 eq 6
/// </summary>
/// <param name="pressure"></param>
/// <returns>"region 2-3 boundary temperature T(p)"</returns>
export function reg23BoundaryTfP(pressure) {
  // if (Pressure>= 16.5292 && Pressure <= 100)
  //var temp = pressure - Constants.reg2_3Boundary[4];
  //var temp1 = temp * 1;
  var theta =
    Constants.reg2_3Boundary[3] + Math.sqrt((pressure - Constants.reg2_3Boundary[4]) / Constants.reg2_3Boundary[2]);
  return theta;
}
