/* eslint no-console: 0 */
const express = require('express');
const { join } = require('path');

// constants
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// serve static files
const app = express();
app.use(express.static('build'));

// redirect to index.html for any path (because of react router)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'build/index.html'));
});

// listen
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
