import express from 'express';
import * as bodyParser from 'body-parser';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
// import swaggerJSDoc = require('swagger-jsdoc');
import passport from 'passport';
import passportJWT from 'passport-jwt';
import * as swaggerDefinition from './swagger-jsdoc.json';

const options = {
  swaggerDefinition,
  apis: ['./src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

class App {
  public app: express.Application;
  public port: number;
 
  constructor(controllers: any, port: number) {
    this.app = express();
    this.port = port;
 
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.intializeAutentication();
    this.initializeSwagger();  
    this.app.use(bodyParser.json());
  }

  private initializeSwagger() {
    this.app.get('/swagger/spec', (request: express.Request, response: express.Response) => response.json(swaggerSpec));
    this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private intializeAutentication() {
    let ExtractJwt = passportJWT.ExtractJwt;
    let JwtStrategy = passportJWT.Strategy;
    let jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'ver_oque_ser_isso'
    }

    let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
      console.log('payload received', jwt_payload);
      let user = { 
        id: jwt_payload.subject.id,
        roles: jwt_payload.subject.roles
      };

      if (user) {
        next(null, user);
      } else {
        next(null, false);
      }
    });
    passport.use(strategy);
    this.app.use(passport.initialize());
  }
 
  private initializeControllers(controllers: any) {
    controllers.forEach((controller: any) => {
      this.app.use('/api', controller.router);
    });
  }

  public index() {
    this.app.use('/index', (request: express.Request, response: express.Response) => {
      response.json({status: 200, api: `[SERVER] Running at http://localhost:${this.port}`, port: 8000, request: request.headers});
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`[SERVER] Running at http://localhost:${this.port}`);
    });
  }
}
 
export default App;