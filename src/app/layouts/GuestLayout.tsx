import {Navigate, Outlet} from "react-router-dom";
import Header from "../../widgets/Header";

export default function GuestLayout() {
  const isAuthed = !!localStorage.getItem('token');
  if (isAuthed) {
    return <Navigate to={"/gagarin"} />
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