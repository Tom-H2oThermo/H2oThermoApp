import * as Constants from "./Constants.js";
import * as Units from "./Units.js";
import * as Errors from "./Errors.js";
import * as Region1Calculations from "./Region1Calculations.js";
import * as Region2Calculations from "./Region2Calculations.js";
import * as Region3Calculations from "./Region3Calculations.js";
import * as Region4SatPressure from "./Region4SatPressure.js";

const T3uv_SatPress = 21.93161551; // MPa : This is the point on the saturation line where regions 3u & 3y, and 3x & 3z meet
const T3wx_SatPress = 21.90096265; // MPa : This is the point to the right of the saturation line at the 3x & 3z boundary

// calculate the saturation properties at zero quality f(p)
export function SatPropertiesQ0_fP(pressure) {
  const satTemp = SatTemperature(pressure);

  if (pressure >= Constants.pTriple && pressure <= Region4SatPressure.satPressureT13Boundary) {
    // Region 1
    return Region1Calculations.Properties_fPT(pressure, satTemp);
  } else if (pressure > Region4SatPressure.satPressureT13Boundary && pressure <= Region4SatPressure.satPressureTcH2O) {
    // Region 3 saturation region
    var SpecificVolume = 0;
    if (pressure > Region4SatPressure.satPressureT13Boundary && pressure <= Region3Calculations.p3cd) {
      SpecificVolume = Region3Calculations.SubRegion3V(2, pressure, satTemp, Region3Calculations.reg3Constants); // reg3Constants[2] => Subregion 3c;
    } else if (pressure > Region3Calculations.p3cd && pressure <= Region4SatPressure.reg4SatPressureT3q3r3u3xPoint) {
      // Subregion 3s
      SpecificVolume = Region3Calculations.SubRegion3V(18, pressure, satTemp, Region3Calculations.reg3Constants); // reg3Constants[18] => Subregion 3s
    } else if (pressure > Region4SatPressure.reg4SatPressureT3q3r3u3xPoint && pressure <= T3uv_SatPress) {
      //Subregion 3u
      SpecificVolume = Region3Calculations.SubRegion3V(20, pressure, satTemp, Region3Calculations.reg3Constants); // reg3Constants[20] => Subregion 3u
    } else if (pressure > T3uv_SatPress && pressure <= Region4SatPressure.satPressureTcH2O) {
      //Subregion 3y
      SpecificVolume = Region3Calculations.SubRegion3V(24, pressure, satTemp, Region3Calculations.reg3Constants); // reg3Constants[24] => Subregion 3y
    } else throw Errors.TemperatureNotInRegion3c3s3u3y;

    var StmPropArray_Q0 = Region3Calculations.Properties_fVT(SpecificVolume, satTemp);
    StmPropArray_Q0[0] = pressure;
    return StmPropArray_Q0;
  } else throw Errors.PressureNotWithinValidSaturatedSteamRegion;
}

// calculate the saturation properties at zero quality f(T)
export function SatPropertiesQ0_fT(temperature) {
  var SpecificVolume = 0;
  const pressure = Region4SatPressure.SatPressure(temperature);

  if (pressure >= Constants.pTriple && pressure <= Region4SatPressure.satPressureT13Boundary) {
    // Region 1
    return Region1Calculations.Properties_fPT(pressure, temperature);
  } else if (pressure > Region4SatPressure.satPressureT13Boundary && pressure <= Region4SatPressure.satPressureTcH2O) {
    // Region 3
    if (pressure > Region4SatPressure.satPressureT13Boundary && pressure <= Region3Calculations.p3cd) {
      SpecificVolume = Region3Calculations.SubRegion3V(2, pressure, temperature, Region3Calculations.reg3Constants); // reg3Constants[2] => Subregion 3c;
    } else if (pressure > Region3Calculations.p3cd && pressure <= Region4SatPressure.reg4SatPressureT3q3r3u3xPoint) {
      // Subregion 3s
      SpecificVolume = Region3Calculations.SubRegion3V(18, pressure, temperature, Region3Calculations.reg3Constants); // reg3Constants[18] => Subregion 3s
    } else if (pressure > Region4SatPressure.reg4SatPressureT3q3r3u3xPoint && pressure <= T3uv_SatPress) {
      //Subregion 3u
      SpecificVolume = Region3Calculations.SubRegion3V(20, pressure, temperature, Region3Calculations.reg3Constants); // reg3Constants[20] => Subregion 3u
    } else if (pressure > T3uv_SatPress && pressure <= Region4SatPressure.satPressureTcH2O) {
      //Subregion 3y
      SpecificVolume = Region3Calculations.SubRegion3V(24, pressure, temperature, Region3Calculations.reg3Constants); // reg3Constants[24] => Subregion 3y
    } else throw Errors.TemperatureNotInRegion3c3s3u3y;

    return Region3Calculations.Properties_fVT(SpecificVolume, temperature);
  } else throw Errors.PressureNotWithinValidSaturatedSteamRegion;
}

// calculate the saturation properties at 100% quality f(p)
export function SatPropertiesQ1_fP(pressure) {
  const satTemp = SatTemperature(pressure);
  var SpecificVolume = 0;

  if (pressure >= 0 && pressure <= Region4SatPressure.satPressureT13Boundary) {
    // Region 2
    var StmPropArray_Q1 = Region2Calculations.Properties_fPT(pressure, satTemp);
    StmPropArray_Q1[0] = pressure;
    return StmPropArray_Q1;
  } else if (pressure > Region4SatPressure.satPressureT13Boundary && pressure <= Region4SatPressure.satPressureTcH2O) {
    // Region 3 subcritical saturation region
    if (pressure > Region4SatPressure.satPressureT13Boundary && pressure <= 20.5) {
      // Subregion 3t
      SpecificVolume = Region3Calculations.SubRegion3V(19, pressure, satTemp, Region3Calculations.reg3Constants); // reg3Constants[19] => Subregion 3t
    } else if (pressure > 20.5 && pressure <= Region4SatPressure.reg4SatPressureT3q3r3u3xPoint) {
      // Subregion 3r
      SpecificVolume = Region3Calculations.SubRegion3V(17, pressure, satTemp, Region3Calculations.reg3Constants); // reg3Constants[17] => Subregion 3r
    } else if (pressure > Region4SatPressure.reg4SatPressureT3q3r3u3xPoint && pressure <= T3wx_SatPress) {
      //Subregion 3x
      SpecificVolume = Region3Calculations.SubRegion3V(23, pressure, satTemp, Region3Calculations.reg3Constants); // reg3Constants[23] => Subregion 3x
    } else if (pressure > T3wx_SatPress && pressure <= Region4SatPressure.satPressureTcH2O) {
      //Subregion 3z
      SpecificVolume = Region3Calculations.SubRegion3V(25, pressure, satTemp, Region3Calculations.reg3Constants); // reg3Constants[25] => Subregion 3z
    } else throw Errors.PressureNotWithinValidSaturatedSteamRegion;

    var ret = Region3Calculations.Properties_fVT(SpecificVolume, satTemp);
    ret[0] = pressure;
    return ret;
    // [(0) Pressure, (1) Temperature, (3) Enthalpy, (4) Entropy,
    //  (5) InternalEnergy, (6) Volume, (7) IsobaricHeat, (8) IsochoricHeat, (9) SpeedOfSound]
  } else throw Errors.PressureNotWithinValidSaturatedSteamRegion;
}

// calculate the saturation properties at 100% quality f(T)
export function SatPropertiesQ1_fT(temperature) {
  const pressure = Region4SatPressure.SatPressure(temperature);
  var SpecificVolume = 0;

  if (pressure >= 0 && pressure <= Region4SatPressure.satPressureT13Boundary) {
    // Region 2
    var reg2 = Region2Calculations.Properties_fPT(pressure, temperature);
    reg2[1] = temperature;
    return reg2;
  } else if (pressure > Region4SatPressure.satPressureT13Boundary && pressure <= Region4SatPressure.satPressureTcH2O) {
    // Region 3 subcritical saturation region
    if (pressure > Region4SatPressure.satPressureT13Boundary && pressure <= 20.5) {
      // Subregion 3t
      SpecificVolume = Region3Calculations.SubRegion3V(19, pressure, temperature, Region3Calculations.reg3Constants); // reg3Constants[19] => Subregion 3t
    } else if (pressure > 20.5 && pressure <= Region4SatPressure.reg4SatPressureT3q3r3u3xPoint) {
      // Subregion 3r
      SpecificVolume = Region3Calculations.SubRegion3V(17, pressure, temperature, Region3Calculations.reg3Constants); // reg3Constants[17] => Subregion 3r
    } else if (pressure > Region4SatPressure.reg4SatPressureT3q3r3u3xPoint && pressure <= T3wx_SatPress) {
      //Subregion 3x
      SpecificVolume = Region3Calculations.SubRegion3V(23, pressure, temperature, Region3Calculations.reg3Constants); // reg3Constants[23] => Subregion 3x
    } else if (pressure > T3wx_SatPress && pressure <= Region4SatPressure.satPressureTcH2O) {
      //Subregion 3z
      SpecificVolume = Region3Calculations.SubRegion3V(25, pressure, temperature, Region3Calculations.reg3Constants); // reg3Constants[25] => Subregion 3z
    } else throw Errors.PressureNotWithinValidSaturatedSteamRegion;

    var StmPropArray_Q1 = Region3Calculations.Properties_fVT(SpecificVolume, temperature);
    StmPropArray_Q1[1] = temperature;
    return StmPropArray_Q1;
    // [(0) Pressure, (1) Temperature, (3) Enthalpy, (4) Entropy,
    //  (5) InternalEnergy, (6) Volume, (7) IsobaricHeat, (8) IsochoricHeat, (9) SpeedOfSound]
  } else throw Errors.PressureNotWithinValidSaturatedSteamRegion;
}

export function satProperties(pressure, parameterValue, parameterIndex) {
  if (pressure > 0 && pressure <= Constants.pc_H2O && parameterIndex >= 3 && parameterIndex <= 9) {
    var properties = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const propertiesQ0 = SatPropertiesQ0_fP(pressure);
    const propertiesQ1 = SatPropertiesQ1_fP(pressure);
    //const parameterQ0 = propertiesQ0[parameterIndex];
    //const parameterQ1 = propertiesQ1[parameterIndex];
    const quality =
      (parameterValue - propertiesQ0[parameterIndex]) / (propertiesQ1[parameterIndex] - propertiesQ0[parameterIndex]);
    if (quality >= 0 && quality <= 1) {
      for (
        var i = 3;
        i < 9;
        i++ // Only applies to properties[3] to [9], parameters that are a function of the mass (something/kg).  Quality is (kg steam)/(kg steam + kg liquid water).  This is an extensive (how much of the stuff there is) vs and intensive (like pressure or temperature) property.
      ) {
        if (i == parameterIndex) {
          continue;
        } // skip over the input parameter so it doesn't change
        properties[i] = propertiesQ0[i] + quality * (propertiesQ1[i] - propertiesQ0[i]);
      }
      properties[0] = pressure;
      return properties;
    } else throw Errors.QualityNotWithinValidRange;
  } else throw Errors.PressureOrIndexNotValid;
}

export function satProperties_fPQ(pressure, quality) {
  if (pressure > 0 && pressure <= Region4SatPressure.satPressureTcH2O && quality >= 0 && quality <= 1) {
    var properties = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const propertiesQ0 = SatPropertiesQ0_fP(pressure);
    const propertiesQ1 = SatPropertiesQ1_fP(pressure);
    properties[10] = 0;
    properties[11] = 0;
    /*for (let i = 3; i < 9; i++) // Only applies to properties[3] to [9], parameters that are a function of the mass (something/kg).  Quality is (kg steam)/(kg steam + kg liquid water)
        {
            properties[i] = propertiesQ0[i] + quality * (propertiesQ1[i] - propertiesQ0[i]);
        }*/
    properties[0] = pressure;
    properties[1] = propertiesQ0[1];
    properties[2] = quality;
    properties[3] = propertiesQ0[3] + quality * (propertiesQ1[3] - propertiesQ0[3]);
    properties[4] = propertiesQ0[4] + quality * (propertiesQ1[4] - propertiesQ0[4]);
    properties[5] = propertiesQ0[5] + quality * (propertiesQ1[5] - propertiesQ0[5]);
    properties[6] = propertiesQ0[6] + quality * (propertiesQ1[6] - propertiesQ0[6]);
    properties[7] = propertiesQ0[7] + quality * (propertiesQ1[7] - propertiesQ0[7]);
    properties[8] = propertiesQ0[8] + quality * (propertiesQ1[8] - propertiesQ0[8]);
    return properties;
  } else throw Errors.PressureOrQualityNotValid;
}

export function satProperties_fTQ(temperature, quality) {
  if (temperature >= Constants.Tmin && temperature <= Constants.Tc_H2O && quality >= 0 && quality <= 1) {
    var properties = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const propertiesQ0 = SatPropertiesQ0_fT(temperature);
    const propertiesQ1 = SatPropertiesQ1_fT(temperature);
    properties[10] = 0;
    properties[11] = 0;
    for (
      var i = 3;
      i < 9;
      i++ // Only applies to properties[3] to [9], parameters that are a function of the mass (something/kg).  Quality is (kg steam)/(kg steam + kg liquid water)
    ) {
      properties[i] = propertiesQ0[i] + quality * (propertiesQ1[i] - propertiesQ0[i]);
    }
    properties[1] = temperature;
    properties[2] = quality;
    return properties;
  } else throw Errors.PressureOrQualityNotValid;
}

// calculate the steam properties given a pressure and an enthalpy
export function Properties_fPH(pressure, enthalpy) {
  if (pressure > 0 && pressure <= Constants.pc_H2O) {
    return satProperties(pressure, enthalpy, Units.VectorParameters.Enthalpy);
  } else throw Errors.PressureNotValid;
}

// calculate the steam properties given a pressure and an entropy
export function Properties_fPS(pressure, entropy) {
  if (pressure > 0 && pressure <= Constants.pc_H2O) {
    return satProperties(pressure, entropy, Units.VectorParameters.Entropy);
  } else throw Errors.PressureNotValid;
}

// calculate the steam properties given a pressure and a quality
export function Properties_fPQ(pressure, quality) {
  if (pressure > 0 && (pressure <= Constants.pc_H2O) & (quality >= 0) && quality <= 1) {
    return satProperties_fPQ(pressure, quality);
  } else Errors.PressureOrQualityNotValid;
}

// calculate the steam properties given a temperature and a quality
export function Properties_fTQ(temperature, quality) {
  if (temperature >= Constants.Tmin && temperature <= Constants.Tc_H2O && quality >= 0 && quality <= 1) {
    return satProperties_fTQ(temperature, quality);
  } else Errors.PressureOrQualityNotValid;
}

// calculate the saturation temperature: R7 Eq. 31
export function SatTemperature(pressure) {
  // if (Pressure >= 0.611213 && Pressure <= 22.064)
  if (pressure > 0 && pressure <= Constants.pc_H2O) {
    const beta = Math.pow(pressure, 0.25);
    const E = Math.pow(beta, 2) + Constants.reg4_sat_eq_n[2] * beta + Constants.reg4_sat_eq_n[5];
    const F =
      Constants.reg4_sat_eq_n[0] * Math.pow(beta, 2) + Constants.reg4_sat_eq_n[3] * beta + Constants.reg4_sat_eq_n[6];
    const G =
      Constants.reg4_sat_eq_n[1] * Math.pow(beta, 2) + Constants.reg4_sat_eq_n[4] * beta + Constants.reg4_sat_eq_n[7];
    const D = (2 * G) / (-F - Math.sqrt(Math.pow(F, 2) - 4 * E * G));
    const satTemperature =
      (Constants.reg4_sat_eq_n[9] +
        D -
        Math.sqrt(
          Math.pow(Constants.reg4_sat_eq_n[9] + D, 2) -
            4 * (Constants.reg4_sat_eq_n[8] + Constants.reg4_sat_eq_n[9] * D)
        )) /
      2;
    return satTemperature;
  } else throw Errors.PressureNotValid;
}

// Surface Tension IAPWS R1-76(2014)
export function SurfaceTension(temperature) {
  const B = 235.8; // mN/m
  const b = -0.625;
  const mu = 1.256;
  const tau = 1 - temperature / Constants.Tc_H2O;
  const sigma = B * Math.pow(tau, mu) * (1 + b * tau);
  return sigma;
}
