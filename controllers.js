const cadastrarUsuarioModel = require('./models/cadastrarUsuario');
const config = require('./config');
const { decrypt, crypt } = require('./utils.js')
const jwt = require('jsonwebtoken')

const controllers = {
    cadastrarUsuario: async (req, res) => {
        try {
            const senhaDigitada = req.body.password
            console.log(senhaDigitada)

            const password = crypt(senhaDigitada);
            console.log(password)

            const cadastrarUsuario = new cadastrarUsuarioModel({
                username : req.body.username,
                nome: req.body.nome,
                dataAniversario: req.body.dataAniversario,
                cpf: req.body.cpf,
                password: password
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
            console.log(usernameDigitado)
            console.log(senhaDigitada)

            const usernameUsuario = await cadastrarUsuarioModel
            .findOne({ username: req.body.username })
            .select('username password dataAniversario cpf'); 
            console.log(usernameUsuario)

            const passwordDecrypted = decrypt(usernameUsuario.password)
           console.log(passwordDecrypted)

           const chaveSecreta = passwordDecrypted

           const mostraUsuario = {
            username: usernameUsuario.username,
            dataAniversario: usernameUsuario.dataAniversario,
            cpf: usernameUsuario.cpf
           }

           function mostraToken() {
                const token = criaToken(); 
                console.log('Token válido por 60 segundos:', token);

           }

           function criaToken(){
            const token = jwt.sign({ mostraUsuario, codigoUnico }, chaveSecreta, {expiresIn: 60});
            console.log(token);

            const tokenDecodificado = jwt.verify(token, chaveSecreta);
            console.log(tokenDecodificado);
           }

           const codigoUnico = gerarCodigoUnico(8);
           console.log("Codigo de identificação unico:", codigoUnico); 

           function gerarCodigoUnico(length) {
                const caracteres = '012345678';
                let codigo = '';
                const caracteresLength = caracteres.length;
            
                for (let i = 0; i < length; i++) {
                    const indice = Math.floor(Math.random() * caracteresLength);
                    codigo += caracteres.charAt(indice);
                }
            
                return codigo;
            }
           
            if (usernameUsuario && senhaDigitada === passwordDecrypted) {
                    res.json({ success: true, msg: "Usuário autenticado"});
                    codigoUnico
                    mostraToken();
                } else {
                    res.json({ success: false, msg: "Nome de usuário e senha incorretos, verifique." });
                }
        } catch (error) {
            console.log(error);
            res.status(400).json({ success: false, msg: error });
        }
    },
    validarSessao: async (req,res) => {
        
        try {
            function verificaToken (req, res, next){
                const token = req.headers['x-access-token']
                jwt.verify(token, chaveSecreta, (err, decoded) => {
                    if(err) return res.status(401).end();
    
                    req.codigoUnico = decoded.codigoUnico
                    mostraUsuario()
                    next();
                })
           }

           if(verificaToken){
            res.json({success: true, msg:"Token Aceito"})
            mostraUsuario()
           }
       
        } catch (error) {
            console.log(error)
            res.status(400).json({success: false, msg: error})
        }
        
        
    }
        
}





module.exports = controllers