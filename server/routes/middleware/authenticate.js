const {User} = require('./../../db/models/user');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        // console.log(user);
        if (!user) {
            return Promise.reject('authenticate: Usuario no valido'); // res.status(401).send(error);
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((error) => {
        // console.log(error);
        console.log('not authorized!!!');
        res.status(401).send(`myAuth: ${error}`);
    });
};


module.exports = {authenticate};
