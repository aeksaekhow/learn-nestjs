import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config'
import DbConfig from './db.config';

const dbConfig = config.get<DbConfig>('db')

let synchronize = dbConfig.synchronize
if (process.env.TYPEORM_SYNC) {
  const typeOrmSync = process.env.TYPEORM_SYNC.toLowerCase()
  synchronize = typeOrmSync === 'true' ? true : false
}

const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: +process.env.RDS_PORT || dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: synchronize
}

export default typeOrmConfig