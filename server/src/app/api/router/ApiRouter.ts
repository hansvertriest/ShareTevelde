import {
  default as express,
  Application,
  Request,
  Response,
  NextFunction,
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
import { decode } from 'punycode';

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
    this.assignmentController = new AssignmentController(this.authService);
  }

  private verifyJwt = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    if (req.headers.authorization) {
	  const token = req.headers.authorization.split(' ')[1];
      const decoded = this.authService.verifyToken(token);
      if (!decoded.verified) {
        return res.status(500).send({ msg: 'JWT could not be verified' });
      }
      req.body.token = decoded;
      next();
    } else {
      return res.status(500).send({ msg: 'JWT must be supplied' });
    }
  }

  private verifyJwtAndCheckAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    if (req.headers.authorization) {
		const token = req.headers.authorization.split(' ')[1];
        const decoded = this.authService.verifyToken(token);
        if (!decoded.verified) {
          return res.status(500).send({ msg: 'JWT could not be verified' });
        }
        if(decoded.role !== 'admin') {
          return res.status(401).send({ msg: 'No admin rights' });
        }
        req.body.token = decoded;
        next();
    } else {
      return res.status(500).send({ msg: 'JWT must be supplied' });
    }
  }

  private registerRoutes(): void {
    // this.router.get('/hello', this.helloController.index);
    // this.router.get('/messages', this.messageController.index);
    // this.router.get('/messages/:id', this.messageController.show);
    // this.router.get('/posts', this.postController.index);
    // this.router.get('/posts/:id', this.postController.show);

    this.router.post('/auth/signin', this.userController.signInLocal);
    this.router.post('/auth/signup', this.userController.signupLocal);
    this.router.post('/auth/verify', this.verifyJwt, this.userController.sendOk);

    this.router.get('/picture/byname/:filename', this.pictureController.show);
    this.router.get('/picture/info', this.pictureController.getPictureInfo);
    this.router.post('/picture',  GridFs.createStorage().single('picture'),this.verifyJwt, this.pictureController.upload);
    
    this.router.get('/user/all', this.userController.getAllUsers);
    this.router.get('/user/softDeleted/all', this.verifyJwtAndCheckAdmin, this.userController.getallAndSoftDeleted);
    this.router.get('/user', this.verifyJwt, this.userController.getUserByTokenOrId);
    this.router.get('/user/softdeleted/', this.verifyJwtAndCheckAdmin, this.userController.getUserByTokenOrIdAndSoftDeleted);
    this.router.put('/user/byId', this.verifyJwtAndCheckAdmin, this.userController.updateUserProfileById);
    this.router.put('/user/token', this.verifyJwt, this.userController.updateUserProfileByToken);
    this.router.delete('/user/token', this.verifyJwt, this.userController.softDeleteUserByToken);
	this.router.delete('/user/byId', this.verifyJwtAndCheckAdmin, this.userController.softDeleteUserById);
	this.router.delete('/user/all/softDeleted', this.verifyJwtAndCheckAdmin, this.userController.permanentDelete);
	this.router.put('/user/undelete', this.verifyJwtAndCheckAdmin, this.userController.undeleteById);

    this.router.post('/post', this.verifyJwt, this.postController.uploadPost);
    this.router.put('/post', this.verifyJwt, this.postController.updateOwnPost);
    this.router.get('/post', this.postController.getPostById);
	this.router.get('/post/all', this.postController.getPostsAll);
	this.router.get('/post/softDeleted/all', this.verifyJwtAndCheckAdmin, this.postController.getPostsAllAndSoftDeleted);
	this.router.delete('/post/own', this.verifyJwt, this.postController.softDeleteOwn);
	this.router.delete('/post/byId', this.verifyJwtAndCheckAdmin, this.postController.softDeleteById);
	this.router.delete('/post/all/softDeleted', this.verifyJwtAndCheckAdmin, this.postController.permanentDelete);
	this.router.put('/post/undelete', this.verifyJwtAndCheckAdmin, this.postController.undeleteById);

	this.router.post('/course', this.verifyJwt, this.courseController.newCourse);
	this.router.delete('/course', this.verifyJwtAndCheckAdmin, this.courseController.softDeleteCourseById);
	this.router.delete('/course/all/softDeleted', this.verifyJwtAndCheckAdmin, this.courseController.permanentDelete);
	this.router.put('/course/undelete', this.verifyJwtAndCheckAdmin, this.courseController.undeleteById);
	this.router.get('/course/byId', this.courseController.getCourseById);
	this.router.get('/course/all', this.courseController.getAllCourses);
	this.router.get('/course/softDeleted/all', this.verifyJwtAndCheckAdmin, this.courseController.getAllCoursesAndSoftDeleted);

    this.router.post('/assignment', this.verifyJwt, this.assignmentController.newAssignment);
    this.router.get('/assignment/all', this.assignmentController.getAllAssignments);
	this.router.get('/assignment/softDeleted/all', this.verifyJwtAndCheckAdmin, this.assignmentController.getAllAssignmentsAndSoftDeleted);
	// this.router.get('/assignment/byId', this.assignmentController.getAssignmentById);
	// this.router.delete('/assignment', this.verifyJwtAndCheckAdmin, this.assignmentController.softDeleteById);
	// this.router.delete('/assignment/all/softDeleted', this.verifyJwtAndCheckAdmin, this.assignmentController.permanentDelete);
	// this.router.put('/assignment/undelete', this.verifyJwtAndCheckAdmin, this.assignmentController.undeleteById);
  }
}

export default ApiRouter;
