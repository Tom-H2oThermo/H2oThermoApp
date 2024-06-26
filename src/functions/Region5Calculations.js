import * as Constants from "./Constants.js";

const R = Constants.R_H2O * 1000; // convert the kJ in R to Joules

export function Properties_fPT(pressure, temperature) {
  var p = pressure * 1e6; // convert MPa to pascals

  var p_Reducing = 1; // MPa
  var T_reducing = 1000; // K
  var pi = pressure / p_Reducing; // Reduced Pressure
  var tau = T_reducing / temperature; // Reduced Temperature

  var gamma_0 = Math.log(pi); // Gibbs free energy
  var gamma_0_pi = 1 / pi;
  var gamma_0_tau = 0;
  //var gamma_0_pi_pi = -1 / Math.pow(pi, 2);
  var gamma_0_tau_tau = 0;
  //var gamma_0_pi_tau = 0;  // never used

  var gamma_r = 0; // Gibbs free energy
  var gamma_r_pi = 0;
  var gamma_r_tau = 0;
  var gamma_r_pi_pi = 0;
  var gamma_r_tau_tau = 0;
  var gamma_r_pi_tau = 0;

  for (let i = 0; i < Constants.reg5_Gibb_Ideal_J.length; i++) {
    gamma_0 += Constants.reg5_Gibb_Ideal_n[i] * Math.pow(tau, Constants.reg5_Gibb_Ideal_J[i]);
    gamma_0_tau +=
      Constants.reg5_Gibb_Ideal_n[i] *
      Constants.reg5_Gibb_Ideal_J[i] *
      Math.pow(tau, Constants.reg5_Gibb_Ideal_J[i] - 1);
    gamma_0_tau_tau +=
      Constants.reg5_Gibb_Ideal_n[i] *
      Constants.reg5_Gibb_Ideal_J[i] *
      (Constants.reg5_Gibb_Ideal_J[i] - 1) *
      Math.pow(tau, Constants.reg5_Gibb_Ideal_J[i] - 2);
  }

  for (let i = 0; i < Constants.reg5_Gibb_Res_I.length; i++) {
    gamma_r +=
      Constants.reg5_Gibb_Res_n[i] *
      Math.pow(pi, Constants.reg5_Gibb_Res_I[i]) *
      Math.pow(tau, Constants.reg5_Gibb_Res_J[i]);
    gamma_r_pi +=
      Constants.reg5_Gibb_Res_n[i] *
      Constants.reg5_Gibb_Res_I[i] *
      Math.pow(pi, Constants.reg5_Gibb_Res_I[i] - 1) *
      Math.pow(tau, Constants.reg5_Gibb_Res_J[i]);
    gamma_r_tau +=
      Constants.reg5_Gibb_Res_n[i] *
      Math.pow(pi, Constants.reg5_Gibb_Res_I[i]) *
      Constants.reg5_Gibb_Res_J[i] *
      Math.pow(tau, Constants.reg5_Gibb_Res_J[i] - 1);
    gamma_r_pi_pi +=
      Constants.reg5_Gibb_Res_n[i] *
      Constants.reg5_Gibb_Res_I[i] *
      (Constants.reg5_Gibb_Res_I[i] - 1) *
      Math.pow(pi, Constants.reg5_Gibb_Res_I[i] - 2) *
      Math.pow(tau, Constants.reg5_Gibb_Res_J[i]);
    gamma_r_tau_tau +=
      Constants.reg5_Gibb_Res_n[i] *
      Math.pow(pi, Constants.reg5_Gibb_Res_I[i]) *
      Constants.reg5_Gibb_Res_J[i] *
      (Constants.reg5_Gibb_Res_J[i] - 1) *
      Math.pow(tau, Constants.reg5_Gibb_Res_J[i] - 2);
    gamma_r_pi_tau +=
      Constants.reg5_Gibb_Res_n[i] *
      Constants.reg5_Gibb_Res_I[i] *
      Math.pow(pi, Constants.reg5_Gibb_Res_I[i] - 1) *
      Constants.reg5_Gibb_Res_J[i] *
      Math.pow(tau, Constants.reg5_Gibb_Res_J[i] - 1);
  }

  const Volume = (R * temperature * pi * (gamma_0_pi + gamma_r_pi)) / p;
  const InternalEnergy =
    (R / 1000) * temperature * (tau * (gamma_0_tau + gamma_r_tau) - pi * (gamma_0_pi + gamma_r_pi));
  const Entropy = (R / 1000) * (tau * (gamma_0_tau + gamma_r_tau) - (gamma_0 + gamma_r));
  const Enthalpy = (R / 1000) * temperature * tau * (gamma_0_tau + gamma_r_tau);
  const IsobaricHeat = -(R / 1000) * Math.pow(tau, 2) * (gamma_0_tau_tau + gamma_r_tau_tau);
  const IsochoricHeat =
    (R / 1000) *
    (-Math.pow(tau, 2) * (gamma_0_tau_tau + gamma_r_tau_tau) -
      Math.pow(1 + pi * gamma_r_pi - tau * pi * gamma_r_pi_tau, 2) / (1 - Math.pow(pi, 2) * gamma_r_pi_pi));
  const SpeedOfSound = Math.sqrt(
    (R * temperature * (1 + 2 * pi * gamma_r_pi + Math.pow(pi * gamma_r_pi, 2))) /
      (1 -
        Math.pow(pi, 2) * gamma_r_pi_pi +
        Math.pow(1 + pi * gamma_r_pi - tau * pi * gamma_r_pi_tau, 2) /
          (Math.pow(tau, 2) * (gamma_0_tau_tau + gamma_r_tau_tau)))
  );

  // Equations below calculate the various properties partial derivatives.  The derivate functions below the first group use IAPWS AN3-07 (2018) Equation 1
  const alpha_v = (1 / temperature) * ((1 + pi * gamma_r_pi - tau * pi * gamma_r_pi_tau) / (1 + pi * gamma_r_pi)); // IAPWS AN3-07 (2018) Eq 7
  const kappa_T = ((1 / pressure) * (1 - Math.pow(pi, 2) * gamma_r_pi_pi)) / (1 + pi * gamma_r_pi); // IAPWS AN3-07 (2018) Eq 7
  const dPdT_P = 0; // IAPWS AN3-07 (2018) Table 2
  const dTdT_P = 1; // IAPWS AN3-07 (2018) Table 2
  const dVdT_P = Volume * alpha_v; // Array Index 56: IAPWS AN3-07 (2018) Table 2
  const dUdT_P = IsobaricHeat - pressure * 1000 * Volume * alpha_v; // Array Index 76: IAPWS AN3-07 (2018) Table 2
  const dHdT_P = IsobaricHeat; // Array Index 96: IAPWS AN3-07 (2018) Table 2
  const dSdT_P = IsobaricHeat / temperature; // Array Index 116: IAPWS AN3-07 (2018) Table 2
  const dPdP_T = 1; // IAPWS AN3-07 (2018) Table 2
  const dTdP_T = 0; // IAPWS AN3-07 (2018) Table 2
  const dVdP_T = -Volume * kappa_T; // Array Index 52: IAPWS AN3-07 (2018) Table 2
  const dUdP_T = 1000 * Volume * (pressure * kappa_T - temperature * alpha_v); // Array Index 72: IAPWS AN3-07 (2018) Table 2
  const dHdP_T = 1000 * Volume * (1 - temperature * alpha_v); // Array Index 92: IAPWS AN3-07 (2018) Table 2
  const dSdP_T = 1000 * (-Volume * alpha_v); // Array Index 112: IAPWS AN3-07 (2018) Table 2

  // The following five groups provide the partial derivatives of pressure.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dPdT_V = (dPdP_T * dVdT_P - dPdT_P * dVdP_T) / (dTdP_T * dVdT_P - dTdT_P * dVdP_T); // Array Index 12
  const dPdT_U = (dPdP_T * dUdT_P - dPdT_P * dUdP_T) / (dTdP_T * dUdT_P - dTdT_P * dUdP_T); // Array Index 13
  const dPdT_H = (dPdP_T * dHdT_P - dPdT_P * dHdP_T) / (dTdP_T * dHdT_P - dTdT_P * dHdP_T); // Array Index 14
  const dPdT_S = (dPdP_T * dSdT_P - dPdT_P * dSdP_T) / (dTdP_T * dSdT_P - dTdT_P * dSdP_T); // Array Index 15

  const dPdV_T = (dPdP_T * dTdT_P - dPdT_P * dTdP_T) / (dVdP_T * dTdT_P - dVdT_P * dTdP_T); // Array Index 16
  const dPdV_U = (dPdP_T * dUdT_P - dPdT_P * dUdP_T) / (dVdP_T * dUdT_P - dVdT_P * dUdP_T); // Array Index 17
  const dPdV_H = (dPdP_T * dHdT_P - dPdT_P * dHdP_T) / (dVdP_T * dHdT_P - dVdT_P * dHdP_T); // Array Index 18
  const dPdV_S = (dPdP_T * dSdT_P - dPdT_P * dSdP_T) / (dVdP_T * dSdT_P - dVdT_P * dSdP_T); // Array Index 19

  const dPdU_T = (dPdP_T * dTdT_P - dPdT_P * dTdP_T) / (dUdP_T * dTdT_P - dUdT_P * dTdP_T); // Array Index 20
  const dPdU_V = (dPdP_T * dVdT_P - dPdT_P * dVdP_T) / (dUdP_T * dVdT_P - dUdT_P * dVdP_T); // Array Index 21
  const dPdU_H = (dPdP_T * dHdT_P - dPdT_P * dHdP_T) / (dUdP_T * dHdT_P - dUdT_P * dHdP_T); // Array Index 22
  const dPdU_S = (dPdP_T * dSdT_P - dPdT_P * dSdP_T) / (dUdP_T * dSdT_P - dUdT_P * dSdP_T); // Array Index 23

  const dPdH_T = (dPdP_T * dTdT_P - dPdT_P * dTdP_T) / (dHdP_T * dTdT_P - dHdT_P * dTdP_T); // Array Index 24
  const dPdH_V = (dPdP_T * dVdT_P - dPdT_P * dVdP_T) / (dHdP_T * dVdT_P - dHdT_P * dVdP_T); // Array Index 25
  const dPdH_U = (dPdP_T * dUdT_P - dPdT_P * dUdP_T) / (dHdP_T * dUdT_P - dHdT_P * dUdP_T); // Array Index 26
  const dPdH_S = (dPdP_T * dSdT_P - dPdT_P * dSdP_T) / (dHdP_T * dSdT_P - dHdT_P * dSdP_T); // Array Index 27

  const dPdS_T = (dPdP_T * dTdT_P - dPdT_P * dTdP_T) / (dSdP_T * dTdT_P - dSdT_P * dTdP_T); // Array Index 28
  const dPdS_V = (dPdP_T * dVdT_P - dPdT_P * dVdP_T) / (dSdP_T * dVdT_P - dSdT_P * dVdP_T); // Array Index 29
  const dPdS_U = (dPdP_T * dUdT_P - dPdT_P * dUdP_T) / (dSdP_T * dUdT_P - dSdT_P * dUdP_T); // Array Index 30
  const dPdS_H = (dPdP_T * dHdT_P - dPdT_P * dHdP_T) / (dSdP_T * dHdT_P - dSdT_P * dHdP_T); // Array Index 31

  // The following five groups provide the partial derivatives of temperature.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dTdP_V = (dTdP_T * dVdT_P - dTdT_P * dVdP_T) / (dPdP_T * dVdT_P - dPdT_P * dVdP_T); // Array Index 32
  const dTdP_U = (dTdP_T * dUdT_P - dTdT_P * dUdP_T) / (dPdP_T * dUdT_P - dPdT_P * dUdP_T); // Array Index 33
  const dTdP_H = (dTdP_T * dHdT_P - dTdT_P * dHdP_T) / (dPdP_T * dHdT_P - dPdT_P * dHdP_T); // Array Index 34
  const dTdP_S = (dTdP_T * dSdT_P - dTdT_P * dSdP_T) / (dPdP_T * dSdT_P - dPdT_P * dSdP_T); // Array Index 35

  const dTdV_P = (dTdP_T * dPdT_P - dTdT_P * dPdP_T) / (dVdP_T * dPdT_P - dVdT_P * dPdP_T); // Array Index 36
  const dTdV_U = (dTdP_T * dUdT_P - dTdT_P * dUdP_T) / (dVdP_T * dUdT_P - dVdT_P * dUdP_T); // Array Index 37
  const dTdV_H = (dTdP_T * dHdT_P - dTdT_P * dHdP_T) / (dVdP_T * dHdT_P - dVdT_P * dHdP_T); // Array Index 38
  const dTdV_S = (dTdP_T * dSdT_P - dTdT_P * dSdP_T) / (dVdP_T * dSdT_P - dVdT_P * dSdP_T); // Array Index 39

  const dTdU_P = (dTdP_T * dPdT_P - dTdT_P * dPdP_T) / (dUdP_T * dPdT_P - dUdT_P * dPdP_T); // Array Index 40
  const dTdU_V = (dTdP_T * dVdT_P - dTdT_P * dVdP_T) / (dUdP_T * dVdT_P - dUdT_P * dVdP_T); // Array Index 41
  const dTdU_H = (dTdP_T * dHdT_P - dTdT_P * dHdP_T) / (dUdP_T * dHdT_P - dUdT_P * dHdP_T); // Array Index 42
  const dTdU_S = (dTdP_T * dSdT_P - dTdT_P * dSdP_T) / (dUdP_T * dSdT_P - dUdT_P * dSdP_T); // Array Index 43

  const dTdH_P = (dTdP_T * dPdT_P - dTdT_P * dPdP_T) / (dHdP_T * dPdT_P - dHdT_P * dPdP_T); // Array Index 44
  const dTdH_V = (dTdP_T * dVdT_P - dTdT_P * dVdP_T) / (dHdP_T * dVdT_P - dHdT_P * dVdP_T); // Array Index 45
  const dTdH_U = (dTdP_T * dUdT_P - dTdT_P * dUdP_T) / (dHdP_T * dUdT_P - dHdT_P * dUdP_T); // Array Index 46
  const dTdH_S = (dTdP_T * dSdT_P - dTdT_P * dSdP_T) / (dHdP_T * dSdT_P - dHdT_P * dSdP_T); // Array Index 47

  const dTdS_P = (dTdP_T * dPdT_P - dTdT_P * dPdP_T) / (dSdP_T * dPdT_P - dSdT_P * dPdP_T); // Array Index 48
  const dTdS_V = (dTdP_T * dVdT_P - dTdT_P * dVdP_T) / (dSdP_T * dVdT_P - dSdT_P * dVdP_T); // Array Index 49
  const dTdS_U = (dTdP_T * dUdT_P - dTdT_P * dUdP_T) / (dSdP_T * dUdT_P - dSdT_P * dUdP_T); // Array Index 50
  const dTdS_H = (dTdP_T * dHdT_P - dTdT_P * dHdP_T) / (dSdP_T * dHdT_P - dSdT_P * dHdP_T); // Array Index 51

  // The following five groups provide the partial derivatives of volume.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dVdP_U = (dVdP_T * dUdT_P - dVdT_P * dUdP_T) / (dPdP_T * dUdT_P - dPdT_P * dUdP_T); // Array Index 53
  const dVdP_H = (dVdP_T * dHdT_P - dVdT_P * dHdP_T) / (dPdP_T * dHdT_P - dPdT_P * dHdP_T); // Array Index 54
  const dVdP_S = (dVdP_T * dSdT_P - dVdT_P * dSdP_T) / (dPdP_T * dSdT_P - dPdT_P * dSdP_T); // Array Index 55

  const dVdT_U = (dVdP_T * dUdT_P - dVdT_P * dUdP_T) / (dTdP_T * dUdT_P - dTdT_P * dUdP_T); // Array Index 57
  const dVdT_H = (dVdP_T * dHdT_P - dVdT_P * dHdP_T) / (dTdP_T * dHdT_P - dTdT_P * dHdP_T); // Array Index 58
  const dVdT_S = (dVdP_T * dSdT_P - dVdT_P * dSdP_T) / (dTdP_T * dSdT_P - dTdT_P * dSdP_T); // Array Index 59

  const dVdU_P = (dVdP_T * dPdT_P - dVdT_P * dPdP_T) / (dUdP_T * dPdT_P - dUdT_P * dPdP_T); // Array Index 60
  const dVdU_T = (dVdP_T * dTdT_P - dVdT_P * dTdP_T) / (dUdP_T * dTdT_P - dUdT_P * dTdP_T); // Array Index 61
  const dVdU_H = (dVdP_T * dHdT_P - dVdT_P * dHdP_T) / (dUdP_T * dHdT_P - dUdT_P * dHdP_T); // Array Index 62
  const dVdU_S = (dVdP_T * dSdT_P - dVdT_P * dSdP_T) / (dUdP_T * dSdT_P - dUdT_P * dSdP_T); // Array Index 63

  const dVdH_P = (dVdP_T * dPdT_P - dVdT_P * dPdP_T) / (dHdP_T * dPdT_P - dHdT_P * dPdP_T); // Array Index 64
  const dVdH_T = (dVdP_T * dTdT_P - dVdT_P * dTdP_T) / (dHdP_T * dTdT_P - dHdT_P * dTdP_T); // Array Index 65
  const dVdH_U = (dVdP_T * dUdT_P - dVdT_P * dUdP_T) / (dHdP_T * dUdT_P - dHdT_P * dUdP_T); // Array Index 66
  const dVdH_S = (dVdP_T * dSdT_P - dVdT_P * dSdP_T) / (dHdP_T * dSdT_P - dHdT_P * dSdP_T); // Array Index 67

  const dVdS_P = (dVdP_T * dPdT_P - dVdT_P * dPdP_T) / (dSdP_T * dPdT_P - dSdT_P * dPdP_T); // Array Index 68
  const dVdS_T = (dVdP_T * dTdT_P - dVdT_P * dTdP_T) / (dSdP_T * dTdT_P - dSdT_P * dTdP_T); // Array Index 69
  const dVdS_U = (dVdP_T * dUdT_P - dVdT_P * dUdP_T) / (dSdP_T * dUdT_P - dSdT_P * dUdP_T); // Array Index 70
  const dVdS_H = (dVdP_T * dHdT_P - dVdT_P * dHdP_T) / (dSdP_T * dHdT_P - dSdT_P * dHdP_T); // Array Index 71

  // The following five groups provide the partial derivatives of internal energy.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dUdP_V = (dUdP_T * dVdT_P - dUdT_P * dVdP_T) / (dPdP_T * dVdT_P - dPdT_P * dVdP_T); // Array Index 73
  const dUdP_H = (dUdP_T * dHdT_P - dUdT_P * dHdP_T) / (dPdP_T * dHdT_P - dPdT_P * dHdP_T); // Array Index 74
  const dUdP_S = (dUdP_T * dSdT_P - dUdT_P * dSdP_T) / (dPdP_T * dSdT_P - dPdT_P * dSdP_T); // Array Index 75

  const dUdT_V = (dUdP_T * dVdT_P - dUdT_P * dVdP_T) / (dTdP_T * dVdT_P - dTdT_P * dVdP_T); // Array Index 77
  const dUdT_H = (dUdP_T * dHdT_P - dUdT_P * dHdP_T) / (dTdP_T * dHdT_P - dTdT_P * dHdP_T); // Array Index 78
  const dUdT_S = (dUdP_T * dSdT_P - dUdT_P * dSdP_T) / (dTdP_T * dSdT_P - dTdT_P * dSdP_T); // Array Index 79

  const dUdV_P = (dUdP_T * dPdT_P - dUdT_P * dPdP_T) / (dVdP_T * dPdT_P - dVdT_P * dPdP_T); // Array Index 80
  const dUdV_T = (dUdP_T * dTdT_P - dUdT_P * dTdP_T) / (dVdP_T * dTdT_P - dVdT_P * dTdP_T); // Array Index 81
  const dUdV_H = (dUdP_T * dHdT_P - dUdT_P * dHdP_T) / (dVdP_T * dHdT_P - dVdT_P * dHdP_T); // Array Index 82
  const dUdV_S = (dUdP_T * dSdT_P - dUdT_P * dSdP_T) / (dVdP_T * dSdT_P - dVdT_P * dSdP_T); // Array Index 83

  const dUdH_P = (dUdP_T * dPdT_P - dUdT_P * dPdP_T) / (dHdP_T * dPdT_P - dHdT_P * dPdP_T); // Array Index 84
  const dUdH_T = (dUdP_T * dTdT_P - dUdT_P * dTdP_T) / (dHdP_T * dTdT_P - dHdT_P * dTdP_T); // Array Index 85
  const dUdH_V = (dUdP_T * dVdT_P - dUdT_P * dVdP_T) / (dHdP_T * dVdT_P - dHdT_P * dVdP_T); // Array Index 86
  const dUdH_S = (dUdP_T * dSdT_P - dUdT_P * dSdP_T) / (dHdP_T * dSdT_P - dHdT_P * dSdP_T); // Array Index 87

  const dUdS_P = (dUdP_T * dPdT_P - dUdT_P * dPdP_T) / (dSdP_T * dPdT_P - dSdT_P * dPdP_T); // Array Index 88
  const dUdS_T = (dUdP_T * dTdT_P - dUdT_P * dTdP_T) / (dSdP_T * dTdT_P - dSdT_P * dTdP_T); // Array Index 89
  const dUdS_V = (dUdP_T * dVdT_P - dUdT_P * dVdP_T) / (dSdP_T * dVdT_P - dSdT_P * dVdP_T); // Array Index 90
  const dUdS_H = (dUdP_T * dHdT_P - dUdT_P * dHdP_T) / (dSdP_T * dHdT_P - dSdT_P * dHdP_T); // Array Index 91

  // The following five groups provide the partial derivatives of enthalpy.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dHdP_V = (dHdP_T * dVdT_P - dHdT_P * dVdP_T) / (dPdP_T * dVdT_P - dPdT_P * dVdP_T); // Array Index 93
  const dHdP_U = (dHdP_T * dUdT_P - dHdT_P * dUdP_T) / (dPdP_T * dUdT_P - dPdT_P * dUdP_T); // Array Index 94
  const dHdP_S = (dHdP_T * dSdT_P - dHdT_P * dSdP_T) / (dPdP_T * dSdT_P - dPdT_P * dSdP_T); // Array Index 95

  const dHdT_V = (dHdP_T * dVdT_P - dHdT_P * dVdP_T) / (dTdP_T * dVdT_P - dTdT_P * dVdP_T); // Array Index 97
  const dHdT_U = (dHdP_T * dUdT_P - dHdT_P * dUdP_T) / (dTdP_T * dUdT_P - dTdT_P * dUdP_T); // Array Index 98
  const dHdT_S = (dHdP_T * dSdT_P - dHdT_P * dSdP_T) / (dTdP_T * dSdT_P - dTdT_P * dSdP_T); // Array Index 99

  const dHdV_P = (dHdP_T * dPdT_P - dHdT_P * dPdP_T) / (dVdP_T * dPdT_P - dVdT_P * dPdP_T); // Array Index 100
  const dHdV_T = (dHdP_T * dTdT_P - dHdT_P * dTdP_T) / (dVdP_T * dTdT_P - dVdT_P * dTdP_T); // Array Index 101
  const dHdV_U = (dHdP_T * dUdT_P - dHdT_P * dUdP_T) / (dVdP_T * dUdT_P - dVdT_P * dUdP_T); // Array Index 102
  const dHdV_S = (dHdP_T * dSdT_P - dHdT_P * dSdP_T) / (dVdP_T * dSdT_P - dVdT_P * dSdP_T); // Array Index 103

  const dHdU_P = (dHdP_T * dPdT_P - dHdT_P * dPdP_T) / (dUdP_T * dPdT_P - dUdT_P * dPdP_T); // Array Index 104
  const dHdU_T = (dHdP_T * dTdT_P - dHdT_P * dTdP_T) / (dUdP_T * dTdT_P - dUdT_P * dTdP_T); // Array Index 105
  const dHdU_V = (dHdP_T * dVdT_P - dHdT_P * dVdP_T) / (dUdP_T * dVdT_P - dUdT_P * dVdP_T); // Array Index 106
  const dHdU_S = (dHdP_T * dSdT_P - dHdT_P * dSdP_T) / (dUdP_T * dSdT_P - dUdT_P * dSdP_T); // Array Index 107

  const dHdS_P = (dHdP_T * dPdT_P - dHdT_P * dPdP_T) / (dSdP_T * dPdT_P - dSdT_P * dPdP_T); // Array Index 108
  const dHdS_T = (dHdP_T * dTdT_P - dHdT_P * dTdP_T) / (dSdP_T * dTdT_P - dSdT_P * dTdP_T); // Array Index 109
  const dHdS_V = (dHdP_T * dVdT_P - dHdT_P * dVdP_T) / (dSdP_T * dVdT_P - dSdT_P * dVdP_T); // Array Index 110
  const dHdS_U = (dHdP_T * dUdT_P - dHdT_P * dUdP_T) / (dSdP_T * dUdT_P - dSdT_P * dUdP_T); // Array Index 111

  // The following five groups provide the partial derivatives of entropy.  Refer to IAPWS AN3-07 (2018) Equation 5
  const dSdP_V = (dSdP_T * dVdT_P - dSdT_P * dVdP_T) / (dPdP_T * dVdT_P - dPdT_P * dVdP_T); // Array Index 113
  const dSdP_U = (dSdP_T * dUdT_P - dSdT_P * dUdP_T) / (dPdP_T * dUdT_P - dPdT_P * dUdP_T); // Array Index 114
  const dSdP_H = (dSdP_T * dHdT_P - dSdT_P * dHdP_T) / (dPdP_T * dHdT_P - dPdT_P * dHdP_T); // Array Index 115

  const dSdT_V = (dSdP_T * dVdT_P - dSdT_P * dVdP_T) / (dTdP_T * dVdT_P - dTdT_P * dVdP_T); // Array Index 117
  const dSdT_U = (dSdP_T * dUdT_P - dSdT_P * dUdP_T) / (dTdP_T * dUdT_P - dTdT_P * dUdP_T); // Array Index 118
  const dSdT_H = (dSdP_T * dHdT_P - dSdT_P * dHdP_T) / (dTdP_T * dHdT_P - dTdT_P * dHdP_T); // Array Index 119

  const dSdV_P = (dSdP_T * dPdT_P - dSdT_P * dPdP_T) / (dVdP_T * dPdT_P - dVdT_P * dPdP_T); // Array Index 120
  const dSdV_T = (dSdP_T * dTdT_P - dSdT_P * dTdP_T) / (dVdP_T * dTdT_P - dVdT_P * dTdP_T); // Array Index 121
  const dSdV_U = (dSdP_T * dUdT_P - dSdT_P * dUdP_T) / (dVdP_T * dUdT_P - dVdT_P * dUdP_T); // Array Index 122
  const dSdV_H = (dSdP_T * dHdT_P - dSdT_P * dHdP_T) / (dVdP_T * dHdT_P - dVdT_P * dHdP_T); // Array Index 123

  const dSdU_P = (dSdP_T * dPdT_P - dSdT_P * dPdP_T) / (dUdP_T * dPdT_P - dUdT_P * dPdP_T); // Array Index 124
  const dSdU_T = (dSdP_T * dTdT_P - dSdT_P * dTdP_T) / (dUdP_T * dTdT_P - dUdT_P * dTdP_T); // Array Index 125
  const dSdU_V = (dSdP_T * dVdT_P - dSdT_P * dVdP_T) / (dUdP_T * dVdT_P - dUdT_P * dVdP_T); // Array Index 126
  const dSdU_H = (dSdP_T * dHdT_P - dSdT_P * dHdP_T) / (dUdP_T * dHdT_P - dUdT_P * dHdP_T); // Array Index 127

  const dSdH_P = (dSdP_T * dPdT_P - dSdT_P * dPdP_T) / (dHdP_T * dPdT_P - dHdT_P * dPdP_T); // Array Index 128
  const dSdH_T = (dSdP_T * dTdT_P - dSdT_P * dTdP_T) / (dHdP_T * dTdT_P - dHdT_P * dTdP_T); // Array Index 129
  const dSdH_V = (dSdP_T * dVdT_P - dSdT_P * dVdP_T) / (dHdP_T * dVdT_P - dHdT_P * dVdP_T); // Array Index 130
  const dSdH_U = (dSdP_T * dUdT_P - dSdT_P * dUdP_T) / (dHdP_T * dUdT_P - dHdT_P * dUdP_T); // Array Index 131

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
    dUdP_H, // 74
    dUdP_S, // 75
    dUdT_P, // 76
    dUdT_V, // 77
    dUdT_H, // 78
    dUdT_S, // 79
    dUdV_P, // 80
    dUdV_T, // 81
    dUdV_H, // 82
    dUdV_S, // 83
    dUdH_P, // 84
    dUdH_T, // 85
    dUdH_V, // 86
    dUdH_S, // 87
    dUdS_P, // 88
    dUdS_T, // 89
    dUdS_V, // 90
    dUdS_H, // 91
    dHdP_T, // 92
    dHdP_V, // 93
    dHdP_U, // 94
    dHdP_S, // 95
    dHdT_P, // 96
    dHdT_V, // 97
    dHdT_U, // 98
    dHdT_S, // 99
    dHdV_P, // 100
    dHdV_T, // 101
    dHdV_U, // 102
    dHdV_S, // 103
    dHdU_P, // 104
    dHdU_T, // 105
    dHdU_V, // 106
    dHdU_S, // 107
    dHdS_P, // 108
    dHdS_T, // 109
    dHdS_V, // 110
    dHdS_U, // 111
    dSdP_T, // 112
    dSdP_V, // 113
    dSdP_U, // 114
    dSdP_H, // 115
    dSdT_P, // 116
    dSdT_V, // 117
    dSdT_U, // 118
    dSdT_H, // 119
    dSdV_P, // 120
    dSdV_T, // 121
    dSdV_U, // 122
    dSdV_H, // 123
    dSdU_P, // 124
    dSdU_T, // 125
    dSdU_V, // 126
    dSdU_H, // 127
    dSdH_P, // 128
    dSdH_T, // 129
    dSdH_V, // 130
    dSdH_U, // 131
  ];
}
