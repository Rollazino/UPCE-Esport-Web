const clientId = "bo5sjt0kl4s7dw2pyg5lgc5vq2boa7";
const clientSecret = "hrm63du4z1ytwq6mt3cbmrcrlx8ocu";
const twitchUser = "upceesports";
let accessToken = "";

async function getAccessToken() {
  console.log("Requesting access token...");
  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  const data = await response.json();
  accessToken = data.access_token;
  console.log("Access Token received:", accessToken);
}

async function checkStreamStatus() {
  console.log("Checking stream status for user:", twitchUser);

  if (!accessToken) {
    console.log("Access token not found. Requesting new token...");
    await getAccessToken();
  }

  const response = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=${twitchUser}`,
    {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  console.log("Stream API response:", data);

  const isLive = data.data && data.data.length > 0;
  console.log(`Stream status: ${isLive ? "LIVE" : "OFFLINE"}`);

  const logo = document.getElementById("twitch-logo");
  const link = document.getElementById("twitch-link");
  const embedContainer = document.querySelector(".twitch-embed");

  if (!logo) console.warn("Element #twitch-logo not found.");
  if (!link) console.warn("Element #twitch-link not found.");
  if (!embedContainer) console.warn("Element .twitch-embed not found.");

  // Check if offline message already exists
  let offlineMessage = document.querySelector(".offline-message");

  // If it doesn't exist, create it
  if (!offlineMessage) {
    offlineMessage = document.createElement("div");
    offlineMessage.className = "offline-message";
    offlineMessage.textContent = "Žádný live stream není aktivní";

    if (embedContainer) {
      embedContainer.parentNode.insertBefore(
        offlineMessage,
        embedContainer.nextSibling
      );
      console.log("Offline message element created and inserted.");
    }
  }

  if (isLive) {
    if (logo) logo.src = "images/online.png";
    if (link) link.style.display = "inline";
    if (embedContainer) embedContainer.style.display = "block";
    if (offlineMessage) offlineMessage.style.display = "none";

    console.log("User is LIVE – showing logo and embed.");
  } else {
    if (link) link.style.display = "inline";
    if (embedContainer) embedContainer.style.display = "none";
    if (offlineMessage) offlineMessage.style.display = "block";
    if (logo) logo.src = "images/offline.png";

    console.log("User is OFFLINE – hiding embed, showing offline message.");
  }
}

// Run after DOM is ready
window.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded. Running stream check...");
  checkStreamStatus();
  setInterval(() => {
    console.log("Running scheduled stream check...");
    checkStreamStatus();
  }, 5 * 60 * 1000);
});
