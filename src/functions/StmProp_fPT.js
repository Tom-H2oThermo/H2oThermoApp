import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
import * as Units from "./Units.js";
import * as Region1Calculations from "./Region1Calculations.js";
import * as Region2Calculations from "./Region2Calculations.js";
import * as Region3Calculations from "./Region3Calculations.js";
import * as Region4Calculations from "./Region4Calculations.js";
import * as Region4SatPressure from "./Region4SatPressure.js";
import * as Region5Calculations from "./Region5Calculations.js";
import * as Boundary2_3Calculations from "./Boundary2_3Calculations.js";

// Steam Properties as a function of Pressure and Temperature

export function SteamProperties(pressure, temperature, metastable) {
  // Region 2 Calculations (metastable applicable in region 2 only)
  if (
    (temperature >= Constants.Tmin &&
      temperature < Constants.Ttriple &&
      pressure > 0 &&
      pressure <= ((temperature - Constants.Tmin) / 0.1) * (Constants.pTriple - Constants.pT0) + Constants.pT0) ||
    (temperature >= Constants.Ttriple &&
      temperature <= Constants.T13_boundary &&
      pressure > 0 &&
      pressure <= Region4SatPressure.SatPressure(temperature) + 1e-11) ||
    (temperature > Constants.T13_boundary &&
      temperature <= Constants.T23_100MPa &&
      pressure > 0 &&
      pressure <= Boundary2_3Calculations.reg23BoundaryPfT(temperature)) ||
    (temperature > Constants.T23_100MPa &&
      temperature <= Constants.T25_boundary &&
      pressure > 0 &&
      pressure <= Constants.pmax) ||
    (metastable &&
      pressure >= Constants.pTriple &&
      pressure <= 10 &&
      temperature <= Region4Calculations.SatTemperature(pressure) &&
      temperature >= // This section defines the metastable region f(p) bounding region 2.
        209.07214 -
          126.05204 * pressure +
          42.768346 * Math.pow(pressure, 1.5) -
          5.2499952 * Math.pow(pressure, 2) +
          235.98605 * Math.sqrt(pressure))
  ) {
    // polynomial curvefit of 5% moisture metastable T(p).
    let SteamPropertiesArray = Region2Calculations.Properties_fPT(pressure, temperature, metastable);
    SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
    SteamPropertiesArray[Units.VectorParameters.Temperature] = temperature;
    return SteamPropertiesArray;
  }

  // Region 1 Calculations
  else if (
    temperature >= Constants.Tmin &&
    temperature <= Constants.T13_boundary &&
    pressure >= Region4SatPressure.SatPressure(temperature) &&
    pressure <= Constants.pmax
  ) {
    let SteamPropertiesArray = Region1Calculations.Properties_fPT(pressure, temperature);
    SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
    SteamPropertiesArray[Units.VectorParameters.Temperature] = temperature;
    return SteamPropertiesArray;
  }

  // Region 3 Calculations
  else if (
    temperature >= Constants.T13_boundary &&
    temperature <= Constants.T23_100MPa &&
    pressure >= Boundary2_3Calculations.reg23BoundaryPfT(temperature) &&
    pressure <= 100
  ) {
    let SteamPropertiesArray = Region3Calculations.Properties_fPT(pressure, temperature);
    SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
    SteamPropertiesArray[Units.VectorParameters.Temperature] = temperature;
    return SteamPropertiesArray;
  }

  //Region 5 Calculations
  else if (temperature >= 1073.15 && temperature <= 2273.15 && pressure >= 0 && pressure <= 50) {
    let SteamPropertiesArray = Region5Calculations.Properties_fPT(pressure, temperature);
    SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
    SteamPropertiesArray[Units.VectorParameters.Temperature] = temperature;
    return SteamPropertiesArray;
  } else {
    throw Errors.PressureOrTempNotInRange;
  }
}
