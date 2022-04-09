import React, {useCallback, useContext} from "react";

// libs
import axios from "axios";
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";

// components
import {API} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {DentistTypes} from "../../../reducers";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";

interface IBioResponse {
  title: string;
  dentist_name: string;
  qualifications: string;
  bio: string;
  email?: string;
  website?: string | null;
  phone?: string | null;
}

const bioSchema = Yup.object().shape({
  title: Yup.string().matches(/(^[A-Za-z]{2,10})/, 'Invalid Title').required("Title is required"),
  name: Yup.string().matches(/(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/, 'Invalid Name').required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  qualifications: Yup.string(),
  bio: Yup.string(),
  website: Yup.string().matches(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/, 'Invalid Website'),
  phone: Yup.string().matches(/^(0|[1-9]\d*)$/, 'Invalid Phone'),
});
export const Bio: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const {email, dentist_name, title, subscription_plan, bio, qualifications, website, phone} = state.dentistState;

  const setNotification = useCallback<ISetNotofication>(
    ({...notifyProps}) => {
      notify({...notifyProps});
    }, []);

  return (
    <ProfileLayout title='Bio and Contact Information' subTitle='Information For Patients'>
      <Formik
        validationSchema={bioSchema}
        enableReinitialize
        initialValues={{
          title: title || '',
          name: dentist_name || '',
          email: email || '',
          qualifications: qualifications || '',
          bio: bio || '',
          password: '',
          phone: phone || '',
          website: website || ''
        }}
        onSubmit={async (values) => {
          const {phone, website} = values;

          const body: IBioResponse = {
            title: values.title || "Dr",
            email: values.email,
            dentist_name: values.name,
            bio: values.bio,
            qualifications: values.qualifications,
            phone,
            website,
          };
          try {
            const {data} = await axios.post<IBioResponse>(API.SET_DENTIST_INFORMATION, body);
            dispatch({
              type: DentistTypes.SET_INFO,
              payload: {
                email: values.email,
                bio: data.bio,
                qualifications: data.qualifications,
                title: data.title,
                dentist_name: data.dentist_name,
                phone: data.phone || undefined,
                website: data.website || undefined,
              },
            });
            setNotification({
              type: "success",
              message: "Successfully updated dentist Bio!",
              autoClose: 2,
              position: "top-right",
            });
          } catch (exp) {
            setNotification({
              type: "error",
              message: "Please try again!",
              autoClose: 2,
              position: "top-right",
            });
          }
        }}>
        {({errors, touched}) =>
          <Form className="box-2-box">
            <div className="profile-block-box">
              <div className="double-blocks">
                <div>
                  <div className="form-profile-label">
                    <label className="form-profile-label" htmlFor="title">
                      Title
                    </label>
                  </div>
                  <div className='form-input'>
                    <Field className="form-profile-input" name="title" placeholder="Dr." />
                    {errors.title && touched.title ? (<div className='error-text'>{errors.title}</div>) : null}
                  </div>
                </div>
                <div>
                  <div className="form-profile-label">
                    <label className="form-profile-label" htmlFor="name">
                      Name
                    </label>
                  </div>
                  <div className='form-input'>
                    <Field className="form-profile-input" name="name" placeholder="Name" />
                    {errors.name && touched.name ? (<div className='error-text'>{errors.name}</div>) : null}
                  </div>
                </div>
              </div>
              <div>
                <div className="form-profile-label">
                  <label className="form-profile-label">
                    Contact Email
                  </label>
                </div>
                <div className='form-input'>
                  <Field className="form-profile-input" name="email" placeholder="Email" />
                  {errors.email && touched.email ? (<div className='error-text'>{errors.email}</div>) : null}
                </div>
              </div>
              <div>
                <div className="form-profile-label">
                  <label className="form-profile-label" htmlFor="Qualifications">
                    Qualifications
                  </label>
                </div>
                <div className='form-input'>
                  <Field className="form-profile-input" name="qualifications" placeholder="Notes Here" />
                  {errors.qualifications && touched.qualifications ? (
                    <div className='error-text'>{errors.qualifications}</div>) : null}
                </div>
              </div>
              <div>
                <div className="form-profile-label">
                  <label className="form-profile-label" htmlFor="profile_bio">
                    Profile Bio
                  </label>
                </div>
                <div className='form-input'>
                  <Field as='textarea' className="form-profile-input" name="bio" placeholder="Profile Bio..." />
                  {errors.bio && touched.bio ?
                    <div className='error-text'>{errors.bio}</div> : null}
                </div>
                <div className="form-login-buttons-confirm">
                  <button type='submit' className="button-green-confirm">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
            <div className={`profile-block-box ${subscription_plan === "FREE" && "disabled"}`}>
              <div>
                <div className="form-profile-label ">
                  <label className="form-profile-label  " htmlFor="website">
                    Website Address {subscription_plan === 'FREE' && '- Premium'}
                  </label>
                </div>
                <div className='form-input'>
                  <Field
                    className="form-profile-input"
                    name="website"
                    placeholder="Website..."
                    disabled={subscription_plan === "FREE"} />
                  {errors.website && touched.website ? (<div className='error-text'>{errors.website}</div>) : null}
                </div>
              </div>
              <div>
                <div className="form-profile-label">
                  <label className="form-profile-label " htmlFor="phone">
                    Phone {subscription_plan === 'FREE' && '- Premium'}
                  </label>
                </div>
                <div className='form-input'>
                  <Field
                    className="form-profile-input"
                    name="phone"
                    placeholder="Phone"
                    disabled={subscription_plan === "FREE"} />
                  {errors.phone && touched.phone ? (<div className='error-text'>{errors.phone}</div>) : null}
                </div>
              </div>
            </div>
          </Form>}
      </Formik>
    </ProfileLayout>
  );
};
