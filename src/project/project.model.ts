import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Skill } from '../skill/skill.model';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  summary?: string | null;

  @Field(() => String, { nullable: true })
  url?: string | null;

  @Field(() => [String])
  repoUrl: string[];

  @Field(() => [Skill])
  skills: Skill[];
}
