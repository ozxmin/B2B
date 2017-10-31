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
const {Review} = require('./../db/models/reviews');

// Global test variables, from seed.js
const {
    normalUser,
    populateDB, 
    adsConnected, 
    datosMinEmpresa, 
    adminGoodProbe,
    random,
    productosDeEmpresa,
    comentarios
} = require('./seed/seed')

// local variables for api.test
let tokenAdmin, idProductoAgregado, nombreUsuario, emailUsuario;

//================> Set up
before(populateDB);

//>>>>>>>>>>>>>>>>==============> Inicio de pruebas

//=================Registro
describe('Registro admin, empresa y miembros', () => {
    
    it('/registroadmin: guarda admin en DB', (done) => {
        request(app).post('/registroadmin')
            .send(adminGoodProbe)
            .expect((res) => {
                expect(res.body.nombre).toBe(adminGoodProbe.nombre);
                tokenAdmin = res.header['x-auth'];
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
                    nombreUsuario = usuarios[0].nombre
                    emailUsuario = usuarios[0].email
                    
                }).catch((e) => {
                    console.log(e);
                    return done(e)
                });
                done();
            });
    });

    //Depende de registro admin
    it('/registroEmpresa Registra empresa', (done) => {
        request(app)
            .post('/registroEmpresa')
            .set('x-auth', tokenAdmin)
            .send(datosMinEmpresa)
            .expect((res) => {
                expect(res.body.empresa).toBe(datosMinEmpresa.empresa);
            })
            .expect(201)
            .end((err, res) => {
                if(err) {
                    console.log(err);
                    return done(err);
                }
                Company.find({}).then((empresas)=> {
                }).catch((e) => done(e));
                done();
            });
    });

    it('Agrega miembro a empresa', (done) => {
        const myNormalUser = normalUser;
        request(app).post('/agregaUsuarioAEmpresa')
        .set('x-auth', tokenAdmin)
        .send(normalUser)
        .expect(201)
        .end((err, res) => {
            if (err) { return done(err) }
            const nuevoUsuario = res.body
            Company.findById(nuevoUsuario.empresaRef).then((empresa) => {
                expect(empresa.miembros).toInclude(nuevoUsuario._id);
            }).then(() => {
                User.findById(nuevoUsuario._id).then((usuario) => {
                    expect(usuario.nombre).toEqual(usuario.nombre)
                    console.log("ID Usuario Normal: ", nuevoUsuario._id);
                }).catch((err) => {done(err)});
            })
            done();            
        });
    });

    it('Agrega producto', (done) => {
        const myRandomProduct = random(productosDeEmpresa.length)
        const producto = productosDeEmpresa[myRandomProduct-1];

        productosDeEmpresa.forEach(function(producto) {
            request(app).post('/agregaProducto')
            .set('x-auth', tokenAdmin)
            .send(producto)
            .expect(201)
            .end((err, res) => {
                idProductoAgregado = res.body._id
                if(err) {
                    console.log(err);
                    return done(err);
                }
               
            });            
        }, this);
        done();

    });

    it('logout: Borra el token usado en la sesion', (done) => {
        request(app).delete('/logout')
            .set('x-auth', tokenAdmin)
            .send()
            .expect(205)
            .end((err, res) => {
                User.find({nombre: nombreUsuario}).then((loggedOutUser) => {
                    expect(loggedOutUser[0].tokens.length).toBeFewerThan(1);
                }).catch((err) => {
                    console.log(err);
                    return done(err);
                });
                if(err) {
                 return done(err)
                }
                tokenAdmin = null
                // console.log('TOKEN NIL--------------------');
                // console.log(tokenAdmin);
                done();
            });            
    });

    it('login: agrega un token al llavero', (done) => {
        request(app).post('/login')
            .send({email: emailUsuario, password: 'contrasena'})
            .expect(200)
            .end((err, res) => {
                User.findOne({nombre: nombreUsuario}).then((loggedIn) => {                
                   expect(loggedIn.tokens.length).toEqual(1);
                    expect(loggedIn.tokens[0].token).toBe(res.body.tokens[0].token);
                }).catch((err) => {
                    console.log(err);
                    return done(err);
                });
                tokenAdmin = res.body.tokens[0].token
                done();
            });
    });

    xit('/completaEmpresa Comprleta registro empresa', (done) => {done()});
    xit('Calcula los costos de membresia correctamente');

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
                expect(res.body.titulo).toBe(adsConnected[adNumber-1].titulo);
            })
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                done();
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
            done();
        });
    });

    it('/producto: devuelve los detalles de un producto dado su ID', (done) => {
        request(app).get(`/producto/${idProductoAgregado}`)
            .send()
            .expect(200)
            .expect((res) => {
                let producto = productosDeEmpresa.find((producto) => {
                    return producto.nombreProducto === res.body[0].nombreProducto   
                });
                expect(idProductoAgregado).toNotBe(null)
                expect(producto.subcategorias).toNotEqual(null);
                expect(producto.subcategorias).toEqual(res.body[0].subcategorias);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                done();
            });
    });


    it('/comentarProducto: Agrega review de un usuario a un producto', (done) => {
        const comentario = {
            contenido: comentarios.comentario,
            titulo: comentarios.titulo,
            productId: idProductoAgregado
        };
        request(app).post('/comentarProducto')
            .send(comentario)
            .set('x-auth', tokenAdmin)
            .expect(201)
            .end((err, res) => {
                console.log('token admin', tokenAdmin);

                if (err) {
                    return done(err);
                }
                done();
            });
    });

   
    xit('/getProductosDestacadosHome', (done) => {done();});
    xit('/getProductosDestacadosXCategoria', (done) => {done();});
});


///================Productos

describe('Productos Pubilco', () => {

  

    xit('/getReviewsProductos: devuelve reviews por id de producto', (done) => {
        done();
    });
    
});




        // request(app).post('/comentarProducto')
        //     .set('x-auth', tokenAdmin)
        //     .send(comentario)
        //     .expect(() => {
        //         expect('oeuj').toBe(3);        
        //     })
        //     .end((err, res) => {
        //         // console.log(res.text);
        //         // console.log(err);
        //         if(err) {
        //             return done(err);
        //         }
        //         done();
        //     });
        // // return done();