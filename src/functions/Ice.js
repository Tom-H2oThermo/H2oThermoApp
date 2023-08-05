import * as Constants from "./Constants.js";
import * as Errors from "./Errors.js";

// The following constants are from IAPWS R14, Pressure along the Melting and Sublimation Curves of Ordinary Water
const aMelt = [ 0.119539337e7, 0.808183159e5, 0.333826860e4 ];
const bMelt = [ 0.300000e1, 0.257500e2, 0.103750e3 ];
const aSublim = [ -0.212144006e2, 0.273203819e2, -0.610598130e1 ];
const bSublim = [ 0.333333333e-2, 0.120666667e1, 0.170333333e1 ];
const ReducingPressureIceIII = 208.566; // MPa
const ReducingTemperatureIceIII = 251.165; // MPa
const ReducingPressureIceV = 350.1; // MPa
const ReducingTemperatureIceV = 256.164; // MPa
const ReducingPressureIceVI = 273.31; // MPa
const ReducingTemperatureIceVI = 251.165; // MPa
const ReducingPressureIceVII = 2216; // MPa
const ReducingTemperatureIceVII = 355; // MPa
export const MeltTemp100MPa = 264.208747604379; // Melting temperature at 100 MPa


export function PressMeltIceIh(temperature) // IAPWS R14 Equation 1.  The range of validity will be limited to 0 to 100 MPa to correspond with the IAPWS IF97 Industrial Use formulations.
{
    if (temperature>=251.165 && temperature<=273.16)  // Temperature range of validity for ice Ih melting (solid/liquid boundary)
    {
        var pi = 0;
        for (let i = 0; i < aMelt.length; i++)
        {
            pi += aMelt[i] * (1 - Math.pow(temperature / Constants.Ttriple, bMelt[i]));
        }
        pi += 1;
        let pressure= pi * Constants.pTriple; // 
        if (pressure>=Constants.pTriple && pressure<=100) 
        {
            return pressure;
        }
        else throw Errors.PressureNotWithinValidRange;
    }
    else throw Errors.TemperatureNotWithinValidRange;
}

export function PressSublIceIh(temperature) // IAPWS R14 Equation 6.  The range of validity will be limited to 0 to 100 MPa to correspond with the IAPWS IF97 Industrial Use formulations.
{
    if (temperature >= 130 && temperature <= 273.16)  // Temperature range of validity for ice Ih melting (solid/liquid boundary)
    {
        var lnPi = 0;
        for (let i = 0; i < aSublim.length; i++)
        {
            lnPi += aSublim[i] * Math.pow(temperature / Constants.Ttriple, bSublim[i]);
        }
        lnPi = lnPi/(temperature/Constants.Ttriple);
        let pressure = Constants.pTriple* Math.exp(lnPi);  // MPa
        if (pressure >0 && pressure <= Constants.pTriple)
        {
            return pressure;
        }
        else throw Errors.PressureNotWithinValidRange;
    }
    else throw Errors.TemperatureNotWithinValidRange;
} 
