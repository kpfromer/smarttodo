import { InterfaceType, Field } from 'type-graphql';

@InterfaceType()
export abstract class DateMetadata {
  @Field({ defaultValue: new Date() })
  created!: Date;

  @Field({ defaultValue: new Date() })
  updated!: Date;
}
