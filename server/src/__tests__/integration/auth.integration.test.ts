import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../../models';
import { generateToken, verifyToken } from '../../utils/jwt';

let mongoServer: MongoMemoryServer;

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('User Registration and Login Flow', () => {
    it('should create user, hash password, and verify login', async () => {
      // Create user
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const user = await User.create(userData);

      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.password).not.toBe(userData.password); // Password should be hashed

      // Verify password
      const foundUser = await User.findOne({ email: userData.email }).select('+password');
      expect(foundUser).toBeTruthy();

      const isPasswordValid = await foundUser!.comparePassword(userData.password);
      expect(isPasswordValid).toBe(true);

      const isWrongPassword = await foundUser!.comparePassword('wrongpassword');
      expect(isWrongPassword).toBe(false);
    });

    it('should generate and verify JWT token for user', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: user.role,
      });

      expect(token).toBeTruthy();

      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(user._id);
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe('user');
    });

    it('should prevent duplicate email registration', async () => {
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      // Try to create another user with same email
      await expect(
        User.create({
          email: 'test@example.com',
          password: 'password456',
          name: 'Another User',
        })
      ).rejects.toThrow();
    });
  });
});
