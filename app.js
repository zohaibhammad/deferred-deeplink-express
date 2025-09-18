const express = require('express');
const app = express();

app.get('/redirect', (req, res) => {

  // Get the value from the query parameter, default to 'visited' if not provided
  const value = req.query.value || '';

  const isAppInstalled = false; // Simulated check, usually handled on client side
  const deepLink = `taskmanagerreactnative://${value}`;
  const webUrl = `https://localhost:8081/${value}`;
  const appStoreUrl = 'https://apps.apple.com/au/app/my-vodafone/id386764438';
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=au.com.vodafone.mobile.gss&hl=en';
  const ua = req.get("User-Agent") || "";

  if (isAppInstalled) {
    return res.redirect(deepLink);

  } else {
    // Set a cookie named 'deeplink' with the value from the query param
    res.cookie('deeplink', value, { httpOnly: true, sameSite: 'lax' });
    // Redirect to the Play Store app page (replace with your app's URL)
    return res.redirect(/iPhone|iPad|iPod/i.test(ua) ? appStoreUrl : (/Android/i.test(ua) ? playStoreUrl : webUrl));
  }
});

app.get('/deferredlink', (req, res) => {
  // Log the cookies received in the request
  console.log('Received cookies:', req.headers.cookie);

  // Extract the 'deeplink' cookie value
  const cookies = req.headers.cookie
    ? Object.fromEntries(req.headers.cookie.split('; ').map(c => c.split('=')))
    : {};
  const deeplinkValue = cookies.deeplink || '';

  // Redirect to the app with the deeplink value (e.g., taskmanagerreactnative://profile/{deeplinkValue})
  res.redirect(302, `taskmanagerreactnative://${deeplinkValue}`);
  res.send('Cookies logged on the server.');
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});