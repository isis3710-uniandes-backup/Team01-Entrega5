let jwt = require('jsonwebtoken');
const mongoClient = require("mongodb").MongoClient;
const { databaseUser, databasePassword, databaseName, secretKey } = require('../config');
const uri = "mongodb+srv://" + databaseUser + ":" + databasePassword + "@educapp-viylh.gcp.mongodb.net/test?retryWrites=true&w=majority";
let conn = mongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .catch(error => {
        //defined a response with an error to be shown 
    });
class Usuarios {
    /**
     * Get all the users of the database
     * @param {*} req 
     * @param {*} res 
     */
    getUsers(req, res) {
        conn.then(client => {
            client.db(databaseName).collection("usuarios").find({})
                .toArray((err, data) => {
                    if (err) {
                        res.status(500).send('El servidor está caído, intente más tarde.');
                        throw err;
                    }
                    res.send(data);
                })
        })
    }
    /**
     * Get an specific user by its username
     * @param {*} req 
     * @param {*} res 
     */
    getUser(req, res) {

        let username = req.params.username;
        conn.then(client => {
            client.db(databaseName).collection("usuarios").findOne({ _id: username }, (err, result)=> {
                if(err){
                    res.send(err) 
                }
                if(result === null){
                    res.status(400).send("El usuario no existe");
                }
                else{
                    res.send(result);
                }
            });
        })
    }
    /**
     * Sign up of an user
     * @param {*} req 
     * @param {*} res 
     */
    register(req, res) {
        let newUser = req.body;
        conn.then(client => {
            client.db(databaseName).collection("usuarios").insertOne(newUser, (err, data) => {
                if (err) {
                    res.status(400).send('Inserción invalida. Revise los datos suministrados');
                }
                res.send(data);
            })
        })
    }
    /**
     * Log in of an user
     * @param {*} req 
     * @param {*} res 
     */
    login(req, res) {
        let username = req.body._id;
        let password = req.body.password;
        conn.then(client => {
            client.db(databaseName).collection("usuarios").findOne({ _id: username }, (err, data) => {
                if (err) {
                    res.status(500).send('El servidor está caído, intente más tarde.');
                }
                if (data) {
                    if (data.password === password) {
                        let newToken = jwt.sign({ username: username }, secretKey, { expiresIn: '3h' });
                        res.send({
                            token : newToken
                        });
                    }
                    else {
                        res.status(400).send('Contraseña incorrecta');
                    }
                }
                else {
                    res.status(400).send('El usuario no existe');
                }
            });
        })
    }

    postComment(req, res) {
        let comment = req.body;
        let username = req.params.username;
        conn.then(client => {
            client.db(databaseName).collection("usuarios").updateOne({ _id: username} , { $push: { comentarios: comment } }, (err, data) => {
                if (err) {
                    res.status(400).send('No se pudo añadir su comentario');
                }
                else {
                    res.send(data);
                }
            });
        });
    }
}
module.exports = Usuarios;
