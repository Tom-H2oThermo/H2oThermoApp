import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
import * as Ice from "./Ice.js";
import * as Region3Calculations from "./Region3Calculations.js";

export const T_ref = 647.096; // K Reference Temperature
export const rho_ref = 322.0; // kg/m3 Reference density
export const mu_ref = 1.0e-6; // Pa*s Reference viscosity
export const ViscMaxT = 1173.15; // Maximum temperature at which the viscosity equation is applicable

// Calculates visosity as a function of temperature and volume
// pressure input is used to verify inputs are in the valid range
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

// Viscosity function for regions 1, 2 & 5.
// Calculates mu_0 and mu_1, the first two viscosity terms
// Doesn't check for valid pressure, temperature range
export function ViscR125(temperature, volume) {
  var rho = 1 / volume;
  var rho_dim = rho / rho_ref;
  var T_dim = temperature / T_ref;
  var mu_0 = 0;
  var mu_1 = 0;

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

  return mu_ref * (mu_0 * mu_1); // Pa seconds
}

// Calculates the mu_2 term, the third visosity term, if appropriate
// Otherwise mu_2 is set to a value of 1
// Then calls the mu_0 & mu_1 calc and multiplies them all together
export function Visc_fTV(temperature, volume) {
  // var T_dim = temperature / T_ref;
  var rho_dim = 1 / (volume * rho_ref);
  var rho = 1 / volume;
  var mu_2 = 1;

  // If close to the critical point, then mu_2 is used
  if (temperature > 645.91 && temperature < 650.77 && rho > 245.8 && rho < 405.3) {
    // R12-08 Eq. 13
    const dVdP_T = Region3Calculations.Properties_fVT(volume, temperature)[52]; // See if this changes from the input dVdP_T
    var dVdP_TR = Region3Calculations.Properties_fVT(volume, Constants.TR)[52]; // Properties index [16] is dPdV_T.  Use pressure and T_crit to calculate dVdP_T_crit
    const zeta = -(Constants.pc_H2O / (Constants.RHOc_H2O * Math.pow(volume, 2))) * dVdP_T; // R12-08 Eq21a. The differential reciprocol rule is needed to convert from rho to v, hence the (1/v)^2 term
    var zetaTR = -(Constants.pc_H2O / (Constants.RHOc_H2O * Math.pow(volume, 2))) * dVdP_TR; // / R12-08 Eq21a.  Properties[52] is dv/dp_T

    var delta_chi_dim = rho_dim * (zeta - zetaTR * (Constants.TR / temperature)); // R12-08 Eq. 21
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
      const psi_D = Math.acos(Math.pow(1 + Math.pow(Constants.q_D, 2) * Math.pow(xi, 2), -0.5)); // R12-08 Eq. 17
      const w = Math.pow(Math.abs((Constants.q_C * xi - 1) / (Constants.q_C * xi + 1)), 0.5) * Math.tan(psi_D / 2); // R12-08 Eq. 19
      var L = 0; // R12-08 Eq. 18
      if (Constants.q_C * xi > 1) {
        L = Math.log((1 + w) / (1 - w));
      } else {
        L = 2 * Math.atan(Math.abs(w));
      }
      const Y1 = (1 / 12) * Math.sin(3 * psi_D);
      const Y2 = Math.sin(2 * psi_D) / (4 * Constants.q_C * xi);
      const Y3 = ((1 - (5 / 4) * Math.pow(Constants.q_C * xi, 2)) * Math.sin(psi_D)) / Math.pow(Constants.q_C * xi, 2);
      const Y4 = 1 / Math.pow(Constants.q_C * xi, 3);
      const Y5 = (1 - (3 / 2) * Math.pow(Constants.q_C * xi, 2)) * psi_D;
      const Y6 = Math.pow(Math.abs(Math.pow(Constants.q_C * xi, 2) - 1), 1.5) * L;
      Y = Y1 - Y2 + Y3 - Y4 * (Y5 - Y6); // R12-08 Eq.16
    }

    mu_2 = Math.exp(Constants.x_mi * Y);
  }

  return ViscR125(temperature, volume) * mu_2 * 1e6; // Pa seconds.  mu_ref already included in ViscR125
}
