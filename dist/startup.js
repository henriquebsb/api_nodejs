"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var database_controller_1 = __importDefault(require("./controllers/database.controller"));
var publicacao_controller_1 = __importDefault(require("./controllers/publicacao.controller"));
var login_controller_1 = __importDefault(require("./controllers/login.controller"));
var port = 8000;
var app = new app_1.default([
    new database_controller_1.default(),
    new publicacao_controller_1.default(),
    new login_controller_1.default()
], port);
app.index();
app.listen();
