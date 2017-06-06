var {User} = require('./../models/user');

let authenticate = (req, res, next) => {
    let token = req.header('x-auth');
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject('authenticate: Usuario no valido'); // res.status(401).send(error);
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((error) => {
        res.status(401).send(error);
    });
};


// let authenticatedUser = ()

module.exports = {authenticate};
