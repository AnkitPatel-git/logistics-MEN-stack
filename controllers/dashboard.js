const express = require('express');
const router = express.Router();

// Render the login page
router.get('/', (req, res) => {
    res.render('dashboard/operation');
  });

module.exports = router;