import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
import * as Region4Calculations from "./Region4Calculations.js";
import * as Region4SatPressure from "./Region4SatPressure.js";
import * as Boundary2_3 from "./Boundary2_3Calculations.js";

export const p3cd = 1.900881189173929e1; // MPa  SR5 note at bottom of Table 2.
const R = Constants.R_H2O * 1000; // convert the kJ in R to Joules
const Pcritical = 22.064; // Critical Pressure

//  This class is used to merge different data types into a new type.
//  This is used to build an array of elements of the new type that hold
//  all the constants required for the 26 subregions for the Region 3 calculations.
class Reg3SubregionParameters {
  constructor(
    reducingVolume,
    reducingPressure,
    reducingTemperature,
    aParam,
    bParam,
    cParam,
    dParam,
    eParam,
    iParam,
    jParam,
    nParam
  ) {
    this.ReducingVolume = reducingVolume;
    this.ReducingPressure = reducingPressure;
    this.ReducingTemperature = reducingTemperature;
    this.aParameter = aParam;
    this.bParameter = bParam;
    this.cParameter = cParam;
    this.dParameter = dParam;
    this.eParameter = eParam;
    this.I = iParam;
    this.J = jParam;
    this.n = nParam;
  }
}

export const reg3Constants = [
  new Reg3SubregionParameters(
    Constants.reg3a_v,
    Constants.reg3a_p,
    Constants.reg3a_T,
    Constants.reg3a_a,
    Constants.reg3a_b,
    Constants.reg3a_c,
    Constants.reg3a_d,
    Constants.reg3a_e,
    Constants.reg3a_I,
    Constants.reg3a_J,
    Constants.reg3a_n
  ), //[0]
  new Reg3SubregionParameters(
    Constants.reg3b_v,
    Constants.reg3b_p,
    Constants.reg3b_T,
    Constants.reg3b_a,
    Constants.reg3b_b,
    Constants.reg3b_c,
    Constants.reg3b_d,
    Constants.reg3b_e,
    Constants.reg3b_I,
    Constants.reg3b_J,
    Constants.reg3b_n
  ), //[1]
  new Reg3SubregionParameters(
    Constants.reg3c_v,
    Constants.reg3c_p,
    Constants.reg3c_T,
    Constants.reg3c_a,
    Constants.reg3c_b,
    Constants.reg3c_c,
    Constants.reg3c_d,
    Constants.reg3c_e,
    Constants.reg3c_I,
    Constants.reg3c_J,
    Constants.reg3c_n
  ), //[2]
  new Reg3SubregionParameters(
    Constants.reg3d_v,
    Constants.reg3d_p,
    Constants.reg3d_T,
    Constants.reg3d_a,
    Constants.reg3d_b,
    Constants.reg3d_c,
    Constants.reg3d_d,
    Constants.reg3d_e,
    Constants.reg3d_I,
    Constants.reg3d_J,
    Constants.reg3d_n
  ), //[3]
  new Reg3SubregionParameters(
    Constants.reg3e_v,
    Constants.reg3e_p,
    Constants.reg3e_T,
    Constants.reg3e_a,
    Constants.reg3e_b,
    Constants.reg3e_c,
    Constants.reg3e_d,
    Constants.reg3e_e,
    Constants.reg3e_I,
    Constants.reg3e_J,
    Constants.reg3e_n
  ), //[4]
  new Reg3SubregionParameters(
    Constants.reg3f_v,
    Constants.reg3f_p,
    Constants.reg3f_T,
    Constants.reg3f_a,
    Constants.reg3f_b,
    Constants.reg3f_c,
    Constants.reg3f_d,
    Constants.reg3f_e,
    Constants.reg3f_I,
    Constants.reg3f_J,
    Constants.reg3f_n
  ), //[5]
  new Reg3SubregionParameters(
    Constants.reg3g_v,
    Constants.reg3g_p,
    Constants.reg3g_T,
    Constants.reg3g_a,
    Constants.reg3g_b,
    Constants.reg3g_c,
    Constants.reg3g_d,
    Constants.reg3g_e,
    Constants.reg3g_I,
    Constants.reg3g_J,
    Constants.reg3g_n
  ), //[6]
  new Reg3SubregionParameters(
    Constants.reg3h_v,
    Constants.reg3h_p,
    Constants.reg3h_T,
    Constants.reg3h_a,
    Constants.reg3h_b,
    Constants.reg3h_c,
    Constants.reg3h_d,
    Constants.reg3h_e,
    Constants.reg3h_I,
    Constants.reg3h_J,
    Constants.reg3h_n
  ), //[7]
  new Reg3SubregionParameters(
    Constants.reg3i_v,
    Constants.reg3i_p,
    Constants.reg3i_T,
    Constants.reg3i_a,
    Constants.reg3i_b,
    Constants.reg3i_c,
    Constants.reg3i_d,
    Constants.reg3i_e,
    Constants.reg3i_I,
    Constants.reg3i_J,
    Constants.reg3i_n
  ), //[8]
  new Reg3SubregionParameters(
    Constants.reg3j_v,
    Constants.reg3j_p,
    Constants.reg3j_T,
    Constants.reg3j_a,
    Constants.reg3j_b,
    Constants.reg3j_c,
    Constants.reg3j_d,
    Constants.reg3j_e,
    Constants.reg3j_I,
    Constants.reg3j_J,
    Constants.reg3j_n
  ), //[9]
  new Reg3SubregionParameters(
    Constants.reg3k_v,
    Constants.reg3k_p,
    Constants.reg3k_T,
    Constants.reg3k_a,
    Constants.reg3k_b,
    Constants.reg3k_c,
    Constants.reg3k_d,
    Constants.reg3k_e,
    Constants.reg3k_I,
    Constants.reg3k_J,
    Constants.reg3k_n
  ), //[10]
  new Reg3SubregionParameters(
    Constants.reg3l_v,
    Constants.reg3l_p,
    Constants.reg3l_T,
    Constants.reg3l_a,
    Constants.reg3l_b,
    Constants.reg3l_c,
    Constants.reg3l_d,
    Constants.reg3l_e,
    Constants.reg3l_I,
    Constants.reg3l_J,
    Constants.reg3l_n
  ), //[11]
  new Reg3SubregionParameters(
    Constants.reg3m_v,
    Constants.reg3m_p,
    Constants.reg3m_T,
    Constants.reg3m_a,
    Constants.reg3m_b,
    Constants.reg3m_c,
    Constants.reg3m_d,
    Constants.reg3m_e,
    Constants.reg3m_I,
    Constants.reg3m_J,
    Constants.reg3m_n
  ), //[12]
  new Reg3SubregionParameters(
    Constants.reg3n_v,
    Constants.reg3n_p,
    Constants.reg3n_T,
    Constants.reg3n_a,
    Constants.reg3n_b,
    1.0,
    1.0,
    1.0,
    Constants.reg3n_I,
    Constants.reg3n_J,
    Constants.reg3n_n
  ), //[13]
  new Reg3SubregionParameters(
    Constants.reg3o_v,
    Constants.reg3o_p,
    Constants.reg3o_T,
    Constants.reg3o_a,
    Constants.reg3o_b,
    Constants.reg3o_c,
    Constants.reg3o_d,
    Constants.reg3o_e,
    Constants.reg3o_I,
    Constants.reg3o_J,
    Constants.reg3o_n
  ), //[14]
  new Reg3SubregionParameters(
    Constants.reg3p_v,
    Constants.reg3p_p,
    Constants.reg3p_T,
    Constants.reg3p_a,
    Constants.reg3p_b,
    Constants.reg3p_c,
    Constants.reg3p_d,
    Constants.reg3p_e,
    Constants.reg3p_I,
    Constants.reg3p_J,
    Constants.reg3p_n
  ), //[15]
  new Reg3SubregionParameters(
    Constants.reg3q_v,
    Constants.reg3q_p,
    Constants.reg3q_T,
    Constants.reg3q_a,
    Constants.reg3q_b,
    Constants.reg3q_c,
    Constants.reg3q_d,
    Constants.reg3q_e,
    Constants.reg3q_I,
    Constants.reg3q_J,
    Constants.reg3q_n
  ), //[16]
  new Reg3SubregionParameters(
    Constants.reg3r_v,
    Constants.reg3r_p,
    Constants.reg3r_T,
    Constants.reg3r_a,
    Constants.reg3r_b,
    Constants.reg3r_c,
    Constants.reg3r_d,
    Constants.reg3r_e,
    Constants.reg3r_I,
    Constants.reg3r_J,
    Constants.reg3r_n
  ), //[17]
  new Reg3SubregionParameters(
    Constants.reg3s_v,
    Constants.reg3s_p,
    Constants.reg3s_T,
    Constants.reg3s_a,
    Constants.reg3s_b,
    Constants.reg3s_c,
    Constants.reg3s_d,
    Constants.reg3s_e,
    Constants.reg3s_I,
    Constants.reg3s_J,
    Constants.reg3s_n
  ), //[18]
  new Reg3SubregionParameters(
    Constants.reg3t_v,
    Constants.reg3t_p,
    Constants.reg3t_T,
    Constants.reg3t_a,
    Constants.reg3t_b,
    Constants.reg3t_c,
    Constants.reg3t_d,
    Constants.reg3t_e,
    Constants.reg3t_I,
    Constants.reg3t_J,
    Constants.reg3t_n
  ), //[19]
  new Reg3SubregionParameters(
    Constants.reg3u_v,
    Constants.reg3u_p,
    Constants.reg3u_T,
    Constants.reg3u_a,
    Constants.reg3u_b,
    Constants.reg3u_c,
    Constants.reg3u_d,
    Constants.reg3u_e,
    Constants.reg3u_I,
    Constants.reg3u_J,
    Constants.reg3u_n
  ), //[20]
  new Reg3SubregionParameters(
    Constants.reg3v_v,
    Constants.reg3v_p,
    Constants.reg3v_T,
    Constants.reg3v_a,
    Constants.reg3v_b,
    Constants.reg3v_c,
    Constants.reg3v_d,
    Constants.reg3v_e,
    Constants.reg3v_I,
    Constants.reg3v_J,
    Constants.reg3v_n
  ), //[21]
  new Reg3SubregionParameters(
    Constants.reg3w_v,
    Constants.reg3w_p,
    Constants.reg3w_T,
    Constants.reg3w_a,
    Constants.reg3w_b,
    Constants.reg3w_c,
    Constants.reg3w_d,
    Constants.reg3w_e,
    Constants.reg3w_I,
    Constants.reg3w_J,
    Constants.reg3w_n
  ), //[22]
  new Reg3SubregionParameters(
    Constants.reg3x_v,
    Constants.reg3x_p,
    Constants.reg3x_T,
    Constants.reg3x_a,
    Constants.reg3x_b,
    Constants.reg3x_c,
    Constants.reg3x_d,
    Constants.reg3x_e,
    Constants.reg3x_I,
    Constants.reg3x_J,
    Constants.reg3x_n
  ), //[23]
  new Reg3SubregionParameters(
    Constants.reg3y_v,
    Constants.reg3y_p,
    Constants.reg3y_T,
    Constants.reg3y_a,
    Constants.reg3y_b,
    Constants.reg3y_c,
    Constants.reg3y_d,
    Constants.reg3y_e,
    Constants.reg3y_I,
    Constants.reg3y_J,
    Constants.reg3y_n
  ), //[24]
  new Reg3SubregionParameters(
    Constants.reg3z_v,
    Constants.reg3z_p,
    Constants.reg3z_T,
    Constants.reg3z_a,
    Constants.reg3z_b,
    Constants.reg3z_c,
    Constants.reg3z_d,
    Constants.reg3z_e,
    Constants.reg3z_I,
    Constants.reg3z_J,
    Constants.reg3z_n
  ), //[25]
];

// method for calculating the region 3 subregion boundaries
// SR5-05: Eq. 1
export function Reg3SubregBoundaryMost(p, I, n) {
  // Subregion boundaries; except for T3ab, T3ef, T3op
  var T3Boundary = 0;
  for (let i = 0; i < I.length; i++) {
    T3Boundary += n[i] * Math.pow(p, I[i]);
  }
  return T3Boundary;
}

// SR5-05: Eq. 2
export function Reg3SubregAbOpWxBoundary(p, I, n) {
  // Subregion T3ab, T3op boundaries
  var T3Boundary = 0;
  for (let i = 0; i < I.length; i++) {
    T3Boundary += n[i] * Math.pow(Math.log(p), I[i]);
  }
  return T3Boundary;
}

// SR5-05: Eq. 3
export function Reg3SubregEfBoundary(p) {
  // Subregion ef boundary
  var T3Boundary = 3.727888004 * (p - Pcritical) + 647.096;
  return T3Boundary;
}

// SR5-05 Eq 4
// method to calculate v(p,T) valid for subregion 3a ([0]) through 3t (19]), except 3n: Also applies to subregions 3u to 3z
export function SubRegion3V(i, pressure, temperature, SR3Parameters) {
  // i is the subregion; 0 is a, 1 is b, etc.
  var wRoot = 0;
  var pi = pressure / SR3Parameters[i].ReducingPressure;
  var theta = temperature / SR3Parameters[i].ReducingTemperature;
  var A = Math.pow(pi - SR3Parameters[i].aParameter, SR3Parameters[i].cParameter);
  var B = Math.pow(theta - SR3Parameters[i].bParameter, SR3Parameters[i].dParameter);
  for (let j = 0; j < SR3Parameters[i].I.length; j++) {
    wRoot += SR3Parameters[i].n[j] * Math.pow(A, SR3Parameters[i].I[j]) * Math.pow(B, SR3Parameters[i].J[j]);
  }
  var w = Math.pow(wRoot, SR3Parameters[i].eParameter);
  return w * SR3Parameters[i].ReducingVolume;
}

// SR5-05 Eq 5
// method to calculate v(p,T) valid for subregion 3n
export function SubRegion3V_n(i, pressure, temperature, SR3Parameters) {
  var pi = pressure / SR3Parameters[i].ReducingPressure;
  var theta = temperature / SR3Parameters[i].ReducingTemperature;
  var wRoot = 0;
  for (let j = 0; j < SR3Parameters[i].I.length; j++) {
    wRoot +=
      SR3Parameters[i].n[j] *
      Math.pow(pi - SR3Parameters[i].aParameter, SR3Parameters[i].I[j]) *
      Math.pow(theta - SR3Parameters[i].bParameter, SR3Parameters[i].J[j]);
  }
  return SR3Parameters[i].ReducingVolume * Math.exp(wRoot);
}

// Function used to find volume f(p,T) because the region 3 return values are all functions of volume
export function Properties_fPT(pressure, temperature) {
  if (
    temperature >= Constants.T13_boundary &&
    temperature <= Boundary2_3.reg23BoundaryTfP(pressure) &&
    pressure <= Constants.pmax &&
    pressure >= Boundary2_3.reg23BoundaryPfT(temperature)
  ) {
    const volume = Volume_fPT(pressure, temperature);
    var properties = Properties_fVT(volume, temperature);
    properties[0] = pressure;
    properties[1] = temperature;
    return properties;
  }

  throw Errors.TemperatureOrPressureNotInRegion3;
}

export function Properties_fVT(volume, temperature) {
  // Region 3 Steam Properties as a function of specific volume and temperature: SteamProperties = f(V,T)
  // Calcs for the reduced density and reduced temperature
  var Volume = volume;
  var Density = 1 / volume;
  var delta = Density / Constants.RHOc_H2O;
  var tau = Constants.Tc_H2O / temperature;

  // R7-97: Table 32 - Constant terms not under the summation term
  // Region 3 Hemholtz equation and its derivatives
  var phi = Constants.reg3_HelmH_n[0] * Math.log(delta); // Gibbs free energy
  var phi_delta = Constants.reg3_HelmH_n[0] / delta;
  var phi_tau = 0;
  var phi_delta_delta = -Constants.reg3_HelmH_n[0] / Math.pow(delta, 2);
  var phi_tau_tau = 0;
  var phi_delta_tau = 0;

  // Equations below calculate the terms shown in table 32
  // of IAPWS R7-97 (2012) (note: [0] terms not used in summation equations below
  for (let i = 1; i < Constants.reg3_HelmH_I.length; i++) {
    phi +=
      Constants.reg3_HelmH_n[i] * Math.pow(delta, Constants.reg3_HelmH_I[i]) * Math.pow(tau, Constants.reg3_HelmH_J[i]);
  }

  for (let i = 1; i < Constants.reg3_HelmH_I.length; i++) {
    phi_delta +=
      Constants.reg3_HelmH_n[i] *
      Constants.reg3_HelmH_I[i] *
      Math.pow(delta, Constants.reg3_HelmH_I[i] - 1) *
      Math.pow(tau, Constants.reg3_HelmH_J[i]);
  }

  for (let i = 1; i < Constants.reg3_HelmH_I.length; i++) {
    phi_tau +=
      Constants.reg3_HelmH_n[i] *
      Math.pow(delta, Constants.reg3_HelmH_I[i]) *
      Constants.reg3_HelmH_J[i] *
      Math.pow(tau, Constants.reg3_HelmH_J[i] - 1);
  }

  for (let i = 1; i < Constants.reg3_HelmH_I.length; i++) {
    phi_delta_delta +=
      Constants.reg3_HelmH_n[i] *
      Constants.reg3_HelmH_I[i] *
      (Constants.reg3_HelmH_I[i] - 1) *
      Math.pow(delta, Constants.reg3_HelmH_I[i] - 2) *
      Math.pow(tau, Constants.reg3_HelmH_J[i]);
  }

  for (let i = 1; i < Constants.reg3_HelmH_I.length; i++) {
    phi_tau_tau +=
      Constants.reg3_HelmH_n[i] *
      Math.pow(delta, Constants.reg3_HelmH_I[i]) *
      Constants.reg3_HelmH_J[i] *
      (Constants.reg3_HelmH_J[i] - 1) *
      Math.pow(tau, Constants.reg3_HelmH_J[i] - 2);
  }

  for (let i = 1; i < Constants.reg3_HelmH_I.length; i++) {
    phi_delta_tau +=
      Constants.reg3_HelmH_n[i] *
      Constants.reg3_HelmH_I[i] *
      Math.pow(delta, Constants.reg3_HelmH_I[i] - 1) *
      Constants.reg3_HelmH_J[i] *
      Math.pow(tau, Constants.reg3_HelmH_J[i] - 1);
  }

  // R7-97: Table 31 - Return thermodynamic properties - Hemholtz free energy
  const Pressure = (R * temperature * delta * phi_delta) / volume / 1e6;
  const InternalEnergy = (R / 1000) * temperature * tau * phi_tau;
  const Entropy = (R / 1000) * (tau * phi_tau - phi);
  const Enthalpy = ((temperature * R) / 1000) * (tau * phi_tau + delta * phi_delta);
  const IsochoricHeat = -(R / 1000) * Math.pow(tau, 2) * phi_tau_tau;
  const IsobaricHeat =
    (R / 1000) *
    (-Math.pow(tau, 2) * phi_tau_tau +
      Math.pow(delta * phi_delta - delta * tau * phi_delta_tau, 2) /
        (2 * delta * phi_delta + Math.pow(delta, 2) * phi_delta_delta));
  const SpeedOfSound = Math.sqrt(
    R *
      temperature *
      (2 * delta * phi_delta +
        Math.pow(delta, 2) * phi_delta_delta -
        Math.pow(delta * phi_delta - delta * tau * phi_delta_tau, 2) / (Math.pow(tau, 2) * phi_tau_tau))
  );

  //  Equations below calculate the properties partial derivatives.  The derivate functions below the first group use IAPWS AN3-07 (2018) Equation 1
  const alpha_p = (1 / temperature) * (1 - (tau * phi_delta_tau) / phi_delta); // IAPWS AN3-07 (2018) Eq 3
  const Beta_p = (1 / volume) * (2 + (delta * phi_delta_delta) / phi_delta); // IAPWS AN3-07 (2018) Eq 3
  const dPdV_T = -Pressure * Beta_p; // Array Index 16: IAPWS AN3-07 (2018) Table 1
  const dTdV_T = 0; // IAPWS AN3-07 (2018) Table 1
  const dVdV_T = 1; // IAPWS AN3-07 (2018) Table 1
  const dUdV_T = 1000 * (Pressure * (temperature * alpha_p - 1)); // Array Index 81: IAPWS AN3-07 (2018) Table 1.  Not sure why times 1000
  const dHdV_T = 1000 * Pressure * (temperature * alpha_p - volume * Beta_p); // Array Index 101: IAPWS AN3-07 (2018) Table 1.   Not sure why times 1000
  const dSdV_T = 1000 * Pressure * alpha_p; // Array Index 121: IAPWS AN3-07 (2018) Table 1.   Not sure why times 1000
  const dPdT_V = Pressure * alpha_p; // Array Index 12: IAPWS AN3-07 (2018) Table 1
  const dTdT_V = 1; // IAPWS AN3-07 (2018) Table 1
  const dVdT_V = 0; // IAPWS AN3-07 (2018) Table 1
  const dUdT_V = IsochoricHeat; // Array Index 77: IAPWS AN3-07 (2018) Table 1
  const dHdT_V = IsochoricHeat + 1000 * Pressure * volume * alpha_p; // Array Index 97: IAPWS AN3-07 (2018) Table 1.   Not sure why times 1000
  const dSdT_V = IsochoricHeat / temperature; // Array Index 117: IAPWS AN3-07 (2018) Table 1

  // The following five groups provide the partial derivatives of pressure.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dPdT_U = (dPdV_T * dUdT_V - dPdT_V * dUdV_T) / (dTdV_T * dUdT_V - dTdT_V * dUdV_T); // Array Index 13
  const dPdT_H = (dPdV_T * dHdT_V - dPdT_V * dHdV_T) / (dTdV_T * dHdT_V - dTdT_V * dHdV_T); // Array Index 14
  const dPdT_S = (dPdV_T * dSdT_V - dPdT_V * dSdV_T) / (dTdV_T * dSdT_V - dTdT_V * dSdV_T); // Array Index 15

  const dPdV_U = (dPdV_T * dUdT_V - dPdT_V * dUdV_T) / (dVdV_T * dUdT_V - dVdT_V * dUdV_T); // Array Index 17
  const dPdV_H = (dPdV_T * dHdT_V - dPdT_V * dHdV_T) / (dVdV_T * dHdT_V - dVdT_V * dHdV_T); // Array Index 18
  const dPdV_S = (dPdV_T * dSdT_V - dPdT_V * dSdV_T) / (dVdV_T * dSdT_V - dVdT_V * dSdV_T); // Array Index 19

  const dPdU_T = (dPdV_T * dTdT_V - dPdT_V * dTdV_T) / (dUdV_T * dTdT_V - dUdT_V * dTdV_T); // Array Index 20
  const dPdU_V = (dPdV_T * dVdT_V - dPdT_V * dVdV_T) / (dUdV_T * dVdT_V - dUdT_V * dVdV_T); // Array Index 21
  const dPdU_H = (dPdV_T * dHdT_V - dPdT_V * dHdV_T) / (dUdV_T * dHdT_V - dUdT_V * dHdV_T); // Array Index 22
  const dPdU_S = (dPdV_T * dSdT_V - dPdT_V * dSdV_T) / (dUdV_T * dSdT_V - dUdT_V * dSdV_T); // Array Index 23

  const dPdH_T = (dPdV_T * dTdT_V - dPdT_V * dTdV_T) / (dHdV_T * dTdT_V - dHdT_V * dTdV_T); // Array Index 24
  const dPdH_V = (dPdV_T * dVdT_V - dPdT_V * dVdV_T) / (dHdV_T * dVdT_V - dHdT_V * dVdV_T); // Array Index 25
  const dPdH_U = (dPdV_T * dUdT_V - dPdT_V * dUdV_T) / (dHdV_T * dUdT_V - dHdT_V * dUdV_T); // Array Index 26
  const dPdH_S = (dPdV_T * dSdT_V - dPdT_V * dSdV_T) / (dHdV_T * dSdT_V - dHdT_V * dSdV_T); // Array Index 27

  const dPdS_T = (dPdV_T * dTdT_V - dPdT_V * dTdV_T) / (dSdV_T * dTdT_V - dSdT_V * dTdV_T); // Array Index 28
  const dPdS_V = (dPdV_T * dVdT_V - dPdT_V * dVdV_T) / (dSdV_T * dVdT_V - dSdT_V * dVdV_T); // Array Index 29
  const dPdS_U = (dPdV_T * dUdT_V - dPdT_V * dUdV_T) / (dSdV_T * dUdT_V - dSdT_V * dUdV_T); // Array Index 30
  const dPdS_H = (dPdV_T * dHdT_V - dPdT_V * dHdV_T) / (dSdV_T * dHdT_V - dSdT_V * dHdV_T); // Array Index 31

  // The following five groups provide the partial derivatives of pressure.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dTdP_V = (dTdV_T * dVdT_V - dTdT_V * dVdV_T) / (dPdV_T * dVdT_V - dPdT_V * dVdV_T); // Array Index 32
  const dTdP_U = (dTdV_T * dUdT_V - dTdT_V * dUdV_T) / (dPdV_T * dUdT_V - dPdT_V * dUdV_T); // Array Index 33
  const dTdP_H = (dTdV_T * dHdT_V - dTdT_V * dHdV_T) / (dPdV_T * dHdT_V - dPdT_V * dHdV_T); // Array Index 34
  const dTdP_S = (dTdV_T * dSdT_V - dTdT_V * dSdV_T) / (dPdV_T * dSdT_V - dPdT_V * dSdV_T); // Array Index 35

  const dTdV_P = (dTdV_T * dPdT_V - dTdT_V * dPdV_T) / (dVdV_T * dPdT_V - dVdT_V * dPdV_T); // Array Index 36
  const dTdV_U = (dTdV_T * dUdT_V - dTdT_V * dUdV_T) / (dVdV_T * dUdT_V - dVdT_V * dUdV_T); // Array Index 37
  const dTdV_H = (dTdV_T * dHdT_V - dTdT_V * dHdV_T) / (dVdV_T * dHdT_V - dVdT_V * dHdV_T); // Array Index 38
  const dTdV_S = (dTdV_T * dSdT_V - dTdT_V * dSdV_T) / (dVdV_T * dSdT_V - dVdT_V * dSdV_T); // Array Index 39

  const dTdU_P = (dTdV_T * dPdT_V - dTdT_V * dPdV_T) / (dUdV_T * dPdT_V - dUdT_V * dPdV_T); // Array Index 40
  const dTdU_V = (dTdV_T * dVdT_V - dTdT_V * dVdV_T) / (dUdV_T * dVdT_V - dUdT_V * dVdV_T); // Array Index 41
  const dTdU_H = (dTdV_T * dHdT_V - dTdT_V * dHdV_T) / (dUdV_T * dHdT_V - dUdT_V * dHdV_T); // Array Index 42
  const dTdU_S = (dTdV_T * dSdT_V - dTdT_V * dSdV_T) / (dUdV_T * dSdT_V - dUdT_V * dSdV_T); // Array Index 43

  const dTdH_P = (dTdV_T * dPdT_V - dTdT_V * dPdV_T) / (dHdV_T * dPdT_V - dHdT_V * dPdV_T); // Array Index 44
  const dTdH_V = (dTdV_T * dVdT_V - dTdT_V * dVdV_T) / (dHdV_T * dVdT_V - dHdT_V * dVdV_T); // Array Index 45
  const dTdH_U = (dTdV_T * dUdT_V - dTdT_V * dUdV_T) / (dHdV_T * dUdT_V - dHdT_V * dUdV_T); // Array Index 46
  const dTdH_S = (dTdV_T * dSdT_V - dTdT_V * dSdV_T) / (dHdV_T * dSdT_V - dHdT_V * dSdV_T); // Array Index 47

  const dTdS_P = (dTdV_T * dPdT_V - dTdT_V * dPdV_T) / (dSdV_T * dPdT_V - dSdT_V * dPdV_T); // Array Index 48
  const dTdS_V = (dTdV_T * dVdT_V - dTdT_V * dVdV_T) / (dSdV_T * dVdT_V - dSdT_V * dVdV_T); // Array Index 49
  const dTdS_U = (dTdV_T * dUdT_V - dTdT_V * dUdV_T) / (dSdV_T * dUdT_V - dSdT_V * dUdV_T); // Array Index 50
  const dTdS_H = (dTdV_T * dHdT_V - dTdT_V * dHdV_T) / (dSdV_T * dHdT_V - dSdT_V * dHdV_T); // Array Index 51

  // The following five groups provide the partial derivatives of pressure.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dVdP_T = (dVdV_T * dTdT_V - dVdT_V * dTdV_T) / (dPdV_T * dTdT_V - dPdT_V * dTdV_T); // Array Index 52
  const dVdP_U = (dVdV_T * dUdT_V - dVdT_V * dUdV_T) / (dPdV_T * dUdT_V - dPdT_V * dUdV_T); // Array Index 53
  const dVdP_H = (dVdV_T * dHdT_V - dVdT_V * dHdV_T) / (dPdV_T * dHdT_V - dPdT_V * dHdV_T); // Array Index 54
  const dVdP_S = (dVdV_T * dSdT_V - dVdT_V * dSdV_T) / (dPdV_T * dSdT_V - dPdT_V * dSdV_T); // Array Index 55

  const dVdT_P = (dVdV_T * dPdT_V - dVdT_V * dPdV_T) / (dTdV_T * dPdT_V - dTdT_V * dPdV_T); // Array Index 56
  const dVdT_U = (dVdV_T * dUdT_V - dVdT_V * dUdV_T) / (dTdV_T * dUdT_V - dTdT_V * dUdV_T); // Array Index 57
  const dVdT_H = (dVdV_T * dHdT_V - dVdT_V * dHdV_T) / (dTdV_T * dHdT_V - dTdT_V * dHdV_T); // Array Index 58
  const dVdT_S = (dVdV_T * dSdT_V - dVdT_V * dSdV_T) / (dTdV_T * dSdT_V - dTdT_V * dSdV_T); // Array Index 59

  const dVdU_P = (dVdV_T * dPdT_V - dVdT_V * dPdV_T) / (dUdV_T * dPdT_V - dUdT_V * dPdV_T); // Array Index 60
  const dVdU_T = (dVdV_T * dTdT_V - dVdT_V * dTdV_T) / (dUdV_T * dTdT_V - dUdT_V * dTdV_T); // Array Index 61
  const dVdU_H = (dVdV_T * dHdT_V - dVdT_V * dHdV_T) / (dUdV_T * dHdT_V - dUdT_V * dHdV_T); // Array Index 62
  const dVdU_S = (dVdV_T * dSdT_V - dVdT_V * dSdV_T) / (dUdV_T * dSdT_V - dUdT_V * dSdV_T); // Array Index 63

  const dVdH_P = (dVdV_T * dPdT_V - dVdT_V * dPdV_T) / (dHdV_T * dPdT_V - dHdT_V * dPdV_T); // Array Index 64
  const dVdH_T = (dVdV_T * dTdT_V - dVdT_V * dTdV_T) / (dHdV_T * dTdT_V - dHdT_V * dTdV_T); // Array Index 65
  const dVdH_U = (dVdV_T * dUdT_V - dVdT_V * dUdV_T) / (dHdV_T * dUdT_V - dHdT_V * dUdV_T); // Array Index 66
  const dVdH_S = (dVdV_T * dSdT_V - dVdT_V * dSdV_T) / (dHdV_T * dSdT_V - dHdT_V * dSdV_T); // Array Index 67

  const dVdS_P = (dVdV_T * dPdT_V - dVdT_V * dPdV_T) / (dSdV_T * dPdT_V - dSdT_V * dPdV_T); // Array Index 68
  const dVdS_T = (dVdV_T * dTdT_V - dVdT_V * dTdV_T) / (dSdV_T * dTdT_V - dSdT_V * dTdV_T); // Array Index 69
  const dVdS_U = (dVdV_T * dUdT_V - dVdT_V * dUdV_T) / (dSdV_T * dUdT_V - dSdT_V * dUdV_T); // Array Index 70
  const dVdS_H = (dVdV_T * dHdT_V - dVdT_V * dHdV_T) / (dSdV_T * dHdT_V - dSdT_V * dHdV_T); // Array Index 71

  // The following five groups provide the partial derivatives of pressure.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dUdP_T = (dUdV_T * dTdT_V - dUdT_V * dTdV_T) / (dPdV_T * dTdT_V - dPdT_V * dTdV_T); // Array Index 72
  const dUdP_V = (dUdV_T * dVdT_V - dUdT_V * dVdV_T) / (dPdV_T * dVdT_V - dPdT_V * dVdV_T); // Array Index 73
  const dUdP_H = (dUdV_T * dHdT_V - dUdT_V * dHdV_T) / (dPdV_T * dHdT_V - dPdT_V * dHdV_T); // Array Index 74
  const dUdP_S = (dUdV_T * dSdT_V - dUdT_V * dSdV_T) / (dPdV_T * dSdT_V - dPdT_V * dSdV_T); // Array Index 75

  const dUdT_P = (dUdV_T * dPdT_V - dUdT_V * dPdV_T) / (dTdV_T * dPdT_V - dTdT_V * dPdV_T); // Array Index 76
  const dUdT_H = (dUdV_T * dHdT_V - dUdT_V * dHdV_T) / (dTdV_T * dHdT_V - dTdT_V * dHdV_T); // Array Index 78
  const dUdT_S = (dUdV_T * dSdT_V - dUdT_V * dSdV_T) / (dTdV_T * dSdT_V - dTdT_V * dSdV_T); // Array Index 79

  const dUdV_P = (dUdV_T * dPdT_V - dUdT_V * dPdV_T) / (dVdV_T * dPdT_V - dVdT_V * dPdV_T); // Array Index 80
  const dUdV_H = (dUdV_T * dHdT_V - dUdT_V * dHdV_T) / (dVdV_T * dHdT_V - dVdT_V * dHdV_T); // Array Index 82
  const dUdV_S = (dUdV_T * dSdT_V - dUdT_V * dSdV_T) / (dVdV_T * dSdT_V - dVdT_V * dSdV_T); // Array Index 83

  const dUdH_P = (dUdV_T * dPdT_V - dUdT_V * dPdV_T) / (dHdV_T * dPdT_V - dHdT_V * dPdV_T); // Array Index 84
  const dUdH_T = (dUdV_T * dTdT_V - dUdT_V * dTdV_T) / (dHdV_T * dTdT_V - dHdT_V * dTdV_T); // Array Index 85
  const dUdH_V = (dUdV_T * dVdT_V - dUdT_V * dVdV_T) / (dHdV_T * dVdT_V - dHdT_V * dVdV_T); // Array Index 86
  const dUdH_S = (dUdV_T * dSdT_V - dUdT_V * dSdV_T) / (dHdV_T * dSdT_V - dHdT_V * dSdV_T); // Array Index 87

  const dUdS_P = (dUdV_T * dPdT_V - dUdT_V * dPdV_T) / (dSdV_T * dPdT_V - dSdT_V * dPdV_T); // Array Index 88
  const dUdS_T = (dUdV_T * dTdT_V - dUdT_V * dTdV_T) / (dSdV_T * dTdT_V - dSdT_V * dTdV_T); // Array Index 89
  const dUdS_V = (dUdV_T * dVdT_V - dUdT_V * dVdV_T) / (dSdV_T * dVdT_V - dSdT_V * dVdV_T); // Array Index 90
  const dUdS_H = (dUdV_T * dHdT_V - dUdT_V * dHdV_T) / (dSdV_T * dHdT_V - dSdT_V * dHdV_T); // Array Index 91

  // The following five groups provide the partial derivatives of pressure.  Refer to IAPWS AN3-07 (2018) Equation
  const dHdP_T = (dHdV_T * dTdT_V - dHdT_V * dTdV_T) / (dPdV_T * dTdT_V - dPdT_V * dTdV_T); // Array Index 92
  const dHdP_V = (dHdV_T * dVdT_V - dHdT_V * dVdV_T) / (dPdV_T * dVdT_V - dPdT_V * dVdV_T); // Array Index 93
  const dHdP_U = (dHdV_T * dUdT_V - dHdT_V * dUdV_T) / (dPdV_T * dUdT_V - dPdT_V * dUdV_T); // Array Index 94
  const dHdP_S = (dHdV_T * dSdT_V - dHdT_V * dSdV_T) / (dPdV_T * dSdT_V - dPdT_V * dSdV_T); // Array Index 95

  const dHdT_P = (dHdV_T * dPdT_V - dHdT_V * dPdV_T) / (dTdV_T * dPdT_V - dTdT_V * dPdV_T); // Array Index 96
  const dHdT_U = (dHdV_T * dUdT_V - dHdT_V * dUdV_T) / (dTdV_T * dUdT_V - dTdT_V * dUdV_T); // Array Index 98
  const dHdT_S = (dHdV_T * dSdT_V - dHdT_V * dSdV_T) / (dTdV_T * dSdT_V - dTdT_V * dSdV_T); // Array Index 99

  const dHdV_P = (dHdV_T * dPdT_V - dHdT_V * dPdV_T) / (dVdV_T * dPdT_V - dVdT_V * dPdV_T); // Array Index 100
  const dHdV_U = (dHdV_T * dUdT_V - dHdT_V * dUdV_T) / (dVdV_T * dUdT_V - dVdT_V * dUdV_T); // Array Index 102
  const dHdV_S = (dHdV_T * dSdT_V - dHdT_V * dSdV_T) / (dVdV_T * dSdT_V - dVdT_V * dSdV_T); // Array Index 103

  const dHdU_P = (dHdV_T * dPdT_V - dHdT_V * dPdV_T) / (dUdV_T * dPdT_V - dUdT_V * dPdV_T); // Array Index 104
  const dHdU_T = (dHdV_T * dTdT_V - dHdT_V * dTdV_T) / (dUdV_T * dTdT_V - dUdT_V * dTdV_T); // Array Index 105
  const dHdU_V = (dHdV_T * dVdT_V - dHdT_V * dVdV_T) / (dUdV_T * dVdT_V - dUdT_V * dVdV_T); // Array Index 106
  const dHdU_S = (dHdV_T * dSdT_V - dHdT_V * dSdV_T) / (dUdV_T * dSdT_V - dUdT_V * dSdV_T); // Array Index 107

  const dHdS_P = (dHdV_T * dPdT_V - dHdT_V * dPdV_T) / (dSdV_T * dPdT_V - dSdT_V * dPdV_T); // Array Index 108
  const dHdS_T = (dHdV_T * dTdT_V - dHdT_V * dTdV_T) / (dSdV_T * dTdT_V - dSdT_V * dTdV_T); // Array Index 109
  const dHdS_V = (dHdV_T * dVdT_V - dHdT_V * dVdV_T) / (dSdV_T * dVdT_V - dSdT_V * dVdV_T); // Array Index 110
  const dHdS_U = (dHdV_T * dUdT_V - dHdT_V * dUdV_T) / (dSdV_T * dUdT_V - dSdT_V * dUdV_T); // Array Index 111

  // The following five groups provide the partial derivatives of pressure.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dSdP_T = (dSdV_T * dTdT_V - dSdT_V * dTdV_T) / (dPdV_T * dTdT_V - dPdT_V * dTdV_T); // Array Index 112
  const dSdP_V = (dSdV_T * dVdT_V - dSdT_V * dVdV_T) / (dPdV_T * dVdT_V - dPdT_V * dVdV_T); // Array Index 113
  const dSdP_U = (dSdV_T * dUdT_V - dSdT_V * dUdV_T) / (dPdV_T * dUdT_V - dPdT_V * dUdV_T); // Array Index 114
  const dSdP_H = (dSdV_T * dHdT_V - dSdT_V * dHdV_T) / (dPdV_T * dHdT_V - dPdT_V * dHdV_T); // Array Index 115

  const dSdT_P = (dSdV_T * dPdT_V - dSdT_V * dPdV_T) / (dTdV_T * dPdT_V - dTdT_V * dPdV_T); // Array Index 116
  const dSdT_U = (dSdV_T * dUdT_V - dSdT_V * dUdV_T) / (dTdV_T * dUdT_V - dTdT_V * dUdV_T); // Array Index 118
  const dSdT_H = (dSdV_T * dHdT_V - dSdT_V * dHdV_T) / (dTdV_T * dHdT_V - dTdT_V * dHdV_T); // Array Index 119

  const dSdV_P = (dSdV_T * dPdT_V - dSdT_V * dPdV_T) / (dVdV_T * dPdT_V - dVdT_V * dPdV_T); // Array Index 120
  const dSdV_U = (dSdV_T * dUdT_V - dSdT_V * dUdV_T) / (dVdV_T * dUdT_V - dVdT_V * dUdV_T); // Array Index 122
  const dSdV_H = (dSdV_T * dHdT_V - dSdT_V * dHdV_T) / (dVdV_T * dHdT_V - dVdT_V * dHdV_T); // Array Index 123

  const dSdU_P = (dSdV_T * dPdT_V - dSdT_V * dPdV_T) / (dUdV_T * dPdT_V - dUdT_V * dPdV_T); // Array Index 124
  const dSdU_T = (dSdV_T * dTdT_V - dSdT_V * dTdV_T) / (dUdV_T * dTdT_V - dUdT_V * dTdV_T); // Array Index 125
  const dSdU_V = (dSdV_T * dVdT_V - dSdT_V * dVdV_T) / (dUdV_T * dVdT_V - dUdT_V * dVdV_T); // Array Index 126
  const dSdU_H = (dSdV_T * dHdT_V - dSdT_V * dHdV_T) / (dUdV_T * dHdT_V - dUdT_V * dHdV_T); // Array Index 127

  const dSdH_P = (dSdV_T * dPdT_V - dSdT_V * dPdV_T) / (dHdV_T * dPdT_V - dHdT_V * dPdV_T); // Array Index 128
  const dSdH_T = (dSdV_T * dTdT_V - dSdT_V * dTdV_T) / (dHdV_T * dTdT_V - dHdT_V * dTdV_T); // Array Index 129
  const dSdH_V = (dSdV_T * dVdT_V - dSdT_V * dVdV_T) / (dHdV_T * dVdT_V - dHdT_V * dVdV_T); // Array Index 130
  const dSdH_U = (dSdV_T * dUdT_V - dSdT_V * dUdV_T) / (dHdV_T * dUdT_V - dHdT_V * dUdV_T); // Array Index 131

  // SteamPropertiesArray = [(0) Pressure, (1) Temperature, (2) Quality, (3) Enthalpy, (4) Entropy,
  //  (5) InternalEnergy, (6) Volume, (7) IsobaricHeat, (8) IsochoricHeat, (9) SpeedOfSound]
  return [
    Pressure,
    temperature,
    0.0,
    Enthalpy,
    Entropy,
    InternalEnergy,
    Volume,
    IsobaricHeat,
    IsochoricHeat,
    SpeedOfSound, // Elements 0 through 9 (10 & 11 not used)
    0,
    0,
    dPdT_V,
    dPdT_U,
    dPdT_H,
    dPdT_S,
    dPdV_T,
    dPdV_U,
    dPdV_H,
    dPdV_S,
    dPdU_T,
    dPdU_V,
    dPdU_H,
    dPdU_S,
    dPdH_T,
    dPdH_V,
    dPdH_U,
    dPdH_S,
    dPdS_T,
    dPdS_V,
    dPdS_U,
    dPdS_H, // Elements 12 through 31
    dTdP_V,
    dTdP_U,
    dTdP_H,
    dTdP_S,
    dTdV_P,
    dTdV_U,
    dTdV_H,
    dTdV_S,
    dTdU_P,
    dTdU_V,
    dTdU_H,
    dTdU_S,
    dTdH_P,
    dTdH_V,
    dTdH_U,
    dTdH_S,
    dTdS_P,
    dTdS_V,
    dTdS_U,
    dTdS_H, // Elements 32 through 51
    dVdP_T,
    dVdP_U,
    dVdP_H,
    dVdP_S,
    dVdT_P,
    dVdT_U,
    dVdT_H,
    dVdT_S,
    dVdU_P,
    dVdU_T,
    dVdU_H,
    dVdU_S,
    dVdH_P,
    dVdH_T,
    dVdH_U,
    dVdH_S,
    dVdS_P,
    dVdS_T,
    dVdS_U,
    dVdS_H, // Elements 52 through 71
    dUdP_T,
    dUdP_V,
    dUdP_H,
    dUdP_S,
    dUdT_P,
    dUdT_V,
    dUdT_H,
    dUdT_S,
    dUdV_P,
    dUdV_T,
    dUdV_H,
    dUdV_S,
    dUdH_P,
    dUdH_T,
    dUdH_V,
    dUdH_S,
    dUdS_P,
    dUdS_T,
    dUdS_V,
    dUdS_H, // Elements 72 through 91
    dHdP_T,
    dHdP_V,
    dHdP_U,
    dHdP_S,
    dHdT_P,
    dHdT_V,
    dHdT_U,
    dHdT_S,
    dHdV_P,
    dHdV_T,
    dHdV_U,
    dHdV_S,
    dHdU_P,
    dHdU_T,
    dHdU_V,
    dHdU_S,
    dHdS_P,
    dHdS_T,
    dHdS_V,
    dHdS_U, // Elements 92 through 111
    dSdP_T,
    dSdP_V,
    dSdP_U,
    dSdP_H,
    dSdT_P,
    dSdT_V,
    dSdT_U,
    dSdT_H,
    dSdV_P,
    dSdV_T,
    dSdV_U,
    dSdV_H,
    dSdU_P,
    dSdU_T,
    dSdU_V,
    dSdU_H,
    dSdH_P,
    dSdH_T,
    dSdH_V,
    dSdH_U,
  ]; // Elements 112 through 131
}

// The following equations are used for testing.
export function Volume_fPT(pressure, temperature) {
  var SpecificVolume = 0; // initate the Specific Volume for the backward calculation v(p,T)

  if (pressure > 40 && pressure <= Constants.pmax) {
    // subregion 3a or 3b
    let T3ab = Reg3SubregAbOpWxBoundary(pressure, Constants.reg3_T3ab_I, Constants.reg3_T3ab_n);
    if (temperature <= T3ab) {
      // Subregion 3a  Constants contained in a custom type in element 0 of array reg3C
      SpecificVolume = SubRegion3V(0, pressure, temperature, reg3Constants); // reg3Constants[0] => Subregion 3a
    } else if (temperature > T3ab) {
      // Subregion 3b
      SpecificVolume = SubRegion3V(1, pressure, temperature, reg3Constants); // reg3Constants[1] => Subregion 3b
    } else {
      throw Errors.TemperatureNotInRegion3a3b;
    }
  } else if (pressure > 25 && pressure <= 40) {
    // subregion 3c, 3d, 3e, or 3f
    let T3ab = Reg3SubregAbOpWxBoundary(pressure, Constants.reg3_T3ab_I, Constants.reg3_T3ab_n);
    let T3cd = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3cd_I, Constants.reg3_T3cd_n);
    let T3ef = Reg3SubregEfBoundary(pressure);
    if (temperature <= T3cd) {
      // Subregion 3c
      SpecificVolume = SubRegion3V(2, pressure, temperature, reg3Constants); // reg3Constants[2] => Subregion 3c
    } else if (temperature > T3cd && temperature <= T3ab) {
      // Subregion 3d
      SpecificVolume = SubRegion3V(3, pressure, temperature, reg3Constants); // reg3Constants[3] => Subregion 3d
    } else if (temperature > T3ab && temperature <= T3ef) {
      // Subregion 3e
      SpecificVolume = SubRegion3V(4, pressure, temperature, reg3Constants); // reg3Constants[4] => Subregion 3e
    } else if (temperature > T3ef) {
      // Subregion 3f
      SpecificVolume = SubRegion3V(5, pressure, temperature, reg3Constants); // reg3Constants[4] => Subregion 3f
    } else {
      throw Errors.TemperatureNotInRegion3c3d3e3f;
    }
  } else if (pressure > 23.5 && pressure <= 25) {
    // subregion 3c, 3g, 3h, 3i, 3j or 3k
    let T3cd = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3cd_I, Constants.reg3_T3cd_n);
    let T3ef = Reg3SubregEfBoundary(pressure);
    let T3gh = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3gh_I, Constants.reg3_T3gh_n);
    let T3ij = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3ij_I, Constants.reg3_T3ij_n);
    let T3jk = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3jk_I, Constants.reg3_T3jk_n);

    if (temperature <= T3cd) {
      // Subregion 3c
      SpecificVolume = SubRegion3V(2, pressure, temperature, reg3Constants); // reg3Constants[2] => Subregion 3c;
    } else if (temperature > T3cd && temperature <= T3gh) {
      // Subregion 3g
      SpecificVolume = SubRegion3V(6, pressure, temperature, reg3Constants); // reg3Constants[6] => Subregion 3g
    } else if (temperature > T3gh && temperature <= T3ef) {
      // Subregion 3h
      SpecificVolume = SubRegion3V(7, pressure, temperature, reg3Constants); // reg3Constants[7] => Subregion 3h
    } else if (temperature > T3ef && temperature <= T3ij) {
      // Subregion 3i
      SpecificVolume = SubRegion3V(8, pressure, temperature, reg3Constants); // reg3Constants[8] => Subregion 3i
    } else if (temperature > T3ij && temperature <= T3jk) {
      // Subregion 3j
      SpecificVolume = SubRegion3V(9, pressure, temperature, reg3Constants); // reg3Constants[9] => Subregion 3j
    } else if (temperature > T3jk) {
      // Subregion 3k
      SpecificVolume = SubRegion3V(10, pressure, temperature, reg3Constants); // reg3Constants[10] => Subregion 3k
    } else throw Errors.TemperatureNotInRegion3c3g3h3i3j3k;
  } else if (pressure > 23 && pressure <= 23.5) {
    // subregion 3c, 3l, 3h, 3i, 3j or 3k
    let T3cd = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3cd_I, Constants.reg3_T3cd_n);
    let T3ef = Reg3SubregEfBoundary(pressure);
    let T3gh = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3gh_I, Constants.reg3_T3gh_n);
    let T3ij = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3ij_I, Constants.reg3_T3ij_n);
    let T3jk = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3jk_I, Constants.reg3_T3jk_n);

    if (temperature <= T3cd) {
      // Subregion 3c
      SpecificVolume = SubRegion3V(2, pressure, temperature, reg3Constants); // reg3Constants[2] => Subregion 3c
    } else if (temperature > T3cd && temperature <= T3gh) {
      // Subregion 3l
      SpecificVolume = SubRegion3V(11, pressure, temperature, reg3Constants); // reg3Constants[11] => Subregion 3l
    } else if (temperature > T3gh && temperature <= T3ef) {
      // Subregion 3h
      SpecificVolume = SubRegion3V(7, pressure, temperature, reg3Constants); // reg3Constants[7] => Subregion 3h
    } else if (temperature > T3ef && temperature <= T3ij) {
      // Subregion 3i
      SpecificVolume = SubRegion3V(8, pressure, temperature, reg3Constants); // reg3Constants[8] => Subregion 3i
    } else if (temperature > T3ij && temperature <= T3jk) {
      // Subregion 3j
      SpecificVolume = SubRegion3V(9, pressure, temperature, reg3Constants); // reg3Constants[9] => Subregion 3j
    } else if (temperature > T3jk) {
      // Subregion 3k
      SpecificVolume = SubRegion3V(10, pressure, temperature, reg3Constants); // reg3Constants[10] => Subregion 3k
    } else throw Errors.TemperatureNotInRegion3c3l3h3i3j3k;
  } else if (pressure > 22.5 && pressure <= 23) {
    // subregion 3c, 3l, 3m, 3n, 3o, 3p, 3j, or 3k
    let T3cd = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3cd_I, Constants.reg3_T3cd_n);
    let T3ef = Reg3SubregEfBoundary(pressure);
    let T3gh = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3gh_I, Constants.reg3_T3gh_n);
    let T3ij = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3ij_I, Constants.reg3_T3ij_n);
    let T3jk = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3jk_I, Constants.reg3_T3jk_n);
    let T3mn = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3mn_I, Constants.reg3_T3mn_n);
    let T3op = Reg3SubregAbOpWxBoundary(pressure, Constants.reg3_T3op_I, Constants.reg3_T3op_n);

    if (temperature <= T3cd) {
      // Subregion 3c
      SpecificVolume = SubRegion3V(2, pressure, temperature, reg3Constants); // reg3Constants[2] => Subregion 3c
    } else if (temperature > T3cd && temperature <= T3gh) {
      // Subregion 3l
      SpecificVolume = SubRegion3V(11, pressure, temperature, reg3Constants); // reg3Constants[11] => Subregion 3l
    } else if (temperature > T3gh && temperature <= T3mn) {
      // Subregion 3m
      SpecificVolume = SubRegion3V(12, pressure, temperature, reg3Constants); // reg3Constants[12] => Subregion 3m
    } else if (temperature > T3mn && temperature <= T3ef) {
      // Subregion 3n
      SpecificVolume = SubRegion3V_n(13, pressure, temperature, reg3Constants); // reg3Constants[13] => Subregion 3n
    } else if (temperature > T3ef && temperature <= T3op) {
      // Subregion 3o
      SpecificVolume = SubRegion3V(14, pressure, temperature, reg3Constants); // reg3Constants[14] => Subregion 3o
    } else if (temperature > T3op && temperature <= T3ij) {
      // Subregion 3p
      SpecificVolume = SubRegion3V(15, pressure, temperature, reg3Constants); // reg3Constants[15] => Subregion 3p
    } else if (temperature > T3ij && temperature <= T3jk) {
      // Subregion 3j
      SpecificVolume = SubRegion3V(9, pressure, temperature, reg3Constants); // reg3Constants[9] => Subregion 3j
    } else if (temperature > T3jk) {
      // Subregion 3k
      SpecificVolume = SubRegion3V(10, pressure, temperature, reg3Constants); // reg3Constants[10] => Subregion 3k
    } else throw Errors.TemperatureNotInRegion3c3l3m3n3o3p3j3k;
  } else if (pressure > Region4SatPressure.reg4SatPressureT3q3r3u3xPoint && pressure <= 22.5) {
    // subregion 3c, 3q, 3r, 3k or aux equations 3u, 3v, 3w, 3x, 3y or 3z
    let T3cd = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3cd_I, Constants.reg3_T3cd_n);
    let T3ef = Reg3SubregEfBoundary(pressure);
    let T3qu = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3qu_I, Constants.reg3_T3qu_n);
    //let T3ij = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3ij_I, Constants.reg3_T3ij_n);
    let T3jk = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3jk_I, Constants.reg3_T3jk_n);
    let T3rx = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3rx_I, Constants.reg3_T3rx_n);
    let T3uv = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3uv_I, Constants.reg3_T3uv_n);
    let T3wx = Reg3SubregAbOpWxBoundary(pressure, Constants.reg3_T3wx_I, Constants.reg3_T3wx_n);

    if (temperature <= T3cd) {
      // Subregion 3c
      SpecificVolume = SubRegion3V(2, pressure, temperature, reg3Constants); // reg3Constants[2] => Subregion 3c
    } else if (temperature > T3cd && temperature <= T3qu) {
      // Subregion 3q
      SpecificVolume = SubRegion3V(16, pressure, temperature, reg3Constants); // reg3Constants[16] => Subregion 3q
    } else if (temperature > T3rx && temperature <= T3jk) {
      // Subregion 3r
      SpecificVolume = SubRegion3V(17, pressure, temperature, reg3Constants); // reg3Constants[17] => Subregion 3r
    } else if (temperature > T3jk) {
      // Subregion 3k
      SpecificVolume = SubRegion3V(10, pressure, temperature, reg3Constants); // reg3Constants[10] => Subregion 3k
    } else if (pressure > 22.11) {
      // Subregions 3u, 3v, 3w, and 3x : Supercritical Aux Equations near Critical Point
      if (temperature > T3qu && temperature <= T3uv) {
        // Subregion 3u
        SpecificVolume = SubRegion3V(20, pressure, temperature, reg3Constants); // reg3Constants[20] => Subregion 3u
      } else if (temperature > T3uv && temperature <= T3ef) {
        // Subregion 3v
        SpecificVolume = SubRegion3V(21, pressure, temperature, reg3Constants); // reg3Constants[21] => Subregion 3v
      } else if (temperature > T3ef && temperature <= T3wx) {
        // Subregion 3w
        SpecificVolume = SubRegion3V(22, pressure, temperature, reg3Constants); // reg3Constants[22] => Subregion 3w
      } else if (temperature > T3wx && temperature <= T3rx) {
        // Subregion 3x
        SpecificVolume = SubRegion3V(23, pressure, temperature, reg3Constants); // reg3Constants[23] => Subregion 3x
      } else throw Errors.TemperatureNotInRegion3u3v3w3x;
    } else if (pressure >= Pcritical && pressure <= 22.11) {
      // Subregions 3u, 3x, 3y, and 3z : Supercritical Aux Equations near Critical Point
      if (temperature > T3qu && temperature <= T3uv) {
        // Subregion 3u
        SpecificVolume = SubRegion3V(20, pressure, temperature, reg3Constants); // reg3Constants[20] => Subregion 3u
      } else if (temperature > T3uv && temperature <= T3ef) {
        // Subregion 3y
        SpecificVolume = SubRegion3V(24, pressure, temperature, reg3Constants); // reg3Constants[24] => Subregion 3y
      } else if (temperature > T3ef && temperature <= T3wx) {
        // Subregion 3z
        SpecificVolume = SubRegion3V(25, pressure, temperature, reg3Constants); // reg3Constants[25] => Subregion 3z
      } else if (temperature > T3wx && temperature <= T3rx) {
        // Subregion 3x
        SpecificVolume = SubRegion3V(23, pressure, temperature, reg3Constants); // reg3Constants[23] => Subregion 3x
      } else throw Errors.TemperatureNotInRegion3u3x3y3z;
    } else if (temperature <= Region4Calculations.SatTemperature(pressure)) {
      if (pressure > 21.93161551 && pressure <= Pcritical) {
        if (temperature > T3qu && temperature <= T3uv) {
          // Subregion 3u
          SpecificVolume = SubRegion3V(20, pressure, temperature, reg3Constants); // reg3Constants[20] => Subregion 3u
        } else if (temperature > T3uv) {
          // Subregion 3y
          SpecificVolume = SubRegion3V(24, pressure, temperature, reg3Constants); // reg3Constants[24] => Subregion 3y
        } else Errors.TemperatureNotInRegion3u3y;
      } else if (pressure > Region4SatPressure.reg4SatPressureT3q3r3u3xPoint && pressure <= 21.93161551) {
        if (temperature > T3qu) {
          // Subregion 3u
          SpecificVolume = SubRegion3V(20, pressure, temperature, reg3Constants); // reg3Constants[20] => Subregion 3u
        }
      } else throw Errors.TemperatureNotInRegion3u3y;
    } else if (temperature >= Region4Calculations.SatTemperature(pressure)) {
      if (pressure > 21.90096265 && pressure <= Pcritical) {
        if (temperature <= T3wx) {
          // Subregion 3z
          SpecificVolume = SubRegion3V(25, pressure, temperature, reg3Constants); // reg3Constants[25] => Subregion 3z
        } else if (temperature > T3wx && temperature <= T3rx) {
          // Subregion 3x
          SpecificVolume = SubRegion3V(23, pressure, temperature, reg3Constants); // reg3Constants[23] => Subregion 3x
        } else throw Errors.TemperatureNotInRegion3x3z;
      } else if (pressure > Region4SatPressure.reg4SatPressureT3q3r3u3xPoint && pressure <= 21.90096265) {
        if (temperature <= T3rx) {
          // Subregion 3x
          SpecificVolume = SubRegion3V(23, pressure, temperature, reg3Constants); // reg3Constants[23] => Subregion 3x
        } else throw Errors.TemperatureNotInRegion3x3z;
      }
    } else throw Errors.TemperatureNotInRegion3x3z;
  } else if (pressure > 20.5 && pressure <= Region4SatPressure.reg4SatPressureT3q3r3u3xPoint) {
    // subregion 3c, 3s, 3r, or 3k
    let T3cd = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3cd_I, Constants.reg3_T3cd_n);
    let T3jk = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3jk_I, Constants.reg3_T3jk_n);

    if (temperature <= T3cd) {
      // Subregion 3c
      SpecificVolume = SubRegion3V(2, pressure, temperature, reg3Constants); // reg3Constants[2] => Subregion 3c
    } else if (temperature > T3cd && temperature <= Region4Calculations.SatTemperature(pressure)) {
      // Subregion 3s
      SpecificVolume = SubRegion3V(18, pressure, temperature, reg3Constants); // reg3Constants[18] => Subregion 3s
    } else if (temperature >= Region4Calculations.SatTemperature(pressure) && temperature <= T3jk) {
      // Subregion 3r
      SpecificVolume = SubRegion3V(17, pressure, temperature, reg3Constants); // reg3Constants[17] => Subregion 3r
    } else if (temperature > T3jk) {
      // Subregion 3k
      SpecificVolume = SubRegion3V(10, pressure, temperature, reg3Constants); // reg3Constants[10] => Subregion 3k
    } else throw Errors.TemperatureNotInRegion3c3s3r3k;
  } else if (pressure > p3cd && pressure <= 20.5) {
    // subregion 3c, 3s or 3t
    let T3cd = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3cd_I, Constants.reg3_T3cd_n);

    if (temperature <= T3cd) {
      // Subregion 3c
      SpecificVolume = SubRegion3V(2, pressure, temperature, reg3Constants); // reg3Constants[2] => Subregion 3c
    } else if (temperature > T3cd && temperature <= Region4Calculations.SatTemperature(pressure)) {
      // Subregion 3s
      SpecificVolume = SubRegion3V(18, pressure, temperature, reg3Constants); // reg3Constants[18] => Subregion 3s
    } else if (temperature >= Region4Calculations.SatTemperature(pressure)) {
      // Subregion 3t
      SpecificVolume = SubRegion3V(19, pressure, temperature, reg3Constants); // reg3Constants[19] => Subregion 3t
    } else throw Errors.TemperatureNotInRegion3c3s3t;
  }

  if (pressure > Region4SatPressure.satPressureT13Boundary && pressure <= p3cd) {
    // subregion 3c or 3t
    if (temperature <= Region4Calculations.SatTemperature(pressure)) {
      // Subregion 3c
      SpecificVolume = SubRegion3V(2, pressure, temperature, reg3Constants); // reg3Constants[2] => Subregion 3c;
    } else if (temperature >= Region4Calculations.SatTemperature(pressure)) {
      // Subregion 3t
      SpecificVolume = SubRegion3V(19, pressure, temperature, reg3Constants); // reg3Constants[19] => Subregion 3t
    } else throw Errors.TemperatureNotInRegion3c3t;
  }

  return SpecificVolume;
}

// Region 3 backward equations IAPWS SR3-03 (2014)
// T(p,h), v(p,h), T(p,s), v(p,s)

// Backward equation 1: Boundary between subregion 3a and 3b, h(p)
export function H3ab(pressure) {
  return (
    Constants.reg3_h3ab_fP[0] +
    Constants.reg3_h3ab_fP[1] * pressure +
    Constants.reg3_h3ab_fP[2] * Math.pow(pressure, 2) +
    Constants.reg3_h3ab_fP[3] * Math.pow(pressure, 3)
  );
}

// Backward equation 2: Subregion 3a, T(p,h)
export function Reg3a_Tph(pressure, enthalpy) {
  var T_Reducing = 760; // K
  var p_Reducing = Constants.pmax; // MPa
  var h_Reducing = 2300; // kJ/kg

  var pi = pressure / p_Reducing;
  var eta = enthalpy / h_Reducing;

  var theta = 0;
  for (let i = 0; i < Constants.reg3a_Tph_I.length; i++) {
    theta +=
      Constants.reg3a_Tph_n[i] *
      Math.pow(pi + 0.24, Constants.reg3a_Tph_I[i]) *
      Math.pow(eta - 0.615, Constants.reg3a_Tph_J[i]);
  }
  return theta * T_Reducing;
}

// Backward equation 3: Subregion 3b, T(p,h)
export function Reg3b_Tph(pressure, enthalpy) {
  const T_Reducing = 860; // K
  const p_Reducing = Constants.pmax; // MPa
  const h_Reducing = 2800; // kJ/kg
  const pi = pressure / p_Reducing;
  const eta = enthalpy / h_Reducing;
  var theta = 0;

  for (let i = 0; i < Constants.reg3b_Tph_I.length; i++) {
    theta +=
      Constants.reg3b_Tph_n[i] *
      Math.pow(pi + 0.298, Constants.reg3b_Tph_I[i]) *
      Math.pow(eta - 0.72, Constants.reg3b_Tph_J[i]);
  }
  return theta * T_Reducing;
}

// Backward equation 4: Subregion 3a, V(p,h)
export function Reg3a_Vph(pressure, enthalpy) {
  var v_Reducing = 0.0028; // m3/kg
  var p_Reducing = Constants.pmax; // MPa
  var h_Reducing = 2100; // kJ/kg

  var pi = pressure / p_Reducing;
  var eta = enthalpy / h_Reducing;

  var omega = 0;
  for (let i = 0; i < Constants.reg3a_Vph_I.length; i++) {
    omega +=
      Constants.reg3a_Vph_n[i] *
      Math.pow(pi + 0.128, Constants.reg3a_Vph_I[i]) *
      Math.pow(eta - 0.727, Constants.reg3a_Vph_J[i]);
  }
  return omega * v_Reducing;
}

// Backward equation 5: Subregion 3b, V(p,h)
export function Reg3b_Vph(pressure, enthalpy) {
  var v_Reducing = 0.0088; // m3/kg
  var p_Reducing = Constants.pmax; // MPa
  var h_Reducing = 2800; // kJ/kg

  var pi = pressure / p_Reducing;
  var eta = enthalpy / h_Reducing;

  var omega = 0;
  for (let i = 0; i < Constants.reg3b_Vph_I.length; i++) {
    omega +=
      Constants.reg3b_Vph_n[i] *
      Math.pow(pi + 0.0661, Constants.reg3b_Vph_I[i]) *
      Math.pow(eta - 0.72, Constants.reg3b_Vph_J[i]);
  }
  return omega * v_Reducing;
}

// Backward equation 6: Subregion 3a, T(p,s)
export function Reg3a_Tps(pressure, entropy) {
  var T_Reducing = 760; // K
  var p_Reducing = Constants.pmax; // MPa
  var s_Reducing = 4.4; // kJ/kg/K

  var pi = pressure / p_Reducing;
  var sigma = entropy / s_Reducing;

  var theta = 0;
  for (let i = 0; i < Constants.reg3a_Tps_I.length; i++) {
    theta +=
      Constants.reg3a_Tps_n[i] *
      Math.pow(pi + 0.24, Constants.reg3a_Tps_I[i]) *
      Math.pow(sigma - 0.703, Constants.reg3a_Tps_J[i]);
  }
  return theta * T_Reducing;
}

// Backward equation 7: Subregion 3b, T(p,s)
export function Reg3b_Tps(pressure, entropy) {
  var T_Reducing = 860; // K
  var p_Reducing = Constants.pmax; // MPa
  var s_Reducing = 5.3; // kJ/kg/K

  var pi = pressure / p_Reducing;
  var sigma = entropy / s_Reducing;

  var theta = 0;
  for (let i = 0; i < Constants.reg3b_Tps_I.length; i++) {
    theta +=
      Constants.reg3b_Tps_n[i] *
      Math.pow(pi + 0.76, Constants.reg3b_Tps_I[i]) *
      Math.pow(sigma - 0.818, Constants.reg3b_Tps_J[i]);
  }
  return theta * T_Reducing;
}

// Backward equation 8: Subregion 3a, V(p,s)
export function Reg3a_Vps(pressure, entropy) {
  let v_Reducing = 0.0028; // m3/kg
  let p_Reducing = Constants.pmax; // MPa
  let s_Reducing = 4.4; // kJ/kg/K

  let pi = pressure / p_Reducing;
  let sigma = entropy / s_Reducing;

  var omega = 0;
  for (let i = 0; i < Constants.reg3a_Vps_I.length; i++) {
    omega +=
      Constants.reg3a_Vps_n[i] *
      Math.pow(pi + 0.187, Constants.reg3a_Vps_I[i]) *
      Math.pow(sigma - 0.755, Constants.reg3a_Vps_J[i]);
  }
  return omega * v_Reducing;
}

// Backward equation 9: Subregion 3b, V(p,s)
export function Reg3b_Vps(pressure, entropy) {
  let v_Reducing = 0.0088; // m3/kg
  let p_Reducing = Constants.pmax; // MPa
  let s_Reducing = 5.3; // kJ/kg/K

  let pi = pressure / p_Reducing;
  let sigma = entropy / s_Reducing;

  var omega = 0;
  for (let i = 0; i < Constants.reg3b_Vps_I.length; i++) {
    omega +=
      Constants.reg3b_Vps_n[i] *
      Math.pow(pi + 0.298, Constants.reg3b_Vps_I[i]) *
      Math.pow(sigma - 0.816, Constants.reg3b_Vps_J[i]);
  }
  return omega * v_Reducing;
}

// Backward equation 10:  Psat(h)
export function Reg3_PSATh(enthalpy) {
  let p_Reducing = 22; // MPa
  let h_Reducing = 2600; // kJ/kg

  let eta = enthalpy / h_Reducing;

  var pi = 0;
  for (let i = 0; i < Constants.reg3_PSATh_I.length; i++) {
    pi +=
      Constants.reg3_PSATh_n[i] *
      Math.pow(eta - 1.02, Constants.reg3_PSATh_I[i]) *
      Math.pow(eta - 0.608, Constants.reg3_PSATh_J[i]);
  }
  return pi * p_Reducing;
}

// Backward equation 11:  Psat(s)
export function Reg3_PSATs(entropy) {
  let p_Reducing = 22; // MPa
  let s_Reducing = 5.2; // kJ/kg/K

  let sigma = entropy / s_Reducing;

  var pi = 0;
  for (let i = 0; i < Constants.reg3_PSATs_I.length; i++) {
    pi +=
      Constants.reg3_PSATs_n[i] *
      Math.pow(sigma - 1.03, Constants.reg3_PSATs_I[i]) *
      Math.pow(sigma - 0.699, Constants.reg3_PSATs_J[i]);
  }
  return pi * p_Reducing;
}

//  SR4-04 Equ 1: p3aHS gives properties for region 3a
export function P3aHS(enthalpy, entropy) {
  let p_Reducing = 99; // MPa
  let h_Reducing = 2300; // kJ/kg
  let s_Reducing = 4.4; // kJ/kg/K

  let eta = enthalpy / h_Reducing;
  let sigma = entropy / s_Reducing;

  var pi = 0;
  for (let i = 0; i < Constants.reg3a_pHS_I.length; i++) {
    pi +=
      Constants.reg3a_pHS_n[i] *
      Math.pow(eta - 1.01, Constants.reg3a_pHS_I[i]) *
      Math.pow(sigma - 0.75, Constants.reg3a_pHS_J[i]);
  }
  return pi * p_Reducing;
}

//  SR4-04 Equ 2: p3bHS gives properties for region 3b
export function P3bHS(enthalpy, entropy) {
  let p_Reducing = 16.6; // MPa
  let h_Reducing = 2800; // kJ/kg
  let s_Reducing = 5.3; // kJ/kg/K

  let eta = enthalpy / h_Reducing;
  let sigma = entropy / s_Reducing;

  var pi = 0;
  for (let i = 0; i < Constants.reg3b_pHS_I.length; i++) {
    pi +=
      Constants.reg3b_pHS_n[i] *
      Math.pow(eta - 0.681, Constants.reg3b_pHS_I[i]) *
      Math.pow(sigma - 0.792, Constants.reg3b_pHS_J[i]);
  }
  return p_Reducing / pi;
}

//  SR4-04 Equ 3: saturated liquid line, h1'(s)
export function H1_sat_liqS(entropy) {
  let h_Reducing = 1700; // kJ/kg
  let s_Reducing = 3.8; // kJ/kg/K

  let sigma = entropy / s_Reducing;

  var eta = 0;
  for (let i = 0; i < Constants.reg3_h1_satLiqS_I.length; i++) {
    eta +=
      Constants.reg3_h1_satLiqS_n[i] *
      Math.pow(sigma - 1.09, Constants.reg3_h1_satLiqS_I[i]) *
      Math.pow(sigma + 0.366e-4, Constants.reg3_h1_satLiqS_J[i]);
  }
  return eta * h_Reducing;
}

//  SR4-04 Equ 4: saturated liquid line, h3a'(s)
export function H3a_sat_liqS(entropy) {
  let h_Reducing = 1700; // kJ/kg
  let s_Reducing = 3.8; // kJ/kg/K

  let sigma = entropy / s_Reducing;

  var eta = 0;
  for (let i = 0; i < Constants.reg3_h3a_satLiqS_I.length; i++) {
    eta +=
      Constants.reg3_h3a_satLiqS_n[i] *
      Math.pow(sigma - 1.09, Constants.reg3_h3a_satLiqS_I[i]) *
      Math.pow(sigma + 0.366e-4, Constants.reg3_h3a_satLiqS_J[i]);
  }
  return eta * h_Reducing;
}

//  SR4-04 Equ 5: saturated vapor line, h2ab"(s)
export function H2ab_sat_VapS(entropy) {
  let h_Reducing = 2800; // kJ/kg
  let s1_Reducing = 5.21; // kJ/kg/K
  let s2_Reducing = 9.2; // kJ/kg/K

  let sigma1 = entropy / s1_Reducing;
  let sigma2 = entropy / s2_Reducing;

  var eta = 0;
  for (let i = 0; i < Constants.reg3_h2ab_satVapS_I.length; i++) {
    eta +=
      Constants.reg3_h2ab_satVapS_n[i] *
      Math.pow(1 / sigma1 - 0.513, Constants.reg3_h2ab_satVapS_I[i]) *
      Math.pow(sigma2 - 0.524, Constants.reg3_h2ab_satVapS_J[i]);
  }
  return Math.exp(eta) * h_Reducing;
}

//  SR4-04 Equ 6: saturated vapor line, h2c3b"(s)
export function H2c3b_sat_VapS(entropy) {
  let h_Reducing = 2800; // kJ/kg
  let s_Reducing = 5.9; // kJ/kg/K

  let sigma = entropy / s_Reducing;

  var eta = 0;
  for (let i = 0; i < Constants.reg3_h2c3b_satVapS_I.length; i++) {
    eta +=
      Constants.reg3_h2c3b_satVapS_n[i] *
      Math.pow(sigma - 1.02, Constants.reg3_h2c3b_satVapS_I[i]) *
      Math.pow(sigma - 0.726, Constants.reg3_h2c3b_satVapS_J[i]);
  }
  return Math.pow(eta, 4) * h_Reducing;
}

//  SR4-04 Equ 7: hb13(s) boundary between Regions 1 and 3
export function Hb13S(entropy) {
  let h_Reducing = 1700; // kJ/kg
  let s_Reducing = 3.8; // kJ/kg/K

  let sigma = entropy / s_Reducing;

  var eta = 0;
  for (let i = 0; i < Constants.reg3_hB13_I.length; i++) {
    eta +=
      Constants.reg3_hB13_n[i] *
      Math.pow(sigma - 0.884, Constants.reg3_hB13_I[i]) *
      Math.pow(sigma - 0.864, Constants.reg3_hB13_J[i]);
  }
  return eta * h_Reducing;
}

//  SR4-04 Equ 8: Tb23(h,s) boundary between Regions 2 and 3
export function Tb23HS(enthalpy, entropy) {
  let T_Reducing = 900; // K
  let h_Reducing = 3000; // kJ/kg
  let s_Reducing = 5.3; // kJ/kg/K

  let eta = enthalpy / h_Reducing;
  let sigma = entropy / s_Reducing;

  var theta = 0;
  for (let i = 0; i < Constants.reg3_TB23HS_I.length; i++) {
    theta +=
      Constants.reg3_TB23HS_n[i] *
      Math.pow(eta - 0.727, Constants.reg3_TB23HS_I[i]) *
      Math.pow(sigma - 0.864, Constants.reg3_TB23HS_J[i]);
  }
  return theta * T_Reducing;
}

//  SR4-04 Equ 9: Tsat(h,s) saturation temperature given an enthalpy and entropy
export function TsatHS(enthalpy, entropy) {
  let T_Reducing = 550; // K
  let h_Reducing = 2800; // kJ/kg
  let s_Reducing = 9.2; // kJ/kg/K

  let eta = enthalpy / h_Reducing;
  let sigma = entropy / s_Reducing;

  var theta = 0;
  for (let i = 0; i < Constants.reg3_TsatHS_I.length; i++) {
    theta +=
      Constants.reg3_TsatHS_n[i] *
      Math.pow(eta - 0.119, Constants.reg3_TsatHS_I[i]) *
      Math.pow(sigma - 1.07, Constants.reg3_TsatHS_J[i]);
  }
  return theta * T_Reducing;
}

// Test functions
export function T3ab(pressure) {
  var T3ab = Reg3SubregAbOpWxBoundary(pressure, Constants.reg3_T3ab_I, Constants.reg3_T3ab_n);
  return T3ab;
}

export function T3op(pressure) {
  var T3op = Reg3SubregAbOpWxBoundary(pressure, Constants.reg3_T3op_I, Constants.reg3_T3op_n);
  return T3op;
}

export function T3ef(pressure) {
  var T3ef = Reg3SubregEfBoundary(pressure);
  return T3ef;
}

export function T3cd(pressure) {
  var T3cd = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3cd_I, Constants.reg3_T3cd_n);
  return T3cd;
}

export function T3gh(pressure) {
  var T3gh = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3gh_I, Constants.reg3_T3gh_n);
  return T3gh;
}

export function T3ij(pressure) {
  var T3ij = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3ij_I, Constants.reg3_T3ij_n);
  return T3ij;
}

export function T3jk(pressure) {
  var T3jk = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3jk_I, Constants.reg3_T3jk_n);
  return T3jk;
}

export function T3mn(pressure) {
  var T3mn = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3mn_I, Constants.reg3_T3mn_n);
  return T3mn;
}

export function T3qu(pressure) {
  var T3qu = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3qu_I, Constants.reg3_T3qu_n);
  return T3qu;
}

export function T3rx(pressure) {
  var T3rx = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3rx_I, Constants.reg3_T3rx_n);
  return T3rx;
}

export function T3uv(pressure) {
  var T3uv = Reg3SubregBoundaryMost(pressure, Constants.reg3_T3uv_I, Constants.reg3_T3uv_n);
  return T3uv;
}

export function T3wx(pressure) {
  var T3wx = Reg3SubregAbOpWxBoundary(pressure, Constants.reg3_T3wx_I, Constants.reg3_T3wx_n);
  return T3wx;
}
