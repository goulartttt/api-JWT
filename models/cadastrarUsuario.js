const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cadastrarUsuario = new Schema({ 
    username:{type: String, required: true },
    nome:{type: String, required: true },
    dataAniversario:{type: String, required:true},
    cpf:{type:String, required:true},
    password:{type:String, required:true}
})  

module.exports = mongoose.model('cadastrarUsuario', cadastrarUsuario);