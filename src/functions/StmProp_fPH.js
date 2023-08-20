import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
import * as Units from "./Units.js";
import * as Region1Calculations from "./Region1Calculations.js";
import * as Region2Calculations from "./Region2Calculations.js";
import * as Region3Calculations from "./Region3Calculations.js";
import * as Region4Calculations from "./Region4Calculations.js";
import * as Region4SatPressure from "./Region4SatPressure.js";
import * as Boundary2_3 from "./Boundary2_3Calculations.js";

export function SteamProperties(pressure, enthalpy) {
  // SteamPropertiesArray = [(0) Pressure, (1) Temperature, (2) Quality, (3) Enthalpy, (4) Entropy,
  //  (5) InternalEnergy, (6) Volume, (7) IsobaricHeat, (8) IsochoricHeat, (9) SpeedOfSound]

  const enthalpyMin = Region1Calculations.Properties_fPT(Constants.pTriple, Constants.Ttriple)[
    Units.VectorParameters.Enthalpy
  ];
  const enthalpyMax = Region2Calculations.Properties_fPT(Constants.pT0, Constants.T25_boundary)[
    Units.VectorParameters.Enthalpy
  ];
  // Verify that the pressure/enthalpy is in regions 1, 2, 3, or 4.  Region 5 doesn't have backward equations
  if (
    pressure >= Constants.pTriple &&
    pressure <= Constants.pmax &&
    enthalpy >= enthalpyMin &&
    enthalpy <= enthalpyMax
  ) {
    // If true, we are in the valid range
    if (pressure <= Region4SatPressure.SatPressure(Constants.T13_boundary)) {
      // Region 3 is not included in this group this
      const enthalpyQ0 = Region1Calculations.Properties_fPT(pressure, Region4Calculations.SatTemperature(pressure))[
        Units.VectorParameters.Enthalpy
      ];
      const enthalpyQ1 = Region2Calculations.Properties_fPT(pressure, Region4Calculations.SatTemperature(pressure))[
        Units.VectorParameters.Enthalpy
      ];

      if (enthalpy <= enthalpyQ0) {
        // Region 1
        let SteamPropertiesArray = Region1Calculations.Properties_fPT(
          pressure,
          Region1Calculations.T_fPH(pressure, enthalpy)
        );
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
        return SteamPropertiesArray;
      } else if (enthalpy >= enthalpyQ1) {
        // Region 2
        if (pressure <= Constants.p2a2b_boundary) {
          // Region 2a
          let SteamPropertiesArray = Region2Calculations.Properties_fPT(
            pressure,
            Region2Calculations.T2a_fPH(pressure, enthalpy)
          );
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
          return SteamPropertiesArray;
        } else if (pressure <= Region2Calculations.B2bc_PfH(enthalpy)) {
          // Region 2b
          let SteamPropertiesArray = Region2Calculations.Properties_fPT(
            pressure,
            Region2Calculations.T2b_fPH(pressure, enthalpy)
          );
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
          return SteamPropertiesArray;
        } // Region 2c
        else {
          let SteamPropertiesArray = Region2Calculations.Properties_fPT(
            pressure,
            Region2Calculations.T2c_fPH(pressure, enthalpy)
          );
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
          return SteamPropertiesArray;
        }
      } // Region 4
      else {
        let SteamPropertiesArray = Region4Calculations.Properties_fPH(pressure, enthalpy);
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
        return SteamPropertiesArray;
      }
    } // if the pressure is above the saturation pressure of 623.15 (which includes region 3)
    else {
      const reg1Enthalpy350C = Region1Calculations.Properties_fPT(pressure, Constants.T13_boundary)[
        Units.VectorParameters.Enthalpy
      ];
      const enthalpyB23 = Region2Calculations.Properties_fPT(pressure, Boundary2_3.reg23BoundaryTfP(pressure))[
        Units.VectorParameters.Enthalpy
      ];

      if (enthalpy <= reg1Enthalpy350C) {
        // Region 1
        let SteamPropertiesArray = Region1Calculations.Properties_fPT(
          pressure,
          Region1Calculations.T_fPH(pressure, enthalpy)
        );
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
        return SteamPropertiesArray;
      } else if (enthalpy >= enthalpyB23) {
        // Region 2
        if (pressure <= Region2Calculations.B2bc_PfH(enthalpy)) {
          // Region 2b
          let SteamPropertiesArray = Region2Calculations.Properties_fPT(
            pressure,
            Region2Calculations.T2b_fPH(pressure, enthalpy)
          );
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
          return SteamPropertiesArray;
        } // Region 2c
        else {
          let SteamPropertiesArray = Region2Calculations.Properties_fPT(
            pressure,
            Region2Calculations.T2c_fPH(pressure, enthalpy)
          );
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
          return SteamPropertiesArray;
        }
      } else if (pressure >= Region3Calculations.Reg3_PSATh(enthalpy)) {
        // Region 3
        if (enthalpy <= Region3Calculations.H3ab(pressure)) {
          // Region 3a
          const T3a = Region3Calculations.Reg3a_Tph(pressure, enthalpy);
          const V3a = Region3Calculations.Reg3a_Vph(pressure, enthalpy);
          let SteamPropertiesArray = Region3Calculations.Properties_fVT(V3a, T3a);
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
          return SteamPropertiesArray;
        } // Region 3b
        else {
          const T3b = Region3Calculations.Reg3b_Tph(pressure, enthalpy);
          const V3b = Region3Calculations.Reg3b_Vph(pressure, enthalpy);
          let SteamPropertiesArray = Region3Calculations.Properties_fVT(V3b, T3b);
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
          return SteamPropertiesArray;
        }
      } // region 4
      else {
        let SteamPropertiesArray = Region4Calculations.Properties_fPH(pressure, enthalpy);
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Enthalpy] = enthalpy;
        return SteamPropertiesArray;
      }
    }
  } else throw Errors.EnthalpyNotValid;
}
