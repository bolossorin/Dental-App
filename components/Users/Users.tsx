import React, {useCallback, useEffect, useState} from "react";

// libs
import axios from "axios";
import {get} from "lodash";

// components
import SearchForm from "./SearchForm/SearchForm";
import {API, getUsersApi} from "../../api/AWS-gateway";
import {IAdminUser} from "../../reducers/types";
import {getPeriod} from "../../utils/getDate";
import FilterUsersForm from "./FilterUsersForm/FilterUsersForm";
import ConfirmPopup from "./ConfirmPopup/ConfirmPopup";
import {ProfileBox} from "../common/ProfileBox/ProfileBox";
import {User} from "./User/User";

// assets
import styles from "./Users.module.css";
import notify, {ISetNotofication} from "../Toast";

export const Users: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [filteredByPeriod, setFilteredByPeriod] = useState([]);
  const [filteredByStatus, setFilteredByStatus] = useState([]);
  const [usersToRender, setUsersToRender] = useState([]);
  const [alreadyFiltered, setAlreadyFiltered] = useState({byStatus: false, byPeriod: false, byName: false});
  const filtered = alreadyFiltered.byStatus || alreadyFiltered.byPeriod || alreadyFiltered.byName;
  const [confirmPopupOpened, setConfirmPopupOpened] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const setNotification = useCallback<ISetNotofication>(
    ({type, message, position, autoClose}) => {
      notify({type, message, position, autoClose});
    }, []);

  const handleSuspendUserClick = async ({email}): Promise<void> => {
    try {
      const {data} = await axios.put(`${API.SUSPEND_USER}?email=${email}`);
      setNotification({
        type: "success",
        message: data.message,
        position: "bottom-center",
        autoClose: 10,
      });
    } catch (e) {
      console.log(e);
      setNotification({type: "error", message: 'Server Internal Error'});
    }
  };

  const openConfirmPopup = ({email}) => {
    setConfirmPopupOpened(true);
    setUserEmail(email);
  };

  const closeConfirmPopup = () => {
    setConfirmPopupOpened(false);
    setUserEmail("");
  };

  const handleDeleteUserClick = async ({confirm}): Promise<void> => {
    if (confirm === "delete") {
      try {
        const {data} = await axios.delete(`${API.DELETE_USER}?email=${userEmail}`);
        const usersUpdated = users.filter((user: IAdminUser) => user.email !== userEmail);
        setUsersToRender(usersUpdated);
        setUserEmail("");
        setNotification({type: "success", message: data.message});
      } catch (e) {
        console.log(e);
        setNotification({type: "error", message: 'Server Internal Error'});
      }
    }
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
        const creationPoint = new Date(user.created_at);
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
    getUsersApi(config).then(({data}) => {
      setUsers(data);
      setUsersToRender(data);
      data.map((user) => {
        if (!user.dentist_name) user.dentist_name = user.email;
      });
    }).catch((error) => console.log(error, error));

  }, []);

  return (
    <ProfileBox title='Users Catalogue' subTitle='Search Users'>
      <ConfirmPopup
        handleDeleteUserClick={handleDeleteUserClick}
        opened={confirmPopupOpened}
        userEmail={userEmail}
        onBtnCloseClick={closeConfirmPopup} />
      <div className='account-form-info-block-full'>
        <SearchForm handleSearchFormSubmit={handleSearchFormSubmit} searchValue={searchValue}
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
                created_at={get(user, 'created_at', 'there is no data')}
                subscription_end_date={get(user, 'subscription_end_date', 0) as number}
                subscription_plan={user.subscription_plan}
                email={user.email}
                post_code={get(user, 'locations[0].post_code', 'there is no data')}
                gdc_number={get(user, 'gdc', 'there is no data')}
                auth_time={user.auth_time}
                subscription_id={user.subscription_id}
                handleSuspendUserClick={handleSuspendUserClick}
                openConfirmPopup={openConfirmPopup}
              />)) : <h2 className='empty'>Not found</h2>}
          </ul>
        </div>
      </div>
    </ProfileBox>
  );
};
