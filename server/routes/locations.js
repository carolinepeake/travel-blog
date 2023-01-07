
const express = require('express');

const { getLocations, postLocation, getPlaces } = require('.././controllers').LocationsController;

const locationsRouter = express.Router();

locationsRouter.get('/', getLocations);

locationsRouter.post('/', postLocation);

locationsRouter.get('/places/:text/:locality', getPlaces);

module.exports = locationsRouter;