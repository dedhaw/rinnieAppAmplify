import "../../styles/profile.css";

interface UserInfoProps {
  user: any;
  setSection: Function;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, setSection }) => {
  return (
    <>
      <h2>
        {user.first_name} {user.last_name}
      </h2>
      <div className="no-border center-text">
        <h2 style={{ padding: "0px 20px" }}>Email: {user.email}</h2>
        <h2 style={{ padding: "0px 20px" }}>Phone: {user.cell}</h2>
      </div>
      <div className="no-border center-text">
        <h2 style={{ padding: "0px 20px" }}>Broker License: {user.license}</h2>
        <h2 style={{ padding: "0px 20px" }}>
          Brokerage: {user.brokerage_name}
        </h2>
        <h2 style={{ padding: "0px 20px" }}>
          Brokerage: {user.brokerage_license}
        </h2>
      </div>
      <div className="no-border" style={{ justifyContent: "center" }}>
        <img src={user.signature} />
      </div>
      <div className="no-border" style={{ justifyContent: "center" }}>
        <button>Edit</button>
        <button onClick={() => setSection("branding")}>Branding</button>
      </div>
    </>
  );
};

export default UserInfo;
