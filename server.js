const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');


const config = {
    name: 'docker-node-mongo',
    port: 3030,
    host: '0.0.0.0',
};

const app = express();
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors());
app.use(ExpressAPILogMiddleware(logger, { request: true }));


// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('we are all connected to mongo')

    const UsersSchema = new mongoose.Schema({
        fname: String,
        lname: String,
        email: String
    });

    const Users = mongoose.model('Users', UsersSchema, 'Users');
    Users.insertMany([
        {
            fname: 'niraj',
            lname: 'maharjan',
            fname: 'niraj@maharjan.com',
        },
        {
            fname: 'saru',
            lname: 'maharjan',
            fname: 'saru@maharjan.com',
        }
        ,{
            fname: 'kk',
            lname: 'maharjan',
            fname: 'kk@maharjan.com',
        }
    ], (err) => {
        console.log('error -->', err)
    })

    console.log(Users.find({fname: 'niraj'}))
  })
  .catch(err => console.log(err));


var knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'mysql',
      port: '3306',
      user : 'root',
      password : 'testing',
      database : 'address_book'
    },
    migrations: {
      tableName: 'migrations'
    }
});
// var knex = require('knex')({
//     client: 'postgres',
//     connection: {
//       host : 'postgres://mkxkdkecqxcmyk:5a8951a851bc3ad2e6607b578c171c26bf0da59c9d58bce21a91820cfe978508@ec2-54-243-193-59.compute-1.amazonaws.com:5432/d5ir61i5e5eanj',
//       port: '5432',
//       user : 'mkxkdkecqxcmyk',
//       password : '5a8951a851bc3ad2e6607b578c171c26bf0da59c9d58bce21a91820cfe978508',
//       database : 'd5ir61i5e5eanj'
//     },
//     migrations: {
//       tableName: 'migrations'
//     }
// });

const getUsers = async () => {

    try {
        const users = knex.select('id', 'name').from('users');
        // console.log('--??', users);
        return users;
    } catch (error) {
        console.log('error -->>', error);
    }
}

app.get('/', (req, res) => {
    // res.status(200).send('Hello world 12');

    getUsers()
    .then((users) => {
        res.status(200).send(users);
    })
});

app.listen(config.port, config.host, (e)=> {
    if(e) {
        throw new Error('Internal Server Error');
    }
    logger.info(`${config.name} running on ${config.host}:${config.port}`);
});