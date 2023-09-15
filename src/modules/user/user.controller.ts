import { Controller, Get, Body, Patch, Delete, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';
import { Request, Response } from 'express';
import { TokenHelper } from 'src/helpers/token-helper/token.service';
import { UUIDParam } from 'src/helpers/uuid-helper';

@Controller('api/users')
export class UserController {

  constructor(private readonly userService: UserService, private readonly tokenHelper: TokenHelper) { }

  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.userService.findAll();

    return res.status(200).json({
      code: 200,
      msg: 'Here is Your Users',
      data: { users },
    });
  }

  @Patch('')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async selfUpdate(@Body() updateUserDto: UpdateUserDto, @Res() res: Response, @Req() req: Request) {

    const user = this.tokenHelper.decode(req.headers.authorization.replace('Bearer ', ''))
    const updatedUser = await this.userService.update(user.uuid, updateUserDto);

    return res.status(200).json({
      code: 200,
      msg: `User ${updatedUser.name} successfully updated`,
    });
  }

  @Patch(':uuid')
  @FormDataRequest({ storage: FileSystemStoredFile })
  async update(@UUIDParam('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    const updatedUser = await this.userService.update(uuid, updateUserDto);

    return res.status(200).json({
      code: 200,
      msg: `User ${updatedUser.name} successfully updated`,
    });
  }

  @Delete(':uuid')
  async remove(@UUIDParam('uuid') uuid: string, @Res() res: Response) {
    const deletedUser = await this.userService.remove(uuid);

    return res.status(200).json({
      code: 200,
      msg: `User ${deletedUser.name} successfully updated`,
    });
  }
}
