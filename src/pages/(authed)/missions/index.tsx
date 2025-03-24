import Loading from "../../../shared/components/Loading";
import {useEffect, useState} from "react";
import {API, MissionsData} from "../../../shared/api/api.ts";
import Accordion from "../../../shared/components/Accordion";
import {useNavigate} from "react-router-dom";

export default function MissionsPage() {
  const [loading, setLoading] = useState(true);
  const [missionsData, setMissionsData] = useState<null | MissionsData>(null);

  const navigate = useNavigate()

  const getMissions = () =>
    API.getMissions()
      .then(res => {
        if (res.status !== 200)
          throw res;
        setMissionsData(res.data);
        setLoading(false)
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });

  useEffect(() => {
    getMissions()
  }, [])

  if (loading)
    return <Loading/>

  const deleteMission = (missionId: number) => {
    API.deleteMission(missionId)
      .then(res => {
        if (res.status !== 204)
          throw res;

        alert('Миссия удалена');
        getMissions()
      })
      .catch(err => {
        alert(err.message);
        getMissions()
      })
  }

  return (
    <>
      <h1>Миссии</h1>
      <div className="flex-container">
        <button className={"btn"}
                onClick={() => window.location.reload()}
        >
          К списку миссий
        </button>
        <button className={"btn"}
                onClick={() => navigate('/missions/add')}
        >
          Добавить миссию
        </button>
      </div>
      {
        missionsData?.map(mission =>
          <Accordion key={mission.mission.id} title={mission.mission.name}>
            <p>{mission.mission.launch_details.launch_date} - {mission.mission.landing_details.landing_date}</p>
            <p>
              {mission.mission.launch_details.launch_site.name} &nbsp;
              ({mission.mission.launch_details.launch_site.location.longitude}, &nbsp;
              {mission.mission.launch_details.launch_site.location.latitude})
              - {mission.mission.landing_details.landing_site.name} &nbsp;
              ({mission.mission.landing_details.landing_site.coordinates.longitude}, &nbsp;
              {mission.mission.landing_details.landing_site.coordinates.latitude})</p>
            <p><b>Космический корабль:</b></p>
            <p>Лунный модуль: {mission.mission.spacecraft.lunar_module}</p>
            <p>Командный модуль: {mission.mission.spacecraft.command_module}</p>
            <p>Участники: {
              mission.mission.spacecraft.crew.map(el => {
                return el.role + " - " + el.name
              }).join(", ")
            }
            </p>
            <div className={"flex-container"}>
              <button onClick={() => deleteMission(mission.mission.id)}
                      className="btn">
                Удалить
              </button>
              <button onClick={() => navigate('/missions/' + mission.mission.id + '/edit')}
                      className="btn">
                Изменить
              </button>
            </div>
          </Accordion>
        )
      }
    </>
  );
}