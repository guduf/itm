import { ItmProp } from 'src/prop';
import { ItmType } from 'src/type';

@ItmType()
export class User {
  @ItmProp({
    label: 'ID'
  })
  id: number;

  @ItmProp()
  firstName: string;

  @ItmProp({
    // required: true,
    // maxLength: 120
  })
  lastName: string;

  @ItmProp({
    // required: true,
    // pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    // size: 3
  })
  email: string;

  @ItmProp({
    // required: true
  })
  gender: 'male'|'female';

  @ItmProp({
    // pattern: /^\d{2,3}(\.\d{2,3}){2}$/
  })
  ipAddress: string;
}
