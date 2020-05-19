import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import TaskRepository from './task.repository';
import UserEntity from '../auth/user.entity';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import TaskStatus from './task-status.enum';
import TaskEntity from './task.entity';
import { NotFoundException } from '@nestjs/common';
import CreateTaskDto from './dto/create-task.dto';
import { DeleteResult } from 'typeorm';

describe('TasksService', () => {

  let tasksService: TasksService
  let taskRepository: TaskRepository

  const mockTaskRepository = {
    getTasks: jest.fn<Promise<TaskEntity[]>, []>(),
    findOne: jest.fn<Promise<TaskEntity>, []>(),
    createTask: jest.fn<Promise<TaskEntity>, []>(),
    delete: jest.fn<Promise<DeleteResult>, []>()
  }

  const mockUserEntity: UserEntity = new UserEntity()

  beforeEach(async () => {

    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {provide: TaskRepository, useFactory: () => mockTaskRepository}
      ]
    }).compile()

    tasksService = module.get<TasksService>(TasksService)
    taskRepository = module.get<TaskRepository>(TaskRepository)

  })

  describe('getTasks', () => {

    it('should successfully get all tasks', async () => {
      const tasks: TaskEntity[] = [
        new TaskEntity()
      ]
      mockTaskRepository.getTasks.mockResolvedValue(tasks)
      expect(taskRepository.getTasks).not.toHaveBeenCalled()

      const filterDto: GetTasksFilterDto = {
        status: TaskStatus.OPEN,
        search: 'any search text'
      }
      const result = await tasksService.getTasks(filterDto, mockUserEntity)
      expect(taskRepository.getTasks).toHaveBeenCalled()
      expect(result).toEqual(tasks)
    });

  })

  describe('getTaskById', () => {

    it('should return a task', async () => {

      const task = new TaskEntity()
      mockTaskRepository.findOne.mockResolvedValue(task)
      const result = await tasksService.getTaskById(1, mockUserEntity)
      expect(result).toEqual(task)
      expect(taskRepository.findOne).toHaveBeenCalled()
    });

    it('should throw NotFoundException if task not found', () => {
      mockTaskRepository.findOne.mockResolvedValue(null)
      expect(tasksService.getTaskById(1, mockUserEntity)).rejects.toThrow(NotFoundException)
      expect(taskRepository.findOne).toHaveBeenCalled()
    })

  })

  describe('createTask', () => {

    it('should return a new task', async () => {
      const task = new TaskEntity()
      mockTaskRepository.createTask.mockResolvedValue(task)
      const createTaskDto = new CreateTaskDto()
      const result = await tasksService.createTask(createTaskDto, mockUserEntity)
      expect(result).toEqual(task)
      expect(taskRepository.createTask).toHaveBeenCalled()
    });

  })

  describe('deleteTask', () => {

    it('should successfully delete', async () => {
      const mockDeleteResult = new DeleteResult()
      mockDeleteResult.affected = 1
      mockTaskRepository.delete.mockResolvedValue(mockDeleteResult)

      await tasksService.deleteTask(1, mockUserEntity)
      expect(taskRepository.delete).toHaveBeenCalled()

    });

    it('should throw NotFoundException if there is nothing delete', () => {
      const mockDeleteResult = new DeleteResult()
      mockDeleteResult.affected = 0
      mockTaskRepository.delete.mockResolvedValue(mockDeleteResult)

      expect(tasksService.deleteTask(1, mockUserEntity)).rejects.toThrow(NotFoundException)
      expect(taskRepository.delete).toHaveBeenCalled()
    });

  })

  describe('updateTaskStatus', () => {

    it('should successfully update task status', async () => {

      const mockTaskEntity = new TaskEntity()
      mockTaskEntity.save = jest.fn()
      tasksService.getTaskById = jest.fn<Promise<TaskEntity>, []>().mockResolvedValue(mockTaskEntity)
      const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUserEntity)
      expect(result).toEqual(mockTaskEntity)
      expect(tasksService.getTaskById).toHaveBeenCalled()
      expect(mockTaskEntity.save).toHaveBeenCalled()
    });

  })

})