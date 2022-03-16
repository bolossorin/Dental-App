// components
import {IDentistFullDataResponse} from "../components";
import {IUserGallery} from "../reducers/types";

export const useGetDentist = (dentist: IDentistFullDataResponse, galleryData: IUserGallery[]) => {
  return {
    email: dentist.bio.email,
    username: dentist.bio.username,
    title: dentist.bio.title,
    accountType: dentist.accountType,
    profileBio: dentist.bio.profileBio,
    qualifications: dentist.bio.qualifications,
    website: dentist.bio.website,
    phone: dentist.bio.phone,
    avatar_url: dentist.avatar_url,
    locations: dentist.locations,
    services: dentist.services,
    cover_url: dentist.cover_url,
    gdcNumber: dentist.bio.gdcNumber,
    gallery: galleryData,
  };
};
