import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Experience } from '../experience/experience.model';
import { Project } from '../project/project.model';
import { Skill } from '../skill/skill.model';

@ObjectType()
export class Profile {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  github?: string | null;

  @Field(() => String, { nullable: true })
  blog?: string | null;

  @Field(() => String, { nullable: true })
  avatarUrl?: string | null;

  @Field(() => [Experience])
  experiences: Experience[];

  @Field(() => [Project])
  projects: Project[];

  @Field(() => [Skill])
  skills: Skill[];
}
