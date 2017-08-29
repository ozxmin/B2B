const {mongoose} = require('mongoose');
//library for assertions
const expect = require('expect');
//http tests
const request = require('supertest');
//local
const {app} = require('./../server');
const {User} = require('./../db/models/user');
const {Company} = require('./../db/models/company');
const {ConnectedAd} = require('./../db/models/publicidadConnected');

const random = (upTo) =>  Math.floor((Math.random() * upTo) + 1)

const adminGoodProbe = {
    nombre: `usuario${random(100)}`,
    apellido: 'apellido',
    email: `ejemplo${random(100)}@correo.com`,
    password: 'contrasena',
    nombreEmpresa: `miEmpresa`,
    rol: 'vendedor',
    celular: 1234567890
};
const datosMinEmpresa = {
    nombreEmpresa: `miempresa${random(100)}`, 
    membresia: 'comerciante',
    suscripcion: 'gratis'
};

const adsConnected =  [
    {
        titulo: 'mi anuncio 1',
        imagen: './blah/blah/imagen1.jpg',
        link: 'connectedb2b.com/ad1',
        descripcion: 'descripcion1',
        posicion: 1
    },
    {
        titulo: 'mi anuncio 2',
        imagen: './blah/blah/imagen2.jpg',
        link: 'connectedb2b.com/ad2',
        descripcion: 'descripcion2',
        posicion: 2
    },
    {
        titulo: 'mi anuncio 3',
        imagen: './blah/blah/imagen3.jpg',
        link: 'connectedb2b.com/ad3',
        descripcion: 'descripcion3',
        posicion: 3
    }
];

var resTokenUsuario;


before((done) => {
    // User.remove({}).then(() => {
    //     return Company.remove({})
    // }).then(() => { 

    //     return ConnectedAds.insertMany(adsConnected);        
    // })
    Promise.all([User.remove({}), Company.remove({})], ConnectedAd.remove({})).then(() => {    
        return ConnectedAd.insertMany(adsConnected);
    }).then(() => done()
    ).catch((err) => { done(err)});
});

//------------------> Inicio de pruebas
describe('Generacion de datos', () => {


    it('/getDiccionario', (done) => {
        const {diccionarioCategorias} = require('./../db/models/categorias');
        request(app).get('/getDiccionarioCategorias')
            .send()
            .expect(200)
            .expect((res) => {
                // console.log(res.body);
                expect(res.body['Hilaturas'])
                .toEqual(diccionarioCategorias['Hilaturas'])
            })
        .end((err, res) => {
            if (err) {
                console.log('err Diccionario: ',err);
                return done(err);
            }
            // console.log(res);
            return done();
        });
    });

    it('/registroadmin: guarda admin en DB', (done) => {
        
        request(app).post('/registroadmin')
            .send(adminGoodProbe)
            .expect((res) => {
                expect(res.body.nombre).toBe(adminGoodProbe.nombre);
                resTokenUsuario = res.header['x-auth'];
            })
            .expect(201)
        .end((err, res) => {
            if (err) {
                console.log(err);
                return done(err);
            }
            // //find saved user by name
            User.find({email: adminGoodProbe.email}).then((usuarios) => {
                expect(usuarios.length).toBe(1);
                expect(usuarios[0].email).toBe(adminGoodProbe.email);
                done();
            }).catch((e) => {
                console.log(e);
                done(e)
            });
        });
    });

    //Depende de registro admin
    it('Registra empresa: /registroEmpresa', (done) => {
        request(app)
            .post('/registroEmpresa')
            .set('x-auth', resTokenUsuario)
            .send(datosMinEmpresa)
            .expect((res) => {
                // console.log(res.header);
                expect(res.body.empresa).toBe(datosMinEmpresa.empresa);
                restokenAdmin = res.header['x-auth'];
            })
            .expect(201)
       .end((err, res) => {
           if(err) {
            //    console.log(err);
               return done(err);
           }
           Company.find({}).then((empresas)=> {
                done();
           }).catch((e) => done(e));
       });
    });


    it('devuelve un ad de connected', (done) => {

        const adNumber = random(3);
        request(app)
            .get(`/getAdsConnected/${adNumber}`)
            .send()
            .expect(200)
            .expect((res) => {
                expect(res.body.titulo).toBe(adsConnected[adNumber-1].titulo);
            })
        .end((err, res) => {
            if (err) {
                console.log(err);
                return done(err);
            }
            return done();
        });
    });


    //     request(app)
    //         .post('/login')
    //         .send({
    //           email: adminGoodProbe.email,
    //           password: adminGoodProbe.password
    //         })
    //         .expect(200)
    //         .expect((res) => {
    //             epxect(res.header['x-auth']).toExist();
    //             // expect(res.body.empresa).toBe(datosMinEmpresa.empresa);
                
    //         })
    //         .end((err, res) => {
    //             if (err) {
    //                 return done(err);
    //             }
    //             // User.findOne({email: adminGoodProbe.email}).then((user) => {
    //             //     expect(user.tokens[0]).toInclude({
    //             //         access: 'auth',
    //             //         token: res.headers['x-auth']
    //             //     })
    //             //     done();
    //             // });
    //             done()
    //         }).catch((err) => {
    //             done(err)
    //         })
    // });

    // it('/creaUsuario: guarda usuario en DB', (done) => {
    //     const usuarioGoodMinProbe = {
    //         nombre: `usuario`,
    //         email: `ejemplo${Math.floor((Math.random() * 100) + 1)}@correo.com`,
    //         password: 'contrasena',
    //         rol: 'admin',
    //         empresa: 'empresita',
    //         celular: 1234567890
    //     };
    //     var tokenUsuario;
        
    //     request(app)
    //         .post('/creausuario')
    //         .send(usuarioGoodMinProbe)
    //         .expect(201)
    //         .expect((res) => {
    //             expect(res.body.user).toBe(usuarioGoodMinProbe.user);
    //             resTokenUsuario = res.header['x-auth'];
    //         })
    //     .end((err, res) => {
    //         if (err) {
    //             return done(err);
    //         }
    //         // //find saved user by name
    //         User.find({user: usuarioGoodMinProbe.user}).then((usuarios) => {
    //             expect(usuarios.length).toBe(1);
    //             expect(usuarios[0].email).toBe(usuarioGoodMinProbe.email);
    //             done();
    //         }).catch((e) => done(e));
    //     });
    // });


    xit('/ : guarda producto de usuario', (done) => {   
        done();
    });

    xit('/creaUsuarios: No guarda usuario si falta un campo',() =>{});

});


describe('Busqueda de datos', () => {
    // it('login', () => {
    //         //find by token
    //         User.findByToken(resTokenUsuario).then((usuario) => {
    //             expect(usuario.user).toBe(usuarioGoodMinProbe.user);                
    //             done();
    //         }).catch((e) => done(e)); 
    // });
    // it('diccionario de categorias', () => {
        
    // });

});

// describe('Modificacion de datos', () => {
//     it('cambio de rol', () => {
        
//     });
// });

// describe('Destruccion de datos', () => {
//     it('logout', () => {
        
//     });
// });