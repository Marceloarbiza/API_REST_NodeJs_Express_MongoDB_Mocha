const request = require('supertest'); // make requests to the app
const app = require('../app'); // import the app


// Test the root path
describe('GET /', () => {
    it('should return 200 OK', (done) => {
        request(app)
            .get('/')
            .expect(200, done);
    });
    it('should return 404 Not Found', (done) => {
        request(app)
            .get('/notfound')
            .expect(404, done);
    });
});

//describe('GET /api/stores', () => {

describe('GET /api/posts', () => {
    // test login 
    it('should return 200 OK', (done) => {
        request(app)
            .get('/api/posts')
            .auth('test@koibanx.com', 'admin')
            .expect(200, done);
    });
    it('should return 404 Not Found', (done) => {
        request(app)
            .get('/api/notfound')
            .expect(404, done);
    });
    it('should return 401 Unauthorized', (done) => {
        request(app)
            .get('/api/posts')
            .expect(401, done);
    });
    // test type of response
    it('should return json', (done) => {
        request(app)
            .get('/api/posts')
            .auth('test@koibanx.com', 'admin')
            .expect('Content-Type', /json/, done);
    });
    // test array response content and length
    it('should return an array', (done) => {
        request(app)
            .get('/api/posts')
            .auth('test@koibanx.com', 'admin')
            // reponse length
            .expect((res) => {
                expect(res.body).toBeArray();
                expect(res.body.length).toBeEquals(5);
            }
            , done());
    });
    // test pagination structure
    it('should return an object with pagination', (done) => {
        request(app)
            .get('/api/posts')
            .auth('test@koibanx.com', 'admin')
            .expect((res) => {
                expect(res.body).toBeObject();
                expect(res.body).toHaveProperty('data');
                expect(res.body).toHaveProperty('page');
                expect(res.body).toHaveProperty('pages');
                expect(res.body).toHaveProperty('limit');
                expect(res.body).toHaveProperty('total');
            }
            , done());
    });
    // test send pagination url with query params
    it('should return an object with pagination', (done) => {
        request(app)
            .get('/api/posts?limit=3&page=2')
            .auth('test@koibanx.com', 'admin')
            .expect((res) => {
                expect(res.body).toBeObject();
                expect(res.body).toHaveProperty('data');
                expect(res.body['data']).toBeArray();
                expect(res.body['data'].length).toBeEquals(2);
                expect(res.body).toHaveProperty('page');
                expect(res.body['page']).toBeEquals(2);
                expect(res.body).toHaveProperty('pages');
                expect(res.body['pages']).toBeGreaterThan(1);
                expect(res.body).toHaveProperty('limit');
                expect(res.body['limit']).toBeEquals(3);
                expect(res.body).toHaveProperty('total');
                expect(res.body['total']).toBeGreaterThan(1);
            }
            , done());
    });
    // test data content and structure
    it('should return an array of objects', (done) => {
        request(app)
            .get('/api/posts')
            .auth('test@koibanx.com', 'admin')
            .expect((res) => {
                expect(res.body[0]).toBeObject();
                expect(res.body[0]).toHaveProperty('name');
                expect(res.body[0]).typeOf('string');
                expect(res.body[0]).toHaveProperty('cuit');
                expect(res.body[0]).typeOf('string');
                expect(res.body[0]).toHaveProperty('concepts');
                expect(res.body[0]).typeOf('array');
                expect(res.body[0]).toHaveProperty('currentBalance');
                expect(res.body[0]).typeOf('number');
                expect(res.body[0]).toHaveProperty('active');
                expect(res.body[0]).typeOf('string');
                expect(res.body[0]).toHaveProperty('lastSale');
                expect(res.body[0]).typeOf('string');
            }
            , done());
    });
});

// test POST
describe('POST /api/posts', () => {
    // test login
    it('should return 200 Created', (done) => {
        request(app)
            .post('/api/posts')
            .auth('test@koibanx.com', 'admin')
            .send({
                name: 'test1',
                cuit: '20-12345678-9',
                concepts: ["computers","phones","earphones"],
                currentBalance: 100,
                active: true,
                lastSale: '2022-05-09'
            })
            .expect(201, done);
    });
    // test type of response
    it('should return json', (done) => {
        request(app)
            .post('/api/posts')
            .auth('test@koibanx.com', 'admin')
            .send({
                name: 'test2',
                cuit: '20-12345678-9',
                concepts: ["computers","phones","earphones"],
                currentBalance: 100,
                active: true,
                lastSale: '2022-05-09'
            })
            .expect('Content-Type', /json/, done);
    });
    // test status code
    it('should return 500 Not Found', (done) => {
        request(app)
            .post('/api/posts')
            .auth('test@koibanx.com', 'admin')
            .send({
                name: '',
                cuit: '20-12345678-9',
                concepts: ["computers","phones","earphones"],
                currentBalance: 100,
                active: true,
                lastSale: '2022-05-09'
            })
            .expect(500, done);
    });
    // test error message
    it('should return an object with error message', (done) => {
        request(app)
            .post('/api/posts')
            .auth('test@koibanx.com', 'admin')
            .send({
                name: '',
                cuit: '20-12345678-9',
                concepts: ["computers","phones","earphones"],
                currentBalance: 100,
                active: true,
                lastSale: '2022-05-09'
            })
            .expect((res) => {
                expect(res.body).toBeObject();
                expect(res.body).toHaveProperty('error');
                expect(res.body['error']).toBeString();
            }
            , done());
    });
});
