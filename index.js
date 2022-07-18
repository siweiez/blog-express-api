const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use('/', express.static('build'));
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/categories', categoryRoute);

app.get("/", (request, response) => {
  response.json({ message: "Server is Running" });
});

app.listen(process.env.PORT || "5000", () => {
  console.log("--------------Application is running--------------");
});