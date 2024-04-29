const express = require('express');
const router = express.Router();

const {generatePDF} = require('../service/generatePDF.service');

router.post('/pdf', async (req, res) => {
    return generatePDF(req, res);
})

module.exports = router;

