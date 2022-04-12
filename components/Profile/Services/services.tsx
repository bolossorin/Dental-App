import React, {useCallback, useContext, useEffect, useState} from "react";

// libs
import cn from "classnames";

// components
import {AppContext} from "../../../context/app.context";
import {DentistTypes} from "../../../reducers";
import notify, {ISetNotofication} from "../../Toast";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";
import {addDentistServiceApi, getAllServicesApi, removeDentistServiceApi} from "../../../api/AWS-gateway";
import {IService} from "../../../reducers/types";

type IAddServiceResponse = IService[];
export const Services: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const {access_token, services, subscription_plan} = state.dentistState;
  const [selectedService, setSelectService] = useState<string>("");
  const [allServices, setAllServices] = useState<IAddServiceResponse>([]);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const freeAccountLimit = services?.length === 2 && subscription_plan === "FREE";

  const handleAddService = async (id) => {
    if (freeAccountLimit) {
      // TODO: connect to account options API
      setNotification({type: "info", message: "Your cannot add more than 2 services"});
      return;
    }
    try {
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      const {data} = await addDentistServiceApi(id, config);
      dispatch({type: DentistTypes.ADD_SERVICES, payload: {services: data}});
      setNotification({type: "success", message: `Successfully added new service!`});
      setSelectService("");
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
  };

  const handleDeleteService = async (key: string) => {
    try {
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      await removeDentistServiceApi(key, config);
      dispatch({type: DentistTypes.REMOVE_SERVICE, payload: {key}});
      setNotification({type: "success", message: `Successfully deleted service!`});
    } catch (exp) {
      setNotification({type: "error", message: `Failed to delete service!`});
    }
  };

  useEffect(() => {
    getAllServicesApi()
      .then(({data}) => setAllServices(data))
      .catch((error) => console.log(error, 'error'))
  }, []);

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
                className="form-profile-input person-arrows"
                value={selectedService}
                onChange={(e) => setSelectService(e.target.value)}>
                <option>Select service</option>
                {allServices && allServices.map((item) => <option value={item.id} key={item.id}>
                  {item.service_name}
                </option>)}
              </select>
            </div>
          </div>
          <div className="row-content">
            <button
              className="button-green-confirm button-green-confirm-mod"
              onClick={() => handleAddService(selectedService)}
              disabled={selectedService === "" || freeAccountLimit}>
              Confirm
            </button>
          </div>
          {services && <div className="mt-big">
            <div className="form-profile-label">
              <label className="form-profile-label">Selected Services</label>
            </div>
            {services.length > 0 ? services.slice(0, 1).map((service) =>
              <div className="form-login-input" key={service.id}>
                <input className='services-selected' type="text" value={service.service_name} disabled />
                <img
                  className="form-login-input-close"
                  src={"../images/close.svg"}
                  onClick={() => handleDeleteService(service.id)}
                  alt='' />
              </div>) : <p className='input-span'>Not selected</p>}
          </div>}
        </div>
        {services && <div className={cn("profile-block-box", {"disabled": subscription_plan === 'FREE'})}>
          <div className="form-profile-label">
            <label className="form-profile-label">
              Additional Services {subscription_plan === 'FREE' ? '- Premium' : ''}
            </label>
          </div>
          {services.slice(1, services.length).map((service) =>
            <div className="form-login-input" key={service.id}>
              <input className='services-additionally' type="text" value={service.service_name} disabled />
              <img
                className="form-login-input-close"
                src={"../images/close.svg"}
                onClick={() => handleDeleteService(service.id)}
                alt='' />
            </div>)}
        </div>}
      </div>
    </ProfileLayout>
  );
};
