import * as configuration from  '../appsetting.json';

export class BaseController {
    public GetConexao(host: string)
    {
        if (configuration.host.development.indexOf(host) < 0)
            return configuration.connectionStrings.default.developmentConnection;
        else if (configuration.host.staging.indexOf(host) < 0)
            return configuration.connectionStrings.default.stagingConnection;
        else if (configuration.host.production.indexOf(host) < 0)
            return configuration.connectionStrings.default.productionConnection;
        else
            return { user: "", password: "", server: "", database: "" };
    }

    public GetConexaoGestaoUsuario(host: string)
    {
        if (configuration.host.development.indexOf(host) < 0 || configuration.host.staging.indexOf(host) < 0)
            return configuration.connectionStrings.gestaoUsuario.stagingConnection;
        else if (configuration.host.production.indexOf(host) < 0)
            return configuration.connectionStrings.gestaoUsuario.productionConnection;
        else
            return { user: "", password: "", server: "", database: "" };
    }
}