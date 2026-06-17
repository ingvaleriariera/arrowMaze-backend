export const PASSWORD_ENCODER = 'PASSWORD_ENCODER';

export interface IPasswordEncoder {
  hash(raw: string): Promise<string>;
  verify(raw: string, hashed: string): Promise<boolean>;
}
