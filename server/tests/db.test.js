//library for assertions
const expect = require('expect');
//http tests
const request = require('supertest');
// adds a special setter and getter to modules for better testing.

const {app} = require('./../server');
const {User} = require('./../db/models/user');

describe('💾  DB C-R-U-D', () => {
    describe('+ Creacion de datos', () => {
        it('UserModel: Crea usuario', () => {
            
        });
    });    
});

