export class LoginUserInput {
  // Either the account email or the username — the use case resolves
  // which one it is. (The HTTP field is still called `email` for
  // backward compatibility with existing clients.)
  emailOrUsername: string;
  password: string;
}
