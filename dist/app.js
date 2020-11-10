"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bodyParser = __importStar(require("body-parser"));
var swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
var swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// import swaggerJSDoc = require('swagger-jsdoc');
var passport_1 = __importDefault(require("passport"));
var passport_jwt_1 = __importDefault(require("passport-jwt"));
var swaggerDefinition = __importStar(require("./swagger-jsdoc.json"));
var options = {
    swaggerDefinition: swaggerDefinition,
    apis: ['./src/controllers/*.ts'],
};
var swaggerSpec = swagger_jsdoc_1.default(options);
var App = /** @class */ (function () {
    function App(controllers, port) {
        this.app = express_1.default();
        this.port = port;
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    App.prototype.initializeMiddlewares = function () {
        this.intializeAutentication();
        this.initializeSwagger();
        this.app.use(bodyParser.json());
    };
    App.prototype.initializeSwagger = function () {
        this.app.get('/swagger/spec', function (request, response) { return response.json(swaggerSpec); });
        this.app.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    };
    App.prototype.intializeAutentication = function () {
        var ExtractJwt = passport_jwt_1.default.ExtractJwt;
        var JwtStrategy = passport_jwt_1.default.Strategy;
        var jwtOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'ver_oque_ser_isso'
        };
        var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
            console.log('payload received', jwt_payload);
            var user = {
                id: jwt_payload.subject.id,
                roles: jwt_payload.subject.roles
            };
            if (user) {
                next(null, user);
            }
            else {
                next(null, false);
            }
        });
        passport_1.default.use(strategy);
        this.app.use(passport_1.default.initialize());
    };
    App.prototype.initializeControllers = function (controllers) {
        var _this = this;
        controllers.forEach(function (controller) {
            _this.app.use('/api', controller.router);
        });
    };
    App.prototype.index = function () {
        var _this = this;
        this.app.use('/index', function (request, response) {
            response.json({ status: 200, api: "[SERVER] Running at http://localhost:" + _this.port, port: 8000, request: request.headers });
        });
    };
    App.prototype.listen = function () {
        var _this = this;
        this.app.listen(this.port, function () {
            console.log("[SERVER] Running at http://localhost:" + _this.port);
        });
    };
    return App;
}());
exports.default = App;
