import { Test } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { TaskRepository } from '../task.repository';
import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: '123',
  username: 'test',
  password: 'test',
  tasks: [],
};
describe('Task Service', () => {
  let taskService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      const result = await taskService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
        id: '12345',
        status: TaskStatus.OPEN,
      };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await taskService.getTaskById('12345', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById('234', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
