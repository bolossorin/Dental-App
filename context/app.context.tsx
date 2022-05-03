import React, {createContext, useReducer, Dispatch, useEffect} from "react";
import {
  userReducer,
  UserActions,
  UserInitialState,
  DentistActions,
  DentistInitialState,
  dentistReducer,
  AdminInitialState,
  AdminActions,
  adminReducer,
  UserTypes,
} from "../reducers";
import {getSettingsSubscriptionsApi} from "../api/AWS-gateway";

type InitialStateType = {
  userState: typeof UserInitialState;
  adminState: typeof AdminInitialState;
  dentistState: typeof DentistInitialState;
};

const initialState: InitialStateType = {
  userState: UserInitialState,
  adminState: AdminInitialState,
  dentistState: DentistInitialState,
};

const AppContext = createContext<{ state: InitialStateType; dispatch: Dispatch<UserActions | DentistActions | AdminActions>; }>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = (
  {
    userState,
    dentistState,
    adminState
  }: InitialStateType, action: UserActions | DentistActions | AdminActions) => ({
  userState: userReducer(userState, action as UserActions),
  dentistState: dentistReducer(dentistState, action as DentistActions),
  adminState: adminReducer(adminState, action as AdminActions),
});

const AppProvider: React.FC = ({children}) => {
  const [state, dispatch] = useReducer<React.Reducer<InitialStateType, UserActions | DentistActions | AdminActions>>(mainReducer, initialState);

  useEffect(() => {
    getSettingsSubscriptionsApi()
      .then(({data}) => {
          const free = data.filter((item) => item.subscription_type === 'FREE');
          const premium = data.filter((item) => item.subscription_type === 'PREMIUM');
          const settings = {premium: premium[0], free: free[0]};
          dispatch({type: UserTypes.SET_ALL_SETTINGS, payload: settings});
        }
      )
      .catch((error) => console.log(error, 'error'));
  }, []);

  return (
    <AppContext.Provider value={{state, dispatch}}>
      {children}
    </AppContext.Provider>
  );
};

export {AppProvider, AppContext};
