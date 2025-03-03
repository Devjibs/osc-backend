import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class RegisterResponse {
  @Field()
  message!: string;
}
