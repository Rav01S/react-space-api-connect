import {useEffect} from "react";
import {API} from "../../../shared/api/api.ts";

export default function LogoutPage() {

  useEffect(() => {
    API.logout().then(res => {
      if (res.status !== 204 && res.status !== 401)
        throw res;

      localStorage.clear();
      window.location.reload();
    }).catch(err => {
      alert(err.message);
    })
  }, [])

  return (
    <>

    </>
  );
}