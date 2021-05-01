import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

@Controller('/hello')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('hello controller')
    return this.appService.getHello()
  }
}
