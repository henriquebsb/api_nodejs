import * as sql from "mssql";

class AutenticacaoData {
    public logar(connectionString: any, sistema: string, objToken: any, metodo: AutenticacaoMetodos) {
        switch (metodo) {
            default:
                return new sql.ConnectionPool(connectionString).connect().then(pool => {
                    const sqlQuery = `SELECT 
                                        SA.NomeAcao AS nome, 
                                        SA.ReferenciaAcao AS referencia
                                    FROM [UsuarioSistema] AS US
                                    INNER JOIN [Sistema] AS S ON US.IdSistema = S.IdSistema
                                    INNER JOIN [SistemaPerfilAcao] AS SPA ON SPA.IdSistemaPerfil = US.IdSistemaPerfil
                                    INNER JOIN [SistemaAcao] AS SA ON SA.IdSistemaAcao = SPA.IdSistemaAcao
                                    WHERE S.Referencia = '${sistema}' AND US.IdUsuario = '${objToken['idUsuario']}';`;                                    
                    return pool.request().query(sqlQuery);
                });
        }
    }

    public getToken(connectionString: any, token: string) {
        return new sql.ConnectionPool(connectionString).connect().then(pool => {
            const sqlQuery = `SELECT T.IdToken AS token
                                ,T.DataCadastro AS dataUltimoLogon
                                ,T.IdUsuario AS idUsuario
                                ,U.Nome AS nome
                                ,U.Login AS login
                                ,U.CPF AS CPF
                            FROM [TokenAcesso] AS T
                            INNER JOIN [Usuario] AS U ON U.IdUsuario = T.IdUsuario 
                            WHERE T.Ativo = 1 AND U.Ativo = 1 AND T.IdToken = '${token}';`;    

            return pool.request().query(sqlQuery);
        });
    }

}

export default AutenticacaoData;

export enum AutenticacaoMetodos {
    AD = 1,
    TokenQueryString = 2,
    Local = 3
}
