//npm run dev || production || test

const env = process.env.NODE_ENV

if (env === 'dev') {
    //mongoosejs
    process.env.NODE_PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/B2BUsers';
    //user.js – Generacion de Tokens
    process.env.ACCESS = 'access';
    process.env.SECRET_VALUE = 'valorsecreto';
} else if (env === 'production') {
    //mongoosejs
    process.env.NODE_PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27013/b2busers';
    //user – Generacion de  Tokens
    process.env.ACCESS = 'ub1Wdx2aaOkZfqT7fFd3eAtT';
    process.env.SECRET_VALUE = 'PW7QoygcjCFX6bl5U9DtBtRX';
} else if (env === 'test') {
    process.env.NODE_PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/B2BUsers';
    //user.js – Generacion de Tokens
    process.env.ACCESS = 'access';
    process.env.SECRET_VALUE = 'valorsecreto';
}