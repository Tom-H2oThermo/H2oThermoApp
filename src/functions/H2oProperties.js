// import * as Constants from "./Constants.js";
import * as Conversions from "./Conversions.js";
import * as Units from "./Units.js";
import * as StmProp_fPT from "./StmProp_fPT.js";
import * as StmProp_fPH from "./StmProp_fPH.js";
import * as StmProp_fPS from "./StmProp_fPS.js";
import * as StmProp_fHS from "./StmProp_fHS.js";
import * as Region4Calculations from "./Region4Calculations.js";
import * as Region4SatPressure from "./Region4SatPressure.js";
import * as Errors from "./Errors.js";
import * as Region3Calculations from "./Region3Calculations.js";
import * as Viscosity from "./Viscosity.js";
import * as Conductivity from "./Conductivity.js";
import * as Constants from "./Constants.js";

// TODO: Licensing??
var licensing = {
  checkLicense: function () {
    var isOk = true;
    if (!isOk) {
      throw "Trial Expired, see https://www.h2othermo.com/steam";
    }
  },
};

export function CallStmProp_fPT(pressure, temperature, units, returnIndex, metastable = false) {
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;
    metastable = metastable ?? false;

    // Check for purchase/trial.
    licensing.checkLicense();

    var p = 0.0;
    var t = 0.0;
    // Converts the inputs to the standard SI values (MPa, K)
    switch (units) {
      case Units.SI:
        p = pressure;
        t = temperature;
        break;
      case Units.USCustomary:
        p = Conversions.PsiToMpa(pressure);
        t = Conversions.FtoK(temperature);
        break;
      case Units.MetricBarA:
        p = Conversions.BarToMpa(pressure);
        t = Conversions.CtoK(temperature);
        break;
      case Units.MetricKpa:
        p = Conversions.KpaToMpa(pressure);
        t = Conversions.CtoK(temperature);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }

    // Get Steam properties, convert to correct units and return the one element.
    return Conversions.SteamPropertiesConversion(StmProp_fPT.SteamProperties(p, t, metastable), units)[returnIndex]; // calls the steam properties with standard SI units and then converts to the desired units.
  } catch (e) {
    // We throw strings. Convert to an Excel error
    // let error = new CustomFunctions.Error(CustomFunctions.ErrorCode.invalidValue, e);
    // throw error;

    // So I just return the thrown string, which is displayed in the cell in Excel.
    return e;
  }
}

export function CallStmProp_fPH(pressure, enthalpy, units, returnIndex) {
  // try/catch block for returning properties f(p,h)
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;

    // Check for purchase/trial.
    licensing.checkLicense();

    var p = pressure;
    var h = enthalpy;
    switch (
      units // Converts the inputs to the standard SI values (MPa, kJ/kg)
    ) {
      case Units.SI:
        p = pressure;
        h = enthalpy;
        break;
      case Units.USCustomary:
        p = Conversions.PsiToMpa(pressure);
        h = Conversions.BtuPerLbmToKjPerKg(enthalpy);
        break;
      case Units.MetricBarA:
        p = Conversions.BarToMpa(pressure);
        h = enthalpy;
        break;
      case Units.MetricKpa:
        p = Conversions.KpaToMpa(pressure);
        h = enthalpy;
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    return Conversions.SteamPropertiesConversion(StmProp_fPH.SteamProperties(p, h), units)[returnIndex];
  } catch (e) {
    // Convert anything thrown to just the string and return it.
    return e;
  }
}

export function CallStmProp_fPS(pressure, entropy, units, returnIndex) {
  // try/catch block for returning properties f(p,s)
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;

    // Check for purchase/trial.
    licensing.checkLicense();

    var p = pressure;
    var s = entropy;
    switch (
      units // Converts the inputs to the standard SI values (MPa, kJ/kg/K)
    ) {
      case Units.SI:
        p = pressure;
        s = entropy;
        break;
      case Units.USCustomary:
        p = Conversions.PsiToMpa(pressure);
        s = Conversions.BtuPerLbmFtoKjPerKgK(entropy);
        break;
      case Units.MetricBarA:
        p = Conversions.BarToMpa(pressure);
        s = entropy;
        break;
      case Units.MetricKpa:
        p = Conversions.KpaToMpa(pressure);
        s = entropy;
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    return Conversions.SteamPropertiesConversion(StmProp_fPS.SteamProperties(p, s), units)[returnIndex];
  } catch (e) {
    // Convert anything thrown to just the string and return it.
    return e;
  }
}

export function CallStmProp_fPQ(pressure, quality, units, returnIndex) {
  // try/catch block for returning properties f(p,Q)
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;

    // Check for purchase/trial.
    licensing.checkLicense();

    var p = pressure;
    switch (
      units // Converts the inputs to the standard SI values (MPa)
    ) {
      case Units.SI:
        p = pressure;
        break;
      case Units.USCustomary:
        p = Conversions.PsiToMpa(pressure);
        break;
      case Units.MetricBarA:
        p = Conversions.BarToMpa(pressure);
        break;
      case Units.MetricKpa:
        p = Conversions.KpaToMpa(pressure);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    return Conversions.SteamPropertiesConversionReg4(Region4Calculations.Properties_fPQ(p, quality), units)[
      returnIndex
    ];
  } catch (e) {
    // Convert anything thrown to just the string and return it.
    return e;
  }
}

export function CallStmProp_fTQ(temperature, quality, units, returnIndex) {
  // try/catch block for returning properties f(T,Q)
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;

    // Check for purchase/trial.
    licensing.checkLicense();

    var t = temperature;
    switch (
      units // Converts the inputs to the standard SI values (K)
    ) {
      case Units.SI:
        t = temperature;
        break;
      case Units.USCustomary:
        t = Conversions.FtoK(temperature);
        break;
      case Units.MetricBarA:
        t = Conversions.CtoK(temperature);
        break;
      case Units.MetricKpa:
        t = Conversions.CtoK(temperature);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }

    return Conversions.SteamPropertiesConversionReg4(Region4Calculations.Properties_fTQ(t, quality), units)[
      returnIndex
    ];
  } catch (e) {
    // Convert anything thrown to just the string and return it.
    return e;
  }
}

export function CallStmProp_fHS(enthalpy, entropy, units, returnIndex) {
  // try/catch block for returning properties f(h,s)
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;

    // Check for purchase/trial.
    licensing.checkLicense();

    var h = enthalpy;
    var s = entropy;
    switch (
      units // Converts the inputs to the standard SI values (kJ/kg, kJ/kg/K)
    ) {
      case Units.SI:
        h = enthalpy;
        s = entropy;
        break;
      case Units.USCustomary:
        h = Conversions.BtuPerLbmToKjPerKg(enthalpy);
        s = Conversions.BtuPerLbmFtoKjPerKgK(entropy);
        break;
      case Units.MetricBarA:
        h = enthalpy;
        s = entropy;
        break;
      case Units.MetricKpa:
        h = enthalpy;
        s = entropy;
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    return Conversions.SteamPropertiesConversion(StmProp_fHS.SteamProperties(h, s), units)[returnIndex];
  } catch (e) {
    // Convert anything thrown to just the string and return it.
    return e;
  }
}

export function CallStmProp_PfT(temperature, units) {
  // try/catch block for returning properties f(h,s)
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;

    // Check for purchase/trial.
    licensing.checkLicense();

    var t = temperature;
    switch (
      units // Converts the input to the standard SI values (K)
    ) {
      case Units.SI:
        t = temperature;
        break;
      case Units.USCustomary:
        t = Conversions.FtoK(temperature);
        break;
      case Units.MetricBarA:
        t = Conversions.CtoK(temperature);
        break;
      case Units.MetricKpa:
        t = Conversions.CtoK(temperature);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    return Conversions.PressureConversion(Region4SatPressure.SatPressure(t), units);
  } catch (e) {
    // Convert anything thrown to just the string and return it.
    return e;
  }
}

export function CallStmProp_TfP(pressure, units) {
  // try/catch block for returning properties f(h,s)
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;

    // Check for purchase/trial.
    licensing.checkLicense();

    var p = pressure;
    switch (
      units // Converts the input to the standard SI values (MPa)
    ) {
      case Units.SI:
        p = pressure;
        break;
      case Units.USCustomary:
        p = Conversions.PsiToMpa(pressure);
        break;
      case Units.MetricBarA:
        p = Conversions.BarToMpa(pressure);
        break;
      case Units.MetricKpa:
        p = Conversions.KpaToMpa(pressure);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    return Conversions.TemperatureConversion(Region4Calculations.SatTemperature(p), units);
  } catch (e) {
    // Convert anything thrown to just the string and return it.
    return e;
  }
}

// Surface Tension
export function CallStmProp_YfT(temperature, units) {
  // try/catch block for returning properties f(h,s)
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;

    // Check for purchase/trial.
    licensing.checkLicense();

    var t = temperature;
    switch (
      units // Converts the input to the standard SI values (K)
    ) {
      case Units.SI:
        t = temperature;
        break;
      case Units.USCustomary:
        t = Conversions.FtoK(temperature);
        break;
      case Units.MetricBarA:
        t = Conversions.CtoK(temperature);
        break;
      case Units.MetricKpa:
        t = Conversions.CtoK(temperature);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    return Conversions.SurfaceTensionConversion(Region4Calculations.SurfaceTension(t), units);
  } catch (e) {
    // Convert anything thrown to just the string and return it.
    return e;
  }
}

// Region 3 only.  For testing, verifying values in R7-97 Table 33
export function CallStmProp_fVT(volume, temperature, units, returnIndex) {
  try {
    // Excel passes null for default parameters when not specified. See https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-parameter-options?tabs=javascript.
    units = units ?? Units.SI;

    // Check for purchase/trial.
    // licensing.checkLicense();  TO DO I think this was giving me a problem so I commented it out

    var v = 0.0;
    var t = 0.0;
    // Converts the inputs to the standard SI values (m3/kg, K)
    switch (units) {
      case Units.SI:
        v = volume;
        t = temperature;
        break;
      case Units.USCustomary:
        v = Conversions.CubicFeetPerLbmToCubicMetersPerKg(volume);
        t = Conversions.FtoK(temperature);
        break;
      case Units.MetricBarA:
        v = volume;
        t = Conversions.CtoK(temperature);
        break;
      case Units.MetricKpa:
        v = volume;
        t = Conversions.CtoK(temperature);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    // Get Steam properties, convert to correct units and return the one element.
    return Conversions.SteamPropertiesConversion(Region3Calculations.Properties_fVT(v, t), units)[returnIndex]; // calls the steam properties with standard SI units and then converts to the desired units.
  } catch (e) {
    return e;
  }
}

// Viscosity f(p,T) R12-08
export function Viscosity_fPT(pressure, temperature, units) {
  try {
    units = units ?? Units.SI;

    var p = 0.0;
    var t = 0.0;
    // Converts the inputs to the standard SI values (m3/kg, K)
    switch (units) {
      case Units.SI:
        p = pressure; //MPa
        t = temperature; //K
        break;
      case Units.USCustomary:
        p = Conversions.PsiToMpa(pressure);
        t = Conversions.FtoK(temperature);
        break;
      case Units.MetricBarA:
        p = Conversions.BarToMpa(pressure);
        t = Conversions.CtoK(temperature);
        break;
      case Units.MetricKpa:
        p = Conversions.KpaToMpa(pressure);
        t = Conversions.CtoK(temperature);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }

    var volume = CallStmProp_fPT(p, t, 0, [6], false); // StmPproperties[6] is volume
    var visc;
    const viscosity = Viscosity.Visc(temperature, volume, pressure);

    switch (units) {
      case Units.SI:
        visc = viscosity;
        break;
      case Units.USCustomary:
        visc = viscosity * Conversions.PascalSecond_To_LbfSecondPerFt2(viscosity);
        break;
      case Units.MetricBarA:
        visc = Conversions.PascalSecond_To_Centipoise(viscosity);
        break;
      case Units.MetricKpa:
        visc = Conversions.PascalSecond_To_Centipoise(viscosity);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    return visc;
  } catch (e) {
    return e;
  }
}

// Viscosity for testing, verifying values in R12-08 Table 4 & 5.  Doesn't check for valid pressure range (use with caution).  SI units only
// functions TVM(temperature, volume) calls this function
export function Viscosity_fTV(temperature, volume) {
  return Viscosity.Visc_fTV(temperature, volume);
}

// Conductivity function for testing values in R15-11 table 4
// function Test_VTK_WO_Crit_Enh(temperature, volume) calls this function
// Does not check to verify in the inputs are in a valid range, for testing only
export function Conductivity_fTV_WO_Crit_Enh(temperature, volume) {
  return Conductivity.Cond_WO_crit_enh(temperature, volume);
}

// Conductivity function for testing values in R15-11 table 5
// function Test_VTK_With_Crit_Enh(temperature, volume) calls this function
// Does not check to verify in the inputs are in a valid range, for testing only
// Assumes input are in Region 3
export function Conductivity_fTV_With_Crit_Enh(t, v) {
  // const TR = Constants.TR; // R15-11 fig 2
  const p = Region3Calculations.Properties_fVT(v, t)[0];
  const visc = Viscosity.Visc_fTV(t, v);
  const Cp = CallStmProp_fPT(p, t, 0, 7, false);
  const Cv = CallStmProp_fPT(p, t, 0, 8, false);
  const dVdP_T = CallStmProp_fPT(p, t, 0, 52, false);
  const dVdP_TR = CallStmProp_fPT(p, Constants.Tc_H2O, 0, 52, false);
  return Conductivity.Cond_With_crit_enh(t, v, p, visc, Cp, Cv, dVdP_T, dVdP_TR);
}

// Conductivity f(p,T) R15-11
export function Conductivity_fPT(pressure, temperature, units) {
  try {
    units = units ?? Units.SI;
    var conductivity;
    var cond;
    var p = 0.0;
    var t = 0.0;
    // Converts the inputs to the standard SI values (m3/kg, K)
    switch (units) {
      case Units.SI:
        p = pressure; //MPa
        t = temperature; //K
        break;
      case Units.USCustomary:
        p = Conversions.PsiToMpa(pressure);
        t = Conversions.FtoK(temperature);
        break;
      case Units.MetricBarA:
        p = Conversions.BarToMpa(pressure);
        t = Conversions.CtoK(temperature);
        break;
      case Units.MetricKpa:
        p = Conversions.KpaToMpa(pressure);
        t = Conversions.CtoK(temperature);
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }

    var volume = CallStmProp_fPT(p, t, 0, [6], false); // StmPproperties[6] is volume
    var viscosity = Viscosity.Visc(temperature, volume, pressure); // StmPproperties[6] is volume
    var Cp = CallStmProp_fPT(p, t, 0, [7], false); // StmPproperties[6] is volume
    var Cv = CallStmProp_fPT(p, t, 0, [8], false); // StmPproperties[6] is volume
    var dVdP_T = CallStmProp_fPT(p, t, 0, [52], false); // StmPproperties[6] is volume
    var dVdP_TR = CallStmProp_fPT(p, Constants.TR, 0, [52], false); // StmPproperties[6] is volume

    conductivity = Conductivity.Cond(temperature, volume, pressure, viscosity, Cp, Cv, dVdP_T, dVdP_TR);

    switch (units) {
      case Units.SI:
        cond = conductivity;
        break;
      case Units.USCustomary:
        cond = conductivity * Conversions.mWattPerMeterK_To_BtuPerHrFtF(conductivity);
        break;
      case Units.MetricBarA:
        cond = conductivity;
        break;
      case Units.MetricKpa:
        cond = conductivity;
        break;
      default:
        throw Errors.ErrorUnitsNotInRange;
    }
    return cond;
  } catch (e) {
    return e;
  }
}

// Debug Function for Region 3 saturation pressure psat(h) to verify the values in 3R3-03 Table 18.
export function R3Psat_fH(enthalpy) {
  try {
    return Region3Calculations.Reg3_PSATh(enthalpy); // returns Region 3 saturation pressure
  } catch (e) {
    return e;
  }
}

// Debug Function for Region 3 saturation pressure psat(s) to verify the values in 3R3-03 Table 20.
export function R3Psat_fS(entropy) {
  try {
    return Region3Calculations.Reg3_PSATs(entropy); // returns Region 3 saturation pressure
  } catch (e) {
    return e;
  }
}

// Debug Function for boundary between region 1 and region 4 as a function of entropy.
export function H1_sat_liqS(entropy) {
  try {
    return Region3Calculations.H1_sat_liqS(entropy); // returns Region 3 saturation pressure
  } catch (e) {
    return e;
  }
}

// Debug Function for saturated liquid boundary between region 3 and region 4 as a function of entropy.
export function H3a_sat_liqS(entropy) {
  try {
    return Region3Calculations.H3a_sat_liqS(entropy); // returns Region 3 saturation pressure
  } catch (e) {
    return e;
  }
}

// Debug Function for boundary between region 1 and region 4 as a function of entropy.
export function H2ab_sat_VapS(entropy) {
  try {
    return Region3Calculations.H2ab_sat_VapS(entropy); // returns Region 3 saturation pressure
  } catch (e) {
    return e;
  }
}

// Debug Function for saturated liquid boundary between region 3 and region 4 as a function of entropy.
export function H2c3b_sat_VapS(entropy) {
  try {
    return Region3Calculations.H2c3b_sat_VapS(entropy); // returns Region 3 saturation pressure
  } catch (e) {
    return e;
  }
}

// Debug Function for the boundary between regions 1 & 3 as a function of entropy.
export function Hb13S(entropy) {
  try {
    return Region3Calculations.Hb13S(entropy); // returns Region 3 saturation pressure
  } catch (e) {
    return e;
  }
}

// Debug Function for the boundary between regions 2 & 3 as a function of temperature.
export function Tb23HS(enthalpy, entropy) {
  try {
    return Region3Calculations.Tb23HS(enthalpy, entropy); // returns Region 3 saturation pressure
  } catch (e) {
    return e;
  }
}

// Debug Function for the saturation temperature as a function of h & s
export function TsatHS(enthalpy, entropy) {
  try {
    return Region3Calculations.TsatHS(enthalpy, entropy); // returns Region 3 saturation pressure
  } catch (e) {
    return e;
  }
}

// Debug Function for the T3ab(p)
export function T3ab(pressure) {
  try {
    return Region3Calculations.T3ab(pressure); // returns Region 3 T3ab(p) boundary SR5 eq 2
  } catch (e) {
    return e;
  }
}

// Debug Function for T3op(p)
export function T3op(pressure) {
  try {
    return Region3Calculations.T3op(pressure); // returns Region 3 T3op(p) boundary SR5 eq 2
  } catch (e) {
    return e;
  }
}

// Debug Function for T3ef(p)
export function T3ef(pressure) {
  try {
    return Region3Calculations.T3ef(pressure); // returns Region 3 T3ef(p) boundary SR5 eq 2
  } catch (e) {
    return e;
  }
}

// Debug Function for T3cd(p)
export function T3cd(pressure) {
  try {
    return Region3Calculations.T3cd(pressure); // returns Region 3 T3cd(p) boundary SR5 eq 1
  } catch (e) {
    return e;
  }
}

// Debug Function for T3gh(p)
export function T3gh(pressure) {
  try {
    return Region3Calculations.T3gh(pressure); // returns Region 3 T3gh(p) boundary SR5 eq 1
  } catch (e) {
    return e;
  }
}

// Debug Function for T3ij(p)
export function T3ij(pressure) {
  try {
    return Region3Calculations.T3ij(pressure); // returns Region 3 T3ij(p) boundary SR5 eq 1
  } catch (e) {
    return e;
  }
}

// Debug Function for T3jk(p)
export function T3jk(pressure) {
  try {
    return Region3Calculations.T3jk(pressure); // returns Region 3 T3jk(p) boundary SR5 eq 1
  } catch (e) {
    return e;
  }
}

// Debug Function for T3mn(p)
export function T3mn(pressure) {
  try {
    return Region3Calculations.T3mn(pressure); // returns Region 3 T3mn(p) boundary SR5 eq 1
  } catch (e) {
    return e;
  }
}

// Debug Function for T3qu(p)
export function T3qu(pressure) {
  try {
    return Region3Calculations.T3qu(pressure); // returns Region 3 T3qu(p) boundary SR5 eq 1
  } catch (e) {
    return e;
  }
}

// Debug Function for T3rx(p)
export function T3rx(pressure) {
  try {
    return Region3Calculations.T3rx(pressure); // returns Region 3 T3rx(p) boundary SR5 eq 1
  } catch (e) {
    return e;
  }
}

// Debug Function for T3uv(p)
export function T3uv(pressure) {
  try {
    return Region3Calculations.T3uv(pressure); // returns Region 3 T3uv(p) boundary SR5 eq 1
  } catch (e) {
    return e;
  }
}

// Debug Function for T3wx(p)
export function T3wx(pressure) {
  try {
    return Region3Calculations.T3wx(pressure); // returns Region 3 T3wx(p) boundary SR5 eq 1
  } catch (e) {
    return e;
  }
}
