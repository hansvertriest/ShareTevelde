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
  UserController,
  CourseController,
  AssignmentController,
} from '../controllers';
import { IConfig, AuthService, Logger, ILogger, GridFs } from '../../services';
import { runInThisContext } from 'vm';

class ApiRouter {
  public router: Router;
  private config: IConfig;
  private authService: AuthService;

  private helloController: HelloController;
  private messageController: MessageController;
  private postController: PostController;
  private pictureController: PictureController;
  private userController: UserController;
  private courseController: CourseController;
  private assignmentController: AssignmentController;

  constructor(config: IConfig, authService: AuthService) {
    this.router = express.Router();
    this.config = config;
    this.authService = authService;
    this.registerControllers();
    this.registerRoutes();
  }

  private registerControllers(): void {
    this.helloController = new HelloController();
    this.messageController = new MessageController();
    this.postController = new PostController();
    this.pictureController = new PictureController();
    this.userController = new UserController(this.config, this.authService);
    this.courseController = new CourseController();
    this.assignmentController = new AssignmentController();
  }

  private registerRoutes(): void {
    this.router.get('/hello', this.helloController.index);
    this.router.get('/messages', this.messageController.index);
    this.router.get('/messages/:id', this.messageController.show);
    // this.router.get('/posts', this.postController.index);
    // this.router.get('/posts/:id', this.postController.show);

    this.router.get('/pictures/:filename', this.pictureController.show);
    this.router.post('/pictures', GridFs.createStorage().single('picture'), this.pictureController.upload);
    
    this.router.get('/user/:id', this.userController.getUser);
    this.router.put('/user', this.userController.updateUserProfile)

    this.router.post('/post', this.postController.uploadPost);

    this.router.post('/course', this.courseController.newCourse);

    this.router.post('/assignment', this.assignmentController.newAssignment);
    this.router.get('/assignment/all', this.assignmentController.showAll);

    this.router.post('/auth/signin', this.userController.signInLocal);
    this.router.post('/auth/signup', this.userController.signupLocal);
    this.router.get('/auth/verify/:token', this.userController.verifyJwt);
  }
}

export default ApiRouter;
