import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
import * as Viscosity from "./Viscosity.js";
import * as Ice from "./Ice.js";

const T_ref = 647.096; // K Reference (critical) Temperature - R15-11 Eq 1
const p_ref = 22.064; // MPa Referene (critical) pressure - R15-11 Eq 2
const rho_ref = 322.0; // kg/m3 Reference (critical) density - R15-11 Eq 3
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

export function CondR3(temperature, volume, dVdP_T, dVdP_T_crit, pressure, viscosity, isobaricHeat, isochoricHeat) {
  if (
    (pressure > 0 && pressure <= 101 && temperature >= Constants.Ttriple - 1e-6 && temperature <= Viscosity.ViscMaxT) || // Pressure range from 0 to 101 MPa with temperature from the triple point to a max of 1173.15 K.  Note: Doesn't cover region below P Triple for temperature less than T Triple (down to sublimation line)
    (temperature <= Constants.Ttriple &&
      temperature >= Ice.MeltTemp100MPa &&
      pressure >= Constants.pTriple &&
      pressure <= 101 &&
      pressure >= Ice.PressMeltIceIh(temperature)) || // (Temperature range between T triple and 100 MPa melting temperature) and (pressure between 100 MPa and  P triple) with pressures greater than the melting pressure.  Note. T melt decreases with increasing pressure above the triple point
    (temperature <= Constants.Ttriple &&
      temperature >= 250 &&
      pressure <= Constants.pTriple &&
      pressure > 0 &&
      pressure <= Ice.PressSublIceIh(temperature)) || // for low pressures below P Triple 611 Pascals, for pressures less than the sublimation curve (gases).  Valid down to about 250K per R12 section 2.4 first bullet note
    (temperature <= Constants.Ttriple &&
      temperature >= Constants.Tmin &&
      pressure > 0 &&
      pressure <= ((temperature - Constants.Tmin) * (Constants.pTriple - Constants.pT0)) / 0.1 + Constants.pT0)
  ) {
    const T_dim = temperature / T_ref;
    const rho_dim = 1 / (volume * rho_ref);
    const mu_dim = viscosity / mu_ref;

    var lambda_0 = 0;
    for (let k = 0; k < 5; k++) {
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

    // The following calculates the Critical Enhancement of R15-11 section 2.7
    var cp_rel = isobaricHeat / R; // cp relative R15-11 Eq. 12
    const heat_cap_ratio = isobaricHeat / isochoricHeat; // cp relative R15-11 Eq. 13
    if (cp_rel < 0 || cp_rel > 1e13) {
      // If negative or greater than 10^13, then it set it to 10^13.  See IAPWS R15-11 note on bottom of page 12
      cp_rel = 1e13;
    }
    const dRhoDp_T = (-(p_ref / rho_ref) * dVdP_T) / Math.pow(volume, 2); // Conversion from dv_dp to dRho_dp.  Uses the derivative reciprocal rule.
    const dRhoDp_T_crit = (-(p_ref / rho_ref) * dVdP_T_crit) / Math.pow(volume, 2); // Conversion from dv_dp to dRho_dp.  Uses the derivative reciprocal rule.
    const zeta1 = (dRhoDp_T * p_ref) / rho_ref; // R15-11 Eq. 12 given actual process input values
    const zeta2 = (dRhoDp_T_crit * p_ref) / rho_ref; // R15-11 Eq. 12 given actual process input values
    /* var l = 0; // for some reason VS doesn't like it if I use j here, so I'm using l instead
    if (rho_dim <= 0.310559006) {
      l = 0;
    } else if (rho_dim <= 0.776397516) {
      l = 1;
    } else if (rho_dim <= 1.242236025) {
      l = 2;
    } else if (rho_dim <= 1.863354037) {
      l = 3;
    } else {
      l = 4;
    }
    var zeta2 = 0; // R15 eq 25
    for (
      let i = 0;
      i < 6;
      i++ // IAPWS R15-11 eq 25
    ) {
      zeta2 += Constants.cond_Aij[i][l] * Math.pow(rho_dim, i);
    }
    zeta2 = 1 / zeta2; */

    //const dRho_dp_TR = zeta2 / (p_ref / rho_ref); // Just used for program verification in IAPWS R15 Tables 7, 8 & 9

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

    return (lambda_0 * lambda_1 + lambda_2) / 1000; // R15 eq 17
  } else throw Errors.TemperatureOrPressureNotValid;
}

// Debug function for Thermal Conductivity without the critical enhancement to verify values in R15-11 Tables 4&5
export function Cond(temperature, volume, pressure) {
  if (
    (pressure > 0 && pressure <= 101 && temperature >= Constants.Ttriple - 1e-6 && temperature <= Viscosity.ViscMaxT) || // Pressure range from 0 to 101 MPa with temperature from the triple point to a max of 1173.15 K.  Note: Doesn't cover region below P Triple for temperature less than T Triple (down to sublimation line)
    (temperature <= Constants.Ttriple &&
      temperature >= Ice.MeltTemp100MPa &&
      pressure >= Constants.pTriple &&
      pressure <= 101 &&
      pressure >= Ice.PressMeltIceIh(temperature)) || // (Temperature range between T triple and 100 MPa melting temperature) and (pressure between 100 MPa and  P triple) with pressures greater than the melting pressure.  Note. T melt decreases with increasing pressure above the triple point
    (temperature <= Constants.Ttriple &&
      temperature >= 250 &&
      pressure <= Constants.pTriple &&
      pressure > 0 &&
      pressure <= Ice.PressSublIceIh(temperature)) || // for low pressures below P Triple 611 Pascals, for pressures less than the sublimation curve (gases).  Valid down to about 250K per R12 section 2.4 first bullet note
    (temperature <= Constants.Ttriple &&
      temperature >= Constants.Tmin &&
      pressure > 0 &&
      pressure <= ((temperature - Constants.Tmin) * (Constants.pTriple - Constants.pT0)) / 0.1 + Constants.pT0)
  ) {
    // For temperature range between 273.15 and 273.16 K.
    const T_dim = temperature / T_ref;
    const rho_dim = 1 / (volume * rho_ref);

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
  } else throw Errors.TemperatureOrPressureNotValid;
}
