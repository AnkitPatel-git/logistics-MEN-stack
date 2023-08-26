const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const officemaster = require('../controllers/admin/office');

router.get("/companymaster", officemaster.getcompny);

module.exports = router;