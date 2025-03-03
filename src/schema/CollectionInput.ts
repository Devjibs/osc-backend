import { InputType, Field } from 'type-graphql';

@InputType()
export class CollectionInput {
  @Field()
  name!: string;
}
