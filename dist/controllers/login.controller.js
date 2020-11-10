"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_controller_1 = require("./base.controller");
var express = __importStar(require("express"));
var passport_1 = __importDefault(require("passport"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var autenticacao_data_1 = __importStar(require("../data/autenticacao.data"));
var configuration = __importStar(require("../appsetting.json"));
var LoginController = /** @class */ (function (_super) {
    __extends(LoginController, _super);
    function LoginController() {
        var _this = _super.call(this) || this;
        _this.path = '/autenticacao';
        _this.router = express.Router();
        _this.autenticacaoData = new autenticacao_data_1.default();
        /**
         * @swagger
         * /api/autenticacao/claims:
         *   get:
         *      tags:
         *          - Login
         *      description: Returns the homepage
         *      security:
         *          - bearerAuth: []
         *      responses:
         *          200:
         *              description: ok
         */
        _this.claims = function (request, response, next) {
            if (request.headers.host) {
                passport_1.default.authenticate('jwt', { session: false }, function (err, user, info) {
                    if (user) {
                        if (user.roles.find(function (role) { return role.referencia === '#SEJABEMVINDO'; })) {
                            response.json(user);
                        }
                        else {
                            response.status(403).send('Não possui permissão.');
                        }
                    }
                    else {
                        response.status(403).send('Não está autenticado.');
                    }
                })(request, response, next);
            }
            else {
                response.status(404).send('Host não definido.');
            }
        };
        /**
         * @swagger
         * /api/autenticacao/login:
         *   post:
         *      tags:
         *          - Login
         *      description: user
         *      parameters:
         *          - name: body
         *            in: body
         *            schema:
         *                  type: object
         *                  properties:
         *                      login:
         *                          type: string
         *                      senha:
         *                          type: string
         *                      token:
         *                          type: string
         *            required:
         *                  - token
         *      responses:
         *          200:
         *              description: ok
         */
        _this.login = function (request, response) {
            if (request.headers.host) {
                var usuario = request.body;
                var credenciaisValidas_1 = false;
                var jwtOptions_1 = {
                    secretOrKey: 'ver_oque_ser_isso'
                };
                if (usuario && (usuario['login'] && usuario['senha']) || usuario['token']) {
                    var connectionString_1 = _this.GetConexaoGestaoUsuario(request.headers.host);
                    _this.autenticacaoData.getToken(connectionString_1, usuario['token']).then(function (result) {
                        var objToken = result.recordset[0];
                        var roles = {};
                        console.log(objToken);
                        _this.autenticacaoData.logar(connectionString_1, configuration.permissoes.sistemaReferencia, objToken, autenticacao_data_1.AutenticacaoMetodos.TokenQueryString)
                            .then(function (result) {
                            roles = result.recordset;
                            credenciaisValidas_1 = true;
                            if (credenciaisValidas_1) {
                                var dataCriacao = new Date();
                                var dataExpiracao = new Date();
                                var identify = {
                                    id: objToken.idFuncionario,
                                    roles: roles
                                };
                                var payload = {
                                    subject: identify
                                };
                                var options = {
                                    expiresIn: configuration.tokenConfiguration.seconds
                                };
                                var token = jsonwebtoken_1.default.sign(payload, jwtOptions_1.secretOrKey, options);
                                response.json({
                                    authenticated: true,
                                    created: dataCriacao,
                                    expiration: dataExpiracao,
                                    accessToken: 'Bearer ' + token,
                                    message: "OK"
                                });
                            }
                            else {
                                response.status(404).send({
                                    authenticated: false,
                                    msg: 'Falha ao autenticar.'
                                });
                            }
                        }).catch(function (error) {
                            response.status(500).send(error);
                        });
                        ;
                    }).catch(function (error) {
                        response.status(500).send(error);
                    });
                }
            }
            else {
                response.status(404).send('Host não definido.');
            }
        };
        _this.intializeRoutes();
        return _this;
    }
    LoginController.prototype.intializeRoutes = function () {
        this.router.get(this.path + '/claims', this.claims);
        // this.router.get(this.path + '/claims', passport.authenticate('jwt', {session: false}), this.claims);
        this.router.post(this.path + '/login', this.login);
    };
    return LoginController;
}(base_controller_1.BaseController));
exports.default = LoginController;
