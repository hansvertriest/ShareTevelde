import {
	default as express,
	Application,
	Request,
	Response,
	NextFunction,
	Router,
} from 'express';
import {
	PostController,
	PictureController,
	UserController,
	CourseController,
	AssignmentController,
	NotificationController,
} from '../controllers';
import {
	IConfig,
	AuthService,
	Logger,
	ILogger,
	GridFs
} from '../../services';

class ApiRouter {
	public router: Router;
	private config: IConfig;
	private authService: AuthService;

	private postController: PostController;
	private pictureController: PictureController;
	private userController: UserController;
	private courseController: CourseController;
	private assignmentController: AssignmentController;
	private notificationController: NotificationController;

	constructor(config: IConfig, authService: AuthService) {
		this.router = express.Router();
		this.config = config;
		this.authService = authService;
		this.registerControllers();
		this.registerRoutes();
	}

	private registerControllers(): void {
		this.postController = new PostController();
		this.pictureController = new PictureController();
		this.userController = new UserController(this.config, this.authService);
		this.courseController = new CourseController();
		this.assignmentController = new AssignmentController();
		this.notificationController = new NotificationController();
	}

	private verifyJwt = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise < Response < any >> => {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = this.authService.verifyToken(token);
			if (!decoded.verified) {
				return res.status(500).send({
					msg: 'JWT could not be verified'
				});
			}
			req.body.token = decoded;
			next();
		} else {
			return res.status(500).send({
				msg: 'JWT must be supplied'
			});
		}
	}

	private verifyJwtAndCheckAdmin = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise < Response < any >> => {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			const decoded = this.authService.verifyToken(token);
			if (!decoded.verified) {
				return res.status(500).send({
					msg: 'JWT could not be verified'
				});
			}
			if (decoded.role !== 'administrator') {
				return res.status(401).send({
					msg: 'No admin rights'
				});
			}
			req.body.token = decoded;
			next();
		} else {
			return res.status(500).send({
				msg: 'JWT must be supplied'
			});
		}
	}

	private registerRoutes(): void {
		this.router.post('/auth/signin', this.userController.signInLocal);
		this.router.post('/auth/signup', this.userController.signupLocal);
		this.router.post('/auth/verify', this.verifyJwt, this.userController.sendOk);

		this.router.get('/picture/byname/:filename', this.pictureController.show);
		this.router.get('/picture/info', this.pictureController.getPictureInfo);
		this.router.post('/picture', GridFs.createStorage().single('picture'), this.verifyJwt, this.pictureController.upload);

		this.router.get('/user/all', this.userController.getAll);
		this.router.get('/user/softDeleted/all', this.verifyJwtAndCheckAdmin, this.userController.getAllAndSoftDeleted);
		this.router.get('/user', this.verifyJwt, this.userController.getById);
		this.router.get('/user/softdeleted/', this.verifyJwtAndCheckAdmin, this.userController.getByIdAndSoftDeleted);
		this.router.put('/user/byId', this.verifyJwtAndCheckAdmin, this.userController.updateProfileById);
		this.router.put('/user/token', this.verifyJwt, this.userController.updateProfileByToken);
		this.router.delete('/user/token', this.verifyJwt, this.userController.softDeleteByToken);
		this.router.delete('/user/byId', this.verifyJwtAndCheckAdmin, this.userController.softDeleteById);
		this.router.delete('/user/all/softDeleted', this.verifyJwtAndCheckAdmin, this.userController.permanentDelete);
		this.router.put('/user/undelete', this.verifyJwtAndCheckAdmin, this.userController.undeleteById);

		this.router.post('/post', this.verifyJwt, this.postController.new);
		this.router.put('/post', this.verifyJwt, this.postController.updateOwn);
		this.router.get('/post', this.postController.getById);
		this.router.get('/post/all', this.postController.getAll);
		this.router.get('/post/all/filtered', this.postController.getAllFiltered);
		this.router.get('/post/softDeleted/all', this.verifyJwtAndCheckAdmin, this.postController.getAllAndSoftDeleted);
		this.router.delete('/post/own', this.verifyJwt, this.postController.softDeleteOwn);
		this.router.delete('/post/byId', this.verifyJwtAndCheckAdmin, this.postController.softDeleteById);
		this.router.delete('/post/all/softDeleted', this.verifyJwtAndCheckAdmin, this.postController.permanentDelete);
		this.router.put('/post/undelete', this.verifyJwtAndCheckAdmin, this.postController.undeleteById);
		this.router.post('/post/feedback', this.verifyJwt, this.postController.postFeedback);
		this.router.post('/post/feedback/agree', this.verifyJwt, this.postController.agree);
		this.router.get('/post/feedback/agrees', this.postController.getAgrees);
		this.router.post('/post/like', this.verifyJwt, this.postController.like);
		this.router.get('/post/likes', this.postController.getLikes);

		this.router.post('/course', this.verifyJwt, this.courseController.new);
		this.router.delete('/course', this.verifyJwtAndCheckAdmin, this.courseController.softDeleteById);
		this.router.delete('/course/all/softDeleted', this.verifyJwtAndCheckAdmin, this.courseController.permanentDelete);
		this.router.put('/course/undelete', this.verifyJwtAndCheckAdmin, this.courseController.undeleteById);
		this.router.get('/course/byId', this.courseController.getById);
		this.router.get('/course/all', this.courseController.getAll);
		this.router.get('/course/softDeleted/all', this.verifyJwtAndCheckAdmin, this.courseController.getAllAndSoftDeleted);

		this.router.post('/assignment', this.verifyJwt, this.assignmentController.new);
		this.router.get('/assignment/all', this.assignmentController.getAll);
		this.router.get('/assignment/softDeleted/all', this.verifyJwtAndCheckAdmin, this.assignmentController.getAllAndSoftDeleted);
		this.router.get('/assignment/byId', this.assignmentController.getById);
		this.router.delete('/assignment', this.verifyJwtAndCheckAdmin, this.assignmentController.softDeleteById);
		this.router.delete('/assignment/all/softDeleted', this.verifyJwtAndCheckAdmin, this.assignmentController.permanentDelete);
		this.router.put('/assignment/undelete', this.verifyJwtAndCheckAdmin, this.assignmentController.undeleteById);
		
		this.router.post('/notification/toAll', this.verifyJwtAndCheckAdmin, this.notificationController.sendAll);
		this.router.get('/notification/all', this.verifyJwt, this.notificationController.get)
	}
}

export default ApiRouter;