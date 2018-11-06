import { ItmProp, ItmType } from 'itm-core';

@ItmType({
  table: {
    template: `
      id gender firstName = lastName = email = =
    `,
    menu: {buttons: [{key: 'save'}]}
  }
})
export class User {
  @ItmProp({
    label: 'ID'
  })
  id: number;

  @ItmProp({
    control: {size: {flexHeight: 0.5}}
  })
  firstName: string;

  @ItmProp({
    label: 'Last name',
    control: {
      required: true,
      size: {flexHeight: 1}
    }
  })
  lastName: string;

  @ItmProp({
    control: {
      required: true,
      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    }
  })
  email: string;

  @ItmProp({})
  gender: 'male'|'female';

  @ItmProp({})
  ipAddress;
}
