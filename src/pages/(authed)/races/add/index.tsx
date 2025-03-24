import {API} from "../../../../shared/api/api.ts";
import Error from "../../../../shared/components/Error";
import {useNavigate} from "react-router-dom";
import {FormEvent, useState} from "react";
import {AxiosError} from "axios";

type FormData = {
  flight_number: string;
  seats_available: number;
  launch_date: string;
  destination: string;
}

const initialState = {
  flight_number: '',
  seats_available: 1,
  launch_date: '',
  destination: ''
}

export default function RacesAdd() {
  const [formState, setFormState] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const formData = {
    ...initialState,
    ...formState
  }

  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({});

    try {
      const res = await API.addRace(formData);
      if (res.status !== 201) {
        throw res;
      }
      alert('Рейс создан');
      navigate('/races');
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response && 'error' in e.response.data) {
          if ('errors' in e.response.data.error) {
            setErrors(e.response.data.error.errors)
            setIsLoading(false)
          }
        }
      }
    }

  }

  const onFormStateChange = function <T extends keyof FormData>(key: T, value: FormData[T]) {
    setFormState({...formState, [key]: value})
  }

  return (
    <form className={"form"} onSubmit={onSubmit}>
      <h1>Добавление рейса</h1>
      <button type={"button"} onClick={() => navigate('/races')} className="btn">К списку рейсов</button>
      <div className="inputBx">
        <label htmlFor="flight_number">Номер рейса</label>
        <input value={formData.flight_number}
               onChange={e => onFormStateChange('flight_number', e.target.value)}
               className={"input"} id={"flight_number"} type="text" placeholder={"Номер рейса"}/>
        <Error>{errors.flight_number}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="destination">Место назначения</label>
        <input value={formData.destination}
               onChange={e => onFormStateChange('destination', e.target.value)}
               className={"input"} id={"destination"} type="text" placeholder={"Место назначения"}/>
        <Error>{errors.destination}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="launch_date">Дата рейса</label>
        <input value={formData.launch_date}
               onChange={e => onFormStateChange('launch_date', e.target.value)}
               className={"input"} id={"launch_date"} type="date" placeholder={"Дата рейса"}/>
        <Error>{errors.launch_date}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="seats_available">Количество мест</label>
        <input value={formData.seats_available}
               onChange={e => onFormStateChange('seats_available', Number(e.target.value))}
               className={"input"} id={"seats_available"} type="number" placeholder={"Количество мест"}/>
        <Error>{errors.seats_available}</Error>
      </div>
      <button disabled={isLoading} className="btn">
        {isLoading ? "Добавляем" : "Добавить"}
      </button>
    </form>
  );
}