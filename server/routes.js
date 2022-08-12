const router = express.Router();

import controllers from '../controllers/controllers.js';

router.get('/users', controllers.getUser);

router.get('/tags', controllers.getTags);

router.get('/regions', controllers.getRegions);

router.get('/posts', controllers.getPosts);

router.post('/users', controllers.postUser);

router.post('/posts', controllers.postPost);