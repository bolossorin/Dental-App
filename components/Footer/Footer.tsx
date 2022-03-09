export const Footer = () => {
  return (
    <>
      <div className="_footer">
        <div>
          <p className="_footer-title">Created For Patients By Dentists</p>
          <p className="_footer-text">Find Your Dentist</p>
        </div>
        <div className="_footer-menu">
          <ul>
            <p className="_form-profile-label">For Patients</p>
            <li>
              <a href="#">Whitening</a>
            </li>
            <li>
              <a href="#">Veneers</a>
            </li>
            <li>
              <a href="#">Braces</a>
            </li>
            <li>
              <a href="#">Map Search</a>
            </li>
          </ul>
          <ul>
            <p className="_form-profile-label">For Dentists</p>
            <li>
              <a href="#">How It Works</a>
            </li>
            <li>
              <a href="#">Create a Profile</a>
            </li>
            <li>
              <a href="#">Pricing</a>
            </li>
            <li>
              <a href="#">Terms and Conditions</a>
            </li>
          </ul>
          <ul>
            <p className="_form-profile-label">Information </p>
            <li>
              <a href="#">FAQs</a>
            </li>
            <li>
              <a href="#">About FYD</a>
            </li>
            <li>
              <a href="#">Contact Information</a>
            </li>
            <li>
              <a href="#">Policies</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="_footer-bottom bg-green">
        <div className="_social-icons">
          <a href="#">
            <img src="../images/facebook.svg" alt="facebook" />
          </a>
        </div>
        <div> ©2021 Find Your Dentist</div>
      </div>
    </>
  );
};
