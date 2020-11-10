import App from './app';
import DatabaseController from './controllers/database.controller';
import PublicacaoController from './controllers/publicacao.controller';
import LoginController from './controllers/login.controller';

const port = 8000;

const app = new App([
    new DatabaseController(),
    new PublicacaoController(),
    new LoginController()
], port);

app.index();

app.listen();

