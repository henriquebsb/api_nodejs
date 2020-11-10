"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var sql = __importStar(require("mssql"));
var PersistenceData = /** @class */ (function () {
    function PersistenceData() {
    }
    PersistenceData.prototype.salvarNaBase = function (connectionString, tabela, obj, metodo) {
        return new sql.ConnectionPool(connectionString).connect().then(function (pool) {
            var _pool = pool.request();
            var objKeys = Object.keys(obj);
            var valores = '';
            objKeys.forEach(function (element) {
                _pool.input(element, obj[element]);
                if (!valores) {
                    valores += '@' + element;
                }
                else {
                    valores += ', @' + element;
                }
            });
            if (metodo == PersistenceMetodos.Inserir) {
                return _pool.query("INSERT INTO " + tabela + " VALUES (" + valores + ");");
            }
            else {
                //TODO: Alterar
                return _pool.query("INSERT INTO " + tabela + " VALUES (" + valores + ");");
            }
            // inserção simples
            // pool.request()
            // .input('idTipoIndicador', obj['idTipoIndicador'])
            // .input('ativo', obj['ativo'])
            // .input('nome', obj['nome'])
            // .input('sigla', obj['sigla'])
            // .input('valor', obj['valor'])
            // .query(`INSERT INTO ${tabela} VALUES (@idTipoIndicador, @ativo, @nome, @sigla, @valor)`);
        });
    };
    PersistenceData.prototype.excluirLogicoDaBase = function (connectionString, tabela, id) {
        return new sql.ConnectionPool(connectionString).connect().then(function (pool) {
            return pool.request()
                .query("UPDATE " + tabela + " SET Ativo = 0 WHERE Id" + tabela + " = '" + id + "'");
        });
    };
    return PersistenceData;
}());
exports.default = PersistenceData;
var PersistenceMetodos;
(function (PersistenceMetodos) {
    PersistenceMetodos[PersistenceMetodos["Inserir"] = 1] = "Inserir";
    PersistenceMetodos[PersistenceMetodos["Alterar"] = 2] = "Alterar";
})(PersistenceMetodos = exports.PersistenceMetodos || (exports.PersistenceMetodos = {}));
