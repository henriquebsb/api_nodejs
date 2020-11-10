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
var base_controller_1 = require("./base.controller");
var persistence_data_1 = __importDefault(require("../data/persistence.data"));
var express = __importStar(require("express"));
var persistence_data_2 = require("../data/persistence.data");
var shared_1 = require("../shared/shared");
var passport_1 = __importDefault(require("passport"));
var PublicacaoController = /** @class */ (function (_super) {
    __extends(PublicacaoController, _super);
    function PublicacaoController() {
        var _this = _super.call(this) || this;
        _this.path = '/publicacao';
        _this.router = express.Router();
        _this.persistenceData = new persistence_data_1.default();
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
        _this.salvarPublicacao = function (request, response) {
            if (request.headers.host) {
                var command_1;
                var connectionString = _this.GetConexao(request.headers.host);
                command_1 = Object.assign({ idTipoIndicador: shared_1.Shared.newGuid(), ativo: true }, request.body);
                _this.persistenceData.salvarNaBase(connectionString, 'IndicadorTipo', command_1, persistence_data_2.PersistenceMetodos.Inserir)
                    .then(function (result) {
                    response.send({ msg: 'Registro inserido!', result: result.rowsAffected, command: command_1 });
                }).catch(function (error) {
                    response.send({ msg: 'Não foi possível inserir!', result: error, command: command_1 });
                });
            }
            else {
                response.status(404).send('Host não definido.');
            }
        };
        _this.intializeRoutes();
        return _this;
    }
    PublicacaoController.prototype.intializeRoutes = function () {
        this.router.post(this.path + '/salvar', passport_1.default.authenticate('jwt', { session: false }), this.salvarPublicacao);
    };
    return PublicacaoController;
}(base_controller_1.BaseController));
exports.default = PublicacaoController;
