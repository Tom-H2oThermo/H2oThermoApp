import * as H2o from "./H2oProperties.js";
import * as Units from "./Units.js";
import * as Errors from "./Errors.js";

// TODO: metastable -- {number}??
// TODO: What about help? Returns, Summary, and Remarks?
// TODO: Didn't document all return unit types...

// TODO: Dumb that this is a copy of Units.VectorParameters, just all lower case...
const returnName = {
  pressure: 0,
  temperature: 1,
  quality: 2,
  enthalpy: 3,
  entropy: 4,
  internalenergy: 5,
  volume: 6,
  isobaricheat: 7,
  isochoricheat: 8,
  speedofsound: 9,
  dpdt_v: 12,
  dpdt_u: 13,
  dpdt_h: 14,
  dpdt_s: 15,
  dpdv_t: 16,
  dpdv_u: 17,
  dpdv_h: 18,
  dpdv_s: 19,
  dpdu_t: 20,
  dpdu_v: 21,
  dpdu_h: 22,
  dpdu_s: 23,
  dpdh_t: 24,
  dpdh_v: 25,
  dpdh_u: 26,
  dpdh_s: 27,
  dpds_t: 28,
  dpds_v: 29,
  dpds_u: 30,
  dpds_h: 31,
  dtdp_v: 32,
  dtdp_u: 33,
  dtdp_h: 34,
  dtdp_s: 35,
  dtdv_p: 36,
  dtdv_u: 37,
  dtdv_h: 38,
  dtdv_s: 39,
  dtdu_p: 40,
  dtdu_v: 41,
  dtdu_h: 42,
  dtdu_s: 43,
  dtdh_p: 44,
  dtdh_v: 45,
  dtdh_u: 46,
  dtdh_s: 47,
  dtds_p: 48,
  dtds_v: 49,
  dtds_u: 50,
  dtds_h: 51,
  dvdp_t: 52,
  dvdp_u: 53,
  dvdp_h: 54,
  dvdp_s: 55,
  dvdt_p: 56,
  dvdt_u: 57,
  dvdt_h: 58,
  dvdt_s: 59,
  dvdu_p: 60,
  dvdu_t: 61,
  dvdu_h: 62,
  dvdu_s: 63,
  dvdh_p: 64,
  dvdh_t: 65,
  dvdh_u: 66,
  dvdh_s: 67,
  dvds_p: 68,
  dvds_t: 69,
  dvds_u: 70,
  dvds_h: 71,
  dudp_t: 72,
  dudp_v: 73,
  dudp_h: 74,
  dudp_s: 75,
  dudt_p: 76,
  dudt_v: 77,
  dudt_h: 78,
  dudt_s: 79,
  dudv_p: 80,
  dudv_t: 81,
  dudv_h: 82,
  dudv_s: 83,
  dudh_p: 84,
  dudh_t: 85,
  dudh_v: 86,
  dudh_s: 87,
  duds_p: 88,
  duds_t: 89,
  duds_v: 90,
  duds_h: 91,
  dhdp_t: 92,
  dhdp_v: 93,
  dhdp_u: 94,
  dhdp_s: 95,
  dhdt_p: 96,
  dhdt_v: 97,
  dhdt_u: 98,
  dhdt_s: 99,
  dhdv_p: 100,
  dhdv_t: 101,
  dhdv_u: 102,
  dhdv_s: 103,
  dhdu_p: 104,
  dhdu_t: 105,
  dhdu_v: 106,
  dhdu_s: 107,
  dhds_p: 108,
  dhds_t: 109,
  dhds_v: 110,
  dhds_u: 111,
  dsdp_t: 112,
  dsdp_v: 113,
  dsdp_u: 114,
  dsdp_h: 115,
  dsdt_p: 116,
  dsdt_v: 117,
  dsdt_u: 118,
  dsdt_h: 119,
  dsdv_p: 120,
  dsdv_t: 121,
  dsdv_u: 122,
  dsdv_h: 123,
  dsdu_p: 124,
  dsdu_t: 125,
  dsdu_v: 126,
  dsdu_h: 127,
  dsdh_p: 128,
  dsdh_t: 129,
  dsdh_v: 130,
  dsdh_u: 131,
};

// Given a string, return the index from Units.VectorParameters. Throws if can't find the value.
function nameToIndex(name) {
  return returnName[name.toLowerCase()];
}

// Function #1
/**
 * Sat Pressure f(T): (0)MPa, (1)psia, (2)bara, (3)kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa, (1)psia, (2)bara, (3)kPa
 */
export function TP(temperature, units) {
  return H2o.CallStmProp_PfT(temperature, units);
}

// Function #2
/**
 * Sat Temperature f(P):  (0)K, (1)°F, (2)°C, (3)°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure(0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns  (0)K, (1)°F, (2)°C, (3)°C
 */
export function PT(pressure, units) {
  return H2o.CallStmProp_TfP(pressure, units);
}

// Function #3 TODO - Test this function
/**
 * Surface Tension f(T): (0)mN/m, (1)lbf/ft, (2)mN/m, (3)mN/m
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)mN/m, (1)lbf/ft, (2)mN/m, (3)mN/m
 */
export function TY(temperature, units) {
  return H2o.CallStmProp_YfT(temperature, units);
}

// Function #4
/**
 * Returns requested parameter f(P,T): Specified Return Parameter in Units Specified
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure(0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {string} return What to return ("enthalpy", "entropy", etc.)
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @param {number} [metastable] false=normal, true=metastable
 * @returns Specified Return Parameter in Units Specified
 */
export function fPT(pressure, temperature, returnName, units, metastable) {
  const index = nameToIndex(returnName);
  if (index == undefined) {
    return Errors.ErrorReturnTypeUnknown;
  }
  return H2o.CallStmProp_fPT(pressure, temperature, units, index, metastable);
}

// Function #5
/**
 * Returns requested parameter f(P,h): Specified Return Parameter in Units Specified
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure(0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {string} return What to return ("enthalpy", "entropy", etc.)
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 */
export function fPH(pressure, enthalpy, returnName, units) {
  const index = nameToIndex(returnName);
  if (index == undefined) {
    return Errors.ErrorReturnTypeUnknown;
  }
  return H2o.CallStmProp_fPH(pressure, enthalpy, units, index);
}

// Function #6
/**
 * Returns requested parameter f(P,S): Specified Return Parameter in Units Specified
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure(0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param {string} return What to return ("enthalpy", "entropy", etc.)
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 */
export function fPS(pressure, entropy, returnName, units) {
  const index = nameToIndex(returnName);
  if (index == undefined) {
    return Errors.ErrorReturnTypeUnknown;
  }
  return H2o.CallStmProp_fPS(pressure, entropy, units, index);
}

// Function #7
/**
 * Returns requested parameter f(H,S): Specified Return Parameter in Units Specified
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param {string} return What to return ("enthalpy", "entropy", etc.)
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 */
export function fHS(enthalpy, entropy, returnName, units) {
  const index = nameToIndex(returnName);
  if (index == undefined) {
    return Errors.ErrorReturnTypeUnknown;
  }
  return H2o.CallStmProp_fPS(enthalpy, entropy, units, index);
}

// Function #8
/**
 * Enthalpy f(P,T): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @param {number} [metastable] false=normal, true=metastable
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function PTH(pressure, temperature, units, metastable) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.Enthalpy, metastable);
}

// Function #9
/**
 * Entropy f(P,T): (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @param {number} [metastable] false=normal, true=metastable
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PTS(pressure, temperature, units, metastable) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.Entropy, metastable);
}

// Function #10
/**
 * Internal Energy f(P,T): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @param {number} [metastable] false=normal, true=metastable
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function PTU(pressure, temperature, units, metastable) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.InternalEnergy, metastable);
}

// Function #11
/**
 * Specific Volume f(P,T): (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @param {number} [metastable] false=normal, true=metastable
 * @returns (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 */
export function PTV(pressure, temperature, units, metastable) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.Volume, metastable);
}

// Function #12
/**
 * Constant Pressure Specific Heat f(P,T): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @param {number} [metastable] false=normal, true=metastable
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PTCp(pressure, temperature, units, metastable) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.IsobaricHeat, metastable);
}

// Function #13
/**
 * Constant Volumn Specific Heat f(P,T): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @param {number} [metastable] false=normal, true=metastable
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PTCv(pressure, temperature, units, metastable) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.IsochoricHeat, metastable);
}

// Function #14
/**
 * Speed of Sound f(P,T): (0)m/s, (1)ft/s, (2)m/s, (3)m/s
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @param {number} [metastable] false=normal, true=metastable
 * @returns (0)m/s, (1)ft/s, (2)m/s, (3)m/s
 */
export function PTW(pressure, temperature, units, metastable) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.SpeedOfSound, metastable);
}

// Function #15
/**
 * Temperature f(P,H):  (0)K, (1)°F, (2)°C, (3)°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns  (0)K, (1)°F, (2)°C, (3)°C
 */
export function PHT(pressure, enthalpy, units) {
  return H2o.CallStmProp_fPH(pressure, enthalpy, units, Units.VectorParameters.Temperature);
}

// Function #16
/**
 * Specific Entropy f(P,H): (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PHS(pressure, enthalpy, units) {
  return H2o.CallStmProp_fPH(pressure, enthalpy, units, Units.VectorParameters.Entropy);
}

// Function #17
/**
 * Internal Energy f(P,H): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function PHU(pressure, enthalpy, units) {
  return H2o.CallStmProp_fPH(pressure, enthalpy, units, Units.VectorParameters.InternalEnergy);
}

// Function #18
/**
 * Specific Volume f(P,H): (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 */
export function PHV(pressure, enthalpy, units) {
  return H2o.CallStmProp_fPH(pressure, enthalpy, units, Units.VectorParameters.Volume);
}

// Function #19
/**
 * Constant Pressure Specific Heat f(P,H): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PHCp(pressure, enthalpy, units) {
  return H2o.CallStmProp_fPH(pressure, enthalpy, units, Units.VectorParameters.IsobaricHeat);
}

// Function #20
/**
 * Constant Volumn Specific Heat f(P,H): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PHCv(pressure, enthalpy, units) {
  return H2o.CallStmProp_fPH(pressure, enthalpy, units, Units.VectorParameters.IsochoricHeat);
}

// Function #21
/**
 * Speed of Sound f(P,H): (0)m/s, (1)ft/s, (2)m/s, (3)m/s
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)m/s, (1)ft/s, (2)m/s, (3)m/s
 */
export function PHW(pressure, enthalpy, units) {
  return H2o.CallStmProp_fPH(pressure, enthalpy, units, Units.VectorParameters.SpeedOfSound);
}

// Function #22
/**
 * Quality f(P,H): dimensionless
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns dimensionless
 */
export function PHQ(pressure, enthalpy, units) {
  return H2o.CallStmProp_fPH(pressure, enthalpy, units, Units.VectorParameters.Quality);
}

// Function #23
/**
 * Temperature f(P,S):  (0)K, (1)°F, (2)°C, (3)°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns  (0)K, (1)°F, (2)°C, (3)°C
 */
export function PST(pressure, entropy, units) {
  return H2o.CallStmProp_fPS(pressure, entropy, units, Units.VectorParameters.Temperature);
}

// Function #24
/**
 * Enthalpy f(P,S): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function PSH(pressure, entropy, units) {
  return H2o.CallStmProp_fPS(pressure, entropy, units, Units.VectorParameters.Enthalpy);
}

// Function #25
/**
 * Internal Energy f(P,S): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function PSU(pressure, entropy, units) {
  return H2o.CallStmProp_fPS(pressure, entropy, units, Units.VectorParameters.InternalEnergy);
}

// Function #26
/**
 * Specific Volume f(P,S): (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 */
export function PSV(pressure, entropy, units) {
  return H2o.CallStmProp_fPS(pressure, entropy, units, Units.VectorParameters.Volume);
}

// Function #27
/**
 * Constant Pressure Specific Heat f(P,S): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PSCp(pressure, entropy, units) {
  return H2o.CallStmProp_fPS(pressure, entropy, units, Units.VectorParameters.IsobaricHeat);
}

// Function #28
/**
 * Constant Volumn Specific Heat f(P,S): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PSCv(pressure, entropy, units) {
  return H2o.CallStmProp_fPS(pressure, entropy, units, Units.VectorParameters.IsochoricHeat);
}

// Function #29
/**
 * Speed of Sound f(P,S): (0)m/s, (1)ft/s, (2)m/s, (3)m/s
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)m/s, (1)ft/s, (2)m/s, (3)m/s
 */
export function PSW(pressure, entropy, units) {
  return H2o.CallStmProp_fPS(pressure, entropy, units, Units.VectorParameters.SpeedOfSound);
}

// Function #30
/**
 * Quality f(P,S): dimensionless
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns dimensionless
 */
export function PSQ(pressure, entropy, units) {
  return H2o.CallStmProp_fPS(pressure, entropy, units, Units.VectorParameters.Quality);
}

// Function #31
/**
 * Pressure f(H,S): (0)MPa, (1)psia, (2)bara, (3)kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa, (1)psia, (2)bara, (3)kPa
 */
export function HSP(enthalpy, entropy, units) {
  return H2o.CallStmProp_fHS(enthalpy, entropy, units, Units.VectorParameters.Pressure);
}

// Function #32
/**
 * Temperature f(H,S):  (0)K, (1)°F, (2)°C, (3)°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns  (0)K, (1)°F, (2)°C, (3)°C
 */
export function HST(enthalpy, entropy, units) {
  return H2o.CallStmProp_fHS(enthalpy, entropy, units, Units.VectorParameters.Temperature);
}

// Function #33
/**
 * Quality f(H,S): dimensionless
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns dimensionless
 */
export function HSQ(enthalpy, entropy, units) {
  return H2o.CallStmProp_fHS(enthalpy, entropy, units, Units.VectorParameters.Quality);
}

// Function #34
/**
 * Internal Energy f(H,S): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function HSU(enthalpy, entropy, units) {
  return H2o.CallStmProp_fHS(enthalpy, entropy, units, Units.VectorParameters.InternalEnergy);
}

// Function #35
/**
 * Specific Volume f(H,S): (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 */
export function HSV(enthalpy, entropy, units) {
  return H2o.CallStmProp_fHS(enthalpy, entropy, units, Units.VectorParameters.Volume);
}

// Function #36
/**
 * Constant Pressure Specific Heat f(H,S): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function HSCp(enthalpy, entropy, units) {
  return H2o.CallStmProp_fHS(enthalpy, entropy, units, Units.VectorParameters.IsobaricHeat);
}

// Function #37
/**
 * Constant Volumn Specific Heat f(H,S): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function HSCv(enthalpy, entropy, units) {
  return H2o.CallStmProp_fHS(enthalpy, entropy, units, Units.VectorParameters.IsochoricHeat);
}

// Function #38
/**
 * Speed of Sound f(H,S): (0)m/s, (1)ft/s, (2)m/s, (3)m/s
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @param {number} entropy (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)m/s, (1)ft/s, (2)m/s, (3)m/s
 */
export function HSW(enthalpy, entropy, units) {
  return H2o.CallStmProp_fHS(enthalpy, entropy, units, Units.VectorParameters.SpeedOfSound);
}

// Function #39
/**
 * Enthalpy f(P,Q): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function PQH(pressure, quality, units) {
  return H2o.CallStmProp_fPQ(pressure, quality, units, Units.VectorParameters.Enthalpy);
}

// Function #40
/**
 * Entropy f(P,Q): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PQS(pressure, quality, units) {
  return H2o.CallStmProp_fPQ(pressure, quality, units, Units.VectorParameters.Entropy);
}

// Function #41
/**
 * Internal Energy f(P,Q): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function PQU(pressure, quality, units) {
  return H2o.CallStmProp_fPQ(pressure, quality, units, Units.VectorParameters.InternalEnergy);
}

// Function #42
/**
 * Specific Volume f(P,Q): (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 */
export function PQV(pressure, quality, units) {
  return H2o.CallStmProp_fPQ(pressure, quality, units, Units.VectorParameters.Volume);
}

// Function #43
/**
 * Constant Pressure Specific Heat f(P,Q): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PQCp(pressure, quality, units) {
  return H2o.CallStmProp_fPQ(pressure, quality, units, Units.VectorParameters.IsobaricHeat);
}

// Function #44
/**
 * Constant Volumn Specific Heat f(P,Q): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function PQCv(pressure, quality, units) {
  return H2o.CallStmProp_fPQ(pressure, quality, units, Units.VectorParameters.IsochoricHeat);
}

// Function #45
/**
 * Enthalpy f(T,Q): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function TQH(temperature, quality, units) {
  return H2o.CallStmProp_fTQ(temperature, quality, units, Units.VectorParameters.Enthalpy);
}

// Function #46
/**
 * Entropy f(T,Q): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function TQS(temperature, quality, units) {
  return H2o.CallStmProp_fTQ(temperature, quality, units, Units.VectorParameters.Entropy);
}

// Function #47
/**
 * Internal Energy f(T,Q): (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function TQU(temperature, quality, units) {
  return H2o.CallStmProp_fTQ(temperature, quality, units, Units.VectorParameters.InternalEnergy);
}

// Function #48
/**
 * Specific Volume f(T,Q): (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 */
export function TQV(temperature, quality, units) {
  return H2o.CallStmProp_fTQ(temperature, quality, units, Units.VectorParameters.Volume);
}

// Function #49
/**
 * Constant Pressure Specific Heat f(T,Q): 0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function TQCp(temperature, quality, units) {
  return H2o.CallStmProp_fTQ(temperature, quality, units, Units.VectorParameters.IsobaricHeat);
}

// Function #50
/**
 * Constant Volumn Specific Heat f(T,Q): (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} quality dimensionless
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function TQCv(temperature, quality, units) {
  return H2o.CallStmProp_fTQ(temperature, quality, units, Units.VectorParameters.IsochoricHeat);
}

// Function #51
/**
 * Viscosity f(P,T): (0)Pa·s, (1)lbf·s/ft³, (2)cP, (3)cP
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)Pa·s, (1)lbf·s/ft³, (2)cP, (3)cP
 */
export function PTM(pressure, temperature, units) {
  return H2o.Viscosity_fPT(pressure, temperature, units);
}

// Function #52
/**
 * Thermal Conductivity f(P,T): (0)mW/(m·K), (1) BTU/(hr⋅ft⋅°F), (2)mW/(m·K), (3)mW/(m·K)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)mW/(m·K), (1) BTU/(hr⋅ft⋅°F), (2)mW/(m·K), (3)mW/(m·K)
 */
export function PTK(pressure, temperature, units) {
  return H2o.Conductivity_fPT(pressure, temperature, units);
}

// Function #53
/**
 * dPdT_V f(P,T): (0)MPa/K, (1)psia/°R, (2)bara/°C, (3)kPa/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/K, (1)psia/°R, (2)bara/°C, (3)kPa/°C
 */
export function dPdT_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdT_V, false);
}

// Function #54
/**
 * dPdT_U f(P,T): (0)MPa/K, (1)psia/°R, (2)bara/°C, (3)kPa/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/K, (1)psia/°R, (2)bara/°C, (3)kPa/°C
 */
export function dPdT_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdT_U, false);
}

// Function #55
/**
 * dPdT_H f(P,T): (0)MPa/K, (1)psia/°R, (2)bara/°C, (3)kPa/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/K, (1)psia/°R, (2)bara/°C, (3)kPa/°C
 */
export function dPdT_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdT_H, false);
}

// Function #56
/**
 * dPdT_S f(P,T): (0)MPa/K, (1)psia/°R, (2)bara/°C, (3)kPa/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/K, (1)psia/°R, (2)bara/°C, (3)kPa/°C
 */
export function dPdT_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdT_S, false);
}

// Function #57
/**
 * dPdV_T f(P,T): (0)MPa/(m³/kg), (1)psia/(ft³/lbm), (2)bara/(m³/kg), (3)kPa/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(m³/kg), (1)psia/(ft³/lbm), (2)bara/(m³/kg), (3)kPa/(m³/kg)
 */
export function dPdV_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdV_T, false);
}

// Function #58
/**
 * dPdV_U f(P,T): (0)MPa/(m³/kg), (1)psia/(ft³/lbm), (2)bara/(m³/kg), (3)kPa/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(m³/kg), (1)psia/(ft³/lbm), (2)bara/(m³/kg), (3)kPa/(m³/kg)
 */
export function dPdV_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdV_U, false);
}

// Function #59
/**
 * dPdV_H f(P,T): (0)MPa/(m³/kg), (1)psia/(ft³/lbm), (2)bara/(m³/kg), (3)kPa/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(m³/kg), (1)psia/(ft³/lbm), (2)bara/(m³/kg), (3)kPa/(m³/kg)
 */
export function dPdV_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdV_H, false);
}

// Function #60
/**
 * dPdV_S f(P,T): (0)MPa/(m³/kg), (1)psia/(ft³/lbm), (2)bara/(m³/kg), (3)kPa/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(m³/kg), (1)psia/(ft³/lbm), (2)bara/(m³/kg), (3)kPa/(m³/kg)
 */
export function dPdV_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdV_S, false);
}

// Function #61
/**
 * dPdU_T f(P,T): (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 */
export function dPdU_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdU_T, false);
}

// Function #62
/**
 * dPdU_V f(P,T): (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 */
export function dPdU_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdU_V, false);
}

// Function #63
/**
 * dPdU_H f(P,T): (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 */
export function dPdU_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdU_H, false);
}

// Function #64
/**
 * dPdU_S f(P,T): (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 */
export function dPdU_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdU_S, false);
}

// Function #65
/**
 * dPdH_T f(P,T): (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 */
export function dPdH_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdH_T, false);
}

// Function #66
/**
 * dPdH_V f(P,T): (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 */
export function dPdH_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdH_V, false);
}

// Function #67
/**
 * dPdH_U f(P,T): (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 */
export function dPdH_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdH_U, false);
}

// Function #68
/**
 * dPdH_S f(P,T): (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/(kJ/kg), (1)psia/(BTU/lbm), (2)bara/(kJ/kg), (3)kPa/(kJ/kg)
 */
export function dPdH_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdH_S, false);
}

// Function #69
/**
 * dPdS_T f(P,T): (0)MPa/[kJ/(kg·K)], (1)psia/[BTU/(lbm·°R)], (2)bara/[kJ/(kg·°C)], (3)kPa/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/[kJ/(kg·K)], (1)psia/[BTU/(lbm·°R)], (2)bara/[kJ/(kg·°C)], (3)kPa/[kJ/(kg·°C)]
 */
export function dPdS_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdS_T, false);
}

// Function #70
/**
 * dPdS_V f(P,T): (0)MPa/[kJ/(kg·K)], (1)psia/[BTU/(lbm·°R)], (2)bara/[kJ/(kg·°C)], (3)kPa/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/[kJ/(kg·K)], (1)psia/[BTU/(lbm·°R)], (2)bara/[kJ/(kg·°C)], (3)kPa/[kJ/(kg·°C)]
 */
export function dPdS_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdS_V, false);
}

// Function #71
/**
 * dPdS_U f(P,T): (0)MPa/[kJ/(kg·K)], (1)psia/[BTU/(lbm·°R)], (2)bara/[kJ/(kg·°C)], (3)kPa/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/[kJ/(kg·K)], (1)psia/[BTU/(lbm·°R)], (2)bara/[kJ/(kg·°C)], (3)kPa/[kJ/(kg·°C)]
 */
export function dPdS_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdS_U, false);
}

// Function #72
/**
 * dPdS_H f(P,T): (0)MPa/[kJ/(kg·K)], (1)psia/[BTU/(lbm·°R)], (2)bara/[kJ/(kg·°C)], (3)kPa/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa/[kJ/(kg·K)], (1)psia/[BTU/(lbm·°R)], (2)bara/[kJ/(kg·°C)], (3)kPa/[kJ/(kg·°C)]
 */
export function dPdS_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dPdS_H, false);
}

// Function #73
/**
 * dTdP_V f(P,T): (0)K/MPa, (1)°R/psia, (2)°C/bara, (3)°C/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/MPa, (1)°R/psia, (2)°C/bara, (3)°C/kPa
 */
export function dTdP_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdP_V, false);
}

// Function #74
/**
 * dTdP_U f(P,T): (0)K/MPa, (1)°R/psia, (2)°C/bara, (3)°C/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/MPa, (1)°R/psia, (2)°C/bara, (3)°C/kPa
 */
export function dTdP_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdP_U, false);
}

// Function #75
/**
 * dTdP_H f(P,T): (0)K/MPa, (1)°R/psia, (2)°C/bara, (3)°C/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/MPa, (1)°R/psia, (2)°C/bara, (3)°C/kPa
 */
export function dTdP_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdP_H, false);
}

// Function #76
/**
 * dTdP_S f(P,T): (0)K/MPa, (1)°R/psia, (2)°C/bara, (3)°C/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/MPa, (1)°R/psia, (2)°C/bara, (3)°C/kPa
 */
export function dTdP_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdP_S, false);
}

// Function #77
/**
 * dTdV_P f(P,T): (0)K/(m³/kg), (1)°R/(ft³/lbm), (2)°C/(m³/kg), (3)°C/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(m³/kg), (1)°R/(ft³/lbm), (2)°C/(m³/kg), (3)°C/(m³/kg)
 */
export function dTdV_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdV_P, false);
}

// Function #78
/**
 * dTdV_U f(P,T): (0)K/(m³/kg), (1)°R/(ft³/lbm), (2)°C/(m³/kg), (3)°C/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(m³/kg), (1)°R/(ft³/lbm), (2)°C/(m³/kg), (3)°C/(m³/kg)
 */
export function dTdV_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdV_U, false);
}

// Function #79
/**
 * dTdV_H f(P,T): (0)K/(m³/kg), (1)°R/(ft³/lbm), (2)°C/(m³/kg), (3)°C/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(m³/kg), (1)°R/(ft³/lbm), (2)°C/(m³/kg), (3)°C/(m³/kg)
 */
export function dTdV_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdV_H, false);
}

// Function #80
/**
 * dTdV_S f(P,T): (0)K/(m³/kg), (1)°R/(ft³/lbm), (2)°C/(m³/kg), (3)°C/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(m³/kg), (1)°R/(ft³/lbm), (2)°C/(m³/kg), (3)°C/(m³/kg)
 */
export function dTdV_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdV_S, false);
}

// Function #81
/**
 * dTdU_P f(P,T): (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 */
export function dTdU_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdU_P, false);
}

// Function #82
/**
 * dTdU_V f(P,T): (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 */
export function dTdU_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdU_V, false);
}

// Function #83
/**
 * dTdU_H f(P,T): (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 */
export function dTdU_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdU_H, false);
}

// Function #84
/**
 * dTdU_S f(P,T): (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 */
export function dTdU_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdU_S, false);
}

// Function #85
/**
 * dTdH_P f(P,T): (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 */
export function dTdH_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdH_P, false);
}

// Function #86
/**
 * dTdH_V f(P,T): (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 */
export function dTdH_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdH_V, false);
}

// Function #87
/**
 * dTdH_U f(P,T): (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 */
export function dTdH_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdH_U, false);
}

// Function #88
/**
 * dTdH_S f(P,T): (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/(kJ/kg), (1)°R/(BTU/lbm), (2)°C/(kJ/kg), (3)°C/(kJ/kg)
 */
export function dTdH_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdH_S, false);
}

// Function #89
/**
 * dTdS_P f(P,T): (0)K/[kJ/(kg·K)], (1)°R/[BTU/(lbm·°R)], (2)°C/[kJ/(kg·°C)], (3)°C/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/[kJ/(kg·K)], (1)°R/[BTU/(lbm·°R)], (2)°C/[kJ/(kg·°C)], (3)°C/[kJ/(kg·°C)]
 */
export function dTdS_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdS_P, false);
}

// Function #90
/**
 * dTdS_V f(P,T): (0)K/[kJ/(kg·K)], (1)°R/[BTU/(lbm·°R)], (2)°C/[kJ/(kg·°C)], (3)°C/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/[kJ/(kg·K)], (1)°R/[BTU/(lbm·°R)], (2)°C/[kJ/(kg·°C)], (3)°C/[kJ/(kg·°C)]
 */
export function dTdS_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdS_V, false);
}

// Function #91
/**
 * dTdS_U f(P,T): (0)K/[kJ/(kg·K)], (1)°R/[BTU/(lbm·°R)], (2)°C/[kJ/(kg·°C)], (3)°C/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/[kJ/(kg·K)], (1)°R/[BTU/(lbm·°R)], (2)°C/[kJ/(kg·°C)], (3)°C/[kJ/(kg·°C)]
 */
export function dTdS_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdS_U, false);
}

// Function #92
/**
 * dTdS_H f(P,T): (0)K/[kJ/(kg·K)], (1)°R/[BTU/(lbm·°R)], (2)°C/[kJ/(kg·°C)], (3)°C/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)K/[kJ/(kg·K)], (1)°R/[BTU/(lbm·°R)], (2)°C/[kJ/(kg·°C)], (3)°C/[kJ/(kg·°C)]
 */
export function dTdS_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dTdS_H, false);
}

// Function #93
/**
 * dVdP_T f(P,T): (0)(m³/kg)/MPa, (1)(ft³/lbm)/psia, (2)(m³/kg)/bara, (3)(m³/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/MPa, (1)(ft³/lbm)/psia, (2)(m³/kg)/bara, (3)(m³/kg)/kPa
 */
export function dVdP_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdP_T, false);
}

// Function #94
/**
 * dVdP_U f(P,T): (0)(m³/kg)/MPa, (1)(ft³/lbm)/psia, (2)(m³/kg)/bara, (3)(m³/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/MPa, (1)(ft³/lbm)/psia, (2)(m³/kg)/bara, (3)(m³/kg)/kPa
 */
export function dVdP_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdP_U, false);
}

// Function #95
/**
 * dVdP_H f(P,T): (0)(m³/kg)/MPa, (1)(ft³/lbm)/psia, (2)(m³/kg)/bara, (3)(m³/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/MPa, (1)(ft³/lbm)/psia, (2)(m³/kg)/bara, (3)(m³/kg)/kPa
 */
export function dVdP_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdP_H, false);
}

// Function #96
/**
 * dVdP_S f(P,T): (0)(m³/kg)/MPa, (1)(ft³/lbm)/psia, (2)(m³/kg)/bara, (3)(m³/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/MPa, (1)(ft³/lbm)/psia, (2)(m³/kg)/bara, (3)(m³/kg)/kPa
 */
export function dVdP_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdP_S, false);
}

// Function #97
/**
 * dVdT_P f(P,T): (0)(m³/kg)/K, (1)(ft³/lbm)/°R, (2)(m³/kg)/°C, (3)(m³/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/K, (1)(ft³/lbm)/°R, (2)(m³/kg)/°C, (3)(m³/kg)/°C
 */
export function dVdT_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdT_P, false);
}

// Function #98
/**
 * dVdT_U f(P,T): (0)(m³/kg)/K, (1)(ft³/lbm)/°R, (2)(m³/kg)/°C, (3)(m³/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/K, (1)(ft³/lbm)/°R, (2)(m³/kg)/°C, (3)(m³/kg)/°C
 */
export function dVdT_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdT_U, false);
}

// Function #99
/**
 * dVdT_H f(P,T): (0)(m³/kg)/K, (1)(ft³/lbm)/°R, (2)(m³/kg)/°C, (3)(m³/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/K, (1)(ft³/lbm)/°R, (2)(m³/kg)/°C, (3)(m³/kg)/°C
 */
export function dVdT_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdT_H, false);
}

// Function #100
/**
 * dVdT_S f(P,T): (0)(m³/kg)/K, (1)(ft³/lbm)/°R, (2)(m³/kg)/°C, (3)(m³/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/K, (1)(ft³/lbm)/°R, (2)(m³/kg)/°C, (3)(m³/kg)/°C
 */
export function dVdT_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdT_S, false);
}

// Function #101
/**
 * dVdU_P f(P,T): (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 */
export function dVdU_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdU_P, false);
}

// Function #102
/**
 * dVdU_T f(P,T): (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 */
export function dVdU_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdU_T, false);
}

// Function #103
/**
 * dVdU_H f(P,T): (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 */
export function dVdU_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdU_H, false);
}

// Function #104
/**
 * dVdU_S f(P,T): (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 */
export function dVdU_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdU_S, false);
}

// Function #105
/**
 * dVdH_P f(P,T): (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 */
export function dVdH_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdH_P, false);
}

// Function #106
/**
 * dVdH_T f(P,T): (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 */
export function dVdH_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdH_T, false);
}

// Function #107
/**
 * dVdH_U f(P,T): (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 */
export function dVdH_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdH_U, false);
}

// Function #108
/**
 * dVdH_S f(P,T): (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/(kJ/kg), (1)(ft³/lbm)/(BTU/lbm), (2)(m³/kg)/(kJ/kg), (3)(m³/kg)/(kJ/kg)
 */
export function dVdH_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdH_S, false);
}

// Function #109
/**
 * dVdS_P f(P,T): (0)(m³/kg)/[kJ/(kg·K)], (1)(ft³/lbm)/[BTU/(lbm·°R)], (2)(m³/kg)/[kJ/(kg·°C)], (3)(m³/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/[kJ/(kg·K)], (1)(ft³/lbm)/[BTU/(lbm·°R)], (2)(m³/kg)/[kJ/(kg·°C)], (3)(m³/kg)/[kJ/(kg·°C)]
 */
export function dVdS_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdS_P, false);
}

// Function #110
/**
 * dVdS_T f(P,T): (0)(m³/kg)/[kJ/(kg·K)], (1)(ft³/lbm)/[BTU/(lbm·°R)], (2)(m³/kg)/[kJ/(kg·°C)], (3)(m³/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/[kJ/(kg·K)], (1)(ft³/lbm)/[BTU/(lbm·°R)], (2)(m³/kg)/[kJ/(kg·°C)], (3)(m³/kg)/[kJ/(kg·°C)]
 */
export function dVdS_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdS_T, false);
}

// Function #111
/**
 * dVdS_U f(P,T): (0)(m³/kg)/[kJ/(kg·K)], (1)(ft³/lbm)/[BTU/(lbm·°R)], (2)(m³/kg)/[kJ/(kg·°C)], (3)(m³/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/[kJ/(kg·K)], (1)(ft³/lbm)/[BTU/(lbm·°R)], (2)(m³/kg)/[kJ/(kg·°C)], (3)(m³/kg)/[kJ/(kg·°C)]
 */
export function dVdS_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdS_U, false);
}

// Function #112
/**
 * dVdS_H f(P,T): (0)(m³/kg)/[kJ/(kg·K)], (1)(ft³/lbm)/[BTU/(lbm·°R)], (2)(m³/kg)/[kJ/(kg·°C)], (3)(m³/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(m³/kg)/[kJ/(kg·K)], (1)(ft³/lbm)/[BTU/(lbm·°R)], (2)(m³/kg)/[kJ/(kg·°C)], (3)(m³/kg)/[kJ/(kg·°C)]
 */
export function dVdS_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dVdS_H, false);
}

// Function #113
/**
 * dUdP_T f(P,T): (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 */
export function dUdP_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdP_T, false);
}

// Function #114
/**
 * dUdP_V f(P,T): (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 */
export function dUdP_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdP_V, false);
}

// Function #115
/**
 * dUdP_H f(P,T): (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 */
export function dUdP_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdP_H, false);
}

// Function #116
/**
 * dUdP_S f(P,T): (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 */
export function dUdP_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdP_S, false);
}

// Function #117
/**
 * dUdT_P f(P,T): (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 */
export function dUdT_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdT_P, false);
}

// Function #118
/**
 * dUdT_V f(P,T): (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 */
export function dUdT_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdT_V, false);
}

// Function #119
/**
 * dUdT_H f(P,T): (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 */
export function dUdT_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdT_H, false);
}

// Function #120
/**
 * dUdT_S f(P,T): (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns ((0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 */
export function dUdT_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdT_S, false);
}

// Function #121
/**
 * dUdV_P f(P,T): (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 */
export function dUdV_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdV_P, false);
}

// Function #122
/**
 * dUdV_T f(P,T): (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 */
export function dUdV_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdV_T, false);
}

// Function #123
/**
 * dUdV_H f(P,T): (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 */
export function dUdV_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdV_H, false);
}

// Function #124
/**
 * dUdV_S f(P,T): (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 */
export function dUdV_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdV_S, false);
}

// Function #125
/**
 * dUdH_P f(P,T): (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 */
export function dUdH_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdH_P, false);
}

// Function #126
/**
 * dUdH_T f(P,T): (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 */
export function dUdH_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdH_T, false);
}

// Function #127
/**
 * dUdH_V f(P,T): (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 */
export function dUdH_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdH_V, false);
}

// Function #128
/**
 * dUdH_S f(P,T): (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 */
export function dUdH_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdH_S, false);
}

// Function #129
/**
 * dUdS_P f(P,T): (0)(kJ/kg)[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 */
export function dUdS_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdS_P, false);
}

// Function #130
/**
 * dUdS_T f(P,T): (0)(kJ/kg)[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 */
export function dUdS_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdS_T, false);
}

// Function #131
/**
 * dUdS_V f(P,T): (0)(kJ/kg)[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 */
export function dUdS_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdS_V, false);
}

// Function #132
/**
 * dUdS_H f(P,T): (0)(kJ/kg)[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 */
export function dUdS_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dUdS_H, false);
}

// Function #133
/**
 * dHdP_T f(P,T): (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 */
export function dHdP_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdP_T, false);
}

// Function #134
/**
 * dHdP_V f(P,T): (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 */
export function dHdP_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdP_V, false);
}

// Function #135
/**
 * dHdP_U f(P,T): (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 */
export function dHdP_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdP_U, false);
}

// Function #136
/**
 * dHdP_S f(P,T): (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/MPa, (1)(BTU/lbm)/psia, (2)(kJ/kg)/bara, (3)(kJ/kg)/kPa
 */
export function dHdP_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdP_S, false);
}

// Function #137
/**
 * dHdT_P f(P,T): (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 */
export function dHdT_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdT_P, false);
}

// Function #138
/**
 * dHdT_V f(P,T): (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 */
export function dHdT_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdT_V, false);
}

// Function #139
/**
 * dHdT_U f(P,T): (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 */
export function dHdT_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdT_U, false);
}

// Function #140
/**
 * dHdT_S f(P,T): (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/K, (1)(BTU/lbm)/°R, (2)(kJ/kg)/°C, (3)(kJ/kg)/°C
 */
export function dHdT_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdT_S, false);
}

// Function #141
/**
 * dHdV_P f(P,T): (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 */
export function dHdV_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdV_P, false);
}

// Function #142
/**
 * dHdV_T f(P,T): (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 */
export function dHdV_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdV_T, false);
}

// Function #143
/**
 * dHdV_U f(P,T): (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 */
export function dHdV_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdV_U, false);
}

// Function #144
/**
 * dHdV_S f(P,T): (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(m³/kg), (1)(BTU/lbm)/(ft³/lbm), (2)(kJ/kg)/(m³/kg), (3)(kJ/kg)/(m³/kg)
 */
export function dHdV_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdV_S, false);
}

// Function #145
/**
 * dHdU_P f(P,T): (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 */
export function dHdU_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdU_P, false);
}

// Function #146
/**
 * dHdU_T f(P,T): (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 */
export function dHdU_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdU_T, false);
}

// Function #147
/**
 * dHdU_V f(P,T): (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 */
export function dHdU_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdU_V, false);
}

// Function #148
/**
 * dHdU_S f(P,T): (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/(kJ/kg), (1)(BTU/lbm)/(BTU/lbm), (2)(kJ/kg)/(kJ/kg), (3)(kJ/kg)/(kJ/kg)
 */
export function dHdU_S_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdU_S, false);
}

// Function #149
/**
 * dHdS_P f(P,T): (0)(kJ/kg)/[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 */
export function dHdS_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdS_P, false);
}

// Function #150
/**
 * dHdS_T f(P,T): (0)(kJ/kg)/[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 */
export function dHdS_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdS_T, false);
}

// Function #151
/**
 * dHdS_V f(P,T): (0)(kJ/kg)/[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 */
export function dHdS_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdS_V, false);
}

// Function #152
/**
 * dHdS_U f(P,T): (0)(kJ/kg)/[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)(kJ/kg)/[kJ/(kg·K)], (1)(BTU/lbm)/[BTU/(lbm·°R)], (2)(kJ/kg)/[kJ/(kg·°C)], (3)(kJ/kg)/[kJ/(kg·°C)]
 */
export function dHdS_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dHdS_U, false);
}

// Function #153
/**
 * dSdP_T f(P,T): (0)[kJ/(kg·K)]/MPa, (1)[BTU/(lbm·°R)]/psia, (2)[kJ/(kg·°C)]/bara, (3)[kJ/(kg/°C)]/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/MPa, (1)[BTU/(lbm·°R)]/psia, (2)[kJ/(kg·°C)]/bara, (3)[kJ/(kg/°C)]/kPa
 */
export function dSdP_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdP_T, false);
}

// Function #154
/**
 * dSdP_V f(P,T): (0)[kJ/(kg·K)]/MPa, (1)[BTU/(lbm·°R)]/psia, (2)[kJ/(kg·°C)]/bara, (3)[kJ/(kg/°C)]/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/MPa, (1)[BTU/(lbm·°R)]/psia, (2)[kJ/(kg·°C)]/bara, (3)[kJ/(kg/°C)]/kPa
 */
export function dSdP_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdP_V, false);
}

// Function #155
/**
 * dSdP_U f(P,T): (0)[kJ/(kg·K)]/MPa, (1)[BTU/(lbm·°R)]/psia, (2)[kJ/(kg·°C)]/bara, (3)[kJ/(kg/°C)]/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/MPa, (1)[BTU/(lbm·°R)]/psia, (2)[kJ/(kg·°C)]/bara, (3)[kJ/(kg/°C)]/kPa
 */
export function dSdP_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdP_U, false);
}

// Function #156
/**
 * dSdP_H f(P,T): (0)[kJ/(kg·K)]/MPa, (1)[BTU/(lbm·°R)]/psia, (2)[kJ/(kg·°C)]/bara, (3)[kJ/(kg/°C)]/kPa
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/MPa, (1)[BTU/(lbm·°R)]/psia, (2)[kJ/(kg·°C)]/bara, (3)[kJ/(kg/°C)]/kPa
 */
export function dSdP_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdP_H, false);
}

// Function #157
/**
 * dSdT_P f(P,T): (0)[kJ/(kg·K)]/K, (1)[BTU/(lbm·°R)]/°R, (2)[kJ/(kg·°C)]/°C, (3)[kJ/(kg·°C)]/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/K, (1)[BTU/(lbm·°R)]/°R, (2)[kJ/(kg·°C)]/°C, (3)[kJ/(kg·°C)]/°C
 */
export function dSdT_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdT_P, false);
}

// Function #158
/**
 * dSdT_V f(P,T): (0)[kJ/(kg·K)]/K, (1)[BTU/(lbm·°R)]/°R, (2)[kJ/(kg·°C)]/°C, (3)[kJ/(kg·°C)]/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/K, (1)[BTU/(lbm·°R)]/°R, (2)[kJ/(kg·°C)]/°C, (3)[kJ/(kg·°C)]/°C
 */
export function dSdT_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdT_V, false);
}

// Function #159
/**
 * dSdT_U f(P,T): (0)[kJ/(kg·K)]/K, (1)[BTU/(lbm·°R)]/°R, (2)[kJ/(kg·°C)]/°C, (3)[kJ/(kg·°C)]/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/K, (1)[BTU/(lbm·°R)]/°R, (2)[kJ/(kg·°C)]/°C, (3)[kJ/(kg·°C)]/°C
 */
export function dSdT_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdT_U, false);
}

// Function #160
/**
 * dSdT_H f(P,T): (0)[kJ/(kg·K)]/K, (1)[BTU/(lbm·°R)]/°R, (2)[kJ/(kg·°C)]/°C, (3)[kJ/(kg·°C)]/°C
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/K, (1)[BTU/(lbm·°R)]/°R, (2)[kJ/(kg·°C)]/°C, (3)[kJ/(kg·°C)]/°C
 */
export function dSdT_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdT_H, false);
}

// Function #161
/**
 * dSdV_P f(P,T): (0)[kJ/(kg·K)]/(m³/kg), (1)[BTU/(lbm·°R)]/(ft³/lbm), (2)[kJ/(kg·°C)]/(m³/kg), (3)[kJ/(kg·°C)]/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(m³/kg), (1)[BTU/(lbm·°R)]/(ft³/lbm), (2)[kJ/(kg·°C)]/(m³/kg), (3)[kJ/(kg·°C)]/(m³/kg)
 */
export function dSdV_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdV_P, false);
}

// Function #162
/**
 * dSdV_T f(P,T): (0)[kJ/(kg·K)]/(m³/kg), (1)[BTU/(lbm·°R)]/(ft³/lbm), (2)[kJ/(kg·°C)]/(m³/kg), (3)[kJ/(kg·°C)]/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(m³/kg), (1)[BTU/(lbm·°R)]/(ft³/lbm), (2)[kJ/(kg·°C)]/(m³/kg), (3)[kJ/(kg·°C)]/(m³/kg)
 */
export function dSdV_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdV_T, false);
}

// Function #163
/**
 * dSdV_U f(P,T): (0)[kJ/(kg·K)]/(m³/kg), (1)[BTU/(lbm·°R)]/(ft³/lbm), (2)[kJ/(kg·°C)]/(m³/kg), (3)[kJ/(kg·°C)]/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(m³/kg), (1)[BTU/(lbm·°R)]/(ft³/lbm), (2)[kJ/(kg·°C)]/(m³/kg), (3)[kJ/(kg·°C)]/(m³/kg)
 */
export function dSdV_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdV_U, false);
}

// Function #164
/**
 * dSdV_H f(P,T): (0)[kJ/(kg·K)]/(m³/kg), (1)[BTU/(lbm·°R)]/(ft³/lbm), (2)[kJ/(kg·°C)]/(m³/kg), (3)[kJ/(kg·°C)]/(m³/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(m³/kg), (1)[BTU/(lbm·°R)]/(ft³/lbm), (2)[kJ/(kg·°C)]/(m³/kg), (3)[kJ/(kg·°C)]/(m³/kg)
 */
export function dSdV_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdV_H, false);
}

// Function #165
/**
 * dSdU_P f(P,T): (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 */
export function dSdU_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdU_P, false);
}

// Function #166
/**
 * dSdU_T f(P,T): (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 */
export function dSdU_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdU_T, false);
}

// Function #167
/**
 * dSdU_V f(P,T): (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 */
export function dSdU_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdU_V, false);
}

// Function #168
/**
 * dSdU_H f(P,T): (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 */
export function dSdU_H_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdU_H, false);
}

// Function #169
/**
 * dSdH_P f(P,T): (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 */
export function dSdH_P_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdH_P, false);
}

// Function #170
/**
 * dSdH_T f(P,T): (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 */
export function dSdH_T_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdH_T, false);
}

// Function #171
/**
 * dSdH_V f(P,T): (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 */
export function dSdH_V_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdH_V, false);
}

// Function #172
/**
 * dSdH_U f(P,T): (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure (0)MPa, (1)psia, (2)bara, (3)kPa
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param  {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)[kJ/(kg·K)]/(kJ/kg), (1)[BTU/(lbm·°R)]/(BTU/lbm), (2)[kJ/(kg·°C)]/(kJ/kg), (3)[kJ/(kg·°C)]/(kJ/kg)
 */
export function dSdH_U_fPT(pressure, temperature, units) {
  return H2o.CallStmProp_fPT(pressure, temperature, units, Units.VectorParameters.dSdH_U, false);
}

// Debug Function for Viscosity
/**
 * Viscosity f(T, v) used to verify the values in R12-08 Table 4 & 5.  This does not check to see if the pressure is valid (use with caution).  Only supports SI units
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature  K
 * @param {number} volume (0)m³/kg
 * @returns Pa·s (use with caution, see help url)
 */
export function TVM(temperature, volume) {
  return H2o.Viscosity_fTV(temperature, volume);
}

// Debug function for Conductivity W/O the critical enhancement for verifying values in R15-11 table 4
// Does not check to verify in a valid range, only used for testing
/**
 * Conductivity f(V,T) without critical enhancement
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature K
 * @param {number} volume m³/kg
 * @returns mW/(m·K)
 */
export function Test_TVK_WO_Crit_Enh(temperature, volume) {
  return H2o.Conductivity_fTV_WO_Crit_Enh(temperature, volume);
}

// Debug function for Conductivity With the critical enhancement for verifying values in R15-11 table 5
// Assumes the input values are in Region 3.  Does not check in a valid range, only for testing
/**
 * Conductivity f(V,T) without critical enhancement
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} temperature K
 * @param {number} volume m³/kg
 * @returns mW/(m·K)
 */
export function Test_TVK_With_Crit_Enh(temperature, volume) {
  return H2o.Conductivity_fTV_With_Crit_Enh(temperature, volume);
}

// Debug Functions for Region 3 f(v,T) to verify the values in R7-97 Table 33.
// Comment out when done testing or add a check to make sure in Region 3
/**
 * Region 3 only: returns pressure f(v,T)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} volume (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)MPa, (1)psia, (2)bara, (3)kPa
 */
export function Test_VTP(volume, temperature, units) {
  return H2o.CallStmProp_fVT(volume, temperature, units, Units.VectorParameters.Pressure);
}

/**
 * Region 3 only: returns enthalpy f(v,T)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} volume (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function Test_VTH(volume, temperature, units) {
  return H2o.CallStmProp_fVT(volume, temperature, units, Units.VectorParameters.Enthalpy);
}

/**
 * Region 3 only: returns internal energy f(v,T)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} volume (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/kg, (1)BTU/lbm, (2)kJ/kg, (3)kJ/kg
 */
export function Test_VTU(volume, temperature, units) {
  return H2o.CallStmProp_fVT(volume, temperature, units, Units.VectorParameters.InternalEnergy);
}

/**
 * Region 3 only: returns entropy f(v,T)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} volume (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function Test_VTS(volume, temperature, units) {
  return H2o.CallStmProp_fVT(volume, temperature, units, Units.VectorParameters.Entropy);
}

/**
 * Region 3 only: returns isobaric specific heat f(v,T)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} volume (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)kJ/(kg·K), (1)BTU/(lbm·°F), (2)kJ/(kg·°C), (3)kJ/(kg·°C)
 */
export function Test_VTCp(volume, temperature, units) {
  return H2o.CallStmProp_fVT(volume, temperature, units, Units.VectorParameters.IsobaricHeat);
}

/**
 * Region 3 only: returns speed of sound f(v,T)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} volume (0)m³/kg, (1)ft³/lbm, (2)m³/kg, (3)m³/kg
 * @param {number} temperature  (0)K, (1)°F, (2)°C, (3)°C
 * @param {number} [units=0] (0)SI, (1)US Customary, (2)Metric bara, (3) Metric kPa
 * @returns (0)m/s, (1)ft/s, (2)m/s, (3)m/s
 */
export function Test_VTW(volume, temperature, units) {
  return H2o.CallStmProp_fVT(volume, temperature, units, Units.VectorParameters.SpeedOfSound);
}

// Debug Function for Region 3 saturation pressure psat(h) to verify the values in 3R3-03 Table 18.
// Comment out when done testing or add a check to make sure inputs within valid range
/**
 * returns Region 3 saturation pressure psat(h)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy  kJ/kg
 * @returns MPa
 */
export function Test_R3_h_psat(enthalpy) {
  return H2o.R3Psat_fH(enthalpy);
}

// Debug Function for Region 3 saturation pressure psat(s) to verify the values in 3R3-03 Table 20.
// Comment out when done testing or add a check to make sure inputs within valid range
/**
 * returns Region 1 to Region 4 boundary: h(s)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} entropy  kJ/(kg·K)
 * @returns enthalpy kJ/kg
 */
export function Test_R3_s_psat(enthalpy) {
  return H2o.R3Psat_fS(enthalpy);
}

// Debug Function for boundary equation between Region 1 and Region 4 to verify the values in SR4-04 Table 11
// Comment out when done testing or add a check to make sure inputs within valid range
/**
 * returns Region 1 to Region 4 boundary: h(s)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} entropy  kJ/(kg·K)
 * @returns enthalpy kJ/kg
 */
export function Test_H1_sat_liqS(enthalpy) {
  return H2o.H1_sat_liqS(enthalpy);
}

// Debug Function for saturated liquid boundary equation between Region 3 and Region 4 to verify the values in SR4-04 Table 11
// Comment out when done testing or add a check to make sure inputs within valid range
/**
 * returns Region 3 to Region 4 saturated liquid boundary: h(s)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} entropy  kJ/(kg·K)
 * @returns enthalpy kJ/kg
 */
export function Test_H3a_sat_liqS(enthalpy) {
  return H2o.H3a_sat_liqS(enthalpy);
}

// Debug Function for saturated vapor boundary between Region 2 and Region 4 to verify the values in SR4-04 Table 18
// Comment out when done testing or add a check to make sure inputs within valid range
/**
 * returns Region 1 to Region 4 boundary: h(s)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} entropy  kJ/(kg·K)
 * @returns enthalpy kJ/kg
 */
export function Test_H2ab_sat_VapS(entropy) {
  return H2o.H2ab_sat_VapS(entropy);
}

// Debug Function for saturated liquid boundary equation between Region 2&3 and Region 4 to verify the values in SR4-04 Table 18
// Comment out when done testing or add a check to make sure inputs within valid range
/**
 * returns Region 3 to Region 4 saturated liquid boundary: h(s)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} entropy  kJ/(kg·K)
 * @returns enthalpy kJ/kg
 */
export function Test_H2c3b_sat_VapS(entropy) {
  return H2o.H2c3b_sat_VapS(entropy);
}

// Debug Function for the boundary between Regions 1 and 3 to verify the values in SR4-04 Table 24
// Comment out when done testing or add a check to make sure inputs within valid range
/**
 * returns boundary between Regions 1 & 3 f(s)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} entropy  kJ/(kg·K)
 * @returns enthalpy kJ/kg
 */
export function Test_Hb13S(entropy) {
  return H2o.Hb13S(entropy);
}

// Debug Function for the boundary between Regions 2 and 3 to verify the values in SR4-04 Table 26
// Comment out when done testing or add a check to make sure inputs within valid range
/**
 * returns boundary between Regions 2 & 3 T(h,s)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy  kJ/kg
 * @param {number} entropy  kJ/(kg·K)
 * @returns Temperature K
 */
export function Test_Tb23HS(enthalpy, entropy) {
  return H2o.Tb23HS(enthalpy, entropy);
}

// Debug Function for the boundary between Regions 2 and 3 to verify the values in SR4-04 Table 26
// Comment out when done testing or add a check to make sure inputs within valid range
/**
 * returns boundary between Regions 2 & 3 T(h,s)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} enthalpy  kJ/kg
 * @param {number} entropy  kJ/(kg·K)
 * @returns Saturation Temperature K
 */
export function Test_TsatHS(enthalpy, entropy) {
  return H2o.TsatHS(enthalpy, entropy);
}

// Debug Function for T3ab(p) SR5-05 eq 2
/**
 * Region 3 only: returns T3ab(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3ab K
 */
export function Test_T3ab(pressure) {
  return H2o.T3ab(pressure);
}

// Debug Function for T3op(p) SR5-05 eq 2
/**
 * Region 3 only: returns T3op(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3op K
 */
export function Test_T3op(pressure) {
  return H2o.T3op(pressure);
}

// Debug Function for T3ef(p) SR5-05 eq 3
/**
 * Region 3 only: returns T3ef(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3ef K
 */
export function Test_T3ef(pressure) {
  return H2o.T3ef(pressure);
}

// Debug Function for T3cd(p) SR5-05 eq 1
/**
 * Region 3 only: returns T3cd(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3cd K
 */
export function Test_T3cd(pressure) {
  return H2o.T3cd(pressure);
}

// Debug Function for T3gh(p) SR5-05 eq 1
/**
 * Region 3 only: returns T3gh(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3gh K
 */
export function Test_T3gh(pressure) {
  return H2o.T3gh(pressure);
}

// Debug Function for T3ij(p) SR5-05 eq 1
/**
 * Region 3 only: returns T3ij(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3ij K
 */
export function Test_T3ij(pressure) {
  return H2o.T3ij(pressure);
}

// Debug Function for T3jk(p) SR5-05 eq 1
/**
 * Region 3 only: returns T3jk(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3jk K
 */
export function Test_T3jk(pressure) {
  return H2o.T3jk(pressure);
}

// Debug Function for T3mn(p) SR5-05 eq 1
/**
 * Region 3 only: returns T3mn(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3mn K
 */
export function Test_T3mn(pressure) {
  return H2o.T3mn(pressure);
}

// Debug Function for T3qu(p) SR5-05 eq 1
/**
 * Region 3 only: returns T3qu(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3qu K
 */
export function Test_T3qu(pressure) {
  return H2o.T3qu(pressure);
}

// Debug Function for T3rx(p) SR5-05 eq 1
/**
 * Region 3 only: returns T3rx(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3rx K
 */
export function Test_T3rx(pressure) {
  return H2o.T3rx(pressure);
}

// Debug Function for T3uv(p) SR5-05 eq 1
/**
 * Region 3 only: returns T3uv(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3uv K
 */
export function Test_T3uv(pressure) {
  return H2o.T3uv(pressure);
}

// Debug Function for T3wx(p) SR5-05 eq 1
/**
 * Region 3 only: returns T3wx(p)
 * @customfunction
 * @helpurl http://InfoPogo.com
 * @param {number} pressure MPa
 * @returns T3wx K
 */
export function Test_T3wx(pressure) {
  return H2o.T3wx(pressure);
}
