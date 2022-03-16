interface IMeMarker {
  lat: number;
  lng: number;
}

export const MeMarker: React.FC<IMeMarker> = () => {
  return (
    <div>
      <img className="meMarkerImage" src={"../images/meMarker.svg"} alt="home" />
    </div>
  );
};
