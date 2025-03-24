import {useEffect, useState} from "react";
import {API, GagarinData} from "../../../shared/api/api.ts";
import Loading from "../../../shared/components/Loading";
import {useNavigate} from "react-router-dom";

export default function GagarinPage() {
  const [loading, setLoading] = useState(true);
  const [gagarinData, setGagarinData] = useState<null | GagarinData['data'][0]>(null);

  const navigate = useNavigate();

  useEffect(() => {
    API.getGagarin()
      .then(res => {
        if (res.status !== 200)
          throw res;
        setGagarinData(res.data.data?.[0]);
        setLoading(false)
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  }, [])

  if (loading)
    return <Loading/>

  return (
    <>
      <h1>Информация о Гагарине</h1>
      <p>ФИО: {gagarinData?.cosmonaut.name}</p>
      <p>Ранг: {gagarinData?.cosmonaut.rank}</p>
      <p>Дата рождения: {gagarinData?.cosmonaut.birthdate}</p>
      <p>Начало жизни: {gagarinData?.cosmonaut.bio.early_life}</p>
      <p>Карьера: {gagarinData?.cosmonaut.bio.career}</p>
      <p>После полёта: {gagarinData?.cosmonaut.bio.post_flight}</p>
      <button onClick={() => navigate('/missions')} className={"btn"}>К списку миссий</button>
    </>
  );
}