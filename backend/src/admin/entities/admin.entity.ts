import { Admin as PrismaAdmin } from '@prisma/client';

export class AdminEntity implements PrismaAdmin {
  id: number;
  name: string;
  email: string;
  password: string;

  constructor(partial: Partial<AdminEntity>) {
    Object.assign(this, partial);
  }
}
