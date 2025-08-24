const multer = require('multer');
const { parse } = require('csv-parse/sync');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const validateFiles = (req, res, next) => {
    const files = req.files;
    const results = [];

    if (!files || files.length === 0) {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'No files uploaded'));
    }

    for (const file of files) {
        const result = {
            file_name: file.originalname,
            success: true,
            error: null,
        };

        try {
            if (file.mimetype === 'application/json') {
                const data = JSON.parse(file.buffer.toString());
                validateHomogeneousData(data, false, file.originalname);
            } else if (file.mimetype === 'text/csv') {
                const data = parse(file.buffer.toString(), { columns: true, skip_empty_lines: true });
                validateHomogeneousData(data, true, file.originalname);
            } else {
                throw new Error('File type not supported');
            }
        } catch (error) {
            result.success = false;
            result.error = error.message;
        }

        results.push(result);
    }

    if (results.some((result) => !result.success)) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            data: results,
            error: 'File validation failed',
        });
    }

    req.validationResults = results;
    next();
};

const validateHomogeneousData = (data, isCSV = false, fileName) => {
    if (!Array.isArray(data)) {
        throw new Error(`File ${fileName}: Data should be an array`);
    }

    const keys = Object.keys(data[0]);
    data.forEach((item, index) => {
        if (typeof item !== 'object' || Array.isArray(item)) {
            throw new Error('Each item in the array should be an object');
        }

        const itemKeys = Object.keys(item);

        if (isCSV) {
            itemKeys.forEach((key) => {
                if (key === '' && item[key] !== '') {
                    throw new Error(`File ${fileName}, line ${index + 1}: CSV row contains an empty column with non-empty value`);
                }
            });
        }

        if (itemKeys.length !== keys.length || !itemKeys.every((key) => keys.includes(key) || (isCSV && key === '' && item[key] === ''))) {
            throw new Error(`File ${fileName}, object ${index + 1}: Data is not homogeneous`);
        }
    });
};

module.exports = validateFiles;
