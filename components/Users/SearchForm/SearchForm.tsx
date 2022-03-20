import React from "react";

// styles
import styles from "./SearchForm.module.scss";

type SearchFormProps = {
  handleSearchFormSubmit: ({keyword: string}) => void;
  setSearchValue: any;
  searchValue: string;
};

const SearchForm: React.FC<SearchFormProps> = (
  {
    handleSearchFormSubmit,
    setSearchValue,
    searchValue
  }: SearchFormProps) => {
  return (
    <div className={styles.form}>
      <input
        name="keyword"
        type="text"
        className={styles.input}
        placeholder="Search users"
        autoComplete="off"
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value)
          handleSearchFormSubmit({keyword: e.target.value})
        }} />
      <img src={"../images/search.svg"} alt="search" className={styles.searchIcon} />
    </div>
  );
};

export default SearchForm;
