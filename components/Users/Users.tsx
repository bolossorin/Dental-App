import React, {useCallback, useEffect, useState} from "react";

// libs
import axios from "axios";

// components
import SearchForm from "./SearchForm/SearchForm";
import {API} from "../../api/AWS-gateway";
import {IAdminUser} from "../../reducers/types";
import {getPeriod} from "../../utils/getDate";
import FilterUsersForm from "./FilterUsersForm/FilterUsersForm";
import ConfirmPopup from "./ConfirmPopup/ConfirmPopup";
import {ProfileBox} from "../common/ProfileBox/ProfileBox";
import {User} from "./User/User";

// assets
import styles from "./Users.module.css";
import notify, {ISetNotofication} from "../Toast";

const usersInitial: any = [
  {
    subscription_id: '#StripeID',
    username: 'Jon',
    gdc_number: '12345',
    email: 'email@email.email',
    post_code: 'Post Code',
    auth_time: '13:05 04/04/2021',
    created_at: new Date().toISOString().slice(0, 10),
    accountType: 'premium',
    exp: '03/09/2021',
    isSuspended: false,
  },
  {
    subscription_id: '#StripeID',
    gdc_number: '12345',
    email: 'email@email.email',
    accountType: 'free',
    username: 'Name',
    exp: '03/09/2021',
    auth_time: '01.01.2021',
    created_at: new Date('01-01-2022').toISOString().slice(0, 10),
    isSuspended: true,
  },
  {
    subscription_id: '#StripeID',
    username: 'Name',
    gdc_number: '12345',
    email: 'email@email.email',
    post_code: 'Post Code',
    auth_time: '13:05 04/04/2021',
    created_at: new Date('01-01-2022').toISOString().slice(0, 10),
    accountType: 'premium',
    exp: '03/09/2021',
    isSuspended: false,
  },
];
export const Users: React.FC = () => {
  const [users, setUsers] = useState(usersInitial);
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
    }
  };

  const handleSearchFormSubmit = ({keyword}) => {
    const usersToFilter = alreadyFiltered.byStatus || alreadyFiltered.byPeriod ? usersToRender : users;
    const filUsers = usersToFilter.filter((user: IAdminUser) => user.username.toLowerCase().indexOf(keyword.toLowerCase()) > -1);
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
      const formattedStatus = status === "Paid" ? "premium" : "free";
      const filUsers = usersToFilter.filter((user: IAdminUser) => user.accountType === formattedStatus);
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
    // todo: need backend
    // const res = await axios.get(API.GET_USERS);
    // const allUsers = res.data;
    // allUsers.map((user) => {
    //   if (!user.username) user.username = user.email;
    // });
    setUsers(users);
    setUsersToRender(users);
  }, [users]);

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
            {usersToRender.length > 0 ? users.map((user: IAdminUser, index) => (
              <User
                key={index}
                username={user.username ? user.username : user.email}
                created_at={user.created_at}
                exp={user.exp}
                accountType={user.accountType}
                email={user.email}
                post_code={user.post_code}
                gdc_number={user.gdc_number}
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
