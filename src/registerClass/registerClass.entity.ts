import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { EntityCommon } from "src/common/common.entity";
import { StudentEntity } from "src/student/student.entity";
import { SubjectClassEntity } from "src/subjectClass/subjectClass.entity";

@Entity({ schema: "school_management" })
export class ResgisterClassEntity extends EntityCommon {
  @ManyToOne(() => SubjectClassEntity)
  subjectClassId: string;

  @ManyToOne(() => StudentEntity)
  studentId: string;

  @Property({ default: null })
  status: string;
}