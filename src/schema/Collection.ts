import { Field, ObjectType, ID } from 'type-graphql';
import { Course } from './Course';

@ObjectType()
export class Collection {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => [Course], { nullable: true })
  courses?: Course[];
}
