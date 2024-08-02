import dbClient from '../utils/db';
import sha1 from 'sha1';


class UsersController {
  /**
   * postNew - creates a new user record in the users collection
   * @reqeust: request sent by router
   * @response: JSON object with the feedback
   * returns: the JSON object along with 201 created
   */
  static async postNew(request, response) {
    const password = request.body.password;
    const email = request.body.email;
    const userCollection = dbClient.db.collection('users');

    if (!email) {
      return response.status(400).send({"error":"Missing email"});
    }
    if (!password) {
      return response.status(400).send({"error":"Missing password"});
    }

    const user = await userCollection.findOne({ email: email });
    if (user) {
      return response.status(400).send({"error":"Already exist"});
    }
    
    const hashedPassword = sha1(password);

    try {
      
      const newUser = await userCollection.insertOne({
        email: email,
	password: hashedPassword,
      });

      const createdUser = {
        id: newUser.insertedId,
        email,
      }

      return response.status(201).send(createdUser);

    } catch(err) {
      console.error('Erorr creating a user', err);
    }
  }
}

export default UsersController;
