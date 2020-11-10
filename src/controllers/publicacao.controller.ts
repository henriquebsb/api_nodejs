import { BaseController } from "./base.controller";
import PersistenceData from "../data/persistence.data";
import * as express from 'express';
import { SalvarPublicacaoCommand } from "../command/salvar-publicacao.command";
import { PersistenceMetodos } from "../data/persistence.data";
import { Shared } from "../shared/shared";
import passport from 'passport';

class PublicacaoController extends BaseController {
    public path = '/publicacao';
    public router = express.Router();
    private persistenceData = new PersistenceData();

    constructor() {
        super();
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(this.path + '/salvar', passport.authenticate('jwt', { session: false }), this.salvarPublicacao);
    }
    
    /**
     * @swagger
     * /api/publicacao/salvar:
     *   post:
     *     tags:
     *          - Publicação
     *     description: Returns the homepage
     *     security:
     *          - bearerAuth: []
     *     responses:
     *       200:
     *         description: hello world
     */
    salvarPublicacao = (request: express.Request, response: express.Response) => {
        if (request.headers.host) {
            let command: SalvarPublicacaoCommand;
            const connectionString = this.GetConexao(request.headers.host);
            
            command = Object.assign({ idTipoIndicador: Shared.newGuid(), ativo: true }, request.body);
            
            this.persistenceData.salvarNaBase(connectionString, 'IndicadorTipo', command, PersistenceMetodos.Inserir)
            .then(result => {
                response.send({ msg: 'Registro inserido!', result: result.rowsAffected, command: command});
            }).catch(error => {
                response.send({ msg: 'Não foi possível inserir!', result: error, command: command});
            });
        } else {
            response.status(404).send('Host não definido.');
        }
    }
}

export default PublicacaoController;
