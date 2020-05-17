import { EntityRepository, Repository } from 'typeorm';
import TaskEntity from './task.entity';
import TaskStatus from './task-status.enum';
import CreateTaskDto from './dto/create-task.dto';
import GetTasksFilterDto from './dto/get-tasks-filter.dto';

@EntityRepository(TaskEntity)
export default class TaskRepository extends Repository<TaskEntity>{

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {

    const task: TaskEntity = this.create()
    task.title = createTaskDto.title
    task.description = createTaskDto.description
    task.status = TaskStatus.OPEN
    const savedTask = await task.save()
    return savedTask
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    const {status, search} = filterDto
    const query = this.createQueryBuilder('task')

    if (status) {
      query.andWhere('task.status = :status', {status})
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
    }

    const tasks = await query.getMany()
    return tasks
  }

}