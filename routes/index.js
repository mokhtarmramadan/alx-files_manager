import express from 'express';
import AppController from '../controllers/AppController';


function controllerRouting(app) {
  // App controller
  const router = express.Router();
  app.use('/', router);

  router.get('/status', (req, res) => {
    // returns true if redis and DB clients are up
    AppController.getStatus(req, res);
  });

  router.get('/stats', (req, res) => {
    // returns number of users and files in the DB
    AppController.getStats(req, res);
  });
}
export default controllerRouting;
