import {
  default as express,
  Application,
  Request,
  Response,
  Router,
} from 'express';
import {
  HelloController,
  MessageController,
  PostController,
  PictureController,
} from '../controllers';

class ApiRouter {
  public router: Router;
  private helloController: HelloController;
  private messageController: MessageController;
  private postController: PostController;
  private pictureController: PictureController;

  constructor() {
    this.router = express.Router();

    this.registerControllers();
    this.registerRoutes();
  }

  private registerControllers(): void {
    this.helloController = new HelloController();
    this.messageController = new MessageController();
    this.postController = new PostController();
    this.pictureController = new PictureController();
  }

  private registerRoutes(): void {
    this.router.get('/hello', this.helloController.index);
    this.router.get('/messages', this.messageController.index);
    this.router.get('/messages/:id', this.messageController.show);
    this.router.get('/posts', this.postController.index);
    this.router.get('/posts/:id', this.postController.show);

    this.router.get('/pictures/:filename', this.pictureController.show);
  }
}

export default ApiRouter;
