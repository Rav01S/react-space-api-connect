import {Link} from "react-router-dom";

export default function Header() {
  const isAuthed = !!localStorage.getItem("token");

  return (
    <header>
      <div className="container">
        <div className="header__logo">Logo</div>
        <nav className="header__nav">
          <ul className="header__nav-list">
            {
              isAuthed ? <>
                <li className="header__nav-item">
                  <Link to={"/gagarin"} className="header__nav-link">
                    Гагарин
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to={"/missions"} className="header__nav-link">
                    Миссии
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to={"/races"} className="header__nav-link">
                    Рейсы
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to={"/search"} className="header__nav-link">
                    Поиск
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to={"/watermark"} className="header__nav-link">
                    Заказы на луне
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to={"/logout"} className="header__nav-link">
                    Выход
                  </Link>
                </li>
              </> : <>
                <li className="header__nav-item">
                  <Link to={"/login"} className="header__nav-link">
                    Войти
                  </Link>
                </li>
                <li className="header__nav-item">
                  <Link to={"/register"} className="header__nav-link">
                    Регистрация
                  </Link>
                </li>
              </>
            }
          </ul>
        </nav>
      </div>
    </header>
  );
}