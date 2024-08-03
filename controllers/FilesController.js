import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import {v4 as uuidv4} from 'uuid'
import { promises as fs } from 'fs';


class FilesController {
  /**
   * getDisconnect - logout the user
   * @reqeust: request sent by router
   * @response: JSON object with the feedback
   * returns: the JSON object along with 200 OK
  */
  static async postUpload(req, res) {
    const fileCollection = dbClient.db.collection('files');
    let name_token = "";
    const name = req.body.name;
    const type = req.body.type;
    const parentID = req.body.parentId || 0;
    const isPublic = req.body.isPublic || false;
    let data = ""

    if (type == 'file' || type == 'image') {
	data = req.body.data;
    }
    console.log(data);
    if ('x-token' in req.headers) {
       name_token = 'x-token';
    }
    else {
       name_token = 'X-Token';
    }
    const token = req.headers[name_token];
    const user_id = await redisClient.get(`auth_${token}`)
    if (!user_id) {
      return res.status(401).send({"error":"Unauthorized"});
    }

    if (!name) {
      return res.status(400).send({"error":"Missing name"});
    }
    if (!type || (type != 'folder' && type != 'file' && type != 'image')) {
      return res.status(400).send({"error":"Missing type"});
    }
    if (type !== 'folder' && !data) {
      return res.status(400).send({"error":"Missing data"});
    }

    const file = await fileCollection.findOne({ "_id": new ObjectId(parentID)});
    if (!file && parentID != 0) {
       return res.status(400).send({"error":"Parent not found"});
    }
    if (parentID != 0 && file.type != "folder") {
       return res.status(400).send({"error":"Parent is not a folder"});
    }
    if (type == 'folder') {
      const newfolder = await fileCollection.insertOne({
        userId: new ObjectId(user_id),
        name: name,
	type: type,
	parentId: parentID,
	isPublic: isPublic,
      });

      const createdFolder = {
        id: newfolder.insertedId,
        userId: user_id,
        name: name,
        type: type,
	isPublic: isPublic,
        parentId: parentID
      }

      return res.status(201).json(createdFolder);
    }
    else {
      const filePath = process.env.FOLDER_PATH || '/tmp/files_manager' 
      const fileName = `${filePath}/${uuidv4()}`;
      const buff = Buffer.from(data, 'base64');
      try {
        try {
          await fs.mkdir(filePath);
        } catch (error) {
        }
        await fs.writeFile(fileName, buff, 'utf-8');
      } catch (error) {
        console.log(error);
      }
      fileCollection.insertOne(
        {
          userId: new ObjectId(user_id),
          name,
          type,
          isPublic,
          parentId: parentID,
          localPath: fileName,
        },
      ).then((result) => {
        res.status(201).json(
          {
            id: result.insertedId,
            userId: user_id,
            name,
            type,
            isPublic,
            parentId: parentID,
          },
        )
      });
    }
  }
}
export default FilesController;
