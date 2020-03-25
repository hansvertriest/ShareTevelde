# mern-boilerplate
Boilerplate MERN stack | New Media Development | Artevelde University of Applied Sciences

# Rules

https://medium.com/@jorgemcdev/node-express-app-typescript-tslint-prettier-airbnb-husky-c42588cbcbe3

# Project creation

![Image of React Coding](https://images.unsplash.com/photo-1552308995-2baac1ad5490?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80)

# NMD MERN Template

Template for the course **Mobile Development II** specialisation **New Media Development** in the department **Graphical and Digital Media** within **Artevelde University College Ghent**.

Template consists of:

- Node.js
- Express
- React

## Getting Started

### MongoDb

https://cloud.mongodb.com/

### Environment settings

Create a `.env`-file under the root of the project with the following contents:

```
NMD_BASELINE='Like Graphics Love Code' 
NODE_DOCS={generating documentation for Api} (true or false) 
NODE_ENV={your node environment} (development, production or staging)  
NODE_SERVER_HOST={your ip-addres or domainname} (ex.: 127.0.0.1, 192.168.0.6)  
NODE_SERVER_PORT={your port for the server} (ex.: 8080)  
NODE_SERVER_PROTOCOL={your port for the server} (ex.: 8080)  
MONGODB_CONNECTION={your mongodb connection string}
SKIP_PREFLIGHT_CHECK=true
AUTH_BCRYPT_SALT={your salt value for passwords} (ex.: 10) 
AUTH_JWT_SECRET={your JWT secret} (ex.: gdm_nmd_mobdev2) 
AUTH_JWT_SESSION={your JWT session true or false} 
AUTH_FACEBOOK_CLIENT_ID={your Facebook Client id} 
AUTH_FACEBOOK_CLIENT_SECRET={your Facebook Client secret} 
```

Create a `.env`-file under the `client` folder following contents:

```
SKIP_PREFLIGHT_CHECK=true
SASS_PATH=node_modules:src
```

### Installing

Under the root execute:

```
yarn install
```

### Scripts

#### Running the Express-server in development

Under the root execute:

```
yarn server:start
```

#### Running the React-client in development

Under the root execute:

```
yarn client:start
```

#### Running the Express-server and React-client in development

Under the root execute:

```
yarn start:all
```

The React-client must be build in order to visit the default route: `http://{your domain}:{your port}/`. Run `yarn client:build` to create a `build` folder under the root of the `client` folder.

#### Running the tests for Express-server

Under the root execute:

```
yarn server:test
```

#### Check eslint for the server

Under the root execute:

```
yarn server:lint
```

#### Running the React-app

Under the root execute:

```
yarn client:start
```

#### Building the React-app

Under the root execute:

```
yarn client:build
```

This command creates a directory `build` under the client folder. Afster building, the `build` folder will be copied to the `dist\client` folder (under the root of the project).

#### Running the tests for React-client

Under the root execute:

```
yarn client:test
```

## API Specification

### Urls

- [Swagger Ui for Express](http://{your domain}:{your port]/api/v1/docs/)
- [ReDoc](http://{your domain}:{your port]/docs/)

## Client

### Urls

- Public
  - Home: http://{your domain}:{your port]
  - News: http://{your domain}:{your port]/news
  - Post Detail: http://{your domain}:{your port]/news/{post id}
- Admin
  - Home: http://{your domain}:{your port]/admin
  - Blog List: http://{your domain}:{your port]/admin/blogs
  - Blog Create: http://{your domain}:{your port]/admin/blogs/create
  - Blog Edit: http://{your domain}:{your port]/admin/blogs/{blog id}/edit
  - Categories List: http://{your domain}:{your port]/admin/categories
  - Category Create: http://{your domain}:{your port]/admin/categories/create
  - Category Edit: http://{your domain}:{your port]/admin/categories/{category id}/edit
  - Posts List: http://{your domain}:{your port]/admin/posts
  - Post Create: http://{your domain}:{your port]/admin/posts/create
  - Post Edit: http://{your domain}:{your port]/admin/posts/{post id}/edit

## Built With

- Node.js
- Express
- React

## Authors

Philippe De Pauw - Waterschoot | [drdynscript](https://github.com/drdynscript)

## License

This project is licensed under the Apache License - see the LICENSE file for details

