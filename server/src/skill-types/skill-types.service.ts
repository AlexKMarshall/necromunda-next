import { Prisma, SkillType } from '.prisma/client'
import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class SkillTypesService {
  constructor(private prisma: PrismaService) {}

  async skillTypes() {
    return this.prisma.skillType.findMany()
  }

  async create(skillType: Prisma.SkillTypeCreateWithoutSkillsInput) {
    try {
      const createdSkillType = await this.prisma.skillType.create({
        data: skillType,
      })
      return createdSkillType
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A Skill Type with name "${skillType.name}" already exists`,
        )
      }
      throw error
    }
  }

  async delete(skillTypeId: SkillType['id']) {
    return this.prisma.skillType.delete({ where: { id: skillTypeId } })
  }
}
