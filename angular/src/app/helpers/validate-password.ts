const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MIN_REQUIREMENTS_MET = 3;
const PASSWORD_CONTAINS_DIGIT = /(?=.*\d)/;
const PASSWORD_CONTAINS_LOWERCASE = /(?=.*[a-z])/;
const PASSWORD_CONTAINS_UPPERCASE = /(?=.*[A-Z])/;
const PASSWORD_CONTAINS_SYMBOL = /(?=(.*[!@#$%^&*()_+{}|:"<>?~;',./=-]))/;

export const validatePassword = (password: string) => {
  if (password.length < PASSWORD_MIN_LENGTH) return false;

  let requirementsMet = 0;
  if (PASSWORD_CONTAINS_UPPERCASE.test(password)) requirementsMet++;
  if (PASSWORD_CONTAINS_LOWERCASE.test(password)) requirementsMet++;
  if (PASSWORD_CONTAINS_DIGIT.test(password)) requirementsMet++;
  if (PASSWORD_CONTAINS_SYMBOL.test(password)) requirementsMet++;

  return requirementsMet >= PASSWORD_MIN_REQUIREMENTS_MET;
};
