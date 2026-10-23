const https = require('https');

https.get('https://unsplash.com/s/photos/sneakers', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9_-]+/g;
    const matches = html.match(regex);
    console.log('Matches:', matches ? matches.length : 0);
    if (matches) {
      console.log([...new Set(matches)]);
    }
  });
});
