import { EntityManager, wrap } from "@mikro-orm/core";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateTeacherDTO,
  GetTeacherDTO,
  SearchTeacherDTO,
  UpdateTeacherDTO,
} from "./teacher.dto";
import { v4 as uuidv4 } from "uuid";
import { TeacherEntity } from "./teacher.entity";
import { ISuccessResponse } from "src/common/response/success.response";
import { plainToClass } from "class-transformer";

@Injectable()
export class TeacherService {
  constructor(private readonly em: EntityManager) {}
  async create(teacher: CreateTeacherDTO): Promise<CreateTeacherDTO> {
    const id = uuidv4();
    const newTeacher = this.em.create(TeacherEntity, { id, ...teacher });
    await this.em.persistAndFlush(newTeacher);
    return teacher;
  }
  async findOne(id: uuidv4) {
    const teacherRecord = await this.em.findOne(TeacherEntity, id);
    if (!teacherRecord) {
      throw new HttpException("Teacher Not Found", HttpStatus.NOT_FOUND);
    }
    return teacherRecord;
  }

  async find(searchTeacher: SearchTeacherDTO) {
    const { id, fullName, page = 1, pageSize = 30 } = searchTeacher;
    const teacherList = await this.em.findAndCount(
      TeacherEntity,
      {
        ...(id ? { id } : {}),
        ...(fullName
          ? {
              $or: [
                { lastName: { $like: `%${fullName}%` } },
                { firstName: { $like: `%${fullName}%` } },
              ],
            }
          : {}),
      },
      { offset: (page - 1) * pageSize, disableIdentityMap: true }
    );
    return teacherList;
  }
  async update(
    newTeacher: UpdateTeacherDTO
  ): Promise<ISuccessResponse<UpdateTeacherDTO>> {
    const recordTeacher = await this.em.findOneOrFail(TeacherEntity, {
      id: newTeacher.id,
    });
    if (!recordTeacher) {
      throw new HttpException("Teacher Not Found", HttpStatus.NOT_FOUND);
    }
    wrap(recordTeacher).assign(newTeacher);
    await this.em.persistAndFlush(recordTeacher);
    return { status: "Update Successfully", data: newTeacher };
  }
  async delete(id: uuidv4): Promise<TeacherEntity> {
    const teacherRecord = await this.em.findOne(TeacherEntity, id);
    if (!teacherRecord) {
      throw new HttpException("Teacher Not Found", HttpStatus.NOT_FOUND);
    }
    await this.em.removeAndFlush(teacherRecord);
    return teacherRecord;
  }
}
