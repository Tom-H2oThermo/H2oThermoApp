import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
import * as Ice from "./Ice.js";
import * as Region3Calculations from "./Region3Calculations.js";

export const T_ref = 647.096; // K Reference Temperature
export const rho_ref = 322.0; // kg/m3 Reference density
export const mu_ref = 1.0e-6; // Pa*s Reference viscosity
export const ViscMaxT = 1173.15; // Maximum temperature at which the viscosity equation is applicable

export function Visc(temperature, volume, pressure) {
  try {
    if (
      (pressure > 0 && pressure <= 101 && temperature >= Constants.Ttriple - 1e-6 && temperature <= ViscMaxT) || // Pressure range from 0 to 101 MPa with temperature from the triple point to a max of 1173.15 K.  Note: Doesn't cover region below P Triple for temperature less than T Triple (down to sublimation line)
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
      return Visc_fTV(temperature, volume);
    }
    throw Errors.TemperatureOrPressureNotValid;
  } catch (e) {
    return e;
  }
}

export function ViscR125(temperature, volume) {
  // Covers 0 < pressure<= 300 MPa and Temperature < 1173.15K and (Temp > Tmelt (if greater than p triple) or Temp > 273.16 (if less than p triple))
  // Currently doesn't include the mu_2 critical enhancement term which only applies near the critical point and requires (drho/dp)T
  // ToDo, consider adding critical enhancement  term in the future
  var rho = 1 / volume;
  var rho_dim = rho / rho_ref;
  var T_dim = temperature / T_ref;
  var mu_0 = 0;
  var mu_1 = 0;
  var mu_2 = 1;

  for (let i = 0; i < 4; i++) {
    mu_0 += Constants.visc_Hi[i] / Math.pow(T_dim, i);
  }
  mu_0 = (100 * Math.sqrt(T_dim)) / mu_0;

  for (let i = 0; i < 6; i++) {
    var H_sum = 0;
    for (let j = 0; j < 7; j++) {
      H_sum += Constants.visc_Hij[i][j] * Math.pow(rho_dim - 1, j);
    }
    mu_1 += Math.pow(1 / T_dim - 1, i) * H_sum;
  }
  mu_1 = Math.exp(rho_dim * mu_1);

  return mu_ref * (mu_0 * mu_1 * mu_2); // Pa seconds
}

export function Visc_fTV(temperature, volume) {
  // Covers 0 < pressure<= 300 MPa and Temperature < 1173.15K and (Temp > Tmelt (if greater than p triple) or Temp > 273.16 (if less than p triple))
  // Currently doesn't include the mu_2 critical enhancement term which only applies near the critical point and requires (drho/dp)T
  // ToDo, consider adding critical enhancement  term in the future
  var T_dim = temperature / T_ref;
  var rho_dim = 1 / (volume * rho_ref);
  var rho = 1 / volume;
  var mu_2 = 1;

  // If close to the critical point, then mu_2 is used
  if (temperature > 645.91 && temperature < 650.77 && rho > 245.8 && rho < 405.3) {
    const pressure = Region3Calculations.Properties_fVT(volume, temperature)[0];
    const volume_T_crit = Region3Calculations.Volume_fPT(pressure, Constants.Tc_H2O); // use pressure and T_crit to calculate volume_T_crit
    const dVdP_T = Region3Calculations.Properties_fVT(volume, temperature)[52]; // See if this changes from the input dVdP_T
    const dVdP_T_crit = Region3Calculations.Properties_fVT(volume_T_crit, Constants.Tc_H2O)[52]; // Properties index [16] is dPdV_T.  Use pressure and T_crit to calculate dVdP_T_crit
    const zeta = -(Constants.pc_H2O / (Constants.RHOc_H2O * Math.pow(volume, 2))) * dVdP_T; // R12-08 Eq21a. The differential reciprocol rule is needed to convert from rho to v, hence the (1/v)^2 term
    const zetaTr = -(Constants.pc_H2O / (Constants.RHOc_H2O * Math.pow(volume_T_crit, 2))) * dVdP_T_crit; // / R12-08 Eq21a.  Properties[52] is dv/dp_T
    var delta_chi_dim = rho_dim * (zeta - zetaTr * (Constants.T_R / T_dim)); // R12-08 Eq. 21
    if (delta_chi_dim < 0) {
      delta_chi_dim = 0;
    }
    const xi = Constants.xi_0 * Math.pow(delta_chi_dim / Constants.Gamma_0, Constants.ni / Constants.gamma); // R12-08 Eq. 20
    var Y = 0;
    if (xi >= 0 && xi <= 0.3817016416) {
      // R12-08 Eq. 13
      Y =
        (1 / 5) *
        Constants.q_C *
        xi *
        Math.pow(Constants.q_D * xi, 5) *
        (1 - Constants.q_C * xi + Math.pow(Constants.q_C * xi, 2) - (765 / 504) * Math.pow(Constants.q_D * xi, 2)); // R12-08 Eq. 15
    } else {
      var psi_D = Math.acos(Math.pow(1 + Math.pow(Constants.q_D * xi, 2), -0.5)); // R12-08 Eq. 17
      var w = Math.sqrt(Math.abs((Constants.q_C * xi - 1) / (Constants.q_C * xi + 1))) * Math.tan(psi_D / 2);
      var L = 0;
      if (Constants.q_C * xi > 1) {
        L = Math.log((1 + w) / (1 - w));
      } else {
        L = 2 * Math.atan(Math.abs(w));
      }
      var Y1 = (1 / 12) * Math.sin(3 * psi_D);
      var Y2 = Math.sin(2 * psi_D) / (4 * Constants.q_C * xi);
      var Y3 = Math.pow(Constants.q_C * xi, -2) * (1 - (5 / 4) * Math.pow(Constants.q_C * xi, 2)) * Math.sin(psi_D);
      var Y4 = Math.pow(Constants.q_C * xi, -3);
      var Y5 = (1 - (3 / 2) * Math.pow(Constants.q_C * xi, 2)) * psi_D;
      var Y6 = Math.pow(Math.abs(Math.pow(Constants.q_C * xi, 2) - 1), 1.5);
      Y = Y1 - Y2 + Y3 - Y4 * (Y5 - Y6) * L; // R12-08 Eq.16
    }
    mu_2 = Math.exp(Constants.x_mi * Y);
  }

  return mu_ref * (ViscR125(temperature, volume) * mu_2) * 1e6; // Pa seconds
}
