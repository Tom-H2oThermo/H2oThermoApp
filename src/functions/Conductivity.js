import * as Constants from "./Constants.js";
/*
import * as Errors from "./Errors.js";
import * as Viscosity from "./Viscosity.js";
import * as Ice from "./Ice.js";
*/

//const cond_ref = 1e-3; // W/K*m - R15-11 Eq 4
const mu_ref = 1; // MPa*s Reference viscosity - R15-11 Eq 5
const R = 0.46151805; // kJ/kg K Specific Gas Constant - R15-11 Eq 6
const Lambda = 177.8514; // Critical Region Constant - R15-11 Table 3
const xi0 = 0.13; // nm Table 3 Critical Region Constant correlation length- R15-11 Table 3
const qD = 1 / 0.4; // 1/nm Critical Region Constant reference wave number R15-11 Table 3
const nu = 0.63; // Critical Region Constant- R15-11 Table 3
const Gamma0 = 0.06; // Critical Region Constant- R15-11 Table 3
const gamma = 1.239; // Critical Region Constant- R15-11 Table 3
const T_R = 1.5; // Critical Region Constant- R15-11 Table 3

// Debug function for Thermal Conductivity without the critical enhancement to verify values in R15-11 Tables 4
// Does not check to see if in a valid range because pressure is not an input
export function CondTest_WO_crit_enh(temperature, volume) {
  const T_dim = temperature / Constants.Tc_H2O;
  const rho_dim = 1 / (volume * Constants.RHOc_H2O);
  var lambda_0 = 0;
  for (let k = 0; k < 5; k++) {
    // R15-11 Eq 16
    lambda_0 += Constants.cond_Lk[k] / Math.pow(T_dim, k);
  }
  lambda_0 = Math.sqrt(T_dim) / lambda_0;

  var lambda_1 = 0;
  for (let i = 0; i < 5; i++) {
    var L_sum = 0;
    for (let j = 0; j < 6; j++) {
      L_sum += Constants.cond_Lij[i][j] * Math.pow(rho_dim - 1, j);
    }
    lambda_1 += Math.pow(1 / T_dim - 1, i) * L_sum;
  }
  lambda_1 = Math.exp(rho_dim * lambda_1);

  return lambda_0 * lambda_1;
}

// Conductivity with the Critical Enhancement of R15-11 section 2.7
export function CondTest_With_crit_enh(
  temperature,
  volume,
  pressure,
  viscosity,
  isobaricHeat,
  isochoricHeat,
  dVdP_T,
  dVdP_TR
) {
  const T_dim = temperature / Constants.Tc_H2O; // R15-11 eq 7
  const rho_dim = 1 / (volume * Constants.RHOc_H2O); // R15-11 eq 9
  const mu_dim = viscosity / mu_ref; // R15-11 eq 11
  const heat_cap_ratio = isobaricHeat / isochoricHeat; // R15-11 Eq. 13
  const dRhoDp_T = (-(Constants.pc_H2O / Constants.RHOc_H2O) * dVdP_T) / Math.pow(volume, 2); // Conversion from dv_dp to dRho_dp.  Uses the derivative reciprocal rule.
  const dRhoDp_TR = (-(Constants.pc_H2O / Constants.RHOc_H2O) * dVdP_TR) / Math.pow(volume, 2); // Conversion from dv_dp to dRho_dp.
  var cp_rel = isobaricHeat / R; // cp relative R15-11 Eq. 12
  if (cp_rel < 0 || cp_rel > 1e13) {
    // If negative or greater than 10^13, then it set it to 10^13.  See IAPWS R15-11 note on bottom of page 12
    cp_rel = 1e13;
  }

  var zeta1 = (dRhoDp_T * Constants.pc_H2O) / Constants.RHOc_H2O; // R15-11 Eq. 24 given actual process input values
  if (zeta1 < 0 || zeta1 > 1e13) {
    // If negative or greater than 10^13, then it set it to 10^13.  See IAPWS R15-11 note on bottom of page 12
    zeta1 = 1e13;
  }

  var zeta2 = (dRhoDp_TR * Constants.pc_H2O) / Constants.RHOc_H2O; // R15-11 Eq. 24 given actual process input values

  /*
  var j = 0;
  if (rho_dim <= 0.310559006) {
    j = 0;
  }
  if (rho_dim > 0.310559006 && rho_dim <= 0.776397516) {
    j = 1;
  }
  if (rho_dim > 0.776397516 && rho_dim <= 1.242236025) {
    j = 2;
  }
  if (rho_dim > 1.242236025 && rho_dim <= 1.863354037) {
    j = 3;
  }
  if (rho_dim > 1.863354037) {
    j = 4;
  }
  var zeta2 = 0;
  var cond_Aij = 0;
  var MathPow_rho_dim_i = 0;
  for (let i = 0; i < 6; i++) {
    cond_Aij = Constants.cond_Aij[i][j];
    MathPow_rho_dim_i = Math.pow(rho_dim, i);
    zeta2 += cond_Aij * MathPow_rho_dim_i;
  }
  zeta2 = 1 / zeta2;
*/

  // R15-11 Eq. 24 given actual process input values Constants.cond_Aij
  if (zeta2 < 0 || zeta2 > 1e13) {
    // If negative or greater than 10^13, then it set it to 10^13.  See IAPWS R15-11 note on bottom of page 12
    zeta2 = 1e13;
  }

  var chi = rho_dim * (zeta1 - zeta2 * (T_R / T_dim)); // R15 eq 23
  if (chi < 0) {
    // refer to comment at the top of page 8 in IAPWS R15-11
    chi = 0;
  }

  var xi = xi0 * Math.pow(chi / Gamma0, nu / gamma); // R15 eq 22
  if (xi < 0 || xi > 1e13) {
    // see footnote 2 on IAPWS R15-11 page 12
    xi = 1e13;
  }

  const y = xi * qD; // R15 eq 20

  var Zy = 0;
  if (y >= 1.2e-7) {
    Zy =
      (2 / (Math.PI * y)) *
      ((1 - 1 / heat_cap_ratio) * Math.atan(y) +
        (1 / heat_cap_ratio) * y -
        (1 - Math.exp(-1 / (1 / y + Math.pow(y, 2) / (3 * Math.pow(rho_dim, 2)))))); // R15 eq 19
  }

  const lambda_2 = (Zy * Lambda * rho_dim * cp_rel * T_dim) / mu_dim; // R15 eq 18
  const Lambda_01 = CondTest_WO_crit_enh(temperature, volume);
  return Lambda_01 + lambda_2; // R15 eq 17
}
