import { ItmProp } from 'src/prop';
import { ItmType } from 'src/type';

@ItmType({
  table: {
    template: `
      id gender firstName = lastName = email = =
    `
  }
})
export class User {
  @ItmProp({
    label: 'ID'
  })
  id: number;

  @ItmProp()
  firstName: string;

  @ItmProp({
    label: 'Last name',
    control: {
      required: true
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

  @ItmProp({
    // required: true
  })
  gender: 'male'|'female';

  @ItmProp({
    // pattern: /^\d{2,3}(\.\d{2,3}){2}$/
  })
  ipAddress;
}
