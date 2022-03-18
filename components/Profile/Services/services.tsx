import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { API } from "../../../api/AWS-gateway";
import { AppContext } from "../../../context/app.context";
import { UserTypes } from "../../../reducers";
import { UserServices } from "../../../reducers/types";
import { ISetNotofication } from "../../Toast";
import notify from "../../Toast";
import Link from "next/link";

interface IAddServiceBody {
  email: string;
  services: string[];
}
type IAddServiceResponse = UserServices[];

export const Services: React.FC = () => {
  const { state, dispatch } = useContext(AppContext);
  const { services, accountType, allowedServices, email } = state.userState;
  const [selectedServiceId, selectService] = useState<string>("");

  const setNotification = useCallback<ISetNotofication>(
    ({ ...notifyProps }) => {
      notify({ ...notifyProps });
    },
    []
  );

  const freeAccountLimit = services?.length === 2 && accountType === "free";

  const handleAddService = async () => {
    if (freeAccountLimit) {
      setNotification({
        type: "info",
        message: "Your cannot add more than 2 services",
      });
      return;
    }
    const body: IAddServiceBody = {
      email: email || "",
      services: [selectedServiceId],
    };
    try {
      const { data } = await axios.post<IAddServiceResponse>(API.DENTIST_SERVICES, body);
      dispatch({type: UserTypes.ADD_SERVICES, payload: { services: data }});
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
      await axios.delete(`${API.DENTIST_SERVICES}?key=${key}`);
      dispatch({
        type: UserTypes.REMOVE_SERVICE,
        payload: { key },
      });
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
    <>
      <div className="profile-box-form">
        <div className="form-info-block">
          <div>
            <p className="form-login-title green px20">Services</p>
            <p className="form-login-subtitle gray px12 mb-6px">
              Information For Patients
            </p>
          </div>
          {accountType === "free" && (
            <div className="upgrade-button-bio">
              <Link href={"/purchase"}>
                <button className="button-green-outline">Upgrade</button>
              </Link>
            </div>
          )}
        </div>

        <div className="box-2-box">
          <div className="profile-block-box">
            <div>
              <div className="form-profile-label">
                <label className="form-profile-label">Add Service</label>
              </div>
              <div className="row-content">
                <span className="input-span">Service</span>
                <select
                  className="form-profile-input arrows"
                  name="services"
                  id="services"
                  onChange={(e) => {
                    selectService(e.target.value);
                  }}
                >
                  <option>Select service</option>
                  {allowedServices &&
                    allowedServices.map((item) => {
                      return (
                        <option value={item.service_id} key={item.service_id}>
                          {item.service_name}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            <div className="row-content">
              <span className="input-span"></span>
              <button
                className="button-green-confirm"
                onClick={handleAddService}
                disabled={selectedServiceId === "" || freeAccountLimit}
              >
                Confirm
              </button>
            </div>
            <div className="mt-big">
              <div className="form-profile-label">
                <label className="form-profile-label">Selected Services</label>
              </div>
              {services &&
                services.slice(0, 2).map((el) => {
                  return (
                    <div className="form-login-input" key={el.service_id}>
                      <input
                        type="text"
                        name={el.service_name}
                        value={el.service_name}
                        id={el.service_id}
                        disabled
                        onChange={() => {}}
                      />
                      <img
                        className="form-login-input-close"
                        src="../images/close.svg"
                        onClick={() => {
                          handleDeleteService(el.key);
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="profile-block-box">
            <div>
              <div className="form-profile-label">
                <label className="form-profile-label">
                  Additional Services - Premium
                </label>
              </div>

              {services &&
                services.slice(2, services.length).map((el) => {
                  return (
                    <div className="form-login-input" key={el.service_id}>
                      <input
                        key={el.service_id}
                        type="text"
                        name={el.service_name}
                        value={el.service_name}
                        id={el.service_id}
                        disabled
                        onChange={() => {}}
                      />
                      <img
                        className="form-login-input-close"
                        src="../images/close.svg"
                        onClick={() => {
                          handleDeleteService(el.key);
                        }}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
