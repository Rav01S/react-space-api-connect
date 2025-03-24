import {FormEvent, useState} from "react";
import Error from "../../../shared/components/Error";
import {API} from "../../../shared/api/api.ts";
import {AxiosError} from "axios";

type FormData = {
  email: string;
  password: string;
}

const initialState = {
  email: "",
  password: "",
}

export default function LoginPage() {
  const [formState, setFormState] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const formData = {
    ...initialState,
    ...formState,
  }

  const onFormStateChange = function <T extends keyof FormData>(key: T, value: FormData[T]) {
    setFormState({...formState, [key]: value});
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({});

    try {
      const res = await API.authorization(formData);
      if (res.status !== 200) {
        throw res;
      }
      localStorage.setItem('token', res.data.data.token)

      alert('Успешный вход');

      setIsLoading(false)
      window.location.reload();
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
      <h1>Вход</h1>
      <div className="inputBx">
        <label htmlFor="email">Email</label>
        <input value={formData.email}
               onChange={(e) => onFormStateChange('email', e.target.value)}
               className={"input"} id={"email"} type="email" placeholder={"Email"}/>
        <Error>{errors?.email}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="password">Пароль</label>
        <input value={formData.password}
               onChange={(e) => onFormStateChange('password', e.target.value)}
               className={"input"} id={"password"} type="password" placeholder={"Пароль"}/>
        <Error>{errors?.password}</Error>
      </div>
      <button disabled={isLoading} className="btn">
        {isLoading ? "Входим..." : "Войти"}
      </button>
    </form>
  );
}