import { ObjectType, Field, Int, ClassType } from 'type-graphql';

function getFieldType<T>(type?: ClassType<Object>) {
  return type ?? String;
}

@ObjectType()
export class BaseResponse<T> {
  @Field()
  status: boolean;

  @Field(() => Int)
  responseCode: number;

  @Field(() => getFieldType<T>(), { nullable: true })
  responseData?: T;

  constructor(status: boolean, responseCode: number, responseData?: T) {
    this.status = status;
    this.responseCode = responseCode;
    this.responseData = responseData;
  }
}
