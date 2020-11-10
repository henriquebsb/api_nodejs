import * as sql from "mssql";

class PersistenceData {
    public salvarNaBase(connectionString: any, tabela: string, obj: any, metodo: PersistenceMetodos) {
        return new sql.ConnectionPool(connectionString).connect().then(pool => {
            const _pool = pool.request();
            const objKeys = Object.keys(obj);
            let valores = '';
            
            objKeys.forEach(element => {
                _pool.input(element, obj[element]);
                if(!valores) {
                    valores += '@' + element;
                } else {
                    valores += ', @' + element;
                }
            });

            if(metodo == PersistenceMetodos.Inserir) {
                return _pool.query(`INSERT INTO ${tabela} VALUES (${valores});`);
            } else {
                //TODO: Alterar
                return _pool.query(`INSERT INTO ${tabela} VALUES (${valores});`);
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
    }

    public excluirLogicoDaBase(connectionString: any, tabela: any, id: any) {
        return new sql.ConnectionPool(connectionString).connect().then(pool => {
            return pool.request()
            .query(`UPDATE ${tabela} SET Ativo = 0 WHERE Id${tabela} = '${id}'`);
        });
    }
}

export default PersistenceData;

export enum PersistenceMetodos {
    Inserir = 1,
    Alterar = 2
}