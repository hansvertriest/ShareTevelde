import { default as express, Application } from 'express';
import { default as bodyParser } from 'body-parser';
import { default as methodOverride } from 'method-override';
import { default as cors } from 'cors';
import { default as passport } from 'passport';

import { default as path } from 'path';

class GlobalMiddleware {
  public static load(app: Application, rootPath: string) {
    console.log(path.join(rootPath, 'views'));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(express.static(path.join(rootPath, 'static')));
	app.use(methodOverride('_method'));
	app.use(cors())
	app.use(passport.initialize());
    app.set('views', path.join(rootPath, 'views'));
    app.set('view engine', 'ejs');
  }
}

export default GlobalMiddleware;
