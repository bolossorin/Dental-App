import {IService} from "../reducers/types";

export const filterAllServices = (
  all: IService[],
  choosen: IService[] | null
) => {
  const arr = choosen?.map((item) => {
    return item.service_id;
  });
  const newAllServices: IService[] = [];
  for (const el of all) {
    if (!arr?.includes(el.service_id)) {
      newAllServices.push(el);
    }
  }
  return newAllServices;
};
