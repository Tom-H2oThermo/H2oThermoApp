import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
import * as StmProp_fPS from "./StmProp_fPS.js";
import * as StmProp_fPH from "./StmProp_fPH.js";
import * as Units from "./Units.js";
import * as Region1Calculations from "./Region1Calculations.js";
import * as Region2Calculations from "./Region2Calculations.js";
import * as Region3Calculations from "./Region3Calculations.js";
import * as Region4Calculations from "./Region4Calculations.js";
import * as Region4SatPressure from "./Region4SatPressure.js";
import * as Boundary2_3 from "./Boundary2_3Calculations.js";

// The following section calculates h(s) along the 1073.15K (800C) isotherm from pMin to 100 MPa
// 1000 equally spaced values of s between sMin and sMax were used to calculate the pressure at those points
// Then, using this calculated pressure and the 1073.15K temperature, the entropy value was calculated
// This data was used for a table of x,y valves (entropy, enthalpy), equally spaced from sMin to sMax
// This data was then curvefit and used to establish the upper enthalpy boundary as a function of s, over this range
// The following polynomial is a curvefit based on the IAPWS IFC formulations, but is NOT part of that standard

const sMin = -1.545495919e-4; // SR4 Section 4.3 s'(273.15 K)
const sMax = 11.9210550686135; // Calculated in Excel using H2oPTS(H2oTP(273.15), 1073.15)
const s100MPa623K = 3.397782955; // SR4 Section 4.5 boundary between 1 and 3 at 100 MPa
const s100MPa1073K = 6.04048367171238; // Calculated in Excel using H2oPTS(100, 1073.15)
//const hMax;

function H_Pmin(entropy) {
  //Curvefit for h(pmin, s) over range of s
  return (
    -6.62122258198414189 +
    321.238185301903577 * entropy +
    -82.0959654382662344 * Math.pow(entropy, 2) +
    57.8221281826882412 * Math.pow(entropy, 3) +
    -20.5039872574993337 * Math.pow(entropy, 4) +
    3.96952357350072751 * Math.pow(entropy, 5) +
    -0.423564091004529276 * Math.pow(entropy, 6) +
    0.0232321078165524944 * Math.pow(entropy, 7) +
    -0.000506920403085527285 * Math.pow(entropy, 8)
  );
}

function HP800C(entropy) {
  // Curvefit for h(800C, s) over range of s
  return (
    -232411.100029691685 +
    16514718.0618790206 / entropy +
    -499958223.428067708 / Math.pow(entropy, 2) +
    8568365094.23440593 / Math.pow(entropy, 3) +
    -90866887506.2776784 / Math.pow(entropy, 4) +
    610151522908.616501 / Math.pow(entropy, 5) +
    -2531273960518.454 / Math.pow(entropy, 6) +
    5926968673997.74072 / Math.pow(entropy, 7) +
    -5993244023196.03396 / Math.pow(entropy, 8)
  );
}

function H_Max(entropy) {
  if (entropy <= s100MPa1073K) {
    return StmProp_fPS.SteamProperties(Constants.pmax, entropy)[Units.VectorParameters.Enthalpy];
  } else {
    return HP800C(entropy);
  }
}

//
//  Steam Properties as a function of Enthalpy and Entropy
//

export function SteamProperties(enthalpy, entropy) {
  const sSatLiq623K = 3.77828134; // SR4 Section 4.3 s'(623.15 K)
  const sCritical = 4.41202148223476; // SR4 Section 4.3 s critical
  const s2c2b = 5.85; // SR4 Section 4.4 boundary between regions 2c and 2b
  const sSatVap273K = 9.155759395; // SR4 Section 4.4 maximum two phase entropy
  const sB23Min = 5.048096828; // SR4 Section 4.6 sB23 boundary minimum s value
  const sB23Max = 5.260578707; // SR4 Section 4.6 sB23 boundary maximum s value
  const hB23Min = 2.563592004e3; // SR4 Section 4.6 sB23 boundary minimum h value
  const hB23Max = 2.812942061e3; // SR4 Section 4.6 sB23 boundary maximum h value
  const sSatVap623K = 5.210887825; // SR4 Section 5.3 lower bound of validity for region 4 backward equation
  const sH2abMin = 6.06970916; // Calculated in Excel using H2oPQS(4,1)
  const sH2abMax = 7.8523404; // Calculated in Excel using H2oPTS(4,1073.15)

  // Verify that the entropy is between sMin and sMax
  if (entropy >= sMin && entropy <= sMax) {
    const hPmin = H_Pmin(entropy);
    const hMax = H_Max(entropy);

    // if the following true, at this point, we are within the overall valid region of p(s,h), except
    // also not valid if 2 phase (Region 4) and less than s"(623.15K)   Note: s' is saturated liquid line, s" is saturated vapor line
    if (enthalpy >= hPmin && enthalpy <= hMax) {
      var hSat = 0; // variable used to define saturation border h(s)

      if (entropy <= sSatVap273K) {
        if (entropy <= sSatLiq623K) {
          hSat = Region3Calculations.H1_sat_liqS(entropy);
        } else if (entropy <= sCritical) {
          hSat = Region3Calculations.H3a_sat_liqS(entropy);
        } else if (entropy < s2c2b) {
          hSat = Region3Calculations.H2c3b_sat_VapS(entropy);
        } else {
          hSat = Region3Calculations.H2ab_sat_VapS(entropy);
        }
      }

      if (entropy <= sSatVap273K && enthalpy <= hSat) {
        //Region 4
        if (entropy >= sSatVap623K) {
          const Tsat = Region3Calculations.TsatHS(enthalpy, entropy);
          const Psat = Region4SatPressure.SatPressure(Tsat);
          const HsatLiq = Region1Calculations.Properties_fPT(Psat, Tsat)[Units.VectorParameters.Enthalpy];
          const HsatVap = Region2Calculations.Properties_fPT(Psat, Tsat, false)[Units.VectorParameters.Enthalpy];
          const Quality = (enthalpy - HsatLiq) / (HsatVap - HsatLiq);
          let SteamPropertiesArray = Region4Calculations.Properties_fPQ(Psat, Quality);
          SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
          SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
          return SteamPropertiesArray;
        } else throw Errors.EntropyNotValidForSaturatedSteam;
      } else if (entropy <= sSatLiq623K) {
        // could be region 1, or region 3a
        if (enthalpy >= Region3Calculations.H1_sat_liqS(entropy)) {
          //Either region 1 or 3a
          if (entropy >= s100MPa623K && enthalpy >= Region3Calculations.Hb13S(entropy)) {
            // region 3a
            const P3a = Region3Calculations.P3aHS(enthalpy, entropy);
            const T3a = Region3Calculations.Reg3a_Tph(P3a, enthalpy);
            const V3a = Region3Calculations.Reg3a_Vps(P3a, entropy);
            let SteamPropertiesArray = Region3Calculations.Properties_fVT(V3a, T3a);
            SteamPropertiesArray[Units.VectorParameters.Pressure] = P3a;
            SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
            SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
            return SteamPropertiesArray;
          } // region 1
          else {
            const pressure = Region1Calculations.P_fHS(enthalpy, entropy);
            let SteamPropertiesArray = StmProp_fPH.SteamProperties(pressure, enthalpy);
            SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
            SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
            SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
            return SteamPropertiesArray;
          }
        } else throw Errors.EnthalpyNotValidForEntropy;
      } else if (entropy <= sCritical) {
        // region 3a or region 4, above or below the h'3a line
        if (enthalpy >= Region3Calculations.H3a_sat_liqS(entropy)) {
          // region 3a
          const P3a = Region3Calculations.P3aHS(enthalpy, entropy);
          const T3a = Region3Calculations.Reg3a_Tph(P3a, enthalpy);
          const V3a = Region3Calculations.Reg3a_Vps(P3a, entropy);
          let SteamPropertiesArray = Region3Calculations.Properties_fVT(V3a, T3a);
          SteamPropertiesArray[Units.VectorParameters.Pressure] = P3a;
          SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
          SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
          return SteamPropertiesArray;
        } else throw Errors.EnthalpyNotValidForEntropy;
      } else if (entropy <= s2c2b) {
        // region 3b, 2c, or 4
        if (enthalpy >= Region3Calculations.H2c3b_sat_VapS(entropy)) {
          // region 3b or 2c
          if (entropy <= sB23Min || enthalpy <= hB23Min) {
            // region 3b
            const P3b = Region3Calculations.P3bHS(enthalpy, entropy);
            const T3b = Region3Calculations.Reg3b_Tph(P3b, enthalpy);
            const V3b = Region3Calculations.Reg3b_Vps(P3b, entropy);
            let SteamPropertiesArray = Region3Calculations.Properties_fVT(V3b, T3b);
            SteamPropertiesArray[Units.VectorParameters.Pressure] = P3b;
            SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
            SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
            return SteamPropertiesArray;
          } else if (entropy >= sB23Max || enthalpy >= hB23Max) {
            // region 2c
            const pressure = Region2Calculations.P2c_fHS(enthalpy, entropy);
            let SteamPropertiesArray = StmProp_fPH.SteamProperties(pressure, enthalpy);
            SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
            SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
            SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
            return SteamPropertiesArray;
            // return reg2Calcs.P2c_fHS(enthalpy,entropy);
          }

          // Verified in the range of validity of the TB23(h,s) equation.  SR4 Figure 4.  Next steps are:
          // (1) Calculate TB23(h,s)          SR4 Equation 8
          // (2) Calculate pB23(TB23)         Boundary p(TB23) IFC97 Equ 5
          // (3) Calculate p(h,s)             Using SR2 Equ 5 backward equation p2c(h,s) // If p(h,s) >= pB23 then region 3 else region 2c: Within the small box in SR4 Figure 4
          else {
            const TB23 = Region3Calculations.Tb23HS(enthalpy, entropy); // Temperature within the small box
            const PB23 = Region2Calculations.P2c_fHS(enthalpy, entropy); // SR2 Eq 5.  Pressure within the small box
            const p23Boundary = Boundary2_3.reg23BoundaryPfT(TB23);
            if (PB23 > p23Boundary) {
              // Region 3b
              const P3b = Region3Calculations.P3bHS(enthalpy, entropy);
              const T3b = Region3Calculations.Reg3b_Tph(P3b, enthalpy);
              const V3b = Region3Calculations.Reg3b_Vps(P3b, entropy);
              let SteamPropertiesArray = Region3Calculations.Properties_fVT(V3b, T3b);
              SteamPropertiesArray[Units.VectorParameters.Pressure] = P3b;
              SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
              SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
              return SteamPropertiesArray;
            } // Region 2c
            else {
              const pressure = Region2Calculations.P2c_fHS(enthalpy, entropy);
              let SteamPropertiesArray = StmProp_fPH.SteamProperties(pressure, enthalpy);
              SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
              SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
              SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
              return SteamPropertiesArray;
              // return reg2Calcs.P2c_fHS(enthalpy, entropy);
            }
          }
        } else throw Errors.EnthalpyNotValidForEntropy;
      } else if (entropy <= sH2abMin) {
        // Region 2b
        const pressure = Region2Calculations.P2b_fHS(enthalpy, entropy);
        let SteamPropertiesArray = StmProp_fPH.SteamProperties(pressure, enthalpy);
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
        SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
        return SteamPropertiesArray;
        // return reg2Calcs.P2b_fHS(enthalpy,entropy);
      } else if (entropy <= sH2abMax && enthalpy >= Region2Calculations.H2ab(entropy)) {
        // Region 2b
        const pressure = Region2Calculations.P2b_fHS(enthalpy, entropy);
        let SteamPropertiesArray = StmProp_fPH.SteamProperties(pressure, enthalpy);
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
        SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
        return SteamPropertiesArray;
        // return reg2Calcs.P2b_fHS(enthalpy,entropy);
      } // Region 2a
      else {
        const pressure = Region2Calculations.P2a_fHS(enthalpy, entropy);
        let SteamPropertiesArray = StmProp_fPH.SteamProperties(pressure, enthalpy);
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
        SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
        return SteamPropertiesArray;
        // return reg2Calcs.P2a_fHS(enthalpy,entropy);
      }
    } // end of "If hmin <= s <= hmax"
    else throw Errors.EnthalpyNotValidForEntropy;
  } // end of "If smin <= s <= smax"
  else throw Errors.EntropyNotValid;
}
