import React, {useCallback, useContext, useState} from "react";

// libs
// import axios from "axios";
import cn from "classnames";

// components
// import {API} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {DentistTypes} from "../../../reducers";
// import {IService} from "../../../reducers/types";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";

// interface IAddServiceBody {
//   email: string;
//   services: string[];
// }
// type IAddServiceResponse = IService[];

export const Services: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const {services, subscription_plan, allowedServices,
    // email
  } = state.dentistState;
  const [selectedServiceId, selectService] = useState<string>("");

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const freeAccountLimit = services?.length === 2 && subscription_plan === "FREE";

  const handleAddService = async () => {
    if (freeAccountLimit) {
      setNotification({type: "info", message: "Your cannot add more than 2 services"});
      return;
    }
    // const body: IAddServiceBody = {email: email || "", services: [selectedServiceId]};
    try {
      // const {data} = await axios.post<IAddServiceResponse>(API.DENTIST_SERVICES, body);
      // dispatch({type: DentistTypes.ADD_SERVICES, payload: {services: data}});
      setNotification({
        type: "success",
        message: `Successfully added new service!`,
        autoClose: 2,
        position: "top-right",
      });
      selectService("");
    } catch (exp) {
      setNotification({
        type: "error",
        message: `Failed to add new service!`,
        autoClose: 2,
        position: "top-right",
      });
    }
  };

  const handleDeleteService = async (key: string) => {
    try {
      // await axios.delete(`${API.DENTIST_SERVICES}?key=${key}`);
      dispatch({type: DentistTypes.REMOVE_SERVICE, payload: {key}});
      setNotification({
        type: "success",
        message: `Successfully deleted service!`,
        autoClose: 2,
        position: "top-right",
      });
    } catch (exp) {
      setNotification({
        type: "error",
        message: `Failed to delete service!`,
        autoClose: 2,
        position: "top-right",
      });
    }
  };

  return (
    <ProfileLayout title='Services' subTitle='Information For Patients'>
      <div className="box-2-box">
        <div className="profile-block-box profile-block-box-noWrap">
          <div>
            <div className="form-profile-label">
              <label className="form-profile-label">Add Service</label>
            </div>
            <div className="row-content">
              <span className="input-span">Service</span>
              <select
                className="form-profile-input arrows"
                name="services"
                onChange={(e) => selectService(e.target.value)}>
                <option>Select service</option>
                {allowedServices &&
                allowedServices.map((item) => <option value={item.service_id} key={item.service_id}>
                  {item.service_name}
                </option>)}
              </select>
            </div>
          </div>
          <div className="row-content">
            <button
              className="button-green-confirm button-green-confirm-mod"
              onClick={handleAddService}
              disabled={selectedServiceId === "" || freeAccountLimit}>
              Confirm
            </button>
          </div>
          {services && <div className="mt-big">
            <div className="form-profile-label">
              <label className="form-profile-label">Selected Services</label>
            </div>
            {services.slice(0, 2).map((el) =>
              <div className="form-login-input" key={el.service_id}>
                <input
                  className='services-selected'
                  type="text"
                  name={el.service_name}
                  value={el.service_name}
                  id={el.service_id}
                  disabled />
                <img
                  className="form-login-input-close"
                  src={"../images/close.svg"}
                  onClick={() => handleDeleteService(el.key)}
                  alt='' />
              </div>)}
          </div>}
        </div>
        {services && <div className={cn("profile-block-box", {"disabled": subscription_plan === 'FREE'})}>
          <div className="form-profile-label">
            <label className="form-profile-label">
              Additional Services {subscription_plan === 'FREE' ? '- Premium' : ''}
            </label>
          </div>
          {services.slice(2, services.length).map((el) =>
            <div className="form-login-input" key={el.service_id}>
              <input
                className='services-additionally'
                key={el.service_id}
                type="text"
                name={el.service_name}
                value={el.service_name}
                id={el.service_id}
                disabled />
            </div>)}
        </div>}
      </div>
    </ProfileLayout>
  );
};
