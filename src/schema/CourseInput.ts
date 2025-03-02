import { InputType, Field } from 'type-graphql';

@InputType()
export class CourseInput {
  @Field()
  title: string = '';

  @Field()
  description: string = '';
  @Field()
  duration: string = '';

  @Field()
  outcome: string = '';
}
