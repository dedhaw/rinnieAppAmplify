import { useCookies } from "react-cookie";

export const checkUserDocAccess = async (email: string, doc_id: string) => {
  const [session] = useCookies(["session"]);
  try {
    const response = await fetch(
      `https://ali5u9l6fk.execute-api.us-east-1.amazonaws.com/prod/secure/check-user-access/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session.session, // prettier-ignore
        },
        body: JSON.stringify({ email: email, id: doc_id }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch user");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const checkDocEditable = async (doc_id: string) => {
  try {
    const response = await fetch(
      `https://l9cdcbusi1.execute-api.us-east-1.amazonaws.com/prod/secure/check-doc-edit/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: doc_id }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch doc");
    }
  } catch (error) {
    console.error("Error fetching doc data:", error);
  }
};
