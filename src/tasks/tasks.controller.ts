import {
  Body,
  Controller,
  Delete,
  Get, Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import TaskStatus from './task-status.enum';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';
import TaskStatusValidationPipe from './pipes/task-status-validation.pipe';
import TaskEntity from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import UserEntity from '../auth/user.entity';
import GetUser from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

  private logger = new Logger('TasksController')

  constructor(private tasksService: TasksService) {
  }

  @Get()
  async getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() userEntity: UserEntity): Promise<TaskEntity[]> {
    this.logger.verbose(`User "${userEntity.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
    return await this.tasksService.getTasks(filterDto, userEntity)
  }

  @Get('/:id')
  async getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() userEntity: UserEntity): Promise<TaskEntity> {
    this.logger.verbose(`User "${userEntity.username}" retrieving task id ${id}`)
    return await this.tasksService.getTaskById(id, userEntity)
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() dto: CreateTaskDto, @GetUser() userEntity: UserEntity): Promise<TaskEntity> {
    this.logger.verbose(`User "${userEntity.username}" creating a new task. ${JSON.stringify(dto)}`)
    const task = await this.tasksService.createTask(dto, userEntity)
    return task
  }

  @Delete('/:id')
  async deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() userEntity: UserEntity): Promise<void> {
    this.logger.verbose(`User "${userEntity.username}" deleting a task id ${id}`)
    await this.tasksService.deleteTask(id, userEntity)
  }

  @Patch('/:id/status')
  async updateTaskStatus(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @GetUser() userEntity: UserEntity): Promise<TaskEntity> {
    this.logger.verbose(`User "${userEntity.username}" updating task id ${id} to status "${status}"`)
    const task = await this.tasksService.updateTaskStatus(id, status, userEntity)
    return task
  }

}
