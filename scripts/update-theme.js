const fetch = require("node-fetch");

function updateTheme(themeId, baseUrl, apiKey, apiUsername) {
  fetch(`${baseUrl}/admin/themes/${themeId}`, {
    headers: {
      "content-type": "application/json",
      "Api-Key": `${apiKey}`,
      "Api-Username": `${apiUsername}`
    },
    body: JSON.stringify({
      theme: {
        remote_update: true
      }
    }),
    method: "PUT"
  })
    .then(response => response.json())
    .then(() => console.log("Theme updated successfully 🚀"))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

updateTheme(
  process.env.DISCOURSE_THEME_ID,
  process.env.DISCOURSE_APP_BASE_URL,
  process.env.DISCOURSE_API_KEY,
  process.env.DISCOURSE_API_USERNAME
);
