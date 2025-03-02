import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class Course {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  duration: string;

  @Field()
  outcome: string;

  @Field()
  createdById: string;

  constructor(
    id: string,
    title: string,
    description: string,
    duration: string,
    outcome: string,
    createdById: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.outcome = outcome;
    this.createdById = createdById;
  }
}
