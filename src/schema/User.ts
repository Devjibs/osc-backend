import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id?: string;

  @Field()
  username?: string;

  @Field()
  role?: string;
}
