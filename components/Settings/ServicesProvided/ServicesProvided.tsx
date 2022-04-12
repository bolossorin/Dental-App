import React, {useCallback, useState} from "react";

// libs
import {useEffect} from "react";
import {useContext} from "react";

// components
import {addNewServiceApi, deleteServiceApi, getAllServicesApi, updateServiceApi} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {ProfileBox} from "../../common/ProfileBox/ProfileBox";
import {AdminTypes} from "../../../reducers";

export const ServicesProvided: React.FC = () => {
  const {dispatch, state} = useContext(AppContext);
  const {services} = state.adminState;
  const [serviceEditing, setServiceEditing] = useState<any>();
  const [serviceOnPress, setServiceOnPress] = useState<any>();
  const [serviceEditingValue, setServiceEditingValue] = useState<any>();
  const [newService, setNewService] = useState("");

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  useEffect(() => {
    getAllServicesApi()
      .then(({data}) => {
        setServiceEditingValue(data);
        setServiceEditing(data);
        setServiceOnPress(data);
        dispatch({type: AdminTypes.SET_ALL_SERVICES, payload: data});
      })
      .catch((error) => console.log(error, 'error'))
  }, []);

  const addService = async () => {
    try {
      const token = localStorage.getItem('access_token_admin');
      const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
      const {data} = await addNewServiceApi({service_name: newService}, config);
      dispatch({type: AdminTypes.ADD_SERVICE, payload: data});
      setNotification({type: "success", message: "Successfully added new service"});
      setNewService("");
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
  };

  const deleteService = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token_admin');
      const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
      await deleteServiceApi(id, config);
      dispatch({type: AdminTypes.DELETE_SERVICE, payload: {id}});
      setNotification({type: "success", message: "Successfully deleted service"});
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
  };

  const onHandleEdit = async (id: string) => {
    setServiceEditing({...serviceEditing, [id]: false});
    if (!serviceOnPress[id]) return;
    const target: any = services.find((el) => el.id === id);
    try {
      const token = localStorage.getItem('access_token_admin');
      const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
      await updateServiceApi(target.id, target, config);
      dispatch({type: AdminTypes.UPDATE_SERVICE, payload: target});
      setNotification({type: "success", message: "Successfully edited service"});
    } catch (error: any) {
      setNotification({
        type: "error",
        message: Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message
      });
    }
  };

  const onChangeService = (id: string, name: string) => {
    setServiceOnPress({...serviceOnPress, [id]: true});
    services.map((item) => {
      if (item.id === id) item.service_name = name;
      return item;
    });
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
              onClick={addService}
              disabled={!newService.length}>
              Add service
            </button>
          </p>
        </div>
        <div className="profile-block-box">
          <div className='profile-block-box-services'>
            {serviceEditing && serviceEditingValue &&
            services.length > 0 && services.map((item, idx) => (
              <p key={idx} className="form-login-input">
                <input
                  className='services-selected'
                  type="text"
                  name={item.service_name}
                  value={item.service_name}
                  onChange={(e) => onChangeService(item.id, e.target.value)}
                  disabled={!serviceEditing[item.id]} />
                {!serviceEditing[item.id] && (<>
                  <img
                    className="form-login-input-edit"
                    src={"../images/edit.svg"}
                    onClick={() => setServiceEditing({...serviceEditing, [item.id]: true})}
                    alt='' />
                  <img
                    className="form-login-input-close"
                    src={"../images/close.svg"}
                    onClick={() => deleteService(item.id)}
                    alt='' />
                </>)}
                {serviceEditing[item.id] && (<button
                  className="saveEditedServiceButton"
                  onClick={() => onHandleEdit(item.id)}>
                  Ok
                </button>)}
              </p>))}
          </div>
        </div>
      </div>
    </ProfileBox>
  );
};
