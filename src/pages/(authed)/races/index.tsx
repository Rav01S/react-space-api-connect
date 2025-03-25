import Loading from "../../../shared/components/Loading";
import {useEffect, useState} from "react";
import {API, RacesData} from "../../../shared/api/api.ts";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";

export default function RacesPage() {
  const [loading, setLoading] = useState(true);
  const [racesData, setRacesData] = useState<null | RacesData>(null);

  const navigate = useNavigate()

  const getRaces = () =>
    API.getRaces()
      .then(res => {
        if (res.status !== 200)
          throw res;
        setRacesData(res.data);
        setLoading(false)
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });

  useEffect(() => {
    getRaces()
  }, [])

  if (loading)
    return <Loading/>

  const bookFlight = (flight_number: string) => {
    API.bookFlight(flight_number)
      .then(res => {
        if (res.status !== 200)
          throw res;

        alert('Вы успешно записаны на рейс')
      })
      .catch(err => {
        if (err instanceof AxiosError)
          if (err.response && err.response.data?.error?.message)
            alert(err.response.data.error.message)
          else
            alert('Не удалось записаться на рейс');
      })
  }

  return (
    <>
      <h1>Рейсы</h1>
      <div className="flex-container">
        <button className={"btn"}
                onClick={() => navigate('/gagarin')}
        >
          На главную страницу
        </button>
        <button className={"btn"}
                onClick={() => navigate('/races/add')}
        >
          Добавить рейс
        </button>
      </div>
      {
        racesData?.map(race => (
          <div key={race.flight_number}>
            <h2>Номер полёта: {race.flight_number}</h2>
            <p>Место назначения: {race.destination}</p>
            <p>Дата отправления: {race.launch_date}</p>
            <p>Свободно мест: {race.seats_available}</p>
            <div className="flex-container">
              <button onClick={() => bookFlight(race.flight_number)} className={'btn'}>Записаться</button>
            </div>
          </div>
        ))
      }
    </>
  );
}