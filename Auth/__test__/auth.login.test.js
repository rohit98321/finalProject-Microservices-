const request = require('supertest');
const app = require('../src/app');
const userModel = require('../src/models/user.model');
const bcrypt = require('bcryptjs');

describe('POST /auth/login', () => {
  beforeEach(async () => {
    // create one test user before each login test
    const hash = await bcrypt.hash('password123', 10);
    await userModel.create({
      username: 'rohit',
      email: 'rohit@example.com',
      password: hash,
      fullName: { firstName: 'Rohit', lastName: 'Gupta' },
      role: 'user',
    });
  });

  it('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'rohit',
        email: 'rohit@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'user loggedin seccessfully');
    expect(res.body.user).toHaveProperty('email', 'rohit@example.com');
    expect(res.headers['set-cookie'][0]).toMatch(/token=/);
  });

  it('should return 401 if username or email not found', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'unknown',
        email: 'unknown@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'wrong username or email');
  });

  it('should return 401 if password does not match', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'rohit',
        email: 'rohit@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'password not match');
  });

  it('should return 401 if required fields are missing', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'rohit@example.com',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'some field are missing');
  });

  it('should return 500 if an internal error occurs', async () => {
    // simulate internal error
    jest.spyOn(userModel, 'findOne').mockImplementationOnce(() => {
      throw new Error('DB error');
    });

    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'rohit',
        email: 'rohit@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'internal server error');

    jest.restoreAllMocks();
  });
});
