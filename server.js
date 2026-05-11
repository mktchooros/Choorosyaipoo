const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for all routes (SPA routing)
app.get('*', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');

  // Inject Supabase config from environment variables (replace config.js with inline script)
  const configScript = `<script>
window.SUPABASE_CONFIG = {
  url: '${process.env.REACT_APP_SUPABASE_URL || ''}',
  anonKey: '${process.env.REACT_APP_SUPABASE_ANON_KEY || ''}'
};
</script>`;

  // Replace the config.js script tag with inline config
  html = html.replace('<script src="config.js"></script>', configScript);

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
