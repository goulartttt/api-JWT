const controllers = require('./controllers');

module.exports = (express) => {
    const route = express.Router();

    route.post('/cadastrarUsuario', controllers.cadastrarUsuario);
    route.get('/login', controllers.login);
    route.get('/validarSessao', controllers.validarSessao)

    return route

}