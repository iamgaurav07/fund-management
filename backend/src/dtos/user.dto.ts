import { IsEmail, IsString, MinLength, IsIn, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string; // Definite assignment assertion

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password!: string;

  @IsString({ message: 'Name must be a string' })
  name!: string;

  @IsIn(['USER', 'ADMIN', 'SUPERADMIN'], {
    message: 'Role must be either USER, ADMIN or SUPERADMIN',
  })
  @IsOptional()
  role: 'USER' | 'ADMIN' | 'SUPERADMIN' = 'USER'; // Default value

  @IsBoolean()
  @IsOptional()
  isVerified = false; // Default value

  constructor(data?: Partial<CreateUserDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class UpdateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsOptional()
  password?: string;

  @IsIn(['USER', 'ADMIN', 'SUPERADMIN'], {
    message: 'Role must be either USER, ADMIN or SUPERADMIN',
  })
  @IsOptional()
  role?: 'USER' | 'ADMIN' | 'SUPERADMIN';

  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  constructor(data?: Partial<UpdateUserDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export class LoginUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  password!: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
