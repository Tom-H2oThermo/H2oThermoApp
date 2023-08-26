import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
import * as Region4SatPressure from "./Region4SatPressure.js";

const R = Constants.R_H2O * 1000; // convert the kJ to Joules

export function Properties_fPT(pressure, temperature) {
  try {
    if (
      temperature >= Constants.Tmin &&
      temperature <= Constants.T13_boundary &&
      pressure <= Constants.pmax &&
      pressure >= Region4SatPressure.SatPressure(temperature) - 1e11
    ) {
      var p_Reducing = 16.53; // MPa.  R7-97 constants listed below eq 7
      var T_reducing = 1386; // K. R7-97 constants listed below eq 7
      var p = pressure * 1e6; // convert MPa to pascals

      var gamma = 0; // Gibbs free energy
      var gamma_pi = 0;
      var gamma_tau = 0;
      var gamma_pi_pi = 0;
      var gamma_tau_tau = 0;
      var gamma_pi_tau = 0;

      var pi = pressure / p_Reducing; // Reduced Pressure
      var tau = T_reducing / temperature; // Reduced Temperature

      for (let i = 0; i < Constants.reg1_Gibb_I.length; i++) {
        gamma +=
          Constants.reg1_Gibb_n[i] *
          Math.pow(7.1 - pi, Constants.reg1_Gibb_I[i]) *
          Math.pow(tau - 1.222, Constants.reg1_Gibb_J[i]);
        gamma_pi +=
          -Constants.reg1_Gibb_n[i] *
          Constants.reg1_Gibb_I[i] *
          Math.pow(7.1 - pi, Constants.reg1_Gibb_I[i] - 1) *
          Math.pow(tau - 1.222, Constants.reg1_Gibb_J[i]);
        gamma_tau +=
          Constants.reg1_Gibb_n[i] *
          Math.pow(7.1 - pi, Constants.reg1_Gibb_I[i]) *
          Constants.reg1_Gibb_J[i] *
          Math.pow(tau - 1.222, Constants.reg1_Gibb_J[i] - 1);
        gamma_pi_pi +=
          Constants.reg1_Gibb_n[i] *
          Constants.reg1_Gibb_I[i] *
          (Constants.reg1_Gibb_I[i] - 1) *
          Math.pow(7.1 - pi, Constants.reg1_Gibb_I[i] - 2) *
          Math.pow(tau - 1.222, Constants.reg1_Gibb_J[i]);
        gamma_tau_tau +=
          Constants.reg1_Gibb_n[i] *
          Math.pow(7.1 - pi, Constants.reg1_Gibb_I[i]) *
          Constants.reg1_Gibb_J[i] *
          (Constants.reg1_Gibb_J[i] - 1) *
          Math.pow(tau - 1.222, Constants.reg1_Gibb_J[i] - 2);
        gamma_pi_tau +=
          -Constants.reg1_Gibb_n[i] *
          Constants.reg1_Gibb_I[i] *
          Math.pow(7.1 - pi, Constants.reg1_Gibb_I[i] - 1) *
          Constants.reg1_Gibb_J[i] *
          Math.pow(tau - 1.222, Constants.reg1_Gibb_J[i] - 1);
      }

      var Volume = (R * temperature * pi * gamma_pi) / p;
      var InternalEnergy = Constants.R_H2O * temperature * (tau * gamma_tau - pi * gamma_pi);
      var Entropy = Constants.R_H2O * (tau * gamma_tau - gamma);
      var Enthalpy = Constants.R_H2O * temperature * tau * gamma_tau;
      var IsobaricHeat = -Constants.R_H2O * Math.pow(tau, 2) * gamma_tau_tau;
      var IsochoricHeat =
        Constants.R_H2O *
        (-Math.pow(tau, 2) * gamma_tau_tau + Math.pow(gamma_pi - tau * gamma_pi_tau, 2) / gamma_pi_pi);
      var SpeedOfSound = Math.sqrt(
        (R * temperature * Math.pow(gamma_pi, 2)) /
          (Math.pow(gamma_pi - tau * gamma_pi_tau, 2) / (Math.pow(tau, 2) * gamma_tau_tau) - gamma_pi_pi)
      );

      // Equations below calculate the various properties partial derivatives.  The derivate functions below the first group use IAPWS AN3-07 (2018) Equation 1
      var alpha_v = (1 / temperature) * (1 - (tau * gamma_pi_tau) / gamma_pi); // IAPWS AN3-07 (2018) Eq 6
      var kappa_T = -(1 / pressure) * ((pi * gamma_pi_pi) / gamma_pi); // IAPWS AN3-07 (2018) Eq 6
      var dPdT_P = 0; //  IAPWS AN3-07 (2018) Table 2
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
      var dSdP_T = 1000 * (-Volume * alpha_v); // Array Index 112: IAPWS AN3-07 (2018) Table 2

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

      // Array indices for the first 10 steam properties values
      // [(0) Pressure, (1) Temperature, (2) Quality, (3) Enthalpy, (4) Entropy, (5) InternalEnergy, (6) Volume
      //  (7) IsobaricHeat, (8) IsochoricHeat, (9) SpeedOfSound

      return [
        pressure, // 0
        temperature, // 1
        0.0, // 2
        Enthalpy, // 3
        Entropy, // 4
        InternalEnergy, // 5
        Volume, // 6
        IsobaricHeat, // 7
        IsochoricHeat, // 8
        SpeedOfSound, // 9
        0, // 10
        0, // 11
        dPdT_V, // 12
        dPdT_U, // 13
        dPdT_H, // 14
        dPdT_S, // 15
        dPdV_T, // 16
        dPdV_U, // 17
        dPdV_H, // 18
        dPdV_S, // 19
        dPdU_T, // 20
        dPdU_V, // 21
        dPdU_H, // 22
        dPdU_S, // 23
        dPdH_T, // 24
        dPdH_V, // 25
        dPdH_U, // 26
        dPdH_S, // 27
        dPdS_T, // 28
        dPdS_V, // 29
        dPdS_U, // 30
        dPdS_H, // 31
        dTdP_V, // 32
        dTdP_U, // 33
        dTdP_H, // 34
        dTdP_S, // 35
        dTdV_P, // 36
        dTdV_U, // 37
        dTdV_H, // 38
        dTdV_S, // 39
        dTdU_P, // 40
        dTdU_V, // 41
        dTdU_H, // 42
        dTdU_S, // 43
        dTdH_P, // 44
        dTdH_V, // 45
        dTdH_U, // 46
        dTdH_S, // 47
        dTdS_P, // 48
        dTdS_V, // 49
        dTdS_U, // 50
        dTdS_H, // 51
        dVdP_T, // 52
        dVdP_U, // 53
        dVdP_H, // 54
        dVdP_S, // 55
        dVdT_P, // 56
        dVdT_U, // 57
        dVdT_H, // 58
        dVdT_S, // 59
        dVdU_P, // 60
        dVdU_T, // 61
        dVdU_H, // 62
        dVdU_S, // 63
        dVdH_P, // 64
        dVdH_T, // 65
        dVdH_U, // 66
        dVdH_S, // 67
        dVdS_P, // 68
        dVdS_T, // 69
        dVdS_U, // 70
        dVdS_H, // 71
        dUdP_T, // 72
        dUdP_V, // 73
        dUdP_H, // 71
        dUdP_S, // 72
        dUdT_P, // 73
        dUdT_V, // 74
        dUdT_H, // 75
        dUdT_S, // 76
        dUdV_P, // 77
        dUdV_T, // 78
        dUdV_H, // 79
        dUdV_S, // 80
        dUdH_P, // 81
        dUdH_T, // 82
        dUdH_V, // 83
        dUdH_S, // 84
        dUdS_P, // 85
        dUdS_T, // 86
        dUdS_V, // 87
        dUdS_H, // 88
        dHdP_T, // 89
        dHdP_V, // 90
        dHdP_U, // 91
        dHdP_S, // 92
        dHdT_P, // 93
        dHdT_V, // 94
        dHdT_U, // 95
        dHdT_S, // 96
        dHdV_P, // 97
        dHdV_T, // 98
        dHdV_U, // 99
        dHdV_S, // 100
        dHdU_P, // 101
        dHdU_T, // 102
        dHdU_V, // 103
        dHdU_S, // 104
        dHdS_P, // 105
        dHdS_T, // 106
        dHdS_V, // 107
        dHdS_U, // 108
        dSdP_T, // 109
        dSdP_V, // 110
        dSdP_U, // 111
        dSdP_H, // 112
        dSdT_P, // 113
        dSdT_V, // 114
        dSdT_U, // 115
        dSdT_H, // 116
        dSdV_P, // 117
        dSdV_T, // 118
        dSdV_U, // 119
        dSdV_H, // 120
        dSdU_P, // 121
        dSdU_T, // 122
        dSdU_V, // 123
        dSdU_H, // 124
        dSdH_P, // 125
        dSdH_T, // 126
        dSdH_V, // 127
        dSdH_U, // 128
      ];
    }
    throw Errors.TemperatureOrPressureNotInRegion1;
  } catch (err) {
    throw Errors.TemperatureOrPressureNotInRegion1;
  }
}

export function T_fPH(pressure, enthalpy) {
  var h_Reducing = 2500; // kJ/kg

  var theta = 0;
  for (let i = 0; i < Constants.reg1_Tph_I.length; i++) {
    theta +=
      Constants.reg1_Tph_n[i] *
      Math.pow(pressure, Constants.reg1_Tph_I[i]) *
      Math.pow(1 + enthalpy / h_Reducing, Constants.reg1_Tph_J[i]);
  }
  if (theta > 623.15 && theta < 623.175) {
    theta = 623.15;
  }
  return theta;
}

export function T_fPS(pressure, entropy) {
  var theta = 0;
  for (let i = 0; i < Constants.reg1_Tps_I.length; i++) {
    theta +=
      Constants.reg1_Tps_n[i] *
      Math.pow(pressure, Constants.reg1_Tps_I[i]) *
      Math.pow(entropy + 2, Constants.reg1_Tps_J[i]);
  }

  if (theta > 623.15 && theta < 623.175) {
    theta = 623.15;
  }

  return theta;
}

// IAPWS SR2 Equation 1
export function P_fHS(enthalpy, entropy) {
  var p_Reducing = 100; // MPa
  var h_Reducing = 3400; // kJ/kg
  var s_Reducing = 7.6; // kJ/kg-K

  var eta = enthalpy / h_Reducing;
  var sigma = entropy / s_Reducing;

  var pi = 0;
  for (let i = 0; i < Constants.reg1_pHS_I.length; i++) {
    pi +=
      Constants.reg1_pHS_n[i] *
      Math.pow(eta + 0.05, Constants.reg1_pHS_I[i]) *
      Math.pow(sigma + 0.05, Constants.reg1_pHS_J[i]);
  }
  return pi * p_Reducing;
}
