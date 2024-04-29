const PORT = 4516;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

const cors = require('cors')

app.use(bodyParser.json({ limit: '17gb' }));
app.use(bodyParser.urlencoded({ limit: '17gb', extended: true }));
app.use(express.raw({ type: 'text/html', limit:  '17gb' }));

app.use(express.json());
app.use(cors({
    origin: '*'
  }));
  
app.use(morgan('dev'));

const pdf = require('./controllers/pdf.controller')

app.get('/', (req, res) => {
    res.status(200).json({
        applicationName: "Zscan PDF Service",
        version: "1.2.0"
    });
});

app.use(pdf);

app.listen(PORT, () => {
    console.log("Server PDF Service inicializado com sucesso");
});

module.exports = app;
