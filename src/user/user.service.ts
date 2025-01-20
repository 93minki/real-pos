import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtUtil } from 'src/auth/jwt.util';
import { Repository } from 'typeorm';
import { RegisterUserDto, UpdateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtUtil: JwtUtil,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: RegisterUserDto): Promise<User> {
    const { email, password, username } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async updateUser(id: number, dto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, dto);
    return this.userRepository.findOneBy({ id });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
