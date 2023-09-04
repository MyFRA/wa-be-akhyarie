import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { FILE_URL } from 'src/config';
import { UpdateUserDto } from './dto';
import { FileUploadHelper } from 'src/helpers/fileUploadHelper/file-upload.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private fileUploadHelper: FileUploadHelper) { }

  async findAll() {
    const users = await this.prisma.uSERS.findMany({ orderBy: [{ name: 'asc' }] })

    let extendedUsers = []
    for (let i = 0; i < users.length; i++) {
      extendedUsers[i] = users[i];
      delete extendedUsers[i].password;
      extendedUsers[i].photo ? (extendedUsers[i].photo = FILE_URL + 'USERS/photo/' + extendedUsers[i].photo) : null;
    }

    return extendedUsers
  }

  async findUserByUuid(uuid: string) {
    return await this.prisma.uSERS.findUnique({ where: { uuid } })
  }

  async findUserByEmail(email: string) {
    return await this.prisma.uSERS.findUnique({ where: { email } })
  }

  async update(uuid: string, updateUserDto: UpdateUserDto) {
    const userInUpdate = await this.findUserByUuid(uuid);

    if (!userInUpdate) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'User failed to update! Record not found.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (updateUserDto.password) {
      if (!('password_confirmation' in updateUserDto)) {
        throw new HttpException(
          {
            code: HttpStatus.UNPROCESSABLE_ENTITY,
            msg: 'Password confirmation is required.',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    // Cek duplicate Email
    const user = await this.findUserByEmail(updateUserDto.email);

    if (user) {
      if (updateUserDto.email == user.email && userInUpdate.email !== updateUserDto.email) {
        throw new HttpException(
          {
            code: HttpStatus.UNPROCESSABLE_ENTITY,
            msg: 'Employee failed to update! Email already in use.',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    try {
      const fileName = await this.fileUploadHelper.modelFileUpdate(userInUpdate, "USERS", "photo", updateUserDto.photo)

      const updateEmployee = await this.prisma.uSERS.update({
        where: { uuid },
        data: {
          name: updateUserDto.name,
          email: updateUserDto.email,
          password: updateUserDto.password ? await bcrypt.hash(updateUserDto.password, 10) : userInUpdate.password,
          photo: fileName,
        },
      });

      return updateEmployee;
    } catch (error) {
      console.log(error)
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: "Error! Please Contact Admin.",
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(uuid: string) {
    const user = await this.findUserByUuid(uuid)

    if (!user) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'User failed to delete! Record not found.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    try {
      // Delete Photo is exist
      await this.fileUploadHelper.modelFileDelete(user, "USERS", "photo")

      return await this.prisma.uSERS.delete({ where: { uuid } })

    } catch (error) {
      throw new HttpException(
        {
          code: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: "Error! Please Contact Admin.",
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }


}
