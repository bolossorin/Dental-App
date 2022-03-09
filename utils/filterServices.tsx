import { UserServices } from "../reducers/types";

export const filterAllServices = (
  all: UserServices[],
  choosen: UserServices[] | null
) => {
  const arr = choosen?.map((item) => {
    return item.service_id;
  });
  const newAllServices: UserServices[] = [];
  for (const el of all) {
    if (!arr?.includes(el.service_id)) {
      newAllServices.push(el);
    }
  }
  return newAllServices;
};
