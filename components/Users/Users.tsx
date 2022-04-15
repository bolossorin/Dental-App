import React, {useCallback, useContext, useEffect, useState} from "react";

// libs
import {get} from "lodash";

// components
import SearchForm from "./SearchForm/SearchForm";
import {getUsersApi, userDeleteApi, userResolveApi, userSuspendApi} from "../../api/AWS-gateway";
import {IAdminUser} from "../../reducers/types";
import {getPeriod} from "../../utils/getDate";
import FilterUsersForm from "./FilterUsersForm/FilterUsersForm";
import ConfirmPopup from "./ConfirmPopup/ConfirmPopup";
import {ProfileBox} from "../common/ProfileBox/ProfileBox";
import {User} from "./User/User";

// assets
import styles from "./Users.module.css";
import notify, {ISetNotofication} from "../Toast";
import {AdminTypes} from "../../reducers";
import {AppContext} from "../../context/app.context";

export const Users: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const {users} = state.adminState;

  const [filteredByPeriod, setFilteredByPeriod] = useState<IAdminUser[]>([]);
  const [filteredByStatus, setFilteredByStatus] = useState<IAdminUser[]>([]);
  const [usersToRender, setUsersToRender] = useState<IAdminUser[]>([]);
  const [alreadyFiltered, setAlreadyFiltered] = useState({byStatus: false, byPeriod: false, byName: false});
  const filtered = alreadyFiltered.byStatus || alreadyFiltered.byPeriod || alreadyFiltered.byName;
  const [confirmPopupOpened, setConfirmPopupOpened] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [type, setType] = useState("");

  const setNotification = useCallback<ISetNotofication>(({type, message, position, autoClose}) => {
    notify({type, message, position, autoClose});
  }, []);

  const handleSuspendUserClick = async () => {
    try {
      const token = localStorage.getItem('access_token_admin');
      const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
      const {data} = await userSuspendApi(userEmail, config);
      setUserEmail("");
      dispatch({type: AdminTypes.UPDATE_USER, payload: data});
      setNotification({type: "success", message: "User is Suspended"});
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
  };

  const handleResolveUserClick = async () => {
    try {
      const token = localStorage.getItem('access_token_admin');
      const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
      const {data} = await userResolveApi(userEmail, config);
      setUserEmail("");
      dispatch({type: AdminTypes.UPDATE_USER, payload: data});
      setNotification({type: "success", message: "User is Resolved"});
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
  };

  const handleDeleteUserClick = async () => {
    try {
      const token = localStorage.getItem('access_token_admin');
      const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
      await userDeleteApi(userEmail, config);
      dispatch({type: AdminTypes.DELETE_USER, payload: userEmail});
      setUserEmail("");
      setNotification({type: "success", message: "User Deleted"});
    } catch (error: any) {
      setNotification({type: "error", message: error.response.data.message});
    }
  };


  const openConfirmPopup = (email) => {
    setConfirmPopupOpened(true);
    setUserEmail(email);
  };

  const closeConfirmPopup = () => {
    setConfirmPopupOpened(false);
    setUserEmail("");
  };


  const handleSearchFormSubmit = (keyword) => {
    const usersToFilter = alreadyFiltered.byStatus || alreadyFiltered.byPeriod ? usersToRender : users;
    const filUsers = usersToFilter.filter((user: IAdminUser) => user.dentist_name.toLowerCase().includes(keyword.toLowerCase()));
    setUsersToRender(filUsers);
    setAlreadyFiltered({...alreadyFiltered, byName: true});
  };

  const handlePeriodChange = ({period}) => {
    if (period) {
      const usersToFilter = alreadyFiltered.byStatus ? filteredByStatus : users;
      const startPoint = getPeriod(period);
      const filUsers = usersToFilter.filter((user: IAdminUser) => {
        const creationPoint = new Date(user.createdAt as Date);
        return creationPoint > startPoint;
      });
      setUsersToRender(filUsers);
      setFilteredByPeriod(filUsers);
      setAlreadyFiltered({...alreadyFiltered, byPeriod: true});
    }
  };

  const handleStatusChange = ({status}) => {
    if (status) {
      const usersToFilter = alreadyFiltered.byPeriod ? filteredByPeriod : users;
      const formattedStatus = status === "Paid" ? "PREMIUM" : "FREE";
      const filUsers = usersToFilter.filter((user: IAdminUser) => user.subscription_plan === formattedStatus);
      setUsersToRender(filUsers);
      setFilteredByStatus(filUsers);
      setAlreadyFiltered({...alreadyFiltered, byStatus: true});
    }
  };

  const handleResetFiltersClick = () => {
    setSearchValue("");
    setUsersToRender(users);
    setAlreadyFiltered({byName: false, byStatus: false, byPeriod: false});
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token_admin');
    const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
    getUsersApi(config)
      .then(({data}) => dispatch({type: AdminTypes.GET_ALL_USERS, payload: data}))
      .catch((error) => console.log(error, error));

  }, []);

  useEffect(() => {
    setUsersToRender(users);
  }, [users]);

  return (
    <ProfileBox title='Users Catalogue' subTitle='Search Users'>
      {type === 'Delete' && <ConfirmPopup
        type='delete'
        handleUserClick={handleDeleteUserClick}
        opened={confirmPopupOpened}
        userEmail={userEmail}
        onBtnCloseClick={closeConfirmPopup} />}
      {type === 'Suspend' && <ConfirmPopup
        type='suspend'
        handleUserClick={handleSuspendUserClick}
        opened={confirmPopupOpened}
        userEmail={userEmail}
        onBtnCloseClick={closeConfirmPopup} />}
      {type === 'Resolve' && <ConfirmPopup
        type='resolve'
        handleUserClick={handleResolveUserClick}
        opened={confirmPopupOpened}
        userEmail={userEmail}
        onBtnCloseClick={closeConfirmPopup} />}
      <div className='account-form-info-block-full'>
        <SearchForm
          handleSearchFormSubmit={handleSearchFormSubmit}
          searchValue={searchValue}
          setSearchValue={setSearchValue} />
        <div className='users-wrapper'>
          <FilterUsersForm
            onPeriodChange={handlePeriodChange}
            onStatusChange={handleStatusChange}
            handleResetFiltersClick={handleResetFiltersClick}
            alreadyFiltered={filtered} />
          <ul className={styles.usersList}>
            {usersToRender.length > 0 ? usersToRender.map((user: IAdminUser, index) => (
              <User
                key={index}
                username={user.dentist_name ? user.dentist_name : user.email}
                createdAt={get(user, 'createdAt', null)}
                subscription_end_date={get(user, 'subscription_end_date', null)}
                subscription_plan={get(user, 'subscription_plan', '')}
                email={get(user, 'email', '')}
                post_code={get(user, 'locations[0].post_code', '')}
                gdc_number={get(user, 'gdc', '')}
                logged_in_at={get(user, 'logged_in_at', null)}
                subscription_id={get(user, 'subscription_id', '')}
                status={get(user, 'status', '')}
                openConfirmPopup={openConfirmPopup}
                setType={setType} />)) : <h2 className='empty'>Not found</h2>}
          </ul>
        </div>
      </div>
    </ProfileBox>
  );
};
