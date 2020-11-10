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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var sql = __importStar(require("mssql"));
var persistence_data_1 = __importDefault(require("../data/persistence.data"));
var passport_1 = __importDefault(require("passport"));
var pdfkit_1 = __importDefault(require("pdfkit"));
var DatabaseController = /** @class */ (function (_super) {
    __extends(DatabaseController, _super);
    function DatabaseController() {
        var _this = _super.call(this) || this;
        _this.path = '/database';
        _this.router = express.Router();
        _this.persistenceData = new persistence_data_1.default();
        _this.pdf = function (request, response) {
            var doc = new pdfkit_1.default();
            var filename = 'teste';
            // Stripping special characters
            filename = encodeURIComponent(filename) + '.pdf';
            // Setting response to 'attachment' (download).
            // If you use 'inline' here it will automatically open the PDF
            response.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
            response.setHeader('Content-type', 'application/pdf');
            var content = 'TESTE PDF';
            doc.y = 300;
            doc.text(content, 50, 50).fillOpacity(0.5);
            doc.image('src/images/test.png', 0, 15, { width: 700 });
            // doc.image('src/images/test1.png', 0, 15, {width: 100});
            // doc.image('src/images/test2.png', 0, 15, {width: 200});
            // doc.image('src/images/test3.png', 0, 15, {width: 300});
            // doc.image('src/images/test4.png', 0, 15, {width: 400});
            // doc.image('src/images/test5.png', 0, 15, {width: 500});
            // doc.image('src/images/test6.png', 0, 15, {width: 600});
            // doc.image('src/images/test7.png', 0, 15, {width: 700});
            // doc.image('src/images/test8.png', 0, 15, {width: 800});
            // doc.image('src/images/test9.png', 0, 15, {width: 900});
            doc.pipe(response);
            doc.end();
        };
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
        _this.definitions = function (request, response) {
            if (request.headers.host) {
                var connectionString = _this.GetConexao(request.headers.host);
                response.json(connectionString);
            }
            else {
                response.status(404).send('Host não definido.');
            }
        };
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
        _this.select = function (request, response) {
            if (request.headers.host) {
                var connectionString = _this.GetConexao(request.headers.host);
                new sql.ConnectionPool(connectionString).connect().then(function (pool) {
                    var query = request.body['query'];
                    return pool.query(query);
                }).then(function (result) {
                    response.json(result.recordsets);
                }).catch(function (error) {
                    response.json(error);
                });
            }
            else {
                response.status(404).send('Host não definido.');
            }
        };
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
        _this.deleteLogico = function (request, response) {
            if (request.headers.host) {
                var command_1;
                var connectionString = _this.GetConexao(request.headers.host);
                command_1 = request.body;
                _this.persistenceData.excluirLogicoDaBase(connectionString, command_1.tabela, command_1.id)
                    .then(function (result) {
                    response.send({ msg: 'Registro excluído!', result: result.rowsAffected, command: command_1 });
                }).catch(function (error) {
                    response.send({ msg: 'Não foi possível excluir!', result: error, command: command_1 });
                });
            }
            else {
            }
        };
        // exemplo com GET e PARAMETRO
        _this.getParametro = function (request, response) {
            var connectionString = _this.GetConexao('');
            new sql.ConnectionPool(connectionString).connect().then(function (pool) {
                var urlParam = request.params['id'];
                return pool.query(templateObject_1 || (templateObject_1 = __makeTemplateObject(["select * from IndicadorTipo where IdIndicadorTipo=", ""], ["select * from IndicadorTipo where IdIndicadorTipo=", ""])), urlParam);
            }).then(function (result) {
                response.json(result.recordset);
            }).catch(function (error) {
                response.json(error);
            });
        };
        _this.intializeRoutes();
        return _this;
    }
    DatabaseController.prototype.intializeRoutes = function () {
        this.router.get(this.path + '/definitions', passport_1.default.authenticate('jwt', { session: false }), this.definitions);
        this.router.post(this.path + '/select', passport_1.default.authenticate('jwt', { session: false }), this.select);
        this.router.post(this.path + '/deleteLogico', passport_1.default.authenticate('jwt', { session: false }), this.deleteLogico);
        this.router.get(this.path + '/select/:id', this.getParametro);
        this.router.get(this.path + '/pdf', this.pdf);
    };
    return DatabaseController;
}(base_controller_1.BaseController));
exports.default = DatabaseController;
var templateObject_1;
