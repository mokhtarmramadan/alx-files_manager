import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';


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

  router.post('/users', (req, res) => {
    // Adds a new user
    UsersController.postNew(req, res);
  });

  router.get('/connect', (req, res) => {
    AuthController.getConnect(res, req.headers);
  });

  router.get('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
  });
/*
  router.get('/users/me', (req, res) => {
    UserController.getMe(req, res);
  }
 */

}
export default controllerRouting;
