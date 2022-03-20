import React, {useState} from "react";

// libs
import cn from "classnames";
import {Formik, Form, Field} from "formik";
import Select from "react-select";

// components
import {optionsPeriod, optionsStatus, selectStyles} from "../../../utils/selectInputsData";

// assets
import styles from "./FilterUsersForm.module.scss";

interface FilterUsersFormProps {
  onPeriodChange: ({period: string}) => void;
  onStatusChange: ({status: string}) => void;
  handleResetFiltersClick: () => void;
  alreadyFiltered: boolean;
}

const FilterUsersForm: React.FC<FilterUsersFormProps> = (
  {
    onPeriodChange,
    onStatusChange,
    alreadyFiltered,
    handleResetFiltersClick
  }: FilterUsersFormProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState({label: "Account Opened", key: "001"});

  const [selectedStatus, setSelectedStatus] = useState({label: "Status", key: "002"});

  const handlePeriodChange = ({value}) => {
    if (value) {
      setSelectedPeriod({...selectedPeriod, label: value});
      onPeriodChange({period: value});
    }
  };

  const handleStatusChange = ({value}) => {
    if (value) {
      setSelectedStatus({...selectedStatus, label: value});
      onStatusChange({status: value});
    }
  };

  return (
    <Formik
      initialValues={{period: "", status: ""}}
      onSubmit={(values) => console.log(values, 'values')}>
      {() => (
        <Form className={styles.form}>
          <span className={styles.item}>Dentist</span>
          <Field
            className={styles.item}
            component={Select}
            name="period"
            options={optionsPeriod}
            styles={selectStyles}
            onChange={handlePeriodChange}
            value={selectedPeriod} />
          <Field
            className={styles.item}
            component={Select}
            name="status"
            options={optionsStatus}
            styles={selectStyles}
            onChange={handleStatusChange}
            value={selectedStatus} />
          <div className={styles.item} />
          <button className={cn(styles.item, styles.btn_download)}>
            <img src={"../images/arrow-bottom.svg"} alt="download" />
          </button>
          <button
            type="button"
            className={styles.btnReset}
            disabled={!alreadyFiltered}
            onClick={() => {
              handleResetFiltersClick();
              setSelectedPeriod({...selectedPeriod, label: "Account Opened"});
              setSelectedStatus({...selectedStatus, label: "Status"});
            }}>
            Remove all filters
          </button>
        </Form>)}
    </Formik>
  );
};

export default FilterUsersForm;
