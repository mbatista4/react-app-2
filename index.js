if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Setting up express;
const app = express();
app.use(express.json());
app.use(cors());


// Initalizing server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server Online at Port: ${PORT}`);
});


// Connecting to Mongoose
mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(console.log('Connected To MongoDB...'))
    .catch(err => console.error(err));


// Setting up Middleware routes
const userRoutes = require('./routes/userRouter');
app.use('/users', userRoutes);