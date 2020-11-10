import { BaseController } from "./base.controller";
import * as express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import AutenticacaoData, { AutenticacaoMetodos } from "../data/autenticacao.data";
import * as configuration from  '../appsetting.json';

class LoginController extends BaseController {
    public path = '/autenticacao';
    public router = express.Router();
    private autenticacaoData = new AutenticacaoData();
    
    constructor() {
        super();
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path + '/claims', this.claims);
        // this.router.get(this.path + '/claims', passport.authenticate('jwt', {session: false}), this.claims);
        this.router.post(this.path + '/login', this.login);
    }
    
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
    claims = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        if (request.headers.host) {
            passport.authenticate('jwt', {session: false }, (err, user, info) => {
                if(user) {
                    if(user.roles.find((role: any) => role.referencia === '#SEJABEMVINDO')) {
                        response.json(user);
                    } else {
                        response.status(403).send('Não possui permissão.');
                    }
                } else {
                    response.status(403).send('Não está autenticado.');
                }                
            })(request, response, next);
        } else {
            response.status(404).send('Host não definido.');
        }        
    }

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
    login = (request: express.Request, response: express.Response) => {
        if (request.headers.host) {
            const usuario = request.body;
            let credenciaisValidas = false;
            let jwtOptions = {
                secretOrKey: 'ver_oque_ser_isso'
            }

            if (usuario && (usuario['login'] && usuario['senha']) || usuario['token']) {
                const connectionString = this.GetConexaoGestaoUsuario(request.headers.host);   

                this.autenticacaoData.getToken(connectionString, usuario['token']).then(result => {
                    let objToken = result.recordset[0];
                    let roles = {} as any;

                    console.log(objToken);

                    this.autenticacaoData.logar(connectionString, configuration.permissoes.sistemaReferencia, objToken, AutenticacaoMetodos.TokenQueryString)
                    .then(result => {
                        roles = result.recordset;
                        credenciaisValidas = true;                        

                        if(credenciaisValidas) {
                            const dataCriacao = new Date()
                            const dataExpiracao = new Date();
            
                            const identify = {
                                id: objToken.idFuncionario,
                                roles: roles
                            };
            
                            const payload = {
                                subject: identify
                            };

                            const options = {
                                expiresIn: configuration.tokenConfiguration.seconds
                            }

                            const token = jwt.sign(payload, jwtOptions.secretOrKey, options);
            
                            response.json({ 
                                authenticated: true,
                                created: dataCriacao,
                                expiration: dataExpiracao,
                                accessToken: 'Bearer ' + token,
                                message: "OK"
                            });
                        } else {
                            response.status(404).send({ 
                                authenticated: false, 
                                msg:'Falha ao autenticar.'
                            });
                        }
                    }).catch(error => {
                        response.status(500).send(error);
                    });;
                }).catch(error => {
                    response.status(500).send(error);
                });
            }            
        } else {
            response.status(404).send('Host não definido.');
        }
    }
}

export default LoginController;