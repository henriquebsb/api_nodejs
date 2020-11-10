import { BaseController } from "./base.controller";
import * as express from 'express';
import * as sql from "mssql";
import { DeleteLogicoCommand } from "../command/delete-logico.command";
import PersistenceData from "../data/persistence.data";
import passport from 'passport';
import PDFDocument from 'pdfkit';

class DatabaseController extends BaseController {
    public path = '/database';
    public router = express.Router();
    private persistenceData = new PersistenceData();

    constructor() {
        super();
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path + '/definitions', passport.authenticate('jwt', {session: false }), this.definitions);
        this.router.post(this.path + '/select', passport.authenticate('jwt', { session: false }), this.select);
        this.router.post(this.path + '/deleteLogico', passport.authenticate('jwt', { session: false }), this.deleteLogico);
        this.router.get(this.path + '/select/:id', this.getParametro);
        this.router.get(this.path + '/pdf', this.pdf);
    }

    pdf = (request: express.Request, response: express.Response) => {
        const doc = new PDFDocument();
        let filename = 'teste';
        // Stripping special characters
        filename = encodeURIComponent(filename) + '.pdf'
        // Setting response to 'attachment' (download).
        // If you use 'inline' here it will automatically open the PDF
        response.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')
        response.setHeader('Content-type', 'application/pdf')
        const content = 'TESTE PDF';
        doc.y = 300
        doc.text(content, 50, 50).fillOpacity(0.5);
        doc.image('src/images/test.png', 0, 15, {width: 700});

        // doc.image('src/images/test1.png', 0, 15, {width: 100});
        // doc.image('src/images/test2.png', 0, 15, {width: 200});
        // doc.image('src/images/test3.png', 0, 15, {width: 300});
        // doc.image('src/images/test4.png', 0, 15, {width: 400});
        // doc.image('src/images/test5.png', 0, 15, {width: 500});
        // doc.image('src/images/test6.png', 0, 15, {width: 600});
        // doc.image('src/images/test7.png', 0, 15, {width: 700});
        // doc.image('src/images/test8.png', 0, 15, {width: 800});
        // doc.image('src/images/test9.png', 0, 15, {width: 900});
        doc.pipe(response)
        doc.end()
    }

    /**
     * @swagger
     * /api/database/definitions:
     *   get:
     *      tags:
     *          - Database
     *      description: Returns the homepage
     *      security:
     *          - bearerAuth: []
     *      responses:
     *          200:
     *              description: ok
     */
    definitions = (request: express.Request, response: express.Response) => {
        if (request.headers.host) {
            const connectionString = this.GetConexao(request.headers.host);
            response.json(connectionString);
        } else {
            response.status(404).send('Host não definido.');
        }
    }

    /**
     * @swagger
     * /api/database/select:
     *   post:
     *      tags:
     *          - Database
     *      description: query
     *      security:
     *          - bearerAuth: []
     *      parameters:
     *          - name: query
     *            in: body
     *            schema:
     *                  type: object
     *                  properties:
     *                      query:
     *                          type: string
     *      responses:
     *          200:
     *              description: ok
     */
    select = (request: express.Request, response: express.Response) => {
        if (request.headers.host) {
            const connectionString = this.GetConexao(request.headers.host);
            
            new sql.ConnectionPool(connectionString).connect().then(pool => {
                const query = request.body['query'];
                return pool.query(query);
            }).then(result => {    
                response.json(result.recordsets);
            }).catch(error => {
                response.json(error);
            });
        } else {
            response.status(404).send('Host não definido.');
        }
    }

    /**
     * @swagger
     * /api/database/deleteLogico:
     *   post:
     *     tags:
     *          - Database
     *     description: Returns the homepage
     *     security:
     *          - bearerAuth: []
     *     responses:
     *       200:
     *         description: hello world
     */
    deleteLogico = (request: express.Request, response: express.Response) => {
        if (request.headers.host) {
            let command: DeleteLogicoCommand;
            const connectionString = this.GetConexao(request.headers.host);

            command = request.body;

            this.persistenceData.excluirLogicoDaBase(connectionString, command.tabela, command.id)
            .then(result => {
                response.send({ msg: 'Registro excluído!', result: result.rowsAffected, command: command});
            }).catch(error => {
                response.send({ msg: 'Não foi possível excluir!', result: error, command: command});
            });
        } else {

        }
    }

    // exemplo com GET e PARAMETRO
    getParametro = (request: express.Request, response: express.Response) => {    
        const connectionString = this.GetConexao('');

        new sql.ConnectionPool(connectionString).connect().then(pool => {
            const urlParam = request.params['id'];
            return pool.query`select * from IndicadorTipo where IdIndicadorTipo=${urlParam}`
        }).then(result => {
            response.json(result.recordset);
        }).catch(error => {
            response.json(error);
        });
    }
}

export default DatabaseController;