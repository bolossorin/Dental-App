import React, { createContext, useReducer, Dispatch } from "react";
import {
  userReducer,
  UserActions,
  UserInitialState,
  DentistActions,
  DentistInitialState,
  dentistReducer,
} from "../reducers";

type InitialStateType = {
  userState: typeof UserInitialState;
  dentistState: typeof DentistInitialState;
};

const initialState: InitialStateType = {
  userState: UserInitialState,
  dentistState: DentistInitialState,
};

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<UserActions | DentistActions>;
}>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = (
  { userState, dentistState }: InitialStateType,
  action: UserActions | DentistActions
) => ({
  userState: userReducer(userState, action as UserActions),
  dentistState: dentistReducer(dentistState, action as DentistActions),
});

const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer<
    React.Reducer<InitialStateType, UserActions | DentistActions>
  >(mainReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
