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
var AutenticacaoData = /** @class */ (function () {
    function AutenticacaoData() {
    }
    AutenticacaoData.prototype.logar = function (connectionString, sistema, objToken, metodo) {
        switch (metodo) {
            default:
                return new sql.ConnectionPool(connectionString).connect().then(function (pool) {
                    var sqlQuery = "SELECT \n                                        SA.NomeAcao AS nome, \n                                        SA.ReferenciaAcao AS referencia\n                                    FROM [FuncionarioSistema] AS FS\n                                    INNER JOIN [Sistema] AS S ON FS.IdSistema = S.IdSistema\n                                    INNER JOIN [SistemaPerfilAcao] AS SPA ON SPA.IdSistemaPerfil = FS.IdSistemaPerfil\n                                    INNER JOIN [SistemaAcao] AS SA ON SA.IdSistemaAcao = SPA.IdSistemaAcao\n                                    WHERE S.Referencia = '" + sistema + "' AND FS.IdFuncionario = '" + objToken['idFuncionario'] + "';";
                    return pool.request().query(sqlQuery);
                });
        }
    };
    AutenticacaoData.prototype.getToken = function (connectionString, token) {
        return new sql.ConnectionPool(connectionString).connect().then(function (pool) {
            var sqlQuery = "SELECT T.IdToken AS token\n                                ,T.DataCadastro AS dataUltimoLogon\n                                ,T.IdFuncionario AS idFuncionario\n                                ,F.Nome AS nome\n                                ,F.Login AS login\n                                ,F.CPF AS CPF\n                                ,F.IdUnidade AS idUnidade\n                                ,U.Nome AS unidade\n                                ,F.IdCoordenacao AS idCoordenacao\n                                ,C.Nome AS coordenacao\n                            FROM [TokenAcesso] AS T\n                            INNER JOIN [Funcionario] AS F ON F.IdFuncinario = T.IdFuncionario \n                            INNER JOIN [Unidade] AS U ON U.IdUnidade = F.IdUnidade\n                            LEFT JOIN [Coordenacao] AS C ON F.IdCoordenacao = C.IdCoordenacao \n                            WHERE T.Ativo = 1 AND F.Ativo = 1 AND T.IdToken = '" + token + "';";
            return pool.request().query(sqlQuery);
        });
    };
    return AutenticacaoData;
}());
exports.default = AutenticacaoData;
var AutenticacaoMetodos;
(function (AutenticacaoMetodos) {
    AutenticacaoMetodos[AutenticacaoMetodos["AD"] = 1] = "AD";
    AutenticacaoMetodos[AutenticacaoMetodos["TokenQueryString"] = 2] = "TokenQueryString";
    AutenticacaoMetodos[AutenticacaoMetodos["Local"] = 3] = "Local";
})(AutenticacaoMetodos = exports.AutenticacaoMetodos || (exports.AutenticacaoMetodos = {}));
