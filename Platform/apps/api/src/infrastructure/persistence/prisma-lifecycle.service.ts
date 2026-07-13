import { Injectable, Logger, type OnApplicationShutdown } from '@nestjs/common';
import { prisma } from '@aifa/database';

/**
 * Disconnects the shared Prisma client on shutdown. Requires
 * `app.enableShutdownHooks()` in main.ts to actually fire (Nest does not call
 * shutdown lifecycle hooks unless that's enabled). Before this existed,
 * nothing ever called `prisma.$disconnect()` — a rolling deploy or container
 * stop did not drain the database connection cleanly.
 */
@Injectable()
export class PrismaLifecycleService implements OnApplicationShutdown {
  private readonly logger = new Logger(PrismaLifecycleService.name);

  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(`Disconnecting Prisma client (signal: ${signal ?? 'none'})`);
    await prisma.$disconnect();
  }
}
