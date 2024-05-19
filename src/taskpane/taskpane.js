/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Office */

// The initialize function must be run each time a new page is loaded
import { PublicClientNext } from "@azure/msal-browser";

let pca = undefined;
Office.onReady(async (info) => {
  if (info.host === Office.HostType.Excel) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("run").onclick = run;

    // Initialize the public client application
    pca = await PublicClientNext.createPublicClientApplication({
      auth: {
        clientId: "e9a58708-ab78-4d3c-a158-9db2a75465ad",
        authority: "https://login.microsoftonline.com/common",
        supportsNestedAppAuth: true,
      },
    });
  }
});

async function run() {
  // Specify minimum scopes needed for the access token.
  const tokenRequest = {
    scopes: ["Files.Read", "User.Read", "openid", "profile"],
  };
  let accessToken = null;

  try {
    console.log("Trying to acquire token silently...");
    const userAccount = await pca.acquireTokenSilent(tokenRequest);
    console.log("Acquired token silently.");
    accessToken = userAccount.accessToken;
  } catch (error) {
    console.log(`Unable to acquire token silently: ${error}`);
  }

  if (accessToken === null) {
    // Acquire token silent failure. Send an interactive request via popup.
    try {
      console.log("Trying to acquire token interactively...");
      const userAccount = await pca.acquireTokenPopup(tokenRequest);
      console.log("Acquired token interactively.");
      accessToken = userAccount.accessToken;
    } catch (popupError) {
      // Acquire token interactive failure.
      console.log(`Unable to acquire token interactively: ${popupError}`);
    }
  }

  // Log error if both silent and popup requests failed.
  if (accessToken === null) {
    console.error(`Unable to acquire access token.`);
    return;
  }

  // Call the Microsoft Graph API with the access token.
  const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root/children?$select=name&$top=10`, {
    headers: { Authorization: accessToken },
  });

  if (response.ok) {
    // Write file names to the console.
    const data = await response.json();
    const names = data.value.map((item) => item.name);
    names.forEach((name) => {
      console.log(name);
    });
  } else {
    const errorText = await response.text();
    console.error("Microsoft Graph call failed - error text: " + errorText);
  }
}
