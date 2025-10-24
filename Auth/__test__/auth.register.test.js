const request = require('supertest');
const app = require('../src/app');
const userModel = require('../src/models/user.model');

describe('POST /auth/register', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'rohit',
        email: 'rohit@example.com',
        password: 'password123',
        fullName: { firstName: 'Rohit', lastName: 'Gupta' },
        role: 'user',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
    expect(res.body.user).toHaveProperty('email', 'rohit@example.com');
    expect(res.headers['set-cookie'][0]).toMatch(/token=/);
  });

  it('should return 400 if user already exists', async () => {
    await userModel.create({
      username: 'rohit',
      email: 'rohit@example.com',
      password: 'hashedpassword',
      fullName: { firstName: 'Rohit', lastName: 'Gupta' },
      role: 'user',
    });

    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'rohit',
        email: 'rohit@example.com',
        password: 'password123',
        fullName: { firstName: 'Rohit', lastName: 'Gupta' },
        role: 'user',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'Already registered with this email or username'
    );
  });

  it('should return 400 if missing required fields', async () => { 
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'invalid@example.com',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      'message',
      'username, email, and password are required'
    );
  });
});
