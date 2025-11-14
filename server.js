const express = require('express');
const path = require('path');
const app = express();

// Serve i file statici dalla cartella di build
app.use(express.static(path.join(__dirname, 'dist/bnbosio/browser')));

// Tutte le richieste vanno all'index.html (per Angular routing)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/bnbosio/browser/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
