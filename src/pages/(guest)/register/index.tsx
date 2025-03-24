import {useState} from "react";
import Error from "../../../shared/components/Error";
import {API} from "../../../shared/api/api.ts";
import {AxiosError} from "axios";

type FormData = {
  email: string;
  password: string;
  birth_date: string;
  first_name: string;
  last_name: string;
  patronymic: string;
}

const initialState = {
  email: '',
  password: '',
  birth_date: '',
  first_name: '',
  last_name: '',
  patronymic: ''
}

export default function RegisterPage() {
  const [formState, setFormState] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const formData = {
    ...initialState,
    ...formState
  }

  const onFormStateChange = function <T extends keyof FormData>(key: T, value: FormData[T]) {
    setFormState({...formState, [key]: value})
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({});

    try {
      const res = await API.registration(formData)
      if (res.status !== 200) {
        throw res;
      }
      alert('Успешная регистрация');
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


  return (
    <form className={"form"} onSubmit={onSubmit}>
      <h1>Регистрация</h1>
      <div className="inputBx">
        <label htmlFor="last_name">Фамилия</label>
        <input value={formData.last_name}
               onChange={e => onFormStateChange('last_name', e.target.value)}
               className={"input"} id={"last_name"} type="text"
               placeholder={"Фамилия"}/>
        <Error>{errors.last_name}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="first_name">Имя</label>
        <input value={formData.first_name}
               onChange={e => onFormStateChange('first_name', e.target.value)}
               className={"input"} id={"first_name"} type="text"
               placeholder={"Имя"}/>
        <Error>{errors.first_name}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="patronymic">Отчество</label>
        <input value={formData.patronymic}
               onChange={e => onFormStateChange('patronymic', e.target.value)}
               className={"input"} id={"patronymic"} type="text"
               placeholder={"Отчество"}/>
        <Error>{errors.patronymic}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="birth_date">Дата рождения</label>
        <input value={formData.birth_date}
               onChange={e => onFormStateChange('birth_date', e.target.value)}
               className={"input"} id={"birth_date"} type="date"
               placeholder={"Дата рождения"}/>
        <Error>{errors.birth_date}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="email">Email</label>
        <input value={formData.email}
               onChange={e => onFormStateChange('email', e.target.value)}
               className={"input"} id={"email"} type="email" placeholder={"Email"}/>
        <Error>{errors.email}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="password">Пароль</label>
        <input value={formData.password}
               onChange={e => onFormStateChange('password', e.target.value)}
               className={"input"} id={"password"} type="password"
               placeholder={"Пароль"}/>
        <Error>{errors.password}</Error>
      </div>
      <button disabled={isLoading} className="btn">
        {isLoading ? "Регистрируемся..." : "Зарегистрироваться"}
      </button>
    </form>
  );
}