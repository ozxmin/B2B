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

// Test Global variables
const {
    populateDB, 
    adsConnected, 
    datosMinEmpresa, 
    adminGoodProbe,
    random,
    productosDeEmpresa
} = require('./seed/seed')

let tokenUsuario, idProductoAgregado, nombreUsuario, emailUsuario;


//================> Set up
before(populateDB);

//>>>>>>>>>>>>>>>>==============> Inicio de pruebas

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
                    nombreUsuario = usuarios[0].nombre
                    emailUsuario = usuarios[0].email
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
            })
            .expect(201)
            .end((err, res) => {
                if(err) {
                    console.log(err);
                    done(err);
                }
                Company.find({}).then((empresas)=> {
                    done();
                }).catch((e) => done(e));
            });
    });

    it('Agrega producto', (done) => {
        const myRandom = random(productosDeEmpresa.length)
        const producto = productosDeEmpresa[myRandom-1];
        request(app).post('/agregaProducto')
            .set('x-auth', tokenUsuario)
            .send(producto)
            .expect(201)
            .end((err, res) => {
                idProductoAgregado = res.body._id
                if(err) {
                    console.log(err);
                    done(err);
                }
            });
        done();
    });

    it('logout: Borra el token usado en la sesion', (done) => {
        request(app).delete('/logout')
            .set('x-auth', tokenUsuario)
            .send()
            .expect(205)
            .end((err, res) => {
                User.find({nombre: nombreUsuario}).then((loggedOutUser) => {
                    expect(loggedOutUser[0].tokens.length).toBeFewerThan(1);
                }).catch((err) => {
                    console.log(err);
                    done(err);
                })
            })
        done();
    });

    it('login: agrega un token al llavero', (done) => {
        request(app).post('/login')
            .send({email: emailUsuario, password: 'contrasena'})
            .expect(200)
            .end((err, res) => {
                User.find({nombre: nombreUsuario}).then((loggedIn) => {                    
                    expect(loggedIn[0].tokens.length).toBeGreaterThan(0);
                    expect(loggedIn[0].tokens[0].token).toBe(res.body.tokens[0].token);
                }).catch((err) => {
                    console.log(err);
                    return done(err);
                });
            });
        done();
    });

    xit('/completaEmpresa Comprleta registro empresa', (done) => {
        done();
    });

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
            });
        done();
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
        });
        done();
    });

    it('/producto: devuelve los detalles de un producto dado su ID', (done) => {
        request(app).get(`/producto/${idProductoAgregado}`)
            .send()
            .expect(200)
            .expect((res) => {
                let producto = productosDeEmpresa.find((producto) => {
                    return producto.nombreProducto === res.body[0].nombreProducto   
                });
                expect(producto.subcategorias).toNotEqual(null);
                expect(producto.subcategorias).toEqual(res.body[0].subcategorias);
            })
            .end((err, res) => {
                if(err) {
                    console.log(err);
                    return done(err);
                }
            });
        done();
    });

    xit('/getProductosDestacadosHome', (done) => {
        done();
    });

    xit('/getProductosDestacadosXCategoria', (done) => {
        done();
    });


});


///================Productos

describe('Productos', () => {
    xit('/getReviewsProductos: reviews por id', (done) => {
        done();
    });
    
});