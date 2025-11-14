const express = require('express');
const path = require('path');

const app = express();
// Adjust the folder name if your build outputs to a different folder name
const distPath = path.join(__dirname, 'dist', 'bnbosio');

// Serve static files
app.use(express.static(distPath));

// Always return the main index.html, so SPA routing works
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server listening on ${port}`));

