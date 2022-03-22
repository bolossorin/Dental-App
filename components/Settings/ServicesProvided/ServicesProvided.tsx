import React, {useCallback, useState} from "react";

// libs
import axios from "axios";
import {useEffect} from "react";
import {useContext} from "react";

// components
import {API} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {IService} from "../../../reducers/types";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {AdminTypes} from "../../../reducers";

export const ServicesProvided: React.FC = () => {
  const {dispatch, state} = useContext(AppContext);
  const defaultServices = state.userState.services;
  const [serviceEditing, setServiceEditing] = useState<any>();
  const [serviceOnPress, setServiceOnPress] = useState<any>();
  const [serviceEditingValue, setServiceEditingValue] = useState<any>();
  const [services, setLocalServices] = useState<IService[]>([]);
  const [newService, setNewService] = useState("");

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  useEffect(() => {
    if (defaultServices?.length) {
      setLocalServices(defaultServices);
      defaultServices.map((item) => {
        setServiceEditing({...serviceEditing, [item.service_id]: false});
        setServiceOnPress({...serviceEditing, [item.service_id]: false});
        setServiceEditingValue({...serviceEditing, [item.service_id]: ""});
      });
    }
  }, [defaultServices]);

  const onHandleAddService = async () => {
    try {
      const {data} = await axios.post<IService>(API.CHANGE_SERVICES, {service_name: newService});
      dispatch({type: AdminTypes.GET_SERVICES, payload: [...services, {...data}]});
      setNotification({
        type: "success",
        message: "Successfully added new service",
        position: "top-right",
        autoClose: 3,
      });
      setNewService("");
    } catch (error) {
      console.log(error, 'error');
      setNotification({
        type: "error",
        message: "Failed to add new service",
        autoClose: 3,
      });
    }
  };

  const onHandleDeleteService = async (id: string) => {
    try {
      await axios.delete(`${API.CHANGE_SERVICES}?service_id=${id}`);
      dispatch({type: AdminTypes.DELETE_SERVICE, payload: {id}});
      setNotification({
        type: "success",
        message: "Successfully deleted service",
        position: "top-right",
        autoClose: 3,
      });
    } catch (exp) {
      setNotification({
        type: "error",
        message: "Failed to delete service",
        autoClose: 3,
      });
    }
  };

  const onHandleEdit = async (id: string) => {
    setServiceEditing({...serviceEditing, [id]: false});

    if (!serviceOnPress[id]) return;

    const target = services.find((el) => el.service_id === id);
    const body = {service_id: target?.service_id, service_name: target?.service_name};

    try {
      const res = await axios.put(API.CHANGE_SERVICES, body);
      console.log(res);
      dispatch({type: AdminTypes.GET_SERVICES, payload: services});
      setNotification({
        type: "success",
        message: "Successfully edited service",
        position: "top-right",
        autoClose: 3,
      });
    } catch (exp) {
      setNotification({
        type: "error",
        message: "Failed to edit service",
        autoClose: 3,
      });
    }
  };

  const onChangeService = (id: string, name: string) => {
    setServiceOnPress({...serviceOnPress, [id]: true});

    const WithEditedService = services.map((item) => {
      if (item.service_id === id) item.service_name = name;
      return item;
    });
    setLocalServices(WithEditedService);
  };

  return (
    <ProfileBox title='Services Provided' subTitle='Available IService Categories'>
      <div className="box-2-box">
        <div className="profile-block-box">
          <div>
            <p className="form-profile-label">
              <label className="form-profile-label">Add IService</label>
            </p>
            <div className="form-profile-label">
              <input
                className="form-profile-input"
                type="text"
                name="add_service"
                value={newService}
                placeholder="IService Name Here"
                onChange={(e) => setNewService(e.target.value)} />
            </div>
          </div>
          <p className="account-row-content">
            <button
              className="account-button-green"
              onClick={onHandleAddService}
              disabled={!newService.length}>
              Add service
            </button>
          </p>
        </div>
        <div className="profile-block-box">
          <div>
            {serviceEditing && serviceEditingValue &&
            services.map((item, idx) => (
              <p key={idx} className="form-login-input">
                <input
                  className='services-selected'
                  type="text"
                  name={item.service_name}
                  value={item.service_name}
                  onChange={(e) => onChangeService(item.service_id, e.target.value)}
                  disabled={!serviceEditing[item.service_id]} />
                {!serviceEditing[item.service_id] && (<>
                  <img
                    className="form-login-input-edit"
                    src={"../images/edit.svg"}
                    onClick={() => setServiceEditing({...serviceEditing, [item.service_id]: true})}
                    alt='' />
                  <img
                    className="form-login-input-close"
                    src={"../images/close.svg"}
                    onClick={() => onHandleDeleteService(item.service_id)}
                    alt='' />
                </>)}
                {serviceEditing[item.service_id] && (<button
                  className="saveEditedServiceButton"
                  onClick={() => onHandleEdit(item.service_id)}>
                  Ok
                </button>)}
              </p>))}
          </div>
        </div>
      </div>
    </ProfileBox>
  );
};
