const clientId = 'bo5sjt0kl4s7dw2pyg5lgc5vq2boa7';
const clientSecret = 'hrm63du4z1ytwq6mt3cbmrcrlx8ocu';
const twitchUser = 'upceesports';
let accessToken = '';

async function getAccessToken() {
  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials'
    })
  });
  const data = await response.json();
  accessToken = data.access_token;

  console.log("Access Token received.");
}

async function checkStreamStatus() {
  if (!accessToken) await getAccessToken();

  const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${twitchUser}`, {
    headers: {
      'Client-ID': clientId,
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const data = await response.json();
  const isLive = data.data && data.data.length > 0;

  const logo = document.getElementById('twitch-logo');
  const link = document.getElementById('twitch-link');

  if (isLive) {
    logo.src = 'images/online.png'; // or your own path
    link.style.display = 'inline';
    console.log("User is LIVE – showing logo.");
  } else {
    link.style.display = 'none';
    console.log("User is OFFLINE – hiding logo.");
  }
}

// Run after DOM is ready
window.addEventListener('DOMContentLoaded', function () {
  checkStreamStatus();
  setInterval(checkStreamStatus, 5 * 60 * 1000);
});
