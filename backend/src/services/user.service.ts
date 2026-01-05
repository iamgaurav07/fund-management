// services/user.service.ts
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { HttpException } from '../exceptions/http.exception';
import User from '../models/user.model';
import { isEmpty } from '../utils/util';
import { UserResponse } from '../interfaces/user.interface';

export class UserService {
  public async findAllUsers(): Promise<UserResponse[]> {
    const users = await User.find().select('-password').lean();
    return users.map((user) => ({
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  public async findUserById(userId: string): Promise<UserResponse> {
    if (isEmpty(userId)) {
      throw new HttpException(400, 'User ID is required');
    }

    const user = await User.findById(userId).select('-password').lean();
    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    return {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  public async createUser(userData: CreateUserDto): Promise<UserResponse> {
    if (isEmpty(userData)) {
      throw new HttpException(400, 'User data is empty');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new HttpException(409, `User with email ${userData.email} already exists`);
    }

    const createdUser = await User.create(userData);

    // Safe conversion to plain object without password
    const userResponse: UserResponse = {
      _id: createdUser._id.toString(),
      email: createdUser.email,
      role: createdUser.role,
      isVerified: createdUser.isVerified,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    };

    return userResponse;
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<UserResponse> {
    if (isEmpty(userData)) {
      throw new HttpException(400, 'User data is empty');
    }

    if (userData.email) {
      const existingUser = await User.findOne({
        email: userData.email,
        _id: { $ne: userId },
      });
      if (existingUser) {
        throw new HttpException(409, `User with email ${userData.email} already exists`);
      }
    }

    // Create update object without undefined fields
    const updateData: any = {};
    if (userData.email) updateData.email = userData.email;
    if (userData.password) updateData.password = userData.password;
    if (userData.role) updateData.role = userData.role;
    if (typeof userData.isVerified === 'boolean') updateData.isVerified = userData.isVerified;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    })
      .select('-password')
      .lean();

    if (!updatedUser) {
      throw new HttpException(404, 'User not found');
    }

    return {
      _id: updatedUser._id.toString(),
      email: updatedUser.email,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  public async deleteUser(userId: string): Promise<{ message: string }> {
    if (isEmpty(userId)) {
      throw new HttpException(400, 'User ID is required');
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new HttpException(404, 'User not found');
    }

    return { message: 'User deleted successfully' };
  }

  public async getCurrentUser(userId: string): Promise<UserResponse> {
    return this.findUserById(userId);
  }
}
