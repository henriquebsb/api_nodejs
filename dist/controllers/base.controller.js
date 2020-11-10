"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var configuration = __importStar(require("../appsetting.json"));
var BaseController = /** @class */ (function () {
    function BaseController() {
    }
    BaseController.prototype.GetConexao = function (host) {
        if (configuration.host.development.indexOf(host) < 0)
            return configuration.connectionStrings.default.developmentConnection;
        else if (configuration.host.staging.indexOf(host) < 0)
            return configuration.connectionStrings.default.stagingConnection;
        else if (configuration.host.production.indexOf(host) < 0)
            return configuration.connectionStrings.default.productionConnection;
        else
            return { user: "", password: "", server: "", database: "" };
    };
    BaseController.prototype.GetConexaoGestaoUsuario = function (host) {
        if (configuration.host.development.indexOf(host) < 0 || configuration.host.staging.indexOf(host) < 0)
            return configuration.connectionStrings.gestaoUsuario.stagingConnection;
        else if (configuration.host.production.indexOf(host) < 0)
            return configuration.connectionStrings.gestaoUsuario.productionConnection;
        else
            return { user: "", password: "", server: "", database: "" };
    };
    return BaseController;
}());
exports.BaseController = BaseController;
