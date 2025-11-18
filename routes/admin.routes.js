// File: routes/admin.routes.js
const express = require('express');
const router = express.Router();
const { adminauthenticate } = require('../middlewares/auth.middleware');
const {
    getManagers,
    approveManager,
    removeManager
} = require('../controllers/admin.controller');

router.get('/addmanager', adminauthenticate, getManagers);
router.put("/approvemanager/:id", adminauthenticate, approveManager);
router.put("/removemanager/:id", adminauthenticate, removeManager);

module.exports = router;