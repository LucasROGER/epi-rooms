import styles from './styles/App.module.css';
import {useEffect, useState} from "react";
import moment from "moment";
import {
  fetchPlanning,
  getDate,
  formatActivities,
  getState,
  ROOMS,
  SCHOOL_SIZE
} from "./utils/utils";
import Room, {STATES} from "./components/Room";
import localization from "moment/locale/fr";
import {Caption} from "./components/Caption";

const App = () => {
  const [activities, setActivities] = useState(undefined);
  const [rawActivities, setRawActivities] = useState(undefined);
  const [date, setDate] = useState(moment().valueOf());
  const [displayDate, setDisplayDate] = useState(moment().valueOf());

  useEffect(() => {
    moment().locale('fr', localization);

    fetchPlanning(getDate()).then((r) => {
      // console.log('fetch1', r);
      setRawActivities(r);
      setDate(getDate());
    }).catch((e) => {
      console.log(e);
    })
  }, []);

  useEffect(() => {
    let planningInterval = setInterval(() => {
      let d = getDate();
      fetchPlanning(d).then((r) => {
        // console.log('fetch2', r);
        setRawActivities(r);
        setDate(d);
      }).catch((e) => {
        console.log(e);
      })
    }, 3600000);

    let refreshInterval = setInterval(() => {
      setDate(getDate());
    }, 10000);

    let timerInterval = setInterval(() => {
      setDisplayDate(getDate());
    })

    return () => {
      clearInterval(planningInterval);
      clearInterval(refreshInterval);
      clearInterval(timerInterval)
    };
  }, []);

  useEffect(() => {
    if (rawActivities) {
      setActivities(formatActivities(rawActivities, date));
    }
  }, [date, rawActivities]);

  return (
      <div className={styles.container} style={{backgroundColor: '#1f1f1f'}}>
        <head>
          <title>EpiRooms</title>
          <meta name="description" content="Room tracker" />
          <link rel="icon" href="./assets/icon.ico" />
        </head>

        <h1 suppressHydrationWarning style={{textAlign: 'center', color: 'white', fontSize: '2vw', margin: '0'}}>{"EpiRooms (Bêta) - " + moment(displayDate).format('DD MMMM YYYY - HH:mm:ss')}</h1>
        <h2 suppressHydrationWarning style={{textAlign: 'center', color: 'white', fontSize: '1.75vw', margin: '0', marginBottom: 10}}>(Contact: lucas1.roger@epitech.eu) (Disponible sur: <span style={{textDecoration: "underline", color: 'yellow'}}>lroger.alwaysdata.net</span>)</h2>

        <main className={styles.container} style={{alignItems: "center", justifyContent: "center"}}>

          <div style={{width: '100%', height: '90%'}}>
            {
              Array.from(Array(SCHOOL_SIZE.height)).map((e, i) => {
                let width = (100 / SCHOOL_SIZE.width - 1) + '%';
                return (
                    <div key={'row' + i} style={{display: "flex", justifyContent: "space-around", height: (100 / SCHOOL_SIZE.height - 1) + '%', marginBottom: 10}}>
                      {
                        Array.from(Array(SCHOOL_SIZE.width)).map((f, j) => {
                          if (j === 0 && i === 0) {
                            return (
                                <div key={'' + i + ',' + j} style={{width: width, height: '100%', justifyContent: "center", display: "flex", flexDirection: "column"}}>
                                  <Caption color={STATES['free']} text={'Libre'} />
                                  <Caption color={STATES['soonTaken']} text={'Bientôt occupé (< 2h)'} />
                                  <Caption color={STATES['taken']} text={'Occupé'} />
                                </div>
                            )
                          }

                          let room = ROOMS.get('' + j + ',' + i);
                          let a = activities && room ? activities[room][0] : undefined;
                          return <Room key={"room" + j + ',' + i} fakeRoom={room === undefined} state={getState(date, a?.start)} activity={a} roomName={room} date={date} style={{width: width, height: room === 'Knuth' ? '204%' : '100%'}} />;
                        })
                      }
                    </div>
                )
              })
            }
          </div>

        </main>
      </div>
  )
}

export default App;
