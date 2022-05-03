import express from 'express';

const app = express();

// setup the initial middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/app/auth/user', (req, res) => {
    res.send('Hi there!');
})

app.listen(3000, () => console.log('Listening in port 3000'));