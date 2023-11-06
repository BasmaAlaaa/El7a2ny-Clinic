const express = require('express');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../../frontend/public/uploads');
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop());
    }
});

const allowedFileTypes = ['pdf', 'jpeg', 'jpg', 'png'];

const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(extname.substr(1))) {
        return cb(null, true);
    }
    return cb(new Error('Invalid file type. Only PDF, JPEG, JPG, and PNG files are allowed.'));
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = upload;