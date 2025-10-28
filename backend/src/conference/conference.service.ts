import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Conference } from '@prisma/client';

@Injectable()
export class ConferenceService {
  constructor(private prisma: PrismaService) {}

  // Alle Konferenzen abrufen
  findAll() {
    return this.prisma.conference.findMany();
  }

  // Einzelne Konferenz abrufen
  findOne(id: number) {
    return this.prisma.conference.findUnique({ where: { id } });
  }

  // Neue Konferenz erstellen
  create(data: {
    name: string;
    location: string;
    startDate: Date;
    endDate: Date;
  }) {
    return this.prisma.conference.create({ data });
  }

  // Konferenz aktualisieren
  update(id: number, data: Partial<Conference>) {
    return this.prisma.conference.update({ where: { id }, data });
  }

  // Konferenz löschen
  remove(id: number) {
    return this.prisma.conference.delete({ where: { id } });
  }
}
