import 'server-only';
import { signUpUser } from '@/data/auth';
import { SignupParams } from '@/types/auth';

export class AuthService {
  static async signup(params: SignupParams) {
    // 将来的なバリデーションロジックはここに記述
    // 例: validatePasswordStrength(params.password);

    const { data, error } = await signUpUser(params);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
