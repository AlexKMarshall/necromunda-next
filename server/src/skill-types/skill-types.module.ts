import { Module } from '@nestjs/common'
import { SkillTypesService } from './skill-types.service'
import { SkillTypesController } from './skill-types.controller'

@Module({
  providers: [SkillTypesService],
  controllers: [SkillTypesController],
})
export class SkillTypesModule {}
