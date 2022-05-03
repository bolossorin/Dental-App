import React, {useCallback, useContext} from "react";

// libs
import {Formik, Field, Form} from "formik";
import * as Yup from "yup";
import Skeleton from "react-loading-skeleton";

// components
import {updateProfileApi} from "../../../api/AWS-gateway";
import {AppContext} from "../../../context/app.context";
import {DentistTypes} from "../../../reducers";
import {ISetNotofication} from "../../Toast";
import notify from "../../Toast";
import {ProfileLayout} from "../ProfileLayout/ProfileLayout";
import {Spinner} from "../../Spinner/Spinner";
import {dentistNameSchema, emailSchema, phoneSchema, websiteSchema} from "../../../utils/schemas";

const bioSchema = Yup.object().shape({
  title: Yup.string().matches(/(^[A-Za-z]{2,10})/, 'Invalid Title').required("Title is required"),
  dentist_name: dentistNameSchema,
  email: emailSchema,
  qualifications: Yup.string(),
  bio: Yup.string(),
  website: websiteSchema,
  phone: phoneSchema,
});
export const Bio: React.FC = () => {
  const {state, dispatch} = useContext(AppContext);
  const {
    access_token,
    email,
    dentist_name,
    title,
    subscription_plan,
    bio,
    qualifications,
    website,
    phone,
    settings_account
  } = state.dentistState;

  const setNotification = useCallback<ISetNotofication>(({...notifyProps}) => {
    notify({...notifyProps});
  }, []);

  return (
    <ProfileLayout title='Bio and Contact Information' subTitle='Information For Patients'>
      {dentist_name ? <Formik
        validationSchema={bioSchema}
        enableReinitialize
        initialValues={{
          title: title || '',
          dentist_name: dentist_name || '',
          email: email || '',
          qualifications: qualifications || '',
          bio: bio || '',
          password: '',
          phone: phone || '',
          website: website || ''
        }}
        onSubmit={async (values) => {
          try {
            const config = {headers: {Authorization: `Bearer ${access_token}`}};
            await updateProfileApi(values, config);
            dispatch({type: DentistTypes.SET_INFO, payload: {...values}});
            setNotification({type: "success", message: "Successfully updated dentist Bio!"});
          } catch (error: any) {
            setNotification({type: "error", message: error.response.data.message});
          }
        }}>
        {({isSubmitting, errors, touched}) =>
          <Form className="box-2-box">
            <div className="profile-block-box">
              <div className="double-blocks">
                <div>
                  <div className="form-profile-label">
                    <label className="form-profile-label">Title</label>
                  </div>
                  <div className='form-input'>
                    <Field className="form-profile-input" name="title" placeholder="Dr." />
                    {errors.title && touched.title ? (<div className='error-text'>{errors.title}</div>) : null}
                  </div>
                </div>
                <div>
                  <div className="form-profile-label">
                    <label className="form-profile-label">Name</label>
                  </div>
                  <div className='form-input'>
                    <Field className="form-profile-input" name="dentist_name" placeholder="Name" />
                    {errors.dentist_name && touched.dentist_name ?
                      (<div className='error-text'>{errors.dentist_name}</div>) : null}
                  </div>
                </div>
              </div>
              <div>
                <div className="form-profile-label">
                  <label className="form-profile-label">Contact Email</label>
                </div>
                <div className='form-input'>
                  <Field className="form-profile-input" name="email" placeholder="Email" disabled />
                  {errors.email && touched.email ? (<div className='error-text'>{errors.email}</div>) : null}
                </div>
              </div>
              <div>
                <div className="form-profile-label">
                  <label className="form-profile-label">Qualifications</label>
                </div>
                <div className='form-input'>
                  <Field className="form-profile-input" name="qualifications" placeholder="Notes Here" />
                  {errors.qualifications && touched.qualifications ?
                    (<div className='error-text'>{errors.qualifications}</div>) : null}
                </div>
              </div>
              <div>
                <div className="form-profile-label">
                  <label className="form-profile-label">Profile Bio</label>
                </div>
                <div className='form-input'>
                  <Field as='textarea' className="form-profile-input" name="bio" placeholder="Profile Bio..." />
                  {errors.bio && touched.bio ? <div className='error-text'>{errors.bio}</div> : null}
                </div>
                <div className="form-login-buttons-confirm">
                  <button type='submit' className="button-green-confirm" disabled={isSubmitting}>
                    {isSubmitting ? <Spinner /> : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
            <div className={`profile-block-box`}>
              <div className={!settings_account?.websiteAllowed ? "disabled" : ''}>
                <div className="form-profile-label ">
                  <label className="form-profile-label">
                    Website Address {subscription_plan === 'FREE' && '- Premium'}
                  </label>
                </div>
                <div className='form-input'>
                  <Field
                    className="form-profile-input"
                    name="website"
                    placeholder="Website..."
                    disabled={!settings_account?.websiteAllowed} />
                  {errors.website && touched.website ? (<div className='error-text'>{errors.website}</div>) : null}
                </div>
              </div>
              <div className={!settings_account?.phoneAllowed ? "disabled" : ''}>
                <div className="form-profile-label">
                  <label className="form-profile-label">
                    Phone {subscription_plan === 'FREE' && '- Premium'}
                  </label>
                </div>
                <div className='form-input'>
                  <Field
                    className="form-profile-input"
                    name="phone"
                    placeholder="Phone"
                    disabled={!settings_account?.phoneAllowed} />
                  {errors.phone && touched.phone ? (<div className='error-text'>{errors.phone}</div>) : null}
                </div>
              </div>
            </div>
          </Form>}
      </Formik> : <Skeleton count={5} height="5vh" />}
    </ProfileLayout>
  );
};
