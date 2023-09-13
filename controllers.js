const cadastrarUsuarioModel = require('./models/cadastrarUsuario');
const { chaveJWT } = require('./config');
const { decrypt, crypt, gerarCodigoUnico } = require('./utils.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const controllers = {
    cadastrarUsuario: async (req, res) => {
        try {
            const senhaDigitada = req.body.password

            const password = crypt(senhaDigitada);

            const codeUser = gerarCodigoUnico()

            const cadastrarUsuario = new cadastrarUsuarioModel({
                username : req.body.username,
                nome: req.body.nome,
                dataAniversario: req.body.dataAniversario,
                cpf: req.body.cpf,
                password: password,
                codeUser: codeUser
            })
            await cadastrarUsuario.save()

            res.json({success: true, msg:"Usuario cadastrado", cadastrarUsuario: cadastrarUsuario})
        } catch (error) {
            console.log(error)
            res.status(400).json({success: false, msg: error})
        }
    },
    login: async (req, res) => {

        try {
            const usernameDigitado = req.body.username;
            const senhaDigitada = req.body.password;

            const usernameUsuario = await cadastrarUsuarioModel
            .findOne({ username: req.body.username })
            .select('username password dataAniversario cpf codeUser'); 

            const passwordDecrypted = decrypt(usernameUsuario.password)

           const mostraUsuario = {
            username: usernameUsuario.username,
            dataAniversario: usernameUsuario.dataAniversario,
            cpf: usernameUsuario.cpf,
            codeUser: usernameUsuario.codeUser
           }

            if (usernameUsuario && senhaDigitada === passwordDecrypted) {              
                const token = jwt.sign({ mostraUsuario }, chaveJWT, {expiresIn: 60});  
                res.json({ success: true, msg: "Usuário autenticado", token: token, mostraUsuario});
            } else {
                res.json({ success: false, msg: "Nome de usuário e senha incorretos, verifique." });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false, msg: error });
        }
    },
    validarSessao :async (req,res) => {
        try {
            const token = req.headers['x-access-token'];
        
            if (!token) {
                return res.status(401).json({ success: false, msg: "Token não fornecido" });
            }
        
            const decoded =  jwt.verify(token, chaveJWT); 
            res.json({ success: true, msg: "Token Aceito", usuario: decoded});
        } catch (error) {
            console.log(error);
            res.status(401).json({ success: false, msg: "Token inválido" });
        }
    }
}

module.exports = controllers