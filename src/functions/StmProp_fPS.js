import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";
import * as Units from "./Units.js";
import * as Region1Calculations from "./Region1Calculations.js";
import * as Region2Calculations from "./Region2Calculations.js";
import * as Region3Calculations from "./Region3Calculations.js";
import * as Region4Calculations from "./Region4Calculations.js";
import * as Region4SatPressure from "./Region4SatPressure.js";
import * as Boundary2_3 from "./Boundary2_3Calculations.js";

//
//  Steam Properties as a function of Pressure and Entropy
//

export function SteamProperties(pressure, entropy) {
  // SteamPropertiesArray = [(0) Pressure, (1) Temperature, (2) Quality, (3) Enthalpy, (4) Entropy,
  //  (5) InternalEnergy, (6) Volume, (7) IsobaricHeat, (8) IsochoricHeat, (9) SpeedOfSound,
  //  (10) Viscosity, (11) Thermal Conductivity]

  const entropyCritical = 4.41202148223476; // kJ/kg/K
  const entropyMin = Region1Calculations.Properties_fPT(Constants.pTriple, 273.16)[Units.VectorParameters.Entropy];
  const entropyMax = Region2Calculations.Properties_fPT(pressure, 1073.15)[Units.VectorParameters.Entropy];
  // Verify that the pressure/enthalpy is in regions 1, 2, 3, or 4.  Region 5 doesn't have backward equations

  if (pressure >= Constants.pT0 && pressure <= Constants.pmax && entropy >= entropyMin && entropy <= entropyMax) {
    if (pressure <= Region4SatPressure.SatPressure(Constants.T13_boundary)) {
      // Region 3 is not included in this group
      const entropyQ0 = Region1Calculations.Properties_fPT(pressure, Region4Calculations.SatTemperature(pressure))[
        Units.VectorParameters.Entropy
      ];
      const entropyQ1 = Region2Calculations.Properties_fPT(pressure, Region4Calculations.SatTemperature(pressure))[
        Units.VectorParameters.Entropy
      ];

      if (entropy <= entropyQ0) {
        // Region 1
        let SteamPropertiesArray = Region1Calculations.Properties_fPT(
          pressure,
          Region1Calculations.T_fPS(pressure, entropy)
        );
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
        return SteamPropertiesArray;
      } else if (entropy >= entropyQ1) {
        // Region 2
        if (pressure <= 4) {
          // Region 2a
          let SteamPropertiesArray = Region2Calculations.Properties_fPT(
            pressure,
            Region2Calculations.T2a_fPS(pressure, entropy)
          );
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
          return SteamPropertiesArray;
        } else if (entropy >= 5.85) {
          // Region 2b
          return Region2Calculations.Properties_fPT(pressure, Region2Calculations.T2b_fPS(pressure, entropy));
        } // Region 2c
        else {
          let SteamPropertiesArray = Region2Calculations.Properties_fPT(
            pressure,
            Region2Calculations.T2c_fPS(pressure, entropy)
          );
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
          return SteamPropertiesArray;
        }
      } // Region 4
      else {
        let SteamPropertiesArray = Region4Calculations.Properties_fPS(pressure, entropy);
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
        return SteamPropertiesArray;
      }
    } // if the pressure is above the saturation pressure of 623.15 (which includes region 3)
    else {
      const reg1Entropy350C = Region1Calculations.Properties_fPT(pressure, Constants.T13_boundary)[
        Units.VectorParameters.Entropy
      ];
      const entropyB23 = Region2Calculations.Properties_fPT(pressure, Boundary2_3.reg23BoundaryTfP(pressure))[
        Units.VectorParameters.Entropy
      ];

      if (entropy <= reg1Entropy350C) {
        // Region 1
        let SteamPropertiesArray = Region1Calculations.Properties_fPT(
          pressure,
          Region1Calculations.T_fPS(pressure, entropy)
        );
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
        return SteamPropertiesArray;
      } else if (entropy >= entropyB23) {
        // Region 2
        if (entropy >= 5.85) {
          // Region 2b
          let SteamPropertiesArray = Region2Calculations.Properties_fPT(
            pressure,
            Region2Calculations.T2b_fPS(pressure, entropy)
          );
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
          return SteamPropertiesArray;
        } // Region 2c
        else {
          let SteamPropertiesArray = Region2Calculations.Properties_fPT(
            pressure,
            Region2Calculations.T2c_fPS(pressure, entropy)
          );
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
          return SteamPropertiesArray;
        }
      } else if (pressure >= Region3Calculations.Reg3_PSATs(entropy)) {
        // Region 3
        if (entropy <= entropyCritical) {
          // Region 3a
          const T3a = Region3Calculations.Reg3a_Tps(pressure, entropy);
          const V3a = Region3Calculations.Reg3a_Vps(pressure, entropy);
          let SteamPropertiesArray = Region3Calculations.Properties_fVT(V3a, T3a);
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
          return SteamPropertiesArray;
        } // Region 3b
        else {
          const T3b = Region3Calculations.Reg3b_Tps(pressure, entropy);
          const V3b = Region3Calculations.Reg3b_Vps(pressure, entropy);
          let SteamPropertiesArray = Region3Calculations.Properties_fVT(V3b, T3b);
          SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
          SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
          return SteamPropertiesArray;
        }
      } // region 4
      else {
        let SteamPropertiesArray = Region4Calculations.Properties_fPS(pressure, entropy);
        SteamPropertiesArray[Units.VectorParameters.Pressure] = pressure;
        SteamPropertiesArray[Units.VectorParameters.Entropy] = entropy;
        return SteamPropertiesArray;
      }
    }
  } else throw Errors.EntropyOrPressureNotValid;
}
