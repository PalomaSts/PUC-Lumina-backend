import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task } from '@prisma/client';
import { Prisma } from '@prisma/client';
import * as appInsights from 'applicationinsights';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(TasksService.name);

  async create(userId: string, data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
    if ((data as any).id) delete (data as any).id;

    data.dueDate = new Date(data.dueDate);
    data.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    const result = this.prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackTrace({
        message: 'Task created with server-side properties',
        properties: {
          context: 'TasksService',
          action: 'create',
          userId: userId,
          taskId: (await result).id,
        },
      });
    }
    this.logger.log('Task created', 'TasksService');
    return result;
  }

  async findAll(userId: string, filters: any = {}) {
    const result = this.prisma.task.findMany({
      where: {
        userId,
        ...(filters.projectId && { projectId: filters.projectId }),
        ...(filters.priority && { priority: filters.priority }),
        ...(filters.status && { status: filters.status }),
      },
      orderBy: { createdAt: 'desc' },
      include: { project: true },
    });
    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackTrace({
        message: 'All tasks were found with server-side properties',
        properties: {
          context: 'TasksService',
          action: 'findAll',
          userId: userId,
        },
      });
    }
    this.logger.log('All tasks were found', 'TasksService');
    return result;
  }

  async findOne(userId: string, id: string): Promise<Task> {
    const result = this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (appInsights.defaultClient) {
      appInsights.defaultClient.trackTrace({
        message: 'One task were found with server-side properties',
        properties: {
          context: 'TasksService',
          action: 'findOne',
          userId: userId,
          taskId: id,
        },
      });
    }
    this.logger.log('One task were found', 'TasksService');
    return result;
  }

  async update(userId: string, id: string, data: Prisma.TaskUncheckedUpdateInput): Promise<Task> {
    const { projectId, ...allowedData } = data;

    const updateData: Prisma.TaskUncheckedUpdateInput = {
      ...allowedData,
    };

    let statusValue: string | undefined;

    if (typeof data.status === 'string') {
      statusValue = data.status;
    } else if (typeof data.status === 'object' && data.status !== null) {
      statusValue = (data.status as any).set;
    }

    if (statusValue === 'completed') {
      updateData.completedAt = new Date();
    } else if (statusValue && statusValue !== 'completed') {
      updateData.completedAt = null;
    }

    const updateResult = await this.prisma.task.updateMany({
      where: { id, userId },
      data: updateData,
    });

    if (updateResult.count === 0) {
      throw new Error('Tarefa não encontrada ou acesso negado');
    }

    if (projectId && typeof projectId === 'string') {
    }

    return this.findOne(userId, id);
  }

  async remove(userId: string, id: string): Promise<Prisma.BatchPayload> {
    return this.prisma.task.deleteMany({
      where: { id, userId },
    });
  }

  async assignToProject(userId: string, taskId: string, projectId: string) {
    return this.prisma.task.updateMany({
      where: {
        id: taskId,
        userId,
      },
      data: {
        projectId,
      },
    });
  }

  async findByProject(userId: string, projectId: string, done?: boolean) {
    const where: any = {
      userId,
      projectId,
    };

    if (done !== undefined) {
      where.done = done;
    }

    return this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countTasksLast24h(userId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await this.prisma.task.count({
      where: {
        userId,
        completedAt: {
          not: null,
          gte: since,
        },
      },
    });
    return { count };
  }

  async getCompletionStats(userId: string) {
    const total = await this.prisma.task.count({
      where: { userId },
    });
    const completed = await this.prisma.task.count({
      where: { userId, status: 'completed' },
    });
    return { total, completed };
  }

  async getWeeklyStats(userId: string) {
    const days = 7;
    const result: { date: string; count: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const count = await this.prisma.task.count({
        where: {
          userId,
          completedAt: {
            gte: start,
            lte: end,
          },
        },
      });

      result.push({
        date: start.toISOString().split('T')[0],
        count,
      });
    }

    return result;
  }
}
