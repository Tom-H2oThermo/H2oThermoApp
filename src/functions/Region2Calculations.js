import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
// import * as Conductivity from "./Conductivity.js";
// import * as Viscosity from "./Viscosity.js";
import * as Region4Calculations from "./Region4Calculations.js";
import * as Region4SatPressure from "./Region4SatPressure.js";
import * as Boundary2_3 from "./Boundary2_3Calculations.js";

const R = Constants.R_H2O * 1000; // convert kJ to Joules

const p_Reducing = 1; // MPa
const T_reducing = 540; // K

export function Properties_fPT(pressure, temperature, metastable = false) {
  var tWilson = Constants.Tc_H2O; // metastable 5% equilibrium moisture temperature versus pressure.  I initate it to a high value so the metastable "if" logic test won't kick in unless TWilson has been calculated in the acceptable range
  if (
    metastable &&
    pressure >= Constants.pTriple &&
    pressure <= 10 &&
    temperature <= Region4Calculations.SatTemperature(pressure)
  ) {
    tWilson =
      209.07214 -
      126.05204 * pressure +
      42.768349 * Math.pow(pressure, 1.5) -
      5.2499952 * Math.pow(pressure, 2) +
      235.98605 * Math.sqrt(pressure);
  }

  if (
    (temperature >= Constants.Tmin &&
      temperature < Constants.Ttriple &&
      pressure > 0 &&
      pressure <= ((temperature - Constants.Tmin) / 0.1) * (Constants.pTriple - Constants.pT0) + Constants.pT0) || // Low temperatures between 273.15 and 273.16 K
    (temperature >= Constants.Ttriple &&
      temperature <= Constants.T13_boundary &&
      pressure > 0 &&
      pressure <= Region4SatPressure.SatPressure(temperature) + 1e-11) ||
    (temperature > Constants.T13_boundary &&
      temperature <= Constants.T23_100MPa &&
      pressure > 0 &&
      pressure <= Boundary2_3.reg23BoundaryPfT(temperature)) ||
    (temperature > Constants.T23_100MPa &&
      temperature <= Constants.T25_boundary &&
      pressure > 0 &&
      pressure <= Constants.pmax) ||
    (metastable &&
      pressure >= Constants.pTriple &&
      pressure <= 10 &&
      temperature <= Region4Calculations.SatTemperature(pressure) &&
      temperature >= tWilson)
  ) {
    // The following line is the 5% quality temperature, below the saturation line, based upon the 5% moisture enthalpy h(p)
    var p = pressure * 1e6; // convert MPa to pascalsT

    var pi = pressure / p_Reducing; // Reduced Pressure
    var tau = T_reducing / temperature; // Reduced Temperature

    var gamma_0 = Math.log(pi); // Gibbs free energy
    var gamma_0_pi = 1 / pi;
    var gamma_0_tau = 0;
    //var gamma_0_pi_pi = -1 / Math.pow(pi, 2);
    var gamma_0_tau_tau = 0;
    //var gamma_0_pi_tau = 0;

    var gamma_r = 0; // Gibbs free energy
    var gamma_r_pi = 0;
    var gamma_r_tau = 0;
    var gamma_r_pi_pi = 0;
    var gamma_r_tau_tau = 0;
    var gamma_r_pi_tau = 0;

    var gibbIdeal_n = [];
    var gibbRes_I = [];
    var gibbRes_J = [];
    var gibbRes_n = [];

    // if metastable function conditions met
    if (
      metastable &&
      pressure >= Constants.pTriple &&
      pressure <= 10 &&
      temperature <= Region4Calculations.SatTemperature(pressure)
    ) {
      gibbIdeal_n = Constants.reg2_Gibb_Ideal_na;
      gibbRes_I = Constants.reg2_MSV_Gibb_Res_I;
      gibbRes_J = Constants.reg2_MSV_Gibb_Res_J;
      gibbRes_n = Constants.reg2_MSV_Gibb_Res_n;
    } else {
      gibbIdeal_n = Constants.reg2_Gibb_Ideal_n;
      gibbRes_I = Constants.reg2_Gibb_Res_I;
      gibbRes_J = Constants.reg2_Gibb_Res_J;
      gibbRes_n = Constants.reg2_Gibb_Res_n;
    }

    var i = 0;
    for (
      i = 0;
      i < gibbIdeal_n.length;
      i++ //R7-97 Table 13
    ) {
      gamma_0 += gibbIdeal_n[i] * Math.pow(tau, Constants.reg2_Gibb_Ideal_J[i]);
      gamma_0_tau +=
        gibbIdeal_n[i] * Constants.reg2_Gibb_Ideal_J[i] * Math.pow(tau, Constants.reg2_Gibb_Ideal_J[i] - 1);
      gamma_0_tau_tau +=
        gibbIdeal_n[i] *
        Constants.reg2_Gibb_Ideal_J[i] *
        (Constants.reg2_Gibb_Ideal_J[i] - 1) *
        Math.pow(tau, Constants.reg2_Gibb_Ideal_J[i] - 2);
    }

    for (i = 0; i < gibbRes_n.length; i++) {
      gamma_r += gibbRes_n[i] * Math.pow(pi, gibbRes_I[i]) * Math.pow(tau - 0.5, gibbRes_J[i]);
      gamma_r_pi += gibbRes_n[i] * gibbRes_I[i] * Math.pow(pi, gibbRes_I[i] - 1) * Math.pow(tau - 0.5, gibbRes_J[i]);
      gamma_r_tau += gibbRes_n[i] * Math.pow(pi, gibbRes_I[i]) * gibbRes_J[i] * Math.pow(tau - 0.5, gibbRes_J[i] - 1);
      gamma_r_pi_pi +=
        gibbRes_n[i] *
        gibbRes_I[i] *
        (gibbRes_I[i] - 1) *
        Math.pow(pi, gibbRes_I[i] - 2) *
        Math.pow(tau - 0.5, gibbRes_J[i]);
      gamma_r_tau_tau +=
        gibbRes_n[i] *
        Math.pow(pi, gibbRes_I[i]) *
        gibbRes_J[i] *
        (gibbRes_J[i] - 1) *
        Math.pow(tau - 0.5, gibbRes_J[i] - 2);
      gamma_r_pi_tau +=
        gibbRes_n[i] *
        gibbRes_I[i] *
        Math.pow(pi, gibbRes_I[i] - 1) *
        gibbRes_J[i] *
        Math.pow(tau - 0.5, gibbRes_J[i] - 1);
    }

    var Volume = (R * temperature * pi * (gamma_0_pi + gamma_r_pi)) / p;
    var InternalEnergy =
      (R / 1000) * temperature * (tau * (gamma_0_tau + gamma_r_tau) - pi * (gamma_0_pi + gamma_r_pi));
    var Entropy = (R / 1000) * (tau * (gamma_0_tau + gamma_r_tau) - (gamma_0 + gamma_r));
    var Enthalpy = (R / 1000) * temperature * tau * (gamma_0_tau + gamma_r_tau);
    var IsobaricHeat = -(R / 1000) * Math.pow(tau, 2) * (gamma_0_tau_tau + gamma_r_tau_tau);
    // TODO: Was defined but not used... var IsobaricHeat_G = -R * Math.pow(tau, 2) * (gamma_0_tau_tau + gamma_r_tau_tau);
    var IsochoricHeat =
      (R / 1000) *
      (-Math.pow(tau, 2) * (gamma_0_tau_tau + gamma_r_tau_tau) -
        Math.pow(1 + pi * gamma_r_pi - tau * pi * gamma_r_pi_tau, 2) / (1 - Math.pow(pi, 2) * gamma_r_pi_pi));
    var SpeedOfSound = Math.sqrt(
      (R * temperature * (1 + 2 * pi * gamma_r_pi + Math.pow(pi * gamma_r_pi, 2))) /
        (1 -
          Math.pow(pi, 2) * gamma_r_pi_pi +
          Math.pow(1 + pi * gamma_r_pi - tau * pi * gamma_r_pi_tau, 2) /
            (Math.pow(tau, 2) * (gamma_0_tau_tau + gamma_r_tau_tau)))
    );
    var visc = NaN; //Viscosity.Visc(temperature, Volume, pressure);

    var ThermConductivity = NaN; //Conductivity.Cond(temperature, Volume, pressure);

    // Equations below calculate the various properties partial derivatives.  The derivate functions below the first group use IAPWS AN3-07 (2018) Equation 5
    var alpha_v = (1 / temperature) * ((1 + pi * gamma_r_pi - tau * pi * gamma_r_pi_tau) / (1 + pi * gamma_r_pi)); // IAPWS AN3-07 (2018) Eq 7
    var kappa_T = ((1 / pressure) * (1 - Math.pow(pi, 2) * gamma_r_pi_pi)) / (1 + pi * gamma_r_pi); // IAPWS AN3-07 (2018) Eq 7
    var dPdT_P = 0; // IAPWS AN3-07 (2018) Table 2
    var dTdT_P = 1; // IAPWS AN3-07 (2018) Table 2
    var dVdT_P = Volume * alpha_v; // Array Index 56: IAPWS AN3-07 (2018) Table 2
    var dUdT_P = IsobaricHeat - pressure * 1000 * Volume * alpha_v; // Array Index 76: IAPWS AN3-07 (2018) Table 2
    var dHdT_P = IsobaricHeat; // Array Index 96: IAPWS AN3-07 (2018) Table 2
    var dSdT_P = IsobaricHeat / temperature; // Array Index 116: IAPWS AN3-07 (2018) Table 2
    var dPdP_T = 1; // IAPWS AN3-07 (2018) Table 2
    var dTdP_T = 0; // IAPWS AN3-07 (2018) Table 2
    var dVdP_T = -Volume * kappa_T; // Array Index 52: IAPWS AN3-07 (2018) Table 2
    var dUdP_T = 1000 * Volume * (pressure * kappa_T - temperature * alpha_v); // Array Index 72: IAPWS AN3-07 (2018) Table 2
    var dHdP_T = 1000 * Volume * (1 - temperature * alpha_v); // Array Index 92: IAPWS AN3-07 (2018) Table 2
    var dSdP_T = -1000 * Volume * alpha_v; // Array Index 112: IAPWS AN3-07 (2018) Table 2

    // The following five groups provide the partial derivatives of pressure.  Refer to IAPWS AN3-07 (2018) Equation 5
    var dPdT_V = (dPdP_T * dVdT_P - dPdT_P * dVdP_T) / (dTdP_T * dVdT_P - dTdT_P * dVdP_T); // Array Index 12
    var dPdT_U = (dPdP_T * dUdT_P - dPdT_P * dUdP_T) / (dTdP_T * dUdT_P - dTdT_P * dUdP_T); // Array Index 13
    var dPdT_H = (dPdP_T * dHdT_P - dPdT_P * dHdP_T) / (dTdP_T * dHdT_P - dTdT_P * dHdP_T); // Array Index 14
    var dPdT_S = (dPdP_T * dSdT_P - dPdT_P * dSdP_T) / (dTdP_T * dSdT_P - dTdT_P * dSdP_T); // Array Index 15

    var dPdV_T = (dPdP_T * dTdT_P - dPdT_P * dTdP_T) / (dVdP_T * dTdT_P - dVdT_P * dTdP_T); // Array Index 16
    var dPdV_U = (dPdP_T * dUdT_P - dPdT_P * dUdP_T) / (dVdP_T * dUdT_P - dVdT_P * dUdP_T); // Array Index 17
    var dPdV_H = (dPdP_T * dHdT_P - dPdT_P * dHdP_T) / (dVdP_T * dHdT_P - dVdT_P * dHdP_T); // Array Index 18
    var dPdV_S = (dPdP_T * dSdT_P - dPdT_P * dSdP_T) / (dVdP_T * dSdT_P - dVdT_P * dSdP_T); // Array Index 19

    var dPdU_T = (dPdP_T * dTdT_P - dPdT_P * dTdP_T) / (dUdP_T * dTdT_P - dUdT_P * dTdP_T); // Array Index 20
    var dPdU_V = (dPdP_T * dVdT_P - dPdT_P * dVdP_T) / (dUdP_T * dVdT_P - dUdT_P * dVdP_T); // Array Index 21
    var dPdU_H = (dPdP_T * dHdT_P - dPdT_P * dHdP_T) / (dUdP_T * dHdT_P - dUdT_P * dHdP_T); // Array Index 22
    var dPdU_S = (dPdP_T * dSdT_P - dPdT_P * dSdP_T) / (dUdP_T * dSdT_P - dUdT_P * dSdP_T); // Array Index 23

    var dPdH_T = (dPdP_T * dTdT_P - dPdT_P * dTdP_T) / (dHdP_T * dTdT_P - dHdT_P * dTdP_T); // Array Index 24
    var dPdH_V = (dPdP_T * dVdT_P - dPdT_P * dVdP_T) / (dHdP_T * dVdT_P - dHdT_P * dVdP_T); // Array Index 25
    var dPdH_U = (dPdP_T * dUdT_P - dPdT_P * dUdP_T) / (dHdP_T * dUdT_P - dHdT_P * dUdP_T); // Array Index 26
    var dPdH_S = (dPdP_T * dSdT_P - dPdT_P * dSdP_T) / (dHdP_T * dSdT_P - dHdT_P * dSdP_T); // Array Index 27

    var dPdS_T = (dPdP_T * dTdT_P - dPdT_P * dTdP_T) / (dSdP_T * dTdT_P - dSdT_P * dTdP_T); // Array Index 28
    var dPdS_V = (dPdP_T * dVdT_P - dPdT_P * dVdP_T) / (dSdP_T * dVdT_P - dSdT_P * dVdP_T); // Array Index 29
    var dPdS_U = (dPdP_T * dUdT_P - dPdT_P * dUdP_T) / (dSdP_T * dUdT_P - dSdT_P * dUdP_T); // Array Index 30
    var dPdS_H = (dPdP_T * dHdT_P - dPdT_P * dHdP_T) / (dSdP_T * dHdT_P - dSdT_P * dHdP_T); // Array Index 31

    // The following five groups provide the partial derivatives of temperature.  Refer to IAPWS AN3-07 (2018) Equation 5
    var dTdP_V = (dTdP_T * dVdT_P - dTdT_P * dVdP_T) / (dPdP_T * dVdT_P - dPdT_P * dVdP_T); // Array Index 32
    var dTdP_U = (dTdP_T * dUdT_P - dTdT_P * dUdP_T) / (dPdP_T * dUdT_P - dPdT_P * dUdP_T); // Array Index 33
    var dTdP_H = (dTdP_T * dHdT_P - dTdT_P * dHdP_T) / (dPdP_T * dHdT_P - dPdT_P * dHdP_T); // Array Index 34
    var dTdP_S = (dTdP_T * dSdT_P - dTdT_P * dSdP_T) / (dPdP_T * dSdT_P - dPdT_P * dSdP_T); // Array Index 35

    var dTdV_P = (dTdP_T * dPdT_P - dTdT_P * dPdP_T) / (dVdP_T * dPdT_P - dVdT_P * dPdP_T); // Array Index 36
    var dTdV_U = (dTdP_T * dUdT_P - dTdT_P * dUdP_T) / (dVdP_T * dUdT_P - dVdT_P * dUdP_T); // Array Index 37
    var dTdV_H = (dTdP_T * dHdT_P - dTdT_P * dHdP_T) / (dVdP_T * dHdT_P - dVdT_P * dHdP_T); // Array Index 38
    var dTdV_S = (dTdP_T * dSdT_P - dTdT_P * dSdP_T) / (dVdP_T * dSdT_P - dVdT_P * dSdP_T); // Array Index 39

    var dTdU_P = (dTdP_T * dPdT_P - dTdT_P * dPdP_T) / (dUdP_T * dPdT_P - dUdT_P * dPdP_T); // Array Index 40
    var dTdU_V = (dTdP_T * dVdT_P - dTdT_P * dVdP_T) / (dUdP_T * dVdT_P - dUdT_P * dVdP_T); // Array Index 41
    var dTdU_H = (dTdP_T * dHdT_P - dTdT_P * dHdP_T) / (dUdP_T * dHdT_P - dUdT_P * dHdP_T); // Array Index 42
    var dTdU_S = (dTdP_T * dSdT_P - dTdT_P * dSdP_T) / (dUdP_T * dSdT_P - dUdT_P * dSdP_T); // Array Index 43

    var dTdH_P = (dTdP_T * dPdT_P - dTdT_P * dPdP_T) / (dHdP_T * dPdT_P - dHdT_P * dPdP_T); // Array Index 44
    var dTdH_V = (dTdP_T * dVdT_P - dTdT_P * dVdP_T) / (dHdP_T * dVdT_P - dHdT_P * dVdP_T); // Array Index 45
    var dTdH_U = (dTdP_T * dUdT_P - dTdT_P * dUdP_T) / (dHdP_T * dUdT_P - dHdT_P * dUdP_T); // Array Index 46
    var dTdH_S = (dTdP_T * dSdT_P - dTdT_P * dSdP_T) / (dHdP_T * dSdT_P - dHdT_P * dSdP_T); // Array Index 47

    var dTdS_P = (dTdP_T * dPdT_P - dTdT_P * dPdP_T) / (dSdP_T * dPdT_P - dSdT_P * dPdP_T); // Array Index 48
    var dTdS_V = (dTdP_T * dVdT_P - dTdT_P * dVdP_T) / (dSdP_T * dVdT_P - dSdT_P * dVdP_T); // Array Index 49
    var dTdS_U = (dTdP_T * dUdT_P - dTdT_P * dUdP_T) / (dSdP_T * dUdT_P - dSdT_P * dUdP_T); // Array Index 50
    var dTdS_H = (dTdP_T * dHdT_P - dTdT_P * dHdP_T) / (dSdP_T * dHdT_P - dSdT_P * dHdP_T); // Array Index 51

    // The following five groups provide the partial derivatives of volume.  Refer to IAPWS AN3-07 (2018) Equation 5
    var dVdP_U = (dVdP_T * dUdT_P - dVdT_P * dUdP_T) / (dPdP_T * dUdT_P - dPdT_P * dUdP_T); // Array Index 53
    var dVdP_H = (dVdP_T * dHdT_P - dVdT_P * dHdP_T) / (dPdP_T * dHdT_P - dPdT_P * dHdP_T); // Array Index 54
    var dVdP_S = (dVdP_T * dSdT_P - dVdT_P * dSdP_T) / (dPdP_T * dSdT_P - dPdT_P * dSdP_T); // Array Index 55

    var dVdT_U = (dVdP_T * dUdT_P - dVdT_P * dUdP_T) / (dTdP_T * dUdT_P - dTdT_P * dUdP_T); // Array Index 57
    var dVdT_H = (dVdP_T * dHdT_P - dVdT_P * dHdP_T) / (dTdP_T * dHdT_P - dTdT_P * dHdP_T); // Array Index 58
    var dVdT_S = (dVdP_T * dSdT_P - dVdT_P * dSdP_T) / (dTdP_T * dSdT_P - dTdT_P * dSdP_T); // Array Index 59

    var dVdU_P = (dVdP_T * dPdT_P - dVdT_P * dPdP_T) / (dUdP_T * dPdT_P - dUdT_P * dPdP_T); // Array Index 60
    var dVdU_T = (dVdP_T * dTdT_P - dVdT_P * dTdP_T) / (dUdP_T * dTdT_P - dUdT_P * dTdP_T); // Array Index 61
    var dVdU_H = (dVdP_T * dHdT_P - dVdT_P * dHdP_T) / (dUdP_T * dHdT_P - dUdT_P * dHdP_T); // Array Index 62
    var dVdU_S = (dVdP_T * dSdT_P - dVdT_P * dSdP_T) / (dUdP_T * dSdT_P - dUdT_P * dSdP_T); // Array Index 63

    var dVdH_P = (dVdP_T * dPdT_P - dVdT_P * dPdP_T) / (dHdP_T * dPdT_P - dHdT_P * dPdP_T); // Array Index 64
    var dVdH_T = (dVdP_T * dTdT_P - dVdT_P * dTdP_T) / (dHdP_T * dTdT_P - dHdT_P * dTdP_T); // Array Index 65
    var dVdH_U = (dVdP_T * dUdT_P - dVdT_P * dUdP_T) / (dHdP_T * dUdT_P - dHdT_P * dUdP_T); // Array Index 66
    var dVdH_S = (dVdP_T * dSdT_P - dVdT_P * dSdP_T) / (dHdP_T * dSdT_P - dHdT_P * dSdP_T); // Array Index 67

    var dVdS_P = (dVdP_T * dPdT_P - dVdT_P * dPdP_T) / (dSdP_T * dPdT_P - dSdT_P * dPdP_T); // Array Index 68
    var dVdS_T = (dVdP_T * dTdT_P - dVdT_P * dTdP_T) / (dSdP_T * dTdT_P - dSdT_P * dTdP_T); // Array Index 69
    var dVdS_U = (dVdP_T * dUdT_P - dVdT_P * dUdP_T) / (dSdP_T * dUdT_P - dSdT_P * dUdP_T); // Array Index 70
    var dVdS_H = (dVdP_T * dHdT_P - dVdT_P * dHdP_T) / (dSdP_T * dHdT_P - dSdT_P * dHdP_T); // Array Index 71

    // The following five groups provide the partial derivatives of internal energy.  Refer to IAPWS AN3-07 (2018) Equation 5
    var dUdP_V = (dUdP_T * dVdT_P - dUdT_P * dVdP_T) / (dPdP_T * dVdT_P - dPdT_P * dVdP_T); // Array Index 73
    var dUdP_H = (dUdP_T * dHdT_P - dUdT_P * dHdP_T) / (dPdP_T * dHdT_P - dPdT_P * dHdP_T); // Array Index 74
    var dUdP_S = (dUdP_T * dSdT_P - dUdT_P * dSdP_T) / (dPdP_T * dSdT_P - dPdT_P * dSdP_T); // Array Index 75

    var dUdT_V = (dUdP_T * dVdT_P - dUdT_P * dVdP_T) / (dTdP_T * dVdT_P - dTdT_P * dVdP_T); // Array Index 77
    var dUdT_H = (dUdP_T * dHdT_P - dUdT_P * dHdP_T) / (dTdP_T * dHdT_P - dTdT_P * dHdP_T); // Array Index 78
    var dUdT_S = (dUdP_T * dSdT_P - dUdT_P * dSdP_T) / (dTdP_T * dSdT_P - dTdT_P * dSdP_T); // Array Index 79

    var dUdV_P = (dUdP_T * dPdT_P - dUdT_P * dPdP_T) / (dVdP_T * dPdT_P - dVdT_P * dPdP_T); // Array Index 80
    var dUdV_T = (dUdP_T * dTdT_P - dUdT_P * dTdP_T) / (dVdP_T * dTdT_P - dVdT_P * dTdP_T); // Array Index 81
    var dUdV_H = (dUdP_T * dHdT_P - dUdT_P * dHdP_T) / (dVdP_T * dHdT_P - dVdT_P * dHdP_T); // Array Index 82
    var dUdV_S = (dUdP_T * dSdT_P - dUdT_P * dSdP_T) / (dVdP_T * dSdT_P - dVdT_P * dSdP_T); // Array Index 83

    var dUdH_P = (dUdP_T * dPdT_P - dUdT_P * dPdP_T) / (dHdP_T * dPdT_P - dHdT_P * dPdP_T); // Array Index 84
    var dUdH_T = (dUdP_T * dTdT_P - dUdT_P * dTdP_T) / (dHdP_T * dTdT_P - dHdT_P * dTdP_T); // Array Index 85
    var dUdH_V = (dUdP_T * dVdT_P - dUdT_P * dVdP_T) / (dHdP_T * dVdT_P - dHdT_P * dVdP_T); // Array Index 86
    var dUdH_S = (dUdP_T * dSdT_P - dUdT_P * dSdP_T) / (dHdP_T * dSdT_P - dHdT_P * dSdP_T); // Array Index 87

    var dUdS_P = (dUdP_T * dPdT_P - dUdT_P * dPdP_T) / (dSdP_T * dPdT_P - dSdT_P * dPdP_T); // Array Index 88
    var dUdS_T = (dUdP_T * dTdT_P - dUdT_P * dTdP_T) / (dSdP_T * dTdT_P - dSdT_P * dTdP_T); // Array Index 89
    var dUdS_V = (dUdP_T * dVdT_P - dUdT_P * dVdP_T) / (dSdP_T * dVdT_P - dSdT_P * dVdP_T); // Array Index 90
    var dUdS_H = (dUdP_T * dHdT_P - dUdT_P * dHdP_T) / (dSdP_T * dHdT_P - dSdT_P * dHdP_T); // Array Index 91

    // The following five groups provide the partial derivatives of enthalpy.  Refer to IAPWS AN3-07 (2018) Equation 5
    var dHdP_V = (dHdP_T * dVdT_P - dHdT_P * dVdP_T) / (dPdP_T * dVdT_P - dPdT_P * dVdP_T); // Array Index 93
    var dHdP_U = (dHdP_T * dUdT_P - dHdT_P * dUdP_T) / (dPdP_T * dUdT_P - dPdT_P * dUdP_T); // Array Index 94
    var dHdP_S = (dHdP_T * dSdT_P - dHdT_P * dSdP_T) / (dPdP_T * dSdT_P - dPdT_P * dSdP_T); // Array Index 95

    var dHdT_V = (dHdP_T * dVdT_P - dHdT_P * dVdP_T) / (dTdP_T * dVdT_P - dTdT_P * dVdP_T); // Array Index 97
    var dHdT_U = (dHdP_T * dUdT_P - dHdT_P * dUdP_T) / (dTdP_T * dUdT_P - dTdT_P * dUdP_T); // Array Index 98
    var dHdT_S = (dHdP_T * dSdT_P - dHdT_P * dSdP_T) / (dTdP_T * dSdT_P - dTdT_P * dSdP_T); // Array Index 99

    var dHdV_P = (dHdP_T * dPdT_P - dHdT_P * dPdP_T) / (dVdP_T * dPdT_P - dVdT_P * dPdP_T); // Array Index 100
    var dHdV_T = (dHdP_T * dTdT_P - dHdT_P * dTdP_T) / (dVdP_T * dTdT_P - dVdT_P * dTdP_T); // Array Index 101
    var dHdV_U = (dHdP_T * dUdT_P - dHdT_P * dUdP_T) / (dVdP_T * dUdT_P - dVdT_P * dUdP_T); // Array Index 102
    var dHdV_S = (dHdP_T * dSdT_P - dHdT_P * dSdP_T) / (dVdP_T * dSdT_P - dVdT_P * dSdP_T); // Array Index 103

    var dHdU_P = (dHdP_T * dPdT_P - dHdT_P * dPdP_T) / (dUdP_T * dPdT_P - dUdT_P * dPdP_T); // Array Index 104
    var dHdU_T = (dHdP_T * dTdT_P - dHdT_P * dTdP_T) / (dUdP_T * dTdT_P - dUdT_P * dTdP_T); // Array Index 105
    var dHdU_V = (dHdP_T * dVdT_P - dHdT_P * dVdP_T) / (dUdP_T * dVdT_P - dUdT_P * dVdP_T); // Array Index 106
    var dHdU_S = (dHdP_T * dSdT_P - dHdT_P * dSdP_T) / (dUdP_T * dSdT_P - dUdT_P * dSdP_T); // Array Index 107

    var dHdS_P = (dHdP_T * dPdT_P - dHdT_P * dPdP_T) / (dSdP_T * dPdT_P - dSdT_P * dPdP_T); // Array Index 108
    var dHdS_T = (dHdP_T * dTdT_P - dHdT_P * dTdP_T) / (dSdP_T * dTdT_P - dSdT_P * dTdP_T); // Array Index 109
    var dHdS_V = (dHdP_T * dVdT_P - dHdT_P * dVdP_T) / (dSdP_T * dVdT_P - dSdT_P * dVdP_T); // Array Index 110
    var dHdS_U = (dHdP_T * dUdT_P - dHdT_P * dUdP_T) / (dSdP_T * dUdT_P - dSdT_P * dUdP_T); // Array Index 111

    // The following five groups provide the partial derivatives of entropy.  Refer to IAPWS AN3-07 (2018) Equation 5
    var dSdP_V = (dSdP_T * dVdT_P - dSdT_P * dVdP_T) / (dPdP_T * dVdT_P - dPdT_P * dVdP_T); // Array Index 113
    var dSdP_U = (dSdP_T * dUdT_P - dSdT_P * dUdP_T) / (dPdP_T * dUdT_P - dPdT_P * dUdP_T); // Array Index 114
    var dSdP_H = (dSdP_T * dHdT_P - dSdT_P * dHdP_T) / (dPdP_T * dHdT_P - dPdT_P * dHdP_T); // Array Index 115

    var dSdT_V = (dSdP_T * dVdT_P - dSdT_P * dVdP_T) / (dTdP_T * dVdT_P - dTdT_P * dVdP_T); // Array Index 117
    var dSdT_U = (dSdP_T * dUdT_P - dSdT_P * dUdP_T) / (dTdP_T * dUdT_P - dTdT_P * dUdP_T); // Array Index 118
    var dSdT_H = (dSdP_T * dHdT_P - dSdT_P * dHdP_T) / (dTdP_T * dHdT_P - dTdT_P * dHdP_T); // Array Index 119

    var dSdV_P = (dSdP_T * dPdT_P - dSdT_P * dPdP_T) / (dVdP_T * dPdT_P - dVdT_P * dPdP_T); // Array Index 120
    var dSdV_T = (dSdP_T * dTdT_P - dSdT_P * dTdP_T) / (dVdP_T * dTdT_P - dVdT_P * dTdP_T); // Array Index 121
    var dSdV_U = (dSdP_T * dUdT_P - dSdT_P * dUdP_T) / (dVdP_T * dUdT_P - dVdT_P * dUdP_T); // Array Index 122
    var dSdV_H = (dSdP_T * dHdT_P - dSdT_P * dHdP_T) / (dVdP_T * dHdT_P - dVdT_P * dHdP_T); // Array Index 123

    var dSdU_P = (dSdP_T * dPdT_P - dSdT_P * dPdP_T) / (dUdP_T * dPdT_P - dUdT_P * dPdP_T); // Array Index 124
    var dSdU_T = (dSdP_T * dTdT_P - dSdT_P * dTdP_T) / (dUdP_T * dTdT_P - dUdT_P * dTdP_T); // Array Index 125
    var dSdU_V = (dSdP_T * dVdT_P - dSdT_P * dVdP_T) / (dUdP_T * dVdT_P - dUdT_P * dVdP_T); // Array Index 126
    var dSdU_H = (dSdP_T * dHdT_P - dSdT_P * dHdP_T) / (dUdP_T * dHdT_P - dUdT_P * dHdP_T); // Array Index 127

    var dSdH_P = (dSdP_T * dPdT_P - dSdT_P * dPdP_T) / (dHdP_T * dPdT_P - dHdT_P * dPdP_T); // Array Index 128
    var dSdH_T = (dSdP_T * dTdT_P - dSdT_P * dTdP_T) / (dHdP_T * dTdT_P - dHdT_P * dTdP_T); // Array Index 129
    var dSdH_V = (dSdP_T * dVdT_P - dSdT_P * dVdP_T) / (dHdP_T * dVdT_P - dHdT_P * dVdP_T); // Array Index 130
    var dSdH_U = (dSdP_T * dUdT_P - dSdT_P * dUdP_T) / (dHdP_T * dUdT_P - dHdT_P * dUdP_T); // Array Index 131

    // [(0) Pressure, (1) Temperature, (2) Quality, (3) Enthalpy, (4) Entropy,
    //  (5) InternalEnergy, (6) Volume, (7) IsobaricHeat, (8) IsochoricHeat, (9) SpeedOfSound,
    //  (10) Viscosity, (11) ThermConductivity]
    return [
      pressure,
      temperature,
      0.0,
      Enthalpy,
      Entropy,
      InternalEnergy,
      Volume,
      IsobaricHeat,
      IsochoricHeat,
      SpeedOfSound,
      visc,
      ThermConductivity, // Elements 0 through 11
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

  throw Errors.TemperatureOrPressureNotInRegion2;
}

//
// Backward equations
//

// Defines the boundary between subregion 2b and 2c for using the backward equations : IF97 Equ 20
export function B2bc_PfH(enthalpy) {
  // returns a pressure given an enthalpy
  var pressure =
    Constants.reg2_B2bc_n[0] + Constants.reg2_B2bc_n[1] * enthalpy + Constants.reg2_B2bc_n[2] * Math.pow(enthalpy, 2);
  return pressure;
}

export function B2bc_HfP(pressure) {
  // returns a enthalpy given an pressure : IF97 Equ 21
  var enthalpy = Constants.reg2_B2bc_n[3] + Math.sqrt((pressure - Constants.reg2_B2bc_n[4]) / Constants.reg2_B2bc_n[2]);
  return enthalpy;
}

// Backward equation T(p,h) for subregion 2a : IF97 Equ 22
export function T2a_fPH(pressure, enthalpy) {
  var h_Reducing = 2000; // kJ/kg

  var theta = 0;
  for (let i = 0; i < Constants.reg2a_Tph_I.length; i++) {
    theta +=
      Constants.reg2a_Tph_n[i] *
      Math.pow(pressure, Constants.reg2a_Tph_I[i]) *
      Math.pow(enthalpy / h_Reducing - 2.1, Constants.reg2a_Tph_J[i]);
  }
  return theta;
}

// Backward equation T(p,h) for subregion 2b : IF97 Equ 23
export function T2b_fPH(pressure, enthalpy) {
  var h_Reducing = 2000; // kJ/kg

  var theta = 0;
  for (let i = 0; i < Constants.reg2b_Tph_I.length; i++) {
    theta +=
      Constants.reg2b_Tph_n[i] *
      Math.pow(pressure - 2, Constants.reg2b_Tph_I[i]) *
      Math.pow(enthalpy / h_Reducing - 2.6, Constants.reg2b_Tph_J[i]);
  }
  return theta;
}

// Backward equation T(p,h) for subregion 2c : IF97 Equ 24
export function T2c_fPH(pressure, enthalpy) {
  var h_Reducing = 2000; // kJ/kg
  var eta = enthalpy / h_Reducing;

  var theta = 0;
  for (let i = 0; i < Constants.reg2c_Tph_I.length; i++) {
    theta +=
      Constants.reg2c_Tph_n[i] *
      Math.pow(pressure + 25, Constants.reg2c_Tph_I[i]) *
      Math.pow(eta - 1.8, Constants.reg2c_Tph_J[i]);
  }
  return theta;
}

// Backward equation T(p,s) for subregion 2a : IF97 Equ 25
export function T2a_fPS(pressure, entropy) {
  var s_Reducing = 2; // kJ/kg-K

  var theta = 0;
  for (let i = 0; i < Constants.reg2a_Tps_I.length; i++) {
    theta +=
      Constants.reg2a_Tps_n[i] *
      Math.pow(pressure, Constants.reg2a_Tps_I[i]) *
      Math.pow(entropy / s_Reducing - 2, Constants.reg2a_Tps_J[i]);
  }
  return theta;
}

// Backward equation T(p,s) for subregion 2b : IF97 Equ 26
export function T2b_fPS(pressure, entropy) {
  var s_Reducing = 0.7853; // kJ/kg-K
  var sigma = entropy / s_Reducing;

  var theta = 0;
  for (let i = 0; i < Constants.reg2b_Tps_I.length; i++) {
    theta +=
      Constants.reg2b_Tps_n[i] *
      Math.pow(pressure, Constants.reg2b_Tps_I[i]) *
      Math.pow(10 - sigma, Constants.reg2b_Tps_J[i]);
  }
  return theta;
}

// Backward equation T(p,s) for subregion 2c : IF97 Equ 27
export function T2c_fPS(pressure, entropy) {
  var s_Reducing = 2.9251; // kJ/kg-K
  var sigma = entropy / s_Reducing;

  var theta = 0;
  for (let i = 0; i < Constants.reg2c_Tps_I.length; i++) {
    theta +=
      Constants.reg2c_Tps_n[i] *
      Math.pow(pressure, Constants.reg2c_Tps_I[i]) *
      Math.pow(2 - sigma, Constants.reg2c_Tps_J[i]);
  }
  return theta;
}

// Backward equation P(h,s) for subregion 2a : SR2 Equ 3
export function P2a_fHS(enthalpy, entropy) {
  var p_Reducing = Constants.p2a2b_boundary; // Mpa
  var h_Reducing = 4200; // kJ/kg
  var s_Reducing = 12; // kJ/kg-K

  var eta = enthalpy / h_Reducing;
  var sigma = entropy / s_Reducing;

  var pi = 0;
  for (let i = 0; i < Constants.reg2a_pHS_I.length; i++) {
    pi +=
      Constants.reg2a_pHS_n[i] *
      Math.pow(eta - 0.5, Constants.reg2a_pHS_I[i]) *
      Math.pow(sigma - 1.2, Constants.reg2a_pHS_J[i]);
  }
  return Math.pow(pi, 4) * p_Reducing;
}

// Backward equation P(h,s) for subregion 2b : SR2 Equ 4
export function P2b_fHS(enthalpy, entropy) {
  var p_Reducing = Constants.pmax; // Mpa
  var h_Reducing = 4100; // kJ/kg
  var s_Reducing = 7.9; // kJ/kg-K

  var eta = enthalpy / h_Reducing;
  var sigma = entropy / s_Reducing;

  var pi = 0;
  for (let i = 0; i < Constants.reg2b_pHS_I.length; i++) {
    pi +=
      Constants.reg2b_pHS_n[i] *
      Math.pow(eta - 0.6, Constants.reg2b_pHS_I[i]) *
      Math.pow(sigma - 1.01, Constants.reg2b_pHS_J[i]);
  }
  return Math.pow(pi, 4) * p_Reducing;
}

// Backward equation P(h,s) for subregion 2c : SR2 Equ 5
export function P2c_fHS(enthalpy, entropy) {
  var p_Reducing = 100; // Mpa
  var h_Reducing = 3500; // kJ/kg
  var s_Reducing = 5.9; // kJ/kg-K

  var eta = enthalpy / h_Reducing;
  var sigma = entropy / s_Reducing;

  var pi = 0;
  for (let i = 0; i < Constants.reg2c_pHS_I.length; i++) {
    pi +=
      Constants.reg2c_pHS_n[i] *
      Math.pow(eta - 0.7, Constants.reg2c_pHS_I[i]) *
      Math.pow(sigma - 1.1, Constants.reg2c_pHS_J[i]);
  }
  return Math.pow(pi, 4) * p_Reducing;
}

// SR2 Table 5 Equ 2: Boundary equation for h2ab(s) boundary between subregions 2a and 2b
// Used for back calculations of properties f(h,s)
export function H2ab(entropy) {
  var eta =
    Constants.h2ab_n[0] +
    Constants.h2ab_n[1] * entropy +
    Constants.h2ab_n[2] * Math.pow(entropy, 2) +
    Constants.h2ab_n[3] * Math.pow(entropy, 3);
  return eta;
}
