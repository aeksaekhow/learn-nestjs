import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import TaskStatus from '../task-status.enum';
import { isEnum } from 'class-validator';

export default class TaskStatusValidationPipe implements PipeTransform{



  transform(value: any, _: ArgumentMetadata): any {

    if (!isEnum(value, TaskStatus)) throw new BadRequestException(`${value} is invalid task status`)

    return value;
  }

}