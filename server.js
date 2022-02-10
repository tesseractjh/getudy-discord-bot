const path = require('path');
const express = require('express');
const bot = require('./botServer');
const linkRouter = require('./routes/link');
const emojiRouter = require('./routes/emoji');
const authRouter = require('./routes/auth');

const PORT = process.env.PORT || 3001;
const app = express();

bot.server();
app.use(express.static(path.resolve(__dirname, './dist')));
app.use(express.json());

app.use('/api', authRouter);
app.use('/api', linkRouter);
app.use('/api', emojiRouter);

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

app.listen(PORT, () => console.log(`👂 listening on ${PORT}`));
