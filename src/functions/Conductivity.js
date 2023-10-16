import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";

//const cond_ref = 1e-3; // W/K*m - R15-11 Eq 4
const mu_ref = 1; // Pa*s Reference viscosity - R15-11 Eq 5
const R = 0.46151805; // kJ/kg K Specific Gas Constant - R15-11 Eq 6
const Lambda = 177.8514; // Critical Region Constant - R15-11 Table 3
const xi0 = 0.13; // nm Table 3 Critical Region Constant correlation length- R15-11 Table 3
const qD = 1 / 0.4; // 1/nm Critical Region Constant reference wave number R15-11 Table 3
const nu = 0.63; // Critical Region Constant- R15-11 Table 3
const Gamma0 = 0.06; // Critical Region Constant- R15-11 Table 3
const gamma = 1.239; // Critical Region Constant- R15-11 Table 3
const T_R = 1.5; // Critical Region Constant- R15-11 Table 3

export function Cond(temperature, volume, pressure, visc, Cp, Cv, dVdP_T) {
  try {
    if (
      (pressure > 0 &&
        pressure < Constants.pTriple &&
        temperature >= Constants.Ttriple &&
        temperature <= Constants.T_Cond_Max) || // Pressure range from 0 to 101 MPa with temperature from the triple point to a max of 1173.15 K.  Note: Doesn't cover region below P Triple for temperature less than T Triple (down to sublimation line)
      (pressure >= Constants.pTriple &&
        pressure <= Constants.pmax &&
        temperature >= Constants.Ttriple &&
        temperature <= Constants.T_Cond_Max)
    ) {
      return Cond_With_crit_enh(temperature, volume, pressure, visc, Cp, Cv, dVdP_T);
    }
    throw Errors.TemperatureOrPressureNotValid;
  } catch (e) {
    return e;
  }
}

// Debug function for Thermal Conductivity without the critical enhancement to verify values in R15-11 Tables 4
// Does not check to see if in a valid range because pressure is not an input
export function Cond_WO_crit_enh(temperature, volume) {
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
export function Cond_With_crit_enh(
  temperature,
  volume,
  pressure,
  viscosity,
  isobaricHeat,
  isochoricHeat,
  dVdP_T
  //dVdP_TR
) {
  const T_dim = temperature / Constants.Tc_H2O; // R15-11 eq 7
  const rho_dim = 1 / (volume * Constants.RHOc_H2O); // R15-11 eq 9
  const mu_dim = viscosity / mu_ref; // R15-11 eq 11
  const heat_cap_ratio = isobaricHeat / isochoricHeat; // R15-11 Eq. 13

  var zetaTR = 0;
  // the ranges in the if statements below are from R15-11 Eq. 26
  var j = 0;
  if (rho_dim > 0 && rho_dim <= 0.310559006) {
    j = 0;
  } else if (rho_dim > 0.310559006 && rho_dim <= 0.776397516) {
    j = 1;
  } else if (rho_dim > 0.776397516 && rho_dim <= 1.242236025) {
    j = 2;
  } else if (rho_dim > 1.242236025 && rho_dim <= 1.863354037) {
    j = 3;
  } else if (rho_dim > 1.863354037) {
    j = 4;
  } else {
    j = NaN;
  }
  var Aij = 0;
  for (let i = 0; i < 6; i++) {
    Aij = Constants.cond_Aij[i][j];
    zetaTR += Aij * Math.pow(rho_dim, i);
  }
  zetaTR = 1 / zetaTR;

  const dRhoDp_T = -dVdP_T / Math.pow(volume, 2); // Conversion from dv_dp to dRho_dp.  Uses the derivative reciprocal rule.
  // const dRhoDp_TR = -dVdP_TR / Math.pow(volume, 2);
  // const dRhoDp_TR = zetaTR * (Constants.Tc_H2O / Constants.RHOc_H2O); // Conversion from dv_dp to dRho_dp.
  var cp_rel = isobaricHeat / R; // cp relative R15-11 Eq. 12
  if (cp_rel < 0 || cp_rel > 1e13) {
    // If negative or greater than 10^13, then it set it to 10^13.  See IAPWS R15-11 note on bottom of page 12
    cp_rel = 1e13;
  }

  var zeta = dRhoDp_T * (Constants.pc_H2O / Constants.RHOc_H2O); // R15-11 Eq. 24
  if (zeta < 0 || zeta > 1e13) {
    // If negative or greater than 10^13, then it set it to 10^13. IAPWS R15-11 note on bottom of page 12
    zeta = 1e13;
  }

  // var zeta2 = dRhoDp_TR * (Constants.pc_H2O / Constants.RHOc_H2O); // R15-11 Eq. 24

  // If zeta is negative or greater than 10^13, then it set it to 10^13
  // See IAPWS R15-11 note on bottom of page 12
  // var zetaTR = dRhoDp_TR * (Constants.pc_H2O / Constants.RHOc_H2O); // R15-11 Eq. 24
  if (zetaTR < 0 || zetaTR > 1e13) {
    zetaTR = 1e13;
  }

  // IAPWS R15-11 eq 23
  var chi = rho_dim * (zeta - zetaTR * (T_R / T_dim));
  // refer to comment at the top of page 8 in IAPWS R15-11
  if (chi < 0) {
    chi = 0;
  }

  // R15 eq 22
  var xi = xi0 * Math.pow(chi / Gamma0, nu / gamma);

  const y = xi * qD; // R15 eq 20

  // R15 eq 19 & eq 21
  var Zy = 0;
  if (y >= 1.2e-7) {
    Zy =
      (2 / (Math.PI * y)) *
      ((1 - 1 / heat_cap_ratio) * Math.atan(y) +
        (1 / heat_cap_ratio) * y -
        (1 - Math.exp(-1 / (1 / y + Math.pow(y, 2) / (3 * Math.pow(rho_dim, 2))))));
  }

  // R15 eq 18
  const lambda_2_temp = Zy * Lambda * rho_dim * cp_rel * T_dim;
  const lambda_2 = lambda_2_temp / mu_dim;

  const Lambda_01 = Cond_WO_crit_enh(temperature, volume);

  // R15 eq 17
  return Lambda_01 + lambda_2;
}
