import { validatePassword } from './validate-password';

describe('validatePassword', () => {
  it('should fail validation if password is too short', () => {
    const password = 'Abcd12';
    const isValid = validatePassword(password);
    expect(isValid).toBeFalse();
  });

  it('should fail validation if password meets only one requirement', () => {
    expect(validatePassword('abcdefgh')).toBeFalse();
    expect(validatePassword('ABCDEFGH')).toBeFalse();
    expect(validatePassword('12345678')).toBeFalse();
    expect(validatePassword('!@#$%^&*()')).toBeFalse();
  });

  it('should fail validation if password meets only two requirements', () => {
    expect(validatePassword('1!2?3!4?')).toBeFalse();
    expect(validatePassword('A!C?E!G?')).toBeFalse();
    expect(validatePassword('A1B2C3D4')).toBeFalse();
    expect(validatePassword('a!c?e!g?')).toBeFalse();
    expect(validatePassword('a!c?e!g?')).toBeFalse();
    expect(validatePassword('a1b2c3d4')).toBeFalse();
    expect(validatePassword('a1b2c3d4')).toBeFalse();
    expect(validatePassword('AbCdEfGh')).toBeFalse();
  });

  it('should pass validation if password contains exactly minimum requirements', () => {
    expect(validatePassword('TEST123!')).toBeTrue();
    expect(validatePassword('test123!')).toBeTrue();
    expect(validatePassword('Test!!!!')).toBeTrue();
    expect(validatePassword('Test1234')).toBeTrue();
  });

  it('should return true if password contains more than minimum requirements', () => {
    expect(validatePassword('Test123!')).toBeTrue();
    expect(validatePassword('Password!')).toBeTrue();
    expect(validatePassword('Password123!')).toBeTrue();
  });
});
