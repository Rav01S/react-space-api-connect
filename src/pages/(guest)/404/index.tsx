import {useNavigate} from "react-router-dom";

export default function Page404() {
  const navigate = useNavigate();

  return (
    <>
      <h1>404 Ошибка - Страница не найдена</h1>
      <button className="btn" onClick={() => navigate('/')}>На главную</button>
    </>
  );
}