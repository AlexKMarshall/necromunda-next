import { Prisma, Skill } from '@prisma/client'
import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

export interface SkillCreateInput
  extends Omit<Prisma.SkillCreateInput, 'type'> {
  type: Prisma.SkillTypeCreateNestedOneWithoutSkillsInput['connect']
}

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async skills() {
    return this.prisma.skill.findMany({ include: { type: true } })
  }

  async create({ type, ...skill }: SkillCreateInput) {
    try {
      const createdSkill = await this.prisma.skill.create({
        data: { ...skill, type: { connect: type } },
        include: { type: true },
      })
      return createdSkill
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A skill with name "${skill.name}" already exists`,
        )
      }
      throw error
    }
  }

  async delete(id: Skill['id']) {
    return this.prisma.skill.delete({ where: { id } })
  }
}
