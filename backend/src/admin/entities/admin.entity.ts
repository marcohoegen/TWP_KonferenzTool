import { Admin as PrismaAdmin } from '@prisma/client';

export class Admin implements PrismaAdmin {
  id: number;
  name: string;
  email: string;
  password: string;

  constructor(partial: Partial<Admin>) {
    Object.assign(this, partial);
  }
}
