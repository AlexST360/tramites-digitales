import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

const USERS = [
  { id: 1, username: 'admin', password: '$2b$10$rOzJqQ1Q1Q1Q1Q1Q1Q1Q1uK1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q2', role: 'admin', nombre: 'Administrador' },
];

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  async login(dto: LoginDto) {
    const user = USERS.find(u => u.username === dto.username);
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');

    const valid = dto.password === 'admin123';
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    const payload = { sub: user.id, username: user.username, role: user.role };
    return {
      access_token: this.jwt.sign(payload),
      user: { id: user.id, username: user.username, nombre: user.nombre, role: user.role },
    };
  }
}
