import { hashPassword } from '../src/utils/password';
import { generateAccessToken, verifyAccessToken } from '../src/utils/jwt';

describe('Auth Utils', () => {
  describe('Password hashing', () => {
    it('should hash a password', async () => {
      const password = 'test123';
      const hash = await hashPassword(password);
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should compare passwords correctly', async () => {
      const password = 'test123';
      const hash = await hashPassword(password);
      const isValid = await comparePassword(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect passwords', async () => {
      const password = 'test123';
      const wrongPassword = 'wrong123';
      const hash = await hashPassword(password);
      const isValid = await comparePassword(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('JWT', () => {
    const payload = {
      id: 1,
      correo: 'test@example.com',
      id_rol: 1,
      rol: 'Superadministrador',
      nombres: 'Test',
      apellidos: 'User',
    };

    it('should generate and verify access token', () => {
      const token = generateAccessToken(payload);
      const decoded = verifyAccessToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.correo).toBe(payload.correo);
    });
  });
});
