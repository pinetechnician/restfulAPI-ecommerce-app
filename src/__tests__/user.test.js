const request = require('supertest');
const app = require('../index');  // Assuming your Express app is exported from here
const pool = require('../config/database'); // If you're using a pool to interact with your database

describe('User API', () => {
  // Close DB connection after all tests are done
  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = 'newuser@example.com' OR email = 'updateduser@example.com'");
    pool.end();
  });

  describe('POST /register', () => {
    it('should successfully register a new user', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'testpassword123'
        });

      expect(response.statusCode).toBe(201);
      expect(response.text).toMatch(/User registered, ID:/);
    });

    it('should return error if email already exists', async () => {
        const res = await request(app)
          .post('/api/users/register')
          .send({
            username: 'newuser1',
            email: 'newuser@example.com',  // Assuming this email already exists
            password: 'testPassword123'
          });
    
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('Email already exists');  
    });

    it('should return error if username already exists', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'newuser',  // Existing username
                email: 'uniqueemail@example.com',  
                password: 'password123'
            });
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Username already exists');
    });

    it('should return an error if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'testuser',
          password: 'testpassword123'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /login', () => {
    it('should successfully log in a user', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'newuser@example.com',
          password: 'testpassword123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('username', 'newuser');
    });

    it('should return an error for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /users/:userId', () => {
    it('should successfully update user information', async () => {
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: 'newuser@example.com',
          password: 'testpassword123'
        });
        
      const cookies = loginResponse.headers['set-cookie'];

      const userId = loginResponse.body.user.userId;
      const updateResponse = await request(app)
        .put(`/api/users/${userId}`)
        .set('Cookie', cookies)
        .send({
          username: 'updateduser',
          email: 'updateduser@example.com'
        });

      expect(updateResponse.statusCode).toBe(200);
      expect(updateResponse.body).toHaveProperty('username', 'updateduser');
    });

    it('should return an error for unauthorized updates', async () => {
      const updateResponse = await request(app)
        .put('/api/users/9999') // Non-existent or unauthorized user ID
        .send({
          username: 'unauthorizeduser'
        });

      expect(updateResponse.statusCode).toBe(401);
      expect(updateResponse.body.message).toMatch(/You are not authenticated./);
    });
  });
});