import { FaRegTrashAlt } from "react-icons/fa";

interface ClauseProps {
  isLoading: Function;
  session: any;
  email: any;
  data: any;
  setData: Function;
}

const Clause: React.FC<ClauseProps> = ({
  isLoading,
  session,
  email,
  data,
  setData,
}) => {
  const renderClauses = (data: any[]) => {
    return data.map((item) => {
      return (
        <>
          <h3>{item.name}</h3>
          <div className="no-border center-text">
            <section className="interior">
              <p
                style={{
                  margin: "0px",
                  padding: "0px",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {item.clause}
              </p>
            </section>
            <button
              className="icon_button_delete"
              onClick={() => deleteClause(item.id)}
            >
              <FaRegTrashAlt size={30} />
            </button>
          </div>
        </>
      );
    });
  };

  const deleteClause = async (id: string) => {
    isLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_HOST}/docs/clause/delete/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session.session, // prettier-ignore
          },
          body: JSON.stringify({ email: email.email, id: id }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error("Failed to delete clause");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    isLoading(false);
  };

  return (
    <section style={{ width: "100%" }}>
      <h2>Clause Settings</h2>
      {data.length > 0 && <>{renderClauses(data)}</>}
      {data.length <= 0 && <p>You have no saved clauses!</p>}
    </section>
  );
};

export default Clause;
