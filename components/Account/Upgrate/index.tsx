interface AccountUpgradeBlockProps {}

export const AccountUpgradeBlock: React.FC<AccountUpgradeBlockProps> = () => {
  return (
    <div className="account-profile-box-form">
      <div className="account-form-info-block">
        <div>
          <p className="account-form-login-title">My Subscription</p>
          <p className="account-form-login-subtitle">
            Subscription Information
          </p>
        </div>
      </div>
      <div className="account-box-2-box">
        <div className="account-profile-block-box">
          <div className="account-double-blocks-2">
            <div>
              <div className="account-form-profile-label">
                <label className="account-form-profile-label">Status</label>
              </div>
              <div>
                <input
                  className="account-form-profile-input"
                  type="text"
                  name="status"
                  id="status"
                  value=""
                  placeholder="ACTIVE"
                  onChange={() => {}}
                />
              </div>
            </div>
            <div>
              <div className="account-form-profile-label">
                <label className="form-profile-label">Renewal</label>
              </div>
              <div>
                <input
                  className="account-form-profile-input"
                  type="text"
                  name="renewal"
                  id="renewal"
                  value="01/06/2021"
                  placeholder="01/06/2021"
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
          <div className="account-row-content">
            <button className="account-button-green">
              Cancel subscription
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
