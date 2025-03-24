import {Navigate, Outlet} from "react-router-dom";
import Header from "../../widgets/Header";

export default function AuthedLayout() {
  const isAuthed = !!localStorage.getItem('token');
  if (!isAuthed) {
    return <Navigate to={"/login"} />
  }

  return (
    <>
      <Header/>
      <main>
        <div className="container">
          <Outlet/>
        </div>
      </main>
    </>
  );
}