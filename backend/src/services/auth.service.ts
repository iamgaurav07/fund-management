import { LoginUserDto } from '../dtos/user.dto';
import { HttpException } from '../exceptions/http.exception';
import User from '../models/user.model';
import { isEmpty } from '../utils/util';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserResponse } from '../interfaces/user.interface';

export class AuthService {
  private readonly jwtSecret: jwt.Secret;
  private readonly jwtExpiresIn: string;

  constructor() {
    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';
  }

  public async login(loginData: LoginUserDto): Promise<UserResponse> {
    if (isEmpty(loginData)) {
      throw new HttpException(400, 'Login data is empty');
    }

    const user = await User.findOne({ email: loginData.email }).select('+password').lean();
    if (!user) {
      throw new HttpException(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(401, 'Invalid email or password');
    }

    if (!user.isVerified) {
      throw new HttpException(403, 'Please verify your email first');
    }

    // Properly typed JWT payload
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    // Correct JWT sign call with proper types
    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);

    return {
      _id: user._id.toString(),
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token,
    };
  }
}
