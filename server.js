const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const bot = require('./bot/botServer');
const linkRouter = require('./routes/link');
const emojiRouter = require('./routes/emoji');
const authRouter = require('./routes/auth');
const messageRouter = require('./routes/message');
const idRouter = require('./routes/id');

const PORT = process.env.PORT || 3001;
const app = express();
dotenv.config({ path: 'variables.env' });

bot.server();
app.use(express.static(path.resolve(__dirname, './dist')));
app.use(express.json());

app.use('/api', authRouter);

app.use('/api', async (req, res, next) => {
  const { headers: { authentication } } = req;
  if (authentication?.split(/\s+/)[1] !== process.env.ADMIN_KEY) {
    res.status(403).send('권한 없음');
  } else {
    next();
  }
});

app.use('/api', linkRouter);
app.use('/api', emojiRouter);
app.use('/api', messageRouter);
app.use('/api', idRouter);

app.use('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

app.listen(PORT, () => console.log(`👂 listening on ${PORT}`));
