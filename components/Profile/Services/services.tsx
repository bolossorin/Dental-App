import React, {useCallback, useContext, useEffect, useState} from "react";

// components
import {AppContext} from "../../../context/app.context";
import {DentistTypes} from "../../../reducers";
import notify, {ISetNotofication} from "../../Toast";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";
import {
  addDentistServiceApi,
  getUnusedDentistServicesApi,
  removeDentistServiceApi
} from "../../../api/AWS-gateway";
import {IService} from "../../../reducers/types";
import {Spinner} from "../../Spinner/Spinner";

type IAddServiceResponse = IService[];
export const Services: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const {access_token, services, subscription_plan, settings_account} = state.dentistState;
  const [selectedService, setSelectService] = useState<string>("");
  const [allServices, setAllServices] = useState<IAddServiceResponse>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  const handleAddService = async (id) => {
    setIsSubmitting(true);
    try {
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      const {data} = await addDentistServiceApi(id, config);
      dispatch({type: DentistTypes.ADD_SERVICES, payload: {services: data}});
      setNotification({type: "success", message: `Successfully added new service!`});
      setSelectService("");

      const response = await getUnusedDentistServicesApi(config);
      setAllServices(response.data);
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
    setIsSubmitting(false);
  };

  const handleDeleteService = async (key: string) => {
    try {
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      await removeDentistServiceApi(key, config);
      dispatch({type: DentistTypes.REMOVE_SERVICE, payload: {key}});
      setNotification({type: "success", message: `Successfully deleted service!`});

      const response = await getUnusedDentistServicesApi(config);
      setAllServices(response.data);
    } catch (exp) {
      setNotification({type: "error", message: `Failed to delete service!`});
    }
  };

  useEffect(() => {
    if (access_token) {
      const config = {headers: {Authorization: `Bearer ${access_token}`}};
      getUnusedDentistServicesApi(config)
        .then(({data}) => setAllServices(data))
        .catch((error) => console.log(error, 'error'))
    }
  }, [access_token]);

  return (
    <ProfileLayout
      title='Services'
      subTitle={`Information For Patients (max ${settings_account?.maxService} for ${settings_account?.subscription_type})`}>
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
          <div className='form-profile-buttons'>
            <button
              className="button-green-confirm"
              onClick={() => handleAddService(selectedService)}
              disabled={selectedService === "" || services?.length >= settings_account!.maxService}>
              {isSubmitting ? <Spinner /> : "Confirm"}
            </button>
          </div>
          {services && <div className="mt-big">
            <div className="form-profile-label">
              <label className="form-profile-label">Selected Services</label>
            </div>
            {services.length > 0 ? services.slice(0, settings_account?.maxService).map((service) =>
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
        {services && subscription_plan === 'FREE' && <div className={"profile-block-box disabled"}>
          <div className="form-profile-label">
            <label className="form-profile-label">
              Additional Services {subscription_plan === 'FREE' ? '- Premium' : ''}
            </label>
          </div>
          {services.slice(settings_account?.maxService, services.length).map((service) =>
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
