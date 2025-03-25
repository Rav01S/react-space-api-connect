import {FormEvent, useState} from "react";
import {API} from "../../../shared/api/api.ts";
import {AxiosError} from "axios";
import Error from "../../../shared/components/Error";

type FormData = {
  fileList: FileList | null,
  text: string
}

const initialState = {
  fileList: null,
  text: ''
}

export default function LunarWatermarkPage() {
  const [formState, setFormState] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<{ [key in keyof FormData]: string }>>({});

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
      const res = await API.createWatermark({text: formData.text, file: formData.fileList?.[0] || null});
      if (res.status !== 200) {
        throw res;
      }

      alert(res.data.message);
      setIsLoading(false);
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response && 'error' in e.response.data) {
          if ('errors' in e.response.data.error) {
            setErrors(e.response.data.error.errors)
          }
        }
        alert(e.message)
      }
      setIsLoading(false)
    }

  }

  return (
    <form className={"form"} onSubmit={onSubmit}>
      <h1>Добавление водяного знака</h1>
      <div className="inputBx">
        <label htmlFor="email">Файл</label>
        <input onChange={(e) => onFormStateChange('fileList', e.target.files)}
               className={"input"} id={"fileList"} type="file" placeholder={"Файл"}/>
        <Error>{errors?.fileList}</Error>
      </div>
      <div className="inputBx">
        <label htmlFor="text">Текст</label>
        <input value={formData.text}
               onChange={(e) => onFormStateChange('text', e.target.value)}
               className={"input"} id={"text"} type="text" placeholder={"Текст"}/>
        <Error>{errors?.text}</Error>
      </div>
      <button disabled={isLoading} className="btn">
        {isLoading ? "Делаем подпись..." : "Сделать подпись"}
      </button>
    </form>
  );
}