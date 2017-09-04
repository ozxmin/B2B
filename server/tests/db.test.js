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

const {
    populateDB, 
    adsConnected, 
    datosMinEmpresa, 
    adminGoodProbe,
    random,
    productosDeEmpresa
} = require('./seed/seed')

let tokenUsuario, idProductoAgregado;


//================> Set up
before(populateDB);

//==============> Inicio de pruebas


//=================Registro
describe('Registro admin y empresa', () => {
    it('/registroadmin: guarda admin en DB', (done) => {
        
        request(app).post('/registroadmin')
            .send(adminGoodProbe)
            .expect((res) => {
                expect(res.body.nombre).toBe(adminGoodProbe.nombre);
                tokenUsuario = res.header['x-auth'];
            })
            .expect(201)
        .end((err, res) => {
            if (err) {
                console.log(err);
                return done(err);
            }
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
    it('/registroEmpresa Registra empresa', (done) => {
        request(app)
            .post('/registroEmpresa')
            .set('x-auth', tokenUsuario)
            .send(datosMinEmpresa)
            .expect((res) => {
                expect(res.body.empresa).toBe(datosMinEmpresa.empresa);
                // restokenAdmin = res.header['x-auth'];
            })
            .expect(201)
       .end((err, res) => {
           if(err) {
               console.log(err);
               return done(err);
           }
           Company.find({}).then((empresas)=> {
                done();
           }).catch((e) => done(e));
       });

    });

    it('Agrega producto', (done) => {
        const myRandom = random(productosDeEmpresa.length)
        const producto = productosDeEmpresa[myRandom-1];
        request(app)
            .post('/agregaProducto')
            .set('x-auth', tokenUsuario)
            .send(producto)
            .expect(201)
            .end((err, res) => {
                idProductoAgregado = res.body._id
                if(err) {
                    console.log(err);
                }
                done();
            })
    });

    xit('/completaEmpresa Comprleta registro empresa', () => {
        
    });

});



describe('Login', () => {
    xit('login', () => {
        
    });
});


//===================Home Publico ====================
describe('Home Publico', () => {
    
    it('/getAdsConnected: devuelve un ad de connected', (done) => {
        
                const adNumber = random(3);
                request(app)
                    .get(`/getAdsConnected/${adNumber}`)
                    .send()
                    .expect(200)
                    .expect((res) => {
                        // expect(3).toBe(2);
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

    it('/getDiccionario: todas las categorias y sub disponibles', (done) => {
        const {diccionarioCategorias} = require('./../db/models/categorias');
        request(app).get('/getDiccionarioCategorias')
            .send()
            .expect(200)
            .expect((res) => {
                expect(res.body['Hilaturas'])
                .toEqual(diccionarioCategorias['Hilaturas'])
            })
        .end((err, res) => {
            if (err) {
                console.log('err Diccionario: ',err);
                return done(err);
            }
            return done();
        });
    });

    xit('/getProductosDestacadosHome', () => {   
    });

    xit('/getProductosDestacadosXCategoria', () => {
    });

    it('/producto: devuelve los detalles de un producto dado su ID', (done) => {
        var prueba
        request(app).get(`/producto/${idProductoAgregado}`)
            .send()
            .expect(200)
            .expect((res) => {
                console.log('res.body', res.body);

                let producto = productosDeEmpresa.find(producto => producto.nombreProducto === res.body[0].nombreProducto)

                prueba = producto;
                // console.log(prueba);
                expect(producto.subcategoria).toEqual(res.body[0].subcategoria)

            })
            .end((err, res) => {
                if(err) {
                    // console.log(err);
                    return done(err);
                }
                return done();
                
            });
    });

});



///================Productos


describe('Productos', () => {
    xit('/getReviewsProductos: reviews por id', () => {
        
    });
    
});



// });



// describe('Modificacion de datos', () => {
//     it('cambio de rol', () => {
        
//     });
// });

// describe('Destruccion de datos', () => {
//     it('logout', () => {
        
//     });
// });



// describe('Busqueda de datos', () => {
    // it('login', () => {
    //         //find by token
    //         User.findByToken(resTokenUsuario).then((usuario) => {
    //             expect(usuario.user).toBe(usuarioGoodMinProbe.user);                
    //             done();
    //         }).catch((e) => done(e)); 
    // });
    // it('diccionario de categorias', () => {
        
    // });

// });



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