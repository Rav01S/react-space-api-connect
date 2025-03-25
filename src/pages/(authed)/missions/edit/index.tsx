import {FormEvent, useEffect, useState} from "react";
import {API} from "../../../../shared/api/api.ts";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {AxiosError} from "axios";
import Error from "../../../../shared/components/Error";

type FormData = {
  name: string,
  launch_date: string,
  launch_name: string,
  launch_location_latitude: number,
  launch_location_longitude: number,
  landing_date: string,
  landing_name: string,
  landing_coordinates_latitude: number,
  landing_coordinates_longitude: number,
  crew: {
    name: string,
    role: string
  }[],
  lunar_module: string,
  command_module: string
}

const initialState = {
  name: '',
  launch_date: '',
  launch_name: '',
  launch_location_latitude: 0,
  launch_location_longitude: 0,
  landing_date: '',
  landing_name: '',
  landing_coordinates_latitude: 0,
  landing_coordinates_longitude: 0,
  crew: [{role: '', name: ''}],
  lunar_module: '',
  command_module: ''
}

export default function EditMissionsPage() {
  const {id} = useParams();
  const [formState, setFormState] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData & { crewArr: string }>>({})

  const [data, setData] = useState<null | FormData>(null)

  const navigate = useNavigate();

  const formData = {
    ...initialState,
    ...data,
    ...formState,
  }

  const getMissions = () =>
    API.getMissions()
      .then(res => {
        if (res.status !== 200)
          throw res;

        const mission = res.data.find(mission => mission.mission.id === Number(id))?.mission;

        if (!mission)
          return <Navigate to={'/404'}/>

        setData({
          name: mission.name,
          launch_date: mission.launch_details.launch_date,
          launch_name: mission.launch_details.launch_site.name,
          launch_location_latitude: mission.launch_details.launch_site.location.latitude,
          launch_location_longitude: mission.launch_details.launch_site.location.longitude,
          landing_date: mission.landing_details.landing_date,
          landing_name: mission.landing_details.landing_site.name,
          landing_coordinates_latitude: mission.landing_details.landing_site.coordinates.latitude,
          landing_coordinates_longitude: mission.landing_details.landing_site.coordinates.longitude,
          crew: mission.spacecraft.crew,
          lunar_module: mission.spacecraft.lunar_module,
          command_module: mission.spacecraft.command_module
        })
      })
      .catch(err => {
        console.log(err);
      });

  useEffect(() => {
    getMissions()
  }, [])

  if (!id)
    return <Navigate to={'/404'}/>;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true)
    setErrors({})

    try {
      const res = await API.updateMission(id, formData)

      if (res.status !== 200) {
        throw res;
      }

      navigate('/missions')
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response && 'error' in e.response.data) {
          if ('errors' in e.response.data.error) {
            const crewErrors = handleCrewErrors(e.response.data.error.errors)

            setErrors({
              name: e.response.data.error.errors['mission.name'],
              launch_name: e.response.data.error.errors['mission.launch_details.launch_site.name'],
              launch_date: e.response.data.error.errors['mission.launch_details.launch_date'],
              launch_location_latitude: e.response.data.error.errors['mission.launch_details.launch_site.location.latitude'],
              launch_location_longitude: e.response.data.error.errors['mission.launch_details.launch_site.location.longitude'],
              landing_name: e.response.data.error.errors['mission.landing_details.landing_site.name'],
              landing_date: e.response.data.error.errors['mission.landing_details.landing_date'],
              landing_coordinates_latitude: e.response.data.error.errors['mission.landing_details.landing_site.coordinates.latitude'],
              landing_coordinates_longitude: e.response.data.error.errors['mission.landing_details.landing_site.coordinates.longitude'],
              lunar_module: e.response.data.error.errors['mission.spacecraft.lunar_module'],
              command_module: e.response.data.error.errors['mission.spacecraft.command_module'],
              crew: crewErrors,
              crewArr: e.response.data.error.errors['mission.spacecraft.crew'],
            })

            setIsLoading(false)
          }
        }
      }
    }
  }

  const handleCrewErrors = function (newErrors: {
    [key: string]: string[]
  }) {
    const crewErrors: FormData['crew'] = [];

    Object.keys(newErrors)
      .filter(key => key.startsWith('mission.spacecraft.crew'))
      .forEach(key => {
          const indexAndTypeErr = key.replace('mission.spacecraft.crew.', '').split('.')
          const index = Number(indexAndTypeErr[0]);
          const typeErr = indexAndTypeErr[1] as keyof FormData['crew'][0];
          const err: string = newErrors[key][0];

          crewErrors[index] = {...crewErrors[index], [typeErr]: err}
        }
      )

    return crewErrors
  }

  const onFormStateChange = function <T extends keyof FormData>(key: T, value: FormData[T]) {
    setFormState({...formState, [key]: value})
  }

  const handleCrewChange = (index: number, field: keyof FormData['crew'][0], value: string) => {
    const newCrew = [...formData.crew];
    newCrew[index] = {
      ...newCrew[index],
      [field]: value
    };
    onFormStateChange('crew', newCrew);
  }

  const addCrewMember = () => {
    onFormStateChange('crew', [...formData.crew, {name: '', role: ''}]);
  }

  const removeCrewMember = (index: number) => {
    const newCrew = [...formData.crew];
    newCrew.splice(index, 1);
    onFormStateChange('crew', newCrew);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="form">
        <h1>Изменить миссию</h1>
        <button type={"button"} onClick={() => navigate('/missions')} className="btn">К списку миссий</button>
        <div className="inputBx">
          <label htmlFor="name">Название миссии</label>
          <input className={'input'} value={formData.name}
                 onChange={(e) => onFormStateChange('name', e.target.value)}
                 placeholder={"Название миссии"} id={"name"} type="text"/>
          <Error>{errors.name}</Error>
        </div>
        <div className="inputBx">
          <label htmlFor="launch_date">Начало полёта</label>
          <input className={'input'} value={formData.launch_date}
                 onChange={(e) => onFormStateChange('launch_date', e.target.value)}
                 placeholder={"Начало полёта"} id={"launch_date"} type="date"/>
          <Error>{errors.launch_date}</Error>
        </div>
        <div className="inputBx">
          <label htmlFor="landing_date">Конец полёта</label>
          <input className={'input'} value={formData.landing_date}
                 onChange={(e) => onFormStateChange('landing_date', e.target.value)}
                 placeholder={"Конец полёта"} id={"landing_date"} type="date"/>
          <Error>{errors.landing_date}</Error>
        </div>

        <div className="inputBx">
          <label htmlFor="launch_name">Место запуска</label>
          <input className={'input'} value={formData.launch_name}
                 onChange={(e) => onFormStateChange('launch_name', e.target.value)}
                 placeholder={"Место запуска"} id={"launch_name"} type="text"/>
          <Error>{errors.launch_name}</Error>
        </div>
        <div className="inputBx">
          <label htmlFor="landing_name">Место посадки</label>
          <input className={'input'} value={formData.landing_name}
                 onChange={(e) => onFormStateChange('landing_name', e.target.value)}
                 placeholder={"Место посадки"} id={"landing_name"} type="text"/>
          <Error>{errors.landing_name}</Error>
        </div>

        <div className="inputBx">
          <label htmlFor="launch_location_latitude">Широта места старта</label>
          <input className={'input'} value={formData.launch_location_latitude}
                 onChange={(e) => onFormStateChange('launch_location_latitude', Number(e.target.value))}
                 placeholder={"Широта места старта"} id={"launch_location_latitude"} type="number"/>
          <Error>{errors.launch_location_latitude}</Error>
        </div>
        <div className="inputBx">
          <label htmlFor="launch_location_longitude">Долгота места старта</label>
          <input className={'input'} value={formData.launch_location_longitude}
                 onChange={(e) => onFormStateChange('launch_location_longitude', Number(e.target.value))}
                 placeholder={"Долгота места старта"} id={"launch_location_longitude"} type="number"/>
          <Error>{errors.launch_location_longitude}</Error>
        </div>

        <div className="inputBx">
          <label htmlFor="landing_coordinates_latitude">Широта места посадки</label>
          <input className={'input'} value={formData.landing_coordinates_latitude}
                 onChange={(e) => onFormStateChange('landing_coordinates_latitude', Number(e.target.value))}
                 placeholder={"Широта места посадки"} id={"landing_coordinates_latitude"} type="number"/>
          <Error>{errors.landing_coordinates_latitude}</Error>
        </div>
        <div className="inputBx">
          <label htmlFor="landing_coordinates_longitude">Долгота места посадки</label>
          <input className={'input'} value={formData.landing_coordinates_longitude}
                 onChange={(e) => onFormStateChange('landing_coordinates_longitude', Number(e.target.value))}
                 placeholder={"Долгота места посадки"} id={"landing_coordinates_longitude"} type="number"/>
          <Error>{errors.landing_coordinates_longitude}</Error>
        </div>

        <div className="inputBx">
          <label htmlFor="lunar_module">Лунный модуль</label>
          <input className={'input'} value={formData.lunar_module}
                 onChange={(e) => onFormStateChange('lunar_module', e.target.value)}
                 placeholder={"Лунный модуль"} id={"lunar_module"} type="text"/>
          <Error>{errors.lunar_module}</Error>
        </div>
        <div className="inputBx">
          <label htmlFor="command_module">Командный модуль</label>
          <input className={'input'} value={formData.command_module}
                 onChange={(e) => onFormStateChange('command_module', e.target.value)}
                 placeholder={"Командный модуль"} id={"command_module"} type="text"/>
          <Error>{errors.command_module}</Error>
        </div>

        <div className="crew-section">
          <h3>Экипаж</h3>
          <Error>{errors.crewArr}</Error>
          {formData.crew.map((member, index) => (
            <div key={index} className="crew-member">
              <div className="inputBx">
                <label htmlFor={`crew-name-${index}`}>Имя члена экипажа</label>
                <input className={'input'}
                       id={`crew-name-${index}`}
                       type="text"
                       value={member.name}
                       onChange={(e) => handleCrewChange(index, 'name', e.target.value)}
                       placeholder="Имя"
                />
                <Error>{errors.crew?.[index]?.name}</Error>
              </div>
              <div className="inputBx">
                <label htmlFor={`crew-role-${index}`}>Роль</label>
                <input className={'input'}
                       id={`crew-role-${index}`}
                       type="text"
                       value={member.role}
                       onChange={(e) => handleCrewChange(index, 'role', e.target.value)}
                       placeholder="Роль"
                />
                <Error>{errors.crew?.[index]?.role}</Error>
              </div>
              <button
                type="button"
                onClick={() => removeCrewMember(index)}
                className="btn btn-danger"
              >
                Удалить
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCrewMember}
            className="btn btn-secondary"
          >
            Добавить члена экипажа
          </button>
        </div>

        <button disabled={isLoading} className={"btn"}>
          {isLoading ? "Изменяем..." : "Изменить"}
        </button>
      </form>
    </>
  );
}