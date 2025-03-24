import {useEffect, useState} from "react";
import {API, SearchData} from "../../../shared/api/api.ts";
import Loading from "../../../shared/components/Loading";

export default function SearchPage() {
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState<null | SearchData>(null);
  const [query, setQuery] = useState("");

  const search = () =>
    API.searchFlights(query)
      .then(res => {
        if (res.status !== 200)
          throw res;
        setSearchData(res.data);
        setLoading(false)
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });

  useEffect(() => {
    search()
  }, [])

  if (loading)
    return <Loading/>

  return (
    <>
      <h1>Поиск по названию миссии и имени участников</h1>
      <div>
        <input value={query}
               onChange={e => setQuery(e.target.value)}
               className={"input"} type="text"/>
        <button onClick={() => search()} className={"btn"}>Искать</button>
      </div>
      <div>
        {
          searchData?.map((item, i) => (
            <div key={i}>
              <h2>{item.name}</h2>
              <p>{item.landing_site}</p>
              <p>{item.landing_date}</p>
              <p>Участники: {item.crew.map(cosmonaut =>
                cosmonaut.role + ' - ' + cosmonaut.name
              )
                .join(', ')
              }
              </p>
            </div>
          ))
        }
      </div>
    </>
  );
}