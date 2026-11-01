import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isPgError, PG_UNIQUE_VIOLATION } from '../common/utils/pg-error.util';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User dengan id ${id} tidak ditemukan`);
    }
    return user;
  }

  // Disiapkan untuk modul auth (login): satu-satunya jalur yang ikut mengambil passwordHash
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const { password, ...data } = dto;
    const user = this.userRepository.create({
      ...data,
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
    });

    const saved = await this.save(user);
    // diambil ulang agar passwordHash tidak ikut di response
    return await this.findById(saved.id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    const { password, ...data } = dto;

    this.userRepository.merge(user, data);
    if (password) {
      user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }

    await this.save(user);
    return await this.findById(id);
  }

  async remove(id: string): Promise<{ message: string; deletedId: string }> {
    await this.findById(id);
    await this.userRepository.softDelete(id);

    return {
      message: `User dengan id ${id} berhasil dihapus`,
      deletedId: id,
    };
  }

  // simpan + terjemahkan pelanggaran UNIQUE email menjadi 409 Conflict
  private async save(user: User): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (isPgError(error, PG_UNIQUE_VIOLATION)) {
        throw new ConflictException('Email sudah terdaftar');
      }
      throw error;
    }
  }
}