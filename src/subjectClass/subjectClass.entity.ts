import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { EntityCommon } from "src/common/common.entity";
import { ResgisterClassEntity } from "src/registerClass/registerClass.entity";
import { SubjectEntity } from "src/subject/subject.entity";
import { TeacherEntity } from "src/teacher/teacher.entity";

@Entity({ schema: "school_management" })
export class SubjectClassEntity extends EntityCommon {
  @Property()
  maxQuantity!: number;

  @Property({ default: 20 })
  minQuantity!: number;

  @Property({ type: "date" })
  startAt!: Date;

  @Property({ type: "date" })
  endAt!: Date;

  @Property({ type: "string" })
  classRoom!: string;

  @Property()
  academicYear!: number;

  @Property({ default: "active" })
  classStatus!: string;
  @ManyToOne(() => TeacherEntity)
  teacherId!: string;

  @ManyToOne(() => SubjectEntity)
  subjectId: string;

  @OneToMany(
    () => ResgisterClassEntity,
    (registerSubjectClass) => registerSubjectClass.subjectClassId
  )
  subjectClass = new Collection<ResgisterClassEntity>(this);
}