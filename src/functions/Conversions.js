/* eslint-disable @typescript-eslint/no-unused-vars */
import * as Constants from "./Constants.js";
import * as Units from "./Units.js";
import * as Errors from "./Errors.js";

const KpaPerPsi = 6.894757293168361;
//const MpaPerPsi = 6.894757e3;
const PsiPerMpa = 145.0377; //  ASME Steam Tables Book - Table 2-3

// Convert the SI SteamProperties Array (MPa, K, etc) to required Units
export function SteamPropertiesConversionReg4(inputProperties, units = Units.SI) {
  var outputProperties = inputProperties;

  switch (units) {
    case Units.SI:
      // Nothing to do
      break;
    case Units.USCustomary:
      outputProperties[Units.VectorParameters.Pressure] = inputProperties[Units.VectorParameters.Pressure] * PsiPerMpa; // Pressure - MPa to psia
      outputProperties[Units.VectorParameters.Temperature] = KtoF(inputProperties[Units.VectorParameters.Temperature]); // Temperature - K to deg F
      outputProperties[Units.VectorParameters.Quality] = inputProperties[Units.VectorParameters.Quality]; // Quality - dimensionless
      outputProperties[Units.VectorParameters.Enthalpy] =
        inputProperties[Units.VectorParameters.Enthalpy] * BtuPerLbm_Per_KjPerKg; // Specific enthalpy - kJ/kg to BTU/lbm
      outputProperties[Units.VectorParameters.Entropy] =
        inputProperties[Units.VectorParameters.Entropy] * BtuPerLbmR_Per_KjPerKgK; // Specific entropy - kJ/kg/K to BTU/lbm/R
      outputProperties[Units.VectorParameters.InternalEnergy] =
        inputProperties[Units.VectorParameters.InternalEnergy] * BtuPerLbm_Per_KjPerKg; // Specific internal energy - kJ/kg to BTU/lbm
      outputProperties[Units.VectorParameters.Volume] =
        inputProperties[Units.VectorParameters.Volume] * Ft3perLbm_per_M3PerKg; // Specific Volume - m3/kg to ft3/lbm
      outputProperties[Units.VectorParameters.IsobaricHeat] =
        inputProperties[Units.VectorParameters.IsobaricHeat] * BtuPerLbmR_Per_KjPerKgK; // Isobaric (constant pressure) heat capacity - kJ/kg/K to BTU/lbm/R
      outputProperties[Units.VectorParameters.IsochoricHeat] =
        inputProperties[Units.VectorParameters.IsochoricHeat] * BtuPerLbmR_Per_KjPerKgK; // Isochoric (constant volume) heat capacity - kJ/kg/K to BTU/lbm/R
      outputProperties[Units.VectorParameters.SpeedOfSound] = MetersPerSecondToFeetPerSecond(
        inputProperties[Units.VectorParameters.SpeedOfSound] // Speed of sound - m/s to ft/s
      );
      break;
    case Units.MetricBarA:
      outputProperties = inputProperties;
      outputProperties[Units.VectorParameters.Pressure] = MpaToBar(inputProperties[Units.VectorParameters.Pressure]);
      outputProperties[Units.VectorParameters.Temperature] = KtoC(inputProperties[Units.VectorParameters.Temperature]);
      break;
    case Units.MetricKpa:
      outputProperties = inputProperties;
      outputProperties[Units.VectorParameters.Pressure] = MpaToKpa(inputProperties[Units.VectorParameters.Pressure]);
      outputProperties[Units.VectorParameters.Temperature] = KtoC(inputProperties[Units.VectorParameters.Temperature]);
      break;
    default:
      throw Errors.ErrorUnitsNotInRange;
  }
  return outputProperties;
}

// Converts the resulting calculated SI properties to the requested return units
export function SteamPropertiesConversion(inputProperties, units = Units.SI) {
  var outputProperties = SteamPropertiesConversionReg4(inputProperties, units);
  switch (units) {
    case Units.SI:
      // Nothing to do
      break;
    case Units.USCustomary:
      outputProperties[12] = inputProperties[12] * MPa_per_K_To_psia_per_R; // dPdT_V
      outputProperties[13] = inputProperties[13] * MPa_per_K_To_psia_per_R; // dPdT_U
      outputProperties[14] = inputProperties[14] * MPa_per_K_To_psia_per_R; // dPdT_H
      outputProperties[15] = inputProperties[15] * MPa_per_K_To_psia_per_R; // dPdT_S
      outputProperties[16] = inputProperties[16] * MPa_per_M3PerKg_To_psia_per_Ft3PerLbm; // dPdV_T
      outputProperties[17] = inputProperties[17] * MPa_per_M3PerKg_To_psia_per_Ft3PerLbm; // dPdV_U
      outputProperties[18] = inputProperties[18] * MPa_per_M3PerKg_To_psia_per_Ft3PerLbm; // dPdV_H
      outputProperties[19] = inputProperties[19] * MPa_per_M3PerKg_To_psia_per_Ft3PerLbm; // dPdV_S
      outputProperties[20] = inputProperties[20] * MPa_per_KjPerKg_To_psia_per_BtuPerLbm; // dPdU_T
      outputProperties[21] = inputProperties[21] * MPa_per_KjPerKg_To_psia_per_BtuPerLbm; // dPdU_V
      outputProperties[22] = inputProperties[22] * MPa_per_KjPerKg_To_psia_per_BtuPerLbm; // dPdU_H
      outputProperties[23] = inputProperties[23] * MPa_per_KjPerKg_To_psia_per_BtuPerLbm; // dPdU_S
      outputProperties[24] = inputProperties[24] * MPa_per_KjPerKg_To_psia_per_BtuPerLbm; // dPdH_T
      outputProperties[25] = inputProperties[25] * MPa_per_KjPerKg_To_psia_per_BtuPerLbm; // dPdH_V
      outputProperties[26] = inputProperties[26] * MPa_per_KjPerKg_To_psia_per_BtuPerLbm; // dPdH_U
      outputProperties[27] = inputProperties[27] * MPa_per_KjPerKg_To_psia_per_BtuPerLbm; // dPdH_S
      outputProperties[28] = inputProperties[28] * MPa_per_KjPerKg_K_To_psia_per_BtuPerLbm_R; // dPdS_T
      outputProperties[29] = inputProperties[29] * MPa_per_KjPerKg_K_To_psia_per_BtuPerLbm_R; // dPdS_V
      outputProperties[30] = inputProperties[39] * MPa_per_KjPerKg_K_To_psia_per_BtuPerLbm_R; // dPdS_U
      outputProperties[31] = inputProperties[31] * MPa_per_KjPerKg_K_To_psia_per_BtuPerLbm_R; // dPdS_S
      outputProperties[32] = inputProperties[32] * K_per_MPa_To_R_per_Psia; // dTdP_V
      outputProperties[33] = inputProperties[33] * K_per_MPa_To_R_per_Psia; // dTdP_U
      outputProperties[34] = inputProperties[34] * K_per_MPa_To_R_per_Psia; // dTdP_H
      outputProperties[35] = inputProperties[35] * K_per_MPa_To_R_per_Psia; // dTdP_S
      outputProperties[36] = inputProperties[36] * K_per_M3perKg_To_R_per_Ft3PerLbm; // dTdV_P
      outputProperties[37] = inputProperties[37] * K_per_M3perKg_To_R_per_Ft3PerLbm; // dTdV_U
      outputProperties[38] = inputProperties[38] * K_per_M3perKg_To_R_per_Ft3PerLbm; // dTdV_H
      outputProperties[39] = inputProperties[39] * K_per_M3perKg_To_R_per_Ft3PerLbm; // dTdV_S
      outputProperties[40] = inputProperties[40] * K_per_KjPerKg_To_R_per_BtuPerLbm; // dTdU_P
      outputProperties[41] = inputProperties[41] * K_per_KjPerKg_To_R_per_BtuPerLbm; // dTdU_V
      outputProperties[42] = inputProperties[42] * K_per_KjPerKg_To_R_per_BtuPerLbm; // dTdU_H
      outputProperties[43] = inputProperties[43] * K_per_KjPerKg_To_R_per_BtuPerLbm; // dTdU_S
      outputProperties[44] = inputProperties[44] * K_per_KjPerKg_To_R_per_BtuPerLbm; // dTdH_P
      outputProperties[45] = inputProperties[45] * K_per_KjPerKg_To_R_per_BtuPerLbm; // dTdH_V
      outputProperties[46] = inputProperties[46] * K_per_KjPerKg_To_R_per_BtuPerLbm; // dTdH_U
      outputProperties[47] = inputProperties[47] * K_per_KjPerKg_To_R_per_BtuPerLbm; // dTdH_S
      outputProperties[48] = inputProperties[48] * K_per_KjPerKg_K_To_R_per_BtuPerLbm_R; // dTdS_P
      outputProperties[49] = inputProperties[49] * K_per_KjPerKg_K_To_R_per_BtuPerLbm_R; // dTdS_V
      outputProperties[50] = inputProperties[50] * K_per_KjPerKg_K_To_R_per_BtuPerLbm_R; // dTdS_U
      outputProperties[51] = inputProperties[51] * K_per_KjPerKg_K_To_R_per_BtuPerLbm_R; // dTdS_H
      outputProperties[52] = inputProperties[52] * M3PerKg_per_MPa_To_Ft3PerLbm_per_Psia; // dVdP_T
      outputProperties[53] = inputProperties[53] * M3PerKg_per_MPa_To_Ft3PerLbm_per_Psia; // dVdP_U
      outputProperties[54] = inputProperties[54] * M3PerKg_per_MPa_To_Ft3PerLbm_per_Psia; // dVdP_H
      outputProperties[55] = inputProperties[55] * M3PerKg_per_MPa_To_Ft3PerLbm_per_Psia; // dVdP_S
      outputProperties[56] = inputProperties[56] * M3PerKg_per_K_To_Ft3PerLbm_per_R; // dVdT_P
      outputProperties[57] = inputProperties[57] * M3PerKg_per_K_To_Ft3PerLbm_per_R; // dVdT_U
      outputProperties[58] = inputProperties[58] * M3PerKg_per_K_To_Ft3PerLbm_per_R; // dVdT_H
      outputProperties[59] = inputProperties[59] * M3PerKg_per_K_To_Ft3PerLbm_per_R; // dVdT_S
      outputProperties[60] = inputProperties[60] * M3PerKg_per_KjPerKg_To_Ft3PerLbm_per_BtuPerLbm; // dVdU_P
      outputProperties[61] = inputProperties[61] * M3PerKg_per_KjPerKg_To_Ft3PerLbm_per_BtuPerLbm; // dVdU_T
      outputProperties[62] = inputProperties[62] * M3PerKg_per_KjPerKg_To_Ft3PerLbm_per_BtuPerLbm; // dVdU_H
      outputProperties[63] = inputProperties[63] * M3PerKg_per_KjPerKg_To_Ft3PerLbm_per_BtuPerLbm; // dVdU_S
      outputProperties[64] = inputProperties[64] * M3PerKg_per_KjPerKg_To_Ft3PerLbm_per_BtuPerLbm; // dVdH_P
      outputProperties[65] = inputProperties[65] * M3PerKg_per_KjPerKg_To_Ft3PerLbm_per_BtuPerLbm; // dVdH_T
      outputProperties[66] = inputProperties[66] * M3PerKg_per_KjPerKg_To_Ft3PerLbm_per_BtuPerLbm; // dVdH_U
      outputProperties[67] = inputProperties[67] * M3PerKg_per_KjPerKg_To_Ft3PerLbm_per_BtuPerLbm; // dVdH_S
      outputProperties[68] = inputProperties[68] * M3PerKg_per_KjPerKg_K_To_Ft3perLbm_per_BtuPerLbmR; // dVdS_P
      outputProperties[69] = inputProperties[69] * M3PerKg_per_KjPerKg_K_To_Ft3perLbm_per_BtuPerLbmR; // dVdS_T
      outputProperties[70] = inputProperties[70] * M3PerKg_per_KjPerKg_K_To_Ft3perLbm_per_BtuPerLbmR; // dVdS_U
      outputProperties[71] = inputProperties[71] * M3PerKg_per_KjPerKg_K_To_Ft3perLbm_per_BtuPerLbmR; // dVdS_H
      outputProperties[72] = inputProperties[72] * KjPerKg_per_MPa_To_BtuPerLbm_per_Psia; // dUdP_T
      outputProperties[73] = inputProperties[73] * KjPerKg_per_MPa_To_BtuPerLbm_per_Psia; // dUdP_V
      outputProperties[74] = inputProperties[74] * KjPerKg_per_MPa_To_BtuPerLbm_per_Psia; // dUdP_H
      outputProperties[75] = inputProperties[75] * KjPerKg_per_MPa_To_BtuPerLbm_per_Psia; // dUdP_S
      outputProperties[76] = inputProperties[76] * KjPerKg_per_K_To_BtuPerLbm_per_R; // dUdT_P
      outputProperties[77] = inputProperties[77] * KjPerKg_per_K_To_BtuPerLbm_per_R; // dUdT_V
      outputProperties[78] = inputProperties[78] * KjPerKg_per_K_To_BtuPerLbm_per_R; // dUdT_H
      outputProperties[79] = inputProperties[79] * KjPerKg_per_K_To_BtuPerLbm_per_R; // dUdT_S
      outputProperties[80] = inputProperties[80] * KjPerKg_per_M3PerKg_To_BtuPerLbm_per_Ft3PerLbm; // dUdV_P
      outputProperties[81] = inputProperties[81] * KjPerKg_per_M3PerKg_To_BtuPerLbm_per_Ft3PerLbm; // dUdV_T
      outputProperties[82] = inputProperties[82] * KjPerKg_per_M3PerKg_To_BtuPerLbm_per_Ft3PerLbm; // dUdV_H
      outputProperties[83] = inputProperties[83] * KjPerKg_per_M3PerKg_To_BtuPerLbm_per_Ft3PerLbm; // dUdV_S
      outputProperties[88] = inputProperties[88] * KjPerKg_per_KjPerKgK_To_BtuPerLbm_per_BtuPerLbmR; // dUdS_P
      outputProperties[89] = inputProperties[89] * KjPerKg_per_KjPerKgK_To_BtuPerLbm_per_BtuPerLbmR; // dUdS_T
      outputProperties[90] = inputProperties[90] * KjPerKg_per_KjPerKgK_To_BtuPerLbm_per_BtuPerLbmR; // dUdS_V
      outputProperties[91] = inputProperties[91] * KjPerKg_per_KjPerKgK_To_BtuPerLbm_per_BtuPerLbmR; // dUdS_H
      outputProperties[92] = inputProperties[92] * KjPerKg_per_MPa_To_BtuPerLbm_per_Psia; // dHdP_T
      outputProperties[93] = inputProperties[93] * KjPerKg_per_MPa_To_BtuPerLbm_per_Psia; // dHdP_V
      outputProperties[94] = inputProperties[94] * KjPerKg_per_MPa_To_BtuPerLbm_per_Psia; // dHdP_U
      outputProperties[95] = inputProperties[95] * KjPerKg_per_MPa_To_BtuPerLbm_per_Psia; // dHdP_S
      outputProperties[96] = inputProperties[96] * KjPerKg_per_K_To_BtuPerLbm_per_R; // dHdT_P
      outputProperties[97] = inputProperties[97] * KjPerKg_per_K_To_BtuPerLbm_per_R; // dHdT_V
      outputProperties[98] = inputProperties[98] * KjPerKg_per_K_To_BtuPerLbm_per_R; // dHdT_U
      outputProperties[99] = inputProperties[99] * KjPerKg_per_K_To_BtuPerLbm_per_R; // dHdT_S
      outputProperties[100] = inputProperties[100] * KjPerKg_per_M3PerKg_To_BtuPerLbm_per_Ft3PerLbm; // dHdV_P
      outputProperties[101] = inputProperties[101] * KjPerKg_per_M3PerKg_To_BtuPerLbm_per_Ft3PerLbm; // dHdV_T
      outputProperties[102] = inputProperties[102] * KjPerKg_per_M3PerKg_To_BtuPerLbm_per_Ft3PerLbm; // dHdV_U
      outputProperties[103] = inputProperties[103] * KjPerKg_per_M3PerKg_To_BtuPerLbm_per_Ft3PerLbm; // dHdV_S
      outputProperties[108] = inputProperties[108] * KjPerKg_per_KjPerKgK_To_BtuPerLbm_per_BtuPerLbmR; // dHdS_P
      outputProperties[109] = inputProperties[109] * KjPerKg_per_KjPerKgK_To_BtuPerLbm_per_BtuPerLbmR; // dHdS_T
      outputProperties[110] = inputProperties[110] * KjPerKg_per_KjPerKgK_To_BtuPerLbm_per_BtuPerLbmR; // dHdS_V
      outputProperties[111] = inputProperties[111] * KjPerKg_per_KjPerKgK_To_BtuPerLbm_per_BtuPerLbmR; // dHdS_U
      outputProperties[112] = inputProperties[112] * KjPerKgK_per_Mpa_To_BtuPerLbmR_per_Psia; // dSdP_T
      outputProperties[113] = inputProperties[113] * KjPerKgK_per_Mpa_To_BtuPerLbmR_per_Psia; // dSdP_V
      outputProperties[114] = inputProperties[114] * KjPerKgK_per_Mpa_To_BtuPerLbmR_per_Psia; // dSdP_U
      outputProperties[115] = inputProperties[115] * KjPerKgK_per_Mpa_To_BtuPerLbmR_per_Psia; // dSdP_H
      outputProperties[116] = inputProperties[116] * KjPerKgK_per_K_To_BtuPerLbmR_per_R; // dSdT_P
      outputProperties[117] = inputProperties[117] * KjPerKgK_per_K_To_BtuPerLbmR_per_R; // dSdT_V
      outputProperties[118] = inputProperties[118] * KjPerKgK_per_K_To_BtuPerLbmR_per_R; // dSdT_U
      outputProperties[119] = inputProperties[119] * KjPerKgK_per_K_To_BtuPerLbmR_per_R; // dSdT_H
      outputProperties[120] = inputProperties[120] * KjPerKgK_per_M3PerKg_To_BtuPerLbmR_per_Ft3PerLbm; // dSdV_P
      outputProperties[121] = inputProperties[121] * KjPerKgK_per_M3PerKg_To_BtuPerLbmR_per_Ft3PerLbm; // dSdV_T
      outputProperties[122] = inputProperties[122] * KjPerKgK_per_M3PerKg_To_BtuPerLbmR_per_Ft3PerLbm; // dSdV_U
      outputProperties[123] = inputProperties[123] * KjPerKgK_per_M3PerKg_To_BtuPerLbmR_per_Ft3PerLbm; // dSdV_H
      outputProperties[124] = inputProperties[124] * KjPerKgK_per_KjPerKg_To_BtuPerLbmR_per_BtuPerLbm; // dSdU_P
      outputProperties[125] = inputProperties[125] * KjPerKgK_per_KjPerKg_To_BtuPerLbmR_per_BtuPerLbm; // dSdU_T
      outputProperties[126] = inputProperties[126] * KjPerKgK_per_KjPerKg_To_BtuPerLbmR_per_BtuPerLbm; // dSdU_V
      outputProperties[127] = inputProperties[127] * KjPerKgK_per_KjPerKg_To_BtuPerLbmR_per_BtuPerLbm; // dSdU_H
      outputProperties[128] = inputProperties[128] * KjPerKgK_per_KjPerKg_To_BtuPerLbmR_per_BtuPerLbm; // dSdH_P
      outputProperties[129] = inputProperties[129] * KjPerKgK_per_KjPerKg_To_BtuPerLbmR_per_BtuPerLbm; // dSdH_T
      outputProperties[130] = inputProperties[130] * KjPerKgK_per_KjPerKg_To_BtuPerLbmR_per_BtuPerLbm; // dSdH_V
      outputProperties[131] = inputProperties[131] * KjPerKgK_per_KjPerKg_To_BtuPerLbmR_per_BtuPerLbm; // dSdH_U
      break;
    case Units.MetricBarA:
      outputProperties[12] = inputProperties[12] * MPa_per_K_To_bara_per_C; // dPdT_V
      outputProperties[13] = inputProperties[13] * MPa_per_K_To_bara_per_C; // dPdT_U
      outputProperties[14] = inputProperties[14] * MPa_per_K_To_bara_per_C; // dPdT_H
      outputProperties[15] = inputProperties[15] * MPa_per_K_To_bara_per_C; // dPdT_S
      outputProperties[16] = inputProperties[16] * MPa_per_M3PerKg_To_bara_per_M3PerKg; // dPdV_T
      outputProperties[17] = inputProperties[17] * MPa_per_M3PerKg_To_bara_per_M3PerKg; // dPdV_U
      outputProperties[18] = inputProperties[18] * MPa_per_M3PerKg_To_bara_per_M3PerKg; // dPdV_H
      outputProperties[19] = inputProperties[19] * MPa_per_M3PerKg_To_bara_per_M3PerKg; // dPdV_S
      outputProperties[20] = inputProperties[20] * MPa_per_KjPerKg_To_bara_per_KjPerKg; // dPdU_T
      outputProperties[21] = inputProperties[21] * MPa_per_KjPerKg_To_bara_per_KjPerKg; // dPdU_V
      outputProperties[22] = inputProperties[22] * MPa_per_KjPerKg_To_bara_per_KjPerKg; // dPdU_H
      outputProperties[23] = inputProperties[23] * MPa_per_KjPerKg_To_bara_per_KjPerKg; // dPdU_S
      outputProperties[24] = inputProperties[24] * MPa_per_KjPerKg_To_bara_per_KjPerKg; // dPdU_T
      outputProperties[25] = inputProperties[25] * MPa_per_KjPerKg_To_bara_per_KjPerKg; // dPdU_V
      outputProperties[26] = inputProperties[26] * MPa_per_KjPerKg_To_bara_per_KjPerKg; // dPdU_U
      outputProperties[27] = inputProperties[27] * MPa_per_KjPerKg_To_bara_per_KjPerKg; // dPdU_S
      outputProperties[28] = inputProperties[28] * MPa_per_KjPerKg_K_To_bara_per_KjPerKg_C; // dPdS_T
      outputProperties[29] = inputProperties[29] * MPa_per_KjPerKg_K_To_bara_per_KjPerKg_C; // dPdS_V
      outputProperties[30] = inputProperties[39] * MPa_per_KjPerKg_K_To_bara_per_KjPerKg_C; // dPdS_U
      outputProperties[31] = inputProperties[31] * MPa_per_KjPerKg_K_To_bara_per_KjPerKg_C; // dPdS_S
      outputProperties[32] = inputProperties[32] * K_per_MPa_To_C_per_Bara; // dTdP_V
      outputProperties[33] = inputProperties[33] * K_per_MPa_To_C_per_Bara; // dTdP_U
      outputProperties[34] = inputProperties[34] * K_per_MPa_To_C_per_Bara; // dTdP_H
      outputProperties[35] = inputProperties[35] * K_per_MPa_To_C_per_Bara; // dTdP_S
      outputProperties[52] = inputProperties[52] * M3PerKg_per_MPa_To_M3PerKg_per_Bara; // dVdP_T
      outputProperties[53] = inputProperties[53] * M3PerKg_per_MPa_To_M3PerKg_per_Bara; // dVdP_U
      outputProperties[54] = inputProperties[54] * M3PerKg_per_MPa_To_M3PerKg_per_Bara; // dVdP_H
      outputProperties[55] = inputProperties[55] * M3PerKg_per_MPa_To_M3PerKg_per_Bara; // dVdP_S
      outputProperties[72] = inputProperties[72] * KjPerKg_per_MPa_To_KjPerKg_per_Bara; // dUdP_T
      outputProperties[73] = inputProperties[73] * KjPerKg_per_MPa_To_KjPerKg_per_Bara; // dUdP_V
      outputProperties[74] = inputProperties[74] * KjPerKg_per_MPa_To_KjPerKg_per_Bara; // dUdP_H
      outputProperties[75] = inputProperties[75] * KjPerKg_per_MPa_To_KjPerKg_per_Bara; // dUdP_S
      outputProperties[92] = inputProperties[92] * KjPerKg_per_MPa_To_KjPerKg_per_Bara; // dHdP_T
      outputProperties[93] = inputProperties[93] * KjPerKg_per_MPa_To_KjPerKg_per_Bara; // dHdP_V
      outputProperties[94] = inputProperties[94] * KjPerKg_per_MPa_To_KjPerKg_per_Bara; // dHdP_U
      outputProperties[95] = inputProperties[95] * KjPerKg_per_MPa_To_KjPerKg_per_Bara; // dHdP_S
      outputProperties[112] = inputProperties[112] * KjPerKgK_per_Mpa_To_KjPerKgC_per_Bara; // dSdP_T
      outputProperties[113] = inputProperties[113] * KjPerKgK_per_Mpa_To_KjPerKgC_per_Bara; // dSdP_V
      outputProperties[114] = inputProperties[114] * KjPerKgK_per_Mpa_To_KjPerKgC_per_Bara; // dSdP_U
      outputProperties[115] = inputProperties[115] * KjPerKgK_per_Mpa_To_KjPerKgC_per_Bara; // dSdP_H
      break;
    case Units.MetricKpa:
      outputProperties[12] = inputProperties[12] * MPa_per_K_To_kPa_per_C; // dPdT_V
      outputProperties[13] = inputProperties[13] * MPa_per_K_To_kPa_per_C; // dPdT_U
      outputProperties[14] = inputProperties[14] * MPa_per_K_To_kPa_per_C; // dPdT_H
      outputProperties[15] = inputProperties[15] * MPa_per_K_To_kPa_per_C; // dPdT_S
      outputProperties[16] = inputProperties[16] * MPa_per_M3PerKg_To_kPa_per_M3PerKg; // dPdV_T
      outputProperties[17] = inputProperties[17] * MPa_per_M3PerKg_To_kPa_per_M3PerKg; // dPdV_U
      outputProperties[18] = inputProperties[18] * MPa_per_M3PerKg_To_kPa_per_M3PerKg; // dPdV_H
      outputProperties[19] = inputProperties[19] * MPa_per_M3PerKg_To_kPa_per_M3PerKg; // dPdV_S
      outputProperties[20] = inputProperties[20] * MPa_per_KjPerKg_To_kPa_per_KjPerKg; // dPdU_T
      outputProperties[21] = inputProperties[21] * MPa_per_KjPerKg_To_kPa_per_KjPerKg; // dPdU_V
      outputProperties[22] = inputProperties[22] * MPa_per_KjPerKg_To_kPa_per_KjPerKg; // dPdU_H
      outputProperties[23] = inputProperties[23] * MPa_per_KjPerKg_To_kPa_per_KjPerKg; // dPdU_S
      outputProperties[24] = inputProperties[24] * MPa_per_KjPerKg_To_kPa_per_KjPerKg; // dPdU_T
      outputProperties[25] = inputProperties[25] * MPa_per_KjPerKg_To_kPa_per_KjPerKg; // dPdU_V
      outputProperties[26] = inputProperties[26] * MPa_per_KjPerKg_To_kPa_per_KjPerKg; // dPdU_U
      outputProperties[27] = inputProperties[27] * MPa_per_KjPerKg_To_kPa_per_KjPerKg; // dPdU_S
      outputProperties[28] = inputProperties[28] * MPa_per_KjPerKg_K_To_kPa_per_KjPerKg_C; // dPdS_T
      outputProperties[29] = inputProperties[29] * MPa_per_KjPerKg_K_To_kPa_per_KjPerKg_C; // dPdS_V
      outputProperties[30] = inputProperties[39] * MPa_per_KjPerKg_K_To_kPa_per_KjPerKg_C; // dPdS_U
      outputProperties[31] = inputProperties[31] * MPa_per_KjPerKg_K_To_kPa_per_KjPerKg_C; // dPdS_S
      outputProperties[32] = inputProperties[32] * K_per_MPa_To_C_per_Kpa; // dTdP_V
      outputProperties[33] = inputProperties[33] * K_per_MPa_To_C_per_Kpa; // dTdP_U
      outputProperties[34] = inputProperties[34] * K_per_MPa_To_C_per_Kpa; // dTdP_H
      outputProperties[35] = inputProperties[35] * K_per_MPa_To_C_per_Kpa; // dTdP_S
      outputProperties[52] = inputProperties[52] * M3PerKg_per_MPa_To_M3PerKg_per_KPa; // dVdP_T
      outputProperties[53] = inputProperties[53] * M3PerKg_per_MPa_To_M3PerKg_per_KPa; // dVdP_U
      outputProperties[54] = inputProperties[54] * M3PerKg_per_MPa_To_M3PerKg_per_KPa; // dVdP_H
      outputProperties[55] = inputProperties[55] * M3PerKg_per_MPa_To_M3PerKg_per_KPa; // dVdP_S
      outputProperties[72] = inputProperties[72] * KJPerKg_per_MPa_To_KjPerKg_per_Kpa; // dUdP_T
      outputProperties[73] = inputProperties[73] * KJPerKg_per_MPa_To_KjPerKg_per_Kpa; // dUdP_V
      outputProperties[74] = inputProperties[74] * KJPerKg_per_MPa_To_KjPerKg_per_Kpa; // dUdP_H
      outputProperties[75] = inputProperties[75] * KJPerKg_per_MPa_To_KjPerKg_per_Kpa; // dUdP_S
      outputProperties[92] = inputProperties[92] * KJPerKg_per_MPa_To_KjPerKg_per_Kpa; // dHdP_T
      outputProperties[93] = inputProperties[93] * KJPerKg_per_MPa_To_KjPerKg_per_Kpa; // dHdP_V
      outputProperties[94] = inputProperties[94] * KJPerKg_per_MPa_To_KjPerKg_per_Kpa; // dHdP_U
      outputProperties[95] = inputProperties[95] * KJPerKg_per_MPa_To_KjPerKg_per_Kpa; // dHdP_S
      outputProperties[112] = inputProperties[112] * KjPerKgK_per_Mpa_To_KjPerKgC_per_KPa; // dSdP_T
      outputProperties[113] = inputProperties[113] * KjPerKgK_per_Mpa_To_KjPerKgC_per_KPa; // dSdP_V
      outputProperties[114] = inputProperties[114] * KjPerKgK_per_Mpa_To_KjPerKgC_per_KPa; // dSdP_U
      outputProperties[115] = inputProperties[115] * KjPerKgK_per_Mpa_To_KjPerKgC_per_KPa; // dSdP_H
      break;
    default:
      throw Errors.ErrorUnitsNotInRange;
  }
  return outputProperties;
}

export function PressureConversion(pressure, units) {
  switch (units) {
    case Units.SI:
      return pressure;
    case Units.USCustomary:
      return MpaToPsi(pressure);
    case Units.MetricBarA:
      return MpaToBar(pressure);
    case Units.MetricKpa:
      return MpaToKpa(pressure);
    default:
      throw Errors.ErrorUnitsNotInRange;
  }
}

export function TemperatureConversion(temperature, units) {
  switch (units) {
    case Units.SI:
      return temperature;
    case Units.USCustomary:
      return KtoF(temperature);
    case Units.MetricBarA:
      return KtoC(temperature);
    case Units.MetricKpa:
      return KtoC(temperature);
    default:
      throw Errors.ErrorUnitsNotInRange;
  }
}

export function EnthalpyConversion(enthalpy, units) {
  switch (units) {
    case Units.SI:
      return enthalpy;
    case Units.USCustomary:
      return BtuPerLbmToKjPerKg(enthalpy);
    case Units.MetricBarA:
      return enthalpy;
    case Units.MetricKpa:
      return enthalpy;
    default:
      throw Errors.ErrorUnitsNotInRange;
  }
}

export function EntropyConversion(entropy, units) {
  switch (units) {
    case Units.SI:
      return entropy;
    case Units.USCustomary:
      return BtuPerLbmFtoKjPerKgK(entropy);
    case Units.MetricBarA:
      return entropy;
    case Units.MetricKpa:
      return entropy;
    default:
      throw Errors.ErrorUnitsNotInRange;
  }
}

export function SurfaceTensionConversion(surfaceTension, units) {
  // Input is in milli-N/m
  switch (units) {
    case Units.SI:
      return surfaceTension;
    case Units.USCustomary:
      return mNperMeterToLbfPerFt(surfaceTension);
    case Units.MetricBarA:
      return surfaceTension;
    case Units.MetricKpa:
      return surfaceTension;
    default:
      throw Errors.ErrorUnitsNotInRange;
  }
}

// Temperature Conversions
const C0 = -273.15;
const F0 = 32.0;

export function KtoC(k) {
  return k + C0;
}

export function CtoF(c) {
  return c * (9.0 / 5.0) + 32.0;
}

export function KtoF(k) {
  return CtoF(KtoC(k));
}

export function CtoK(c) {
  return c - C0;
}

export function FtoC(Tf) {
  return (Tf - F0) * (5.0 / 9.0);
}

export function FtoK(f) {
  return CtoK(FtoC(f));
}

// Pressure Conversions.  All pressures in absolute values (no gauge pressures)
export function MpaToKpa(mpa) {
  return mpa * 1000.0;
}

export function MpaToBar(mpa) {
  return mpa * 10.0;
}

export function BarToMpa(bar) {
  return bar / 10.0;
}

export function MpaToPsi(mpa) {
  return KpaToPsi(MpaToKpa(mpa));
}

export function KpaToMpa(kpa) {
  return kpa / 1000.0;
}

export function KpaToBar(kpa) {
  return kpa / 100.0;
}

export function KpaToPsi(kpa) {
  return kpa / KpaPerPsi;
}

export function PsiToKpa(psi) {
  return psi * KpaPerPsi;
}

export function PsiToMpa(psi) {
  return KpaToMpa(PsiToKpa(psi));
}

export function PsiToBar(psi) {
  return KpaToBar(PsiToKpa(psi));
}

// Mass Conversions
const LbmPerKg = 2.2046226218;
export function KgToLbm(kg) {
  return kg * LbmPerKg;
}

export function LbmToKg(lbm) {
  return lbm / LbmPerKg;
}

// Energy conversions  one calorie (IT) is defined to be exactly 4.1868J
export function KjToBtu(kJ) {
  return Constants.BtuPerKj * kJ;
}

export function BtuToKj(btu) {
  return btu / Constants.BtuPerKj;
}

// Distance conversions
const FeetPerMeter = 1000.0 / (25.4 * 12.0); // (feet/meter) exact conversion
export function MeterToFt(m) {
  // returns ft given a meter input
  return m * FeetPerMeter;
}

// Volume conversions
const CubicFeetPerCubicMeter = Math.pow(MeterToFt(1), 3); // Number of cubic feet in one cubic meter
export function CubicMetersToCubicFeet(metersCubed) {
  // returns cubic ft given a cubic meter input
  return metersCubed * CubicFeetPerCubicMeter;
}

// Specific Volume conversions
const Ft3perLbm_per_M3PerKg = 1.601846e1; // ASME Steam Tables Book : Table 2-4

export function CubicMetersPerKgToCubicFeetPerLbm(cubicMetersPerKg) {
  // returns ft^3/lbm given a m^3/kg input
  return (cubicMetersPerKg * CubicFeetPerCubicMeter) / LbmPerKg;
}

export function CubicFeetPerLbmToCubicMetersPerKg(cubicFtLbm) {
  // returns ft^3/lbm given a m^3/kg input
  return (cubicFtLbm / CubicFeetPerCubicMeter) * LbmPerKg;
}

// Enthalpy & Internal Energy conversions
const BtuPerLbm_Per_KjPerKg = 1 / 2.326; // ASME Steam Tables Book - Table 2-5

export function KjPerKgToBtuPerLbm(kjPerKg) {
  return (kjPerKg * Constants.BtuPerKj) / LbmPerKg;
}

export function BtuPerLbmToKjPerKg(BtuPerLbm) {
  return (BtuPerLbm * LbmPerKg) / Constants.BtuPerKj;
}

// Entropy, Isobaric & Isochoric Heat Capacity conversions
const BtuPerLbmR_Per_KjPerKgK = 1.0 / 4.1868; // ASME steam tables book: Table 2.6
export function KjPerKgKtoBtuPerLbmF(kJPerKgK) {
  return (kJPerKgK * Constants.BtuPerKj) / (LbmPerKg * (5 / 9)); // (5/9) is number of Kelvins per F.
}

export function BtuPerLbmFtoKjPerKgK(btuPerLbmF) {
  return (btuPerLbmF * (LbmPerKg * (5 / 9))) / Constants.BtuPerKj; // (5/9) is number of Kelvins per F.
}

// Speed conversions
export function MetersPerSecondToFeetPerSecond(metersPerSecond) {
  return metersPerSecond * FeetPerMeter;
}

// Viscosity conversions
const LbfSecondPerFt2_Per_PascalSecond = 1 / 47.88025898034; //  (lbf-second/ft2) per Pascal Seconds
export function PascalSecond_To_LbfSecondPerFt2(PascalSecond) {
  return LbfSecondPerFt2_Per_PascalSecond * PascalSecond;
}

const CentiPoise_Per_PascalSecond = 1000; // 1000 Pascal*seconds per centiPoise
export function PascalSecond_To_Centipoise(PascalSecond) {
  return CentiPoise_Per_PascalSecond * PascalSecond;
}

// Thermal Conductivity conversions
const BtuPerHrFtF_Per_mWattPerMeterK = 578.176; // ASME Steam Tables Book - Table 2-9
export function mWattPerMeterK_To_BtuPerHrFtF(mWattPerMeterK) {
  return mWattPerMeterK * BtuPerHrFtF_Per_mWattPerMeterK;
}

// Surface Tension conversions
const LbfPerNewton = 1 / 4.4482216152605; // 1 lbf = 4.448 221 615 2605 N
export function mNperMeterToLbfPerFt(mNperMeter) {
  // Converts mN/m to lbf/ft.  The first m is milli, 1/1000
  return (1e-3 * mNperMeter * LbfPerNewton) / FeetPerMeter; // Multiply by 1E-3 to eliminate the milli (mN/m)
}

// Partial Derivative conversions.  The _per_ separates the partial derivative's numerator and denominator
const MPa_per_K_To_psia_per_R = 80.5765209611111; // multiply by this to convert (MPa/K) to (psia/R)
const MPa_per_K_To_bara_per_C = 10; // multiply by this to convert (MPa/K) to (bara/C)
const MPa_per_K_To_kPa_per_C = 1000; // multiply by this to convert (MPa/K) to (kPa/C)

const MPa_per_M3PerKg_To_psia_per_Ft3PerLbm = 9.0544120801874; // multiply by this to convert (MPa/(m3/kg)) to (psia/(ft3/lbm))
const MPa_per_M3PerKg_To_bara_per_M3PerKg = 10; // multiply by this to convert (MPa/(m3/kg)) to (bara/(m3/kg))
const MPa_per_M3PerKg_To_kPa_per_M3PerKg = 1000; // multiply by this to convert (MPa/(m3/kg)) to (kPa/(m3/kg))

const MPa_per_KjPerKg_To_psia_per_BtuPerLbm = 337.35777795998; // multiply by this to convert (MPa/(kJ/kg)) to (psia/(BTU/lbm))
const MPa_per_KjPerKg_To_bara_per_KjPerKg = 10; // multiply by this to convert (MPa/(kJ/kg)) to (bara/(kJ/kg))
const MPa_per_KjPerKg_To_kPa_per_KjPerKg = 1000; // multiply by this to convert (MPa/(kJ/kg)) to (kPa/(kJ/kg))

const MPa_per_KjPerKg_K_To_psia_per_BtuPerLbm_R = 607.244000327964; // multiply by this to convert (MPa/(kJ/kg*K)) to (psia/(BTU/lbm*R))
const MPa_per_KjPerKg_K_To_bara_per_KjPerKg_C = 10; // multiply by this to convert (MPa/(kJ/kg*K)) to (bara/(kJ/kg*C))
const MPa_per_KjPerKg_K_To_kPa_per_KjPerKg_C = 1000; // multiply by this to convert (MPa/(kJ/kg*K)) to (kPa/(kJ/kg*C))

const K_per_MPa_To_R_per_Psia = 0.012410563127721; // multiply by this to convert (K/MPa) to (R/psia)
const K_per_MPa_To_C_per_Bara = 0.1; // multiply by this to convert (K/MPa) to (C/bara)
const K_per_MPa_To_C_per_Kpa = 0.001; // multiply by this to convert (K/MPa) to (C/kPa)

const K_per_M3perKg_To_R_per_Ft3PerLbm = 0.112370352705566; // multiply by this to convert (K/(m3/kg)) to (R/(ft3/lbm))
const K_per_M3perKg_To_C_per_M3PerKg = 1; // multiply by this to convert (K/(m3/kg)) to (C/(m3/kg))

const K_per_KjPerKg_To_R_per_BtuPerLbm = 4.1868; // multiply by this to convert (K/(kJ/kg)) to (R/(BTU/lbm))
const K_per_KjPerKg_To_C_per_KjPerKg = 1; // multiply by this to convert (K/(kJ/kg)) to (C/(kJ/kg))

const K_per_KjPerKg_K_To_R_per_BtuPerLbm_R = 7.53624; // multiply by this to convert (K/(kJ/kg*K)) to (R/(BTU/lbm*R))
const K_per_KjPerKg_K_To_C_per_KjPerKg_C = 1; // multiply by this to convert (K/(kJ/kg*K)) to (C/(kJ/kg*C))

const M3PerKg_per_MPa_To_Ft3PerLbm_per_Psia = 0.110443393910485; // multiply by this to convert ((m3/kg)/MPa) to ((ft3/lbm)/psia)
const M3PerKg_per_MPa_To_M3PerKg_per_Bara = 0.1; // multiply by this to convert ((m3/kg)/MPa) to ((m3/kg)/bara)
const M3PerKg_per_MPa_To_M3PerKg_per_KPa = 0.001; // multiply by this to convert ((m3/kg)/MPa) to ((m3/kg)/kPa)

const M3PerKg_per_K_To_Ft3PerLbm_per_R = 8.89914444444445; // multiply by this to convert ((m3/kg)/K) to ((ft3/lbm)/R)
const M3PerKg_per_K_To_M3PerKg_per_C = 1; // multiply by this to convert ((m3/kg)/K) to ((m3/kg)/C)

const M3PerKg_per_KjPerKg_To_Ft3PerLbm_per_BtuPerLbm = 37.25893796; // multiply by this to convert ((m3/kg)/(kJ/kg)) to ((ft3/lbm)/(BTU/lbm))

const M3PerKg_per_KjPerKg_K_To_Ft3perLbm_per_BtuPerLbmR = 67.066088328; // multiply by this to convert ((m3/kg)/(kJ/kg*K)) to ((ft3/lbm)/(BTU/lbm*R))
const M3PerKg_per_KjPerKg_K_To_M3PerKg_per_KjPerKgC = 1; // multiply by this to convert ((m3/kg)/(kJ/kg*K)) to ((m3/kg)/(kJ/kg*C))

const KjPerKg_per_MPa_To_BtuPerLbm_per_Psia = 0.0029642120779; // multiply by this to convert ((kJ/kg)/MPa) to ((BTU/lbm)/psia)
const KjPerKg_per_MPa_To_KjPerKg_per_Bara = 0.1; // multiply by this to convert ((kJ/kg)/MPa) to ((kJ/kg)/bara)
const KJPerKg_per_MPa_To_KjPerKg_per_Kpa = 0.001; // multiply by this to convert ((kJ/kg)/MPa) to ((kJ/kg)/kPa)

const KjPerKg_per_K_To_BtuPerLbm_per_R = 0.2388458966; // multiply by this to convert ((kJ/kg)/K) to ((BTU/lbm)/R)
const KjPerKg_per_K_To_KjPerKg_per_C = 1; // multiply by this to convert ((kJ/kg)/K) to ((kJ/kg)/C)

const KjPerKg_per_M3PerKg_To_BtuPerLbm_per_Ft3PerLbm = 0.0268391976; // multiply by this to convert ((kJ/kg)/(m3/kg)) to ((BTU/lbm)/(ft3/lbm))

const KjPerKg_per_KjPerKgK_To_BtuPerLbm_per_BtuPerLbmR = 9.7384968; // multiply by this to convert ((kJ/kg)/(kJ/kg*K)) to ((BTU/lbm)/(BTU/lbm*R))
const KjPerKg_per_KjPerKgK_To_KjPerKg_per_KjPerKg_C = 1; // multiply by this to convert ((kJ/kg)/(kJ/kg*K)) to ((kJ/kg)/(kJ/kg*C))

const KjPerKgK_per_Mpa_To_BtuPerLbmR_per_Psia = 0.001646784488; // multiply by this to convert ((kJ/kg*K)/MPa) to ((BTU/lbm*R)/psia)
const KjPerKgK_per_Mpa_To_KjPerKgC_per_Bara = 0.1; // multiply by this to convert ((kJ/kg*K)/MPa) to ((kJ/kg*C)/bara)
const KjPerKgK_per_Mpa_To_KjPerKgC_per_KPa = 0.001; // multiply by this to convert (((kJ/kg*K)/MPa) to ((kJ/kg*C)/kPa)

const KjPerKgK_per_K_To_BtuPerLbmR_per_R = 0.132692165; // multiply by this to convert ((kJ/kg*K)/K) to ((BTU/lbm*R)/R)
const KjPerKgK_per_K_To_KjPerKgC_per_C = 1; // multiply by this to convert ((kJ/kg*K)/K) to ((kJ/kg*C)/C)

const KjPerKgK_per_M3PerKg_To_BtuPerLbmR_per_Ft3PerLbm = 1.491066536e-2; // multiply by this to convert ((kJ/kg*K)/(m3/kg)) to ((BTU/lbm*R)/(ft3/lbm))
const KjPerKgK_per_M3PerKg_To_KjPerKgC_per_M3PerKg = 1; // multiply by this to convert ((kJ/kg*K)/(m3/kg)) to ((kJ/kg*C)/(m3/kg))

const KjPerKgK_per_KjPerKg_To_BtuPerLbmR_per_BtuPerLbm = 0.102685252; // multiply by this to convert ((kJ/kg*K)/(kJ/kg)) to ((BTU/lbm*R)/(BTU/lbm))
const KjPerKgK_per_KjPerKg_To_KjPerKgC_per_KjPerKg = 1; // multiply by this to convert ((kJ/kg*K)/(kJ/kg)) to ((kJ/kg*C)/(kJ/kg))
