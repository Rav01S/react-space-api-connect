import {axiosClient} from "../libs/axiosClient.tsx";

export type AuthPayload = {
  email: string;
  password: string;
}

export type RegisterPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  birth_date: string;
}

export type MissionUpdatePayload = {
  name: string,
  launch_date: string,
  launch_name: string,
  launch_location_latitude: number,
  launch_location_longitude: number,
  landing_date: string,
  landing_name: string,
  landing_coordinates_latitude: number,
  landing_coordinates_longitude: number,
  crew:
    {
      name: string,
      role: string
    }[]
  lunar_module: string,
  command_module: string
}

export type MissionAddPayload = {
  name: string,
  launch_date: string,
  launch_name: string,
  launch_location_latitude: number,
  launch_location_longitude: number,
  landing_date: string,
  landing_name: string,
  landing_coordinates_latitude: number,
  landing_coordinates_longitude: number,
  crew:
    {
      name: string,
      role: string
    }[]
  lunar_module: string,
  command_module: string
}

export type RacesAddPayload = {
  flight_number: string,
  seats_available: number,
  launch_date: string,
  destination: string
}

export const API = {
  authorization: (values: AuthPayload) =>
    axiosClient.post('/authorization', values),

  registration: (values: RegisterPayload) =>
    axiosClient.post('/registration', values),

  logout: () =>
    axiosClient.get('/logout'),

  getGagarin: () =>
    axiosClient.get<GagarinData>('/api/gagarin-flight'),

  getMissions: () =>
    axiosClient.get<MissionsData>('/lunar-missions'),

  deleteMission: (id: number) =>
    axiosClient.delete(`/lunar-missions/${id}`),

  updateMission: (id: number | string, values: MissionUpdatePayload) =>
    axiosClient.patch(`/lunar-missions/${id}`, values),

  addMission: (values: MissionAddPayload) =>
    axiosClient.post(`/lunar-missions`, {
      mission: {
        name: values.name,
        launch_details: {
          launch_date: values.launch_date,
          launch_cite: {
            name: values.launch_name,
            location: {
              latitude: values.launch_location_latitude,
              longitude: values.launch_location_longitude,
            }
          }
        },
        landing_details: {
          landing_date: values.landing_date,
          landing_cite: {
            name: values.landing_name,
            coordinates: {
              latitude: values.landing_coordinates_latitude,
              longitude: values.landing_coordinates_longitude,
            }
          }
        },
        spacecraft: {
          command_module: values.command_module,
          lunar_module: values.lunar_module,
          crew: values.crew
        }
      }
    }),

  getRaces: () =>
    axiosClient.get<RacesData>('/space-flights'),

  bookFlight: (flight_number: string) =>
    axiosClient.post(`/book-flight/`, {flight_number}),

  addRace: (values: RacesAddPayload) =>
    axiosClient.post(`/space-flights/`, values),

  searchFlights: (query: string) =>
    axiosClient.get(`/search?Query=${query}`),
}

export type SearchData = {
  "type": "Миссия",
  "name": "Бугуруслан2",
  "launch_date": "1972-12-07",
  "landing_date": "1972-12-09",
  "crew": [
    {
      "name": "Евгений Сернан",
      "role": "Командир"
    },
    {
      "name": "Харрисон Шмитт",
      "role": "Пилот лунного модуля"
    },
    {
      "name": "Рональд Эванс",
      "role": "Пилот командного модуля"
    }
  ],
  "landing_site": "Телец-Литтров"
}[]

export type RacesData = {
  "flight_number": "СФ-110",
  "destination": "Марс",
  "launch_date": "2025-05-15",
  "seats_available": 4
}[]

export type GagarinData = {
  "data": [
    {
      "mission": {
        "name": "Восток 1",
        "launch_details": {
          "launch_date": "1961-04-12",
          "launch_site": {
            "name": "Космодром Байконур",
            "location": {
              "latitude": "45.9650000",
              "longitude": "63.3050000"
            }
          }
        },
        "flight_duration": {
          "hours": 1,
          "minutes": 48
        },
        "spacecraft": {
          "name": "Восток 3КА",
          "manufacturer": "ОКВ-1",
          "crew_capacity": 1
        }
      },
      "landing": {
        "date": "1961-04-12",
        "site": {
          "name": "Смеловка",
          "country": "СССР",
          "coordinates": {
            "latitude": "51.2700000",
            "longitude": "45.9970000"
          }
        },
        "details": {
          "parachute_landing": true,
          "impact_velocity_mps": 7
        }
      },
      "cosmonaut": {
        "name": "Юрий Гагарин",
        "birthdate": "1934-03-09",
        "rank": "Старший лейтенант",
        "bio": {
          "early_life": "Родился в Клушино, Россия.",
          "career": "Отобран в отряд космонавтов в 1960 году...",
          "post_flight": "Стал международным героем."
        }
      }
    }
  ]
}

export type MissionsData = {
  "mission": {
    "id": 1,
    "name": "Бугуруслан",
    "launch_details": {
      "launch_date": "1972-12-07",
      "launch_site": {
        "name": "Космический центр имени Кеннеди",
        "location": {
          "latitude": 28.5721,
          "longitude": -80.648
        }
      }
    },
    "landing_details": {
      "landing_date": "1972-12-09",
      "landing_site": {
        "name": "Телец-Литтров",
        "coordinates": {
          "latitude": 20.1908,
          "longitude": 30.7717
        }
      }
    },
    "spacecraft": {
      "crew": [
        {
          "name": "Евгений Сернан",
          "role": "Командир"
        },
        {
          "name": "Харрисон Шмитт",
          "role": "Пилот лунного модуля"
        },
        {
          "name": "Рональд Эванс",
          "role": "Пилот командного модуля"
        }
      ],
      "lunar_module": "Челленджер",
      "command_module": "Америка"
    }
  }
}[]