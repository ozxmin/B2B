//npm run dev || production || test

const env = process.env.NODE_ENV

if (env === 'dev') {
    //mongoosejs
    process.env.NODE_PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/B2BUsers';
    //user.js – Generacion de Tokens
    process.env.ACCESS = 'access';
    process.env.SECRET_VALUE = 'valorsecreto';
} if (env === 'production') {
    //mongoosejs
    process.env.NODE_PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27013/b2busers';
    //user – Generacion de  Tokens
    process.env.ACCESS = 'ub1Wdx2aaOkZfqT7fFd3eAtT';
    process.env.SECRET_VALUE = 'PW7QoygcjCFX6bl5U9DtBtRX';
} if (env === 'test') {
    process.env.NODE_PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/B2BUsers';
    //user.js – Generacion de Tokens
    process.env.ACCESS = 'access';
    process.env.SECRET_VALUE = 'valorsecreto';
} if (env == 'heroku' ) {
    process.env.NODE_PORT = process.env.PORT
    process.env.MONGODB_URI = 'mongodb://m_lab_db_admin:vua-W4L-E87-uQ3@ds161164.mlab.com:61164/b2busers';
    process.env.ACCESS = 'ub1Wdx2aaOkZfqT7fFd3eAtT';
    process.env.SECRET_VALUE = 'PW7QoygcjCFX6bl5U9DtBtRX';
}