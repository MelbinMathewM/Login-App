const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mdv');

const express = require('express');
const app = express();

const port = process.env.PORT || 3333;

const path = require('path');
const nocache = require('nocache');
app.use('/',nocache());
// app.use('/admin',nocache());

app.use('/static',express.static(path.join(__dirname,"public")));

const a_route = require('./routes/adminRouter');
app.use('/admin',a_route);

const u_route = require('./routes/userRouter');
app.use('/',u_route);


app.listen(port,() => {
    console.log(`server started at http://localhost:${port}`);
});
