import styles from './styles/App.module.css';
import {useEffect, useState} from "react";
import moment from "moment";
import {
  fetchPlanning,
  getDate,
  formatActivities,
  getState,
  ROOMS,
  STATES,
} from "./utils/utils";
import localization from "moment/locale/fr";
import $ from 'jquery';
import Room from "./components/Room";
import QRCode from "react-qr-code";


const LAYOUT_COLUMNS = 3;

const App = () => {
  const [activities, setActivities] = useState(undefined);
  const [rawActivities, setRawActivities] = useState(undefined);
  const [date, setDate] = useState(moment().valueOf());
  const [displayDate, setDisplayDate] = useState(moment().valueOf());

  useEffect(() => {
    moment().locale('fr', localization);

    fetchPlanning(getDate()).then((r) => {
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
    });

    let scrollPos = 0;
    let scrollInterval = setInterval(() => {
      if (window.innerWidth <= 600) return;
      let scrollList = $("#scrollList");
      scrollPos = scrollPos === 0 ? scrollList.height() : 0;
      scrollList.scrollTop(scrollPos);
    }, 5000);

    return () => {
      clearInterval(planningInterval);
      clearInterval(refreshInterval);
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    if (rawActivities) {
      setActivities(formatActivities(rawActivities, date));

      if (activities) {
        for (let i = 0; i < ROOMS.length; i++) {
          if (activities[ROOMS[i].intraName]) {
            let name = $("#" + ROOMS[i].roomId + " > .name");
            let shape = $("#" + ROOMS[i].roomId + " > .shape");

            shape.attr('fill', STATES[getState(date, activities[ROOMS[i].intraName][0]?.start)]);
            name.text(ROOMS[i].mapName);
            name.attr("fill", "black");
          }
        }
      }
    }
  }, [date, rawActivities]);

  const drawLayout = (i) => {
    let elements = [];

    for (let j = 0; j < LAYOUT_COLUMNS; j++) {
      if (!ROOMS[i + j] || !ROOMS[i + j].displayName) continue;
      elements.push(<Room key={i + "," + j} roomName={ROOMS[i + j]?.displayName} date={displayDate} activity={activities[ROOMS[i + j].intraName][0] ?? undefined} state={getState(date, activities[ROOMS[i + j].intraName][0]?.start)} style={{minHeight: $('#scrollList').height() / 5}}/>)
    }

    return elements;
  };

  return (
      <div className={styles.container} style={{backgroundColor: '#1f1f1f'}}>
        <head>
          <title>EpiRooms</title>
          <meta name="description" content="Room tracker" />
          <link rel="icon" href="./assets/icon.ico" />
        </head>

        <main className={styles.container} >

          <div className={styles.plan}>

            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox={"0 0 100 123"}>

              <g id="Hamilton">
                <rect className={"shape"} x="25" y="1" width="33" height="11" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="41" y="7" fontSize="3" textAnchor="middle" fill="white">Hamilton</text>
              </g>

              <g id="BureauDev">
                <polygon className={"shape"} points="58 1, 80 1, 80 6, 63 16, 58 12" stroke="white" strokeWidth="0.2" />
                <text className={"name"} x="68" y="7" fontSize="2.5" textAnchor="middle" fill="white">Bureau Dev</text>
              </g>

              <g id="Babbage">
                <rect className={"shape"} x="74" y="24" width="17" height="22" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="82.5" y="36" fontSize="3" textAnchor="middle" fill="white">Babbage</text>
              </g>

              <g id="Pascal">
                <rect className={"shape"} x="74" y="46" width="25" height="14" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="87" y="54" fontSize="3" textAnchor="middle" fill="white">Pascal</text>
              </g>

              <g id="Turing">
                <polygon className={"shape"} points="74 60, 74 65, 69 78, 69 82, 99 82, 99 60" stroke="white" strokeWidth="0.2" />
                <text className={"name"} x="85" y="72" fontSize="3" textAnchor="middle" fill="white">Turing</text>
              </g>

              <g id="Aqua">
                <rect className={"shape"} x="74" y="82" width="8" height="7" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="78" y="86" fontSize="2" textAnchor="middle" fill="white">Aqua</text>
              </g>

              <g id="Rium">
                <rect className={"shape"} x="74" y="89" width="8" height="7" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="78" y="93" fontSize="2" textAnchor="middle" fill="white">Rium</text>
              </g>

              <g id="BureauPedago">
                <rect className={"shape"} x="68" y="105" width="11" height="17" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="73.5" y="114" fontSize="2.5" textAnchor="middle" fill="white">Pédago</text>
              </g>

              <g id="Paterson">
                <rect className={"shape"} x="1" y="25" width="17" height="11" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="9.5" y="31" fontSize="3" textAnchor="middle" fill="white">Paterson</text>
              </g>

              <g id="Cray">
                <rect className={"shape"} x="1" y="36" width="17" height="22" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="9.5" y="47" fontSize="3" textAnchor="middle" fill="white">Cray</text>
              </g>

              <g id="Byron">
                <rect className={"shape"} x="31" y="20" width="16" height="20" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="39" y="30" fontSize="3" textAnchor="middle" fill="white">Byron</text>
              </g>

              <g id="Knuth">
                <polygon className={"shape"} points="31 40, 61 40, 61 65, 56 70, 36 70, 31 65" stroke="white" strokeWidth="0.2" />
                <text className={"name"} x="46" y="55" fontSize="3" textAnchor="middle" fill="white">Knuth</text>
              </g>

              <g id="Tesla">
                <polygon className={"shape"} points="1 82, 21 71.5, 37 102, 17 113" stroke="white" strokeWidth="0.2" />
                <text className={"name"} x="19" y="94" fontSize="3" textAnchor="middle" fill="white">Tesla</text>
              </g>

              <g id="SsD">
                <polygon className={"shape"} points="28 107, 37 102, 42 112, 33.5 117" stroke="white" strokeWidth="0.2" />
                <text className={"name"} x="35" y="111" fontSize="3" textAnchor="middle" fill="white">SsD</text>
              </g>

              <g id="Accueil">
                <rect className={"shape"} x="30" y="81" width="15" height="7" stroke="white" strokeWidth="0.2"/>
                <text className={"name"} x="37.5" y="85.5" fontSize="2.5" textAnchor="middle" fill="white">Accueil</text>
              </g>

              <g id="Alcove1">
                <circle className={"shape"} cx={"51"} cy={"36"} r={"3"} stroke={"white"} strokeWidth={"0.2"}/>
                <text className={"name"} x="51" y="37" fontSize="3" textAnchor="middle" fill="white">1</text>
              </g>

              <g id="Alcove2">
                <circle className={"shape"} cx={"70"} cy={"27"} r={"3"} stroke={"white"} strokeWidth={"0.2"}/>
                <text className={"name"} x="70" y="28" fontSize="3" textAnchor="middle" fill="white">2</text>
              </g>

            </svg>

          </div>

          <div className={styles.rooms}>

            <h1 className={styles.date} suppressHydrationWarning style={{textAlign: 'center', color: 'white', margin: '0', position: "absolute", top: 0, left: 0}}>{moment(displayDate).format('DD MMMM YYYY')}</h1>
            <h1 className={styles.time} suppressHydrationWarning style={{textAlign: 'center', color: 'white', margin: '0', position: "absolute", left: 0}}>{moment(displayDate).format('HH:mm:ss')}</h1>

            <div id={"scrollList"} style={{flex: 1, flexDirection: "row", maxHeight: '100vh', scrollBehavior: "smooth"}}>
              {
                Array.from(ROOMS.filter((i) => i.displayName)).map((item, i) =>   {
                  if (i % LAYOUT_COLUMNS !== 0) {
                    return <></>;
                  } else {

                    if (!activities) return <></>;

                    return (
                      <div key={ROOMS[i].roomId + "_" + i} style={{display: "flex", flexDirection: "row"}}>
                        {
                          drawLayout(i)
                        }
                      </div>
                    );
                  }
                })
              }
            </div>
          </div>

          <div className={styles.qrcode} style={{position: "absolute", left: 3, bottom: 3, flexDirection: "row", alignItems: "flex-end"}}>
            <QRCode style={{border: "solid 2px white"}} value={"lroger.alwaysdata.net"} size={128}/>
            <p style={{color: "white", fontSize: 10}}>(eh, viens sur mobile, c'est mieux !)</p>
          </div>
        </main>
      </div>
  )
}

export default App;
