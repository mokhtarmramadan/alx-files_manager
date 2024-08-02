import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';
import {v4 as uuidv4} from 'uuid'

class AuthController {
  /**
   * getStatus - checks Redis and DB status
   * @reqeust: request sent by router
   * @response: JSON object with the feedback
   * returns: the JSON object along with 200 OK
  */
  static async getConnect(res, headers) {
    let userCollection = dbClient.db.collection('users');
    let token = headers['authorization'].split(" ");
    let decodedToken = Buffer.from(token[1], 'base64').toString('utf-8');
    let user = decodedToken.split(":");
    let email = user[0];
    let password = sha1(user[1])
    let found_user = await userCollection.findOne({ email: email });

    if (!found_user || found_user.password != password ) {
      return res.status(401).send({"error":"Unauthorized"});
    }
    else {
      let session_id = uuidv4();
      redisClient.set("token", session_id, 86400);
      return res.status(200).send({"token": session_id});
    }
  }

  
 
 
}
export default AuthController;
