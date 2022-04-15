import React, {useContext, useEffect} from "react";

// libs
import type {NextPage} from "next";

//components
import {CurrentMonth} from "../../components/Dashboard/CurrentMonth/CurrentMonth";
import {TotalSubs} from "../../components/Dashboard/TotalSubs/TotalSubs";
import {LayoutDentist} from "../../components/Layout/LayoutDentist/LayoutDentist";
import {getDashboardStatisticsApi} from "../../api/AWS-gateway";
import {AdminTypes} from "../../reducers";
import {AppContext} from "../../context/app.context";

const DashboardPage: NextPage = (): JSX.Element => {
  const {dispatch} = useContext(AppContext);

  useEffect(() => {
    const token = localStorage.getItem('access_token_admin');
    const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
    getDashboardStatisticsApi(config)
      .then(({data}) => dispatch({type: AdminTypes.GET_USER_STATISTICS, payload: data}))
      .catch((error) => console.log(error, 'error'))
  }, []);

  return (
    <LayoutDentist>
      <CurrentMonth />
      <TotalSubs />
    </LayoutDentist>
  );
};

export default DashboardPage;
