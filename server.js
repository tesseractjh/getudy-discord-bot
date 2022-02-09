const path = require('path');
const express = require('express');
const botServer = require('./botServer');
const linkRouter = require('./routes/link');
const emojiRouter = require('./routes/emoji');

const PORT = process.env.PORT || 3001;
const app = express();

botServer();
app.use(express.static(path.resolve(__dirname, './build')));
app.use(express.json());

app.use('/api', linkRouter);
app.use('/api', emojiRouter);
app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build/index.html'));
});

app.listen(PORT, () => console.log(`👂 listening on ${PORT}`));