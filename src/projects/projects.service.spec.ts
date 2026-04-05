import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  project: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a project', async () => {
    const mockProject = {
      id: '1',
      name: 'Projeto Teste',
      description: '',
      status: 'new',
      userId: 'user-id',
    };

    prisma.project.create.mockResolvedValue(mockProject);

    const result = await service.create({
      name: 'Projeto Teste',
      description: '',
      userId: 'user-id',
    } as any);

    expect(prisma.project.create).toHaveBeenCalled();
    expect(result).toEqual(mockProject);
  });

  it('should return projects list', async () => {
    prisma.project.findMany.mockResolvedValue([
      { id: '1', name: 'Projeto Teste' },
    ]);

    const result = await service.findAll('user-id');

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-id' },
      orderBy: { createdAt: 'desc' },
    });

    expect(result.length).toBeGreaterThan(0);
  });
});