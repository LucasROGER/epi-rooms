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
    }, 4000);

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

  return (
      <div className={styles.container} style={{backgroundColor: '#1f1f1f'}}>
        <head>
          <title>EpiRooms</title>
          <meta name="description" content="Room tracker" />
          <link rel="icon" href="./assets/icon.ico" />
        </head>

        <main className={styles.container} >

          <div className={styles.plan} >

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


          <div style={{flex: 1, display: "flex", flexDirection: "column"}}>

            <h1 className={styles.date} suppressHydrationWarning style={{textAlign: 'center', color: 'white', margin: '0', position: "absolute", top: 0, left: 0}}>{moment(displayDate).format('DD MMMM YYYY')}</h1>
            <h1 className={styles.time} suppressHydrationWarning style={{textAlign: 'center', color: 'white', margin: '0', position: "absolute", left: 0}}>{moment(displayDate).format('HH:mm:ss')}</h1>
            {/*<h2 suppressHydrationWarning style={{textAlign: 'center', color: 'white', fontSize: '1.75vw', margin: '0', marginBottom: 10}}>(Contact: lucas1.roger@epitech.eu) (Disponible sur: <span style={{textDecoration: "underline", color: 'yellow'}}>lroger.alwaysdata.net</span>)</h2>*/}

            <div id={"scrollList"} style={{flex: 1, flexDirection: "row", overflowY: "scroll", maxHeight: '100vh', scrollBehavior: "smooth"}}>
              {

                Array.from(ROOMS).map((item, i) =>   {
                  if (i % 2 === 1) {
                    return <></>;
                  } else {

                    if (!activities) return <></>;

                    return (
                      <div key={ROOMS[i].roomId + "_" + i} style={{display: "flex", flexDirection: "row"}}>
                        <Room roomName={ROOMS[i]?.displayName} date={displayDate} activity={activities[ROOMS[i].intraName][0] ?? undefined} state={getState(date, activities[ROOMS[i].intraName][0]?.start)} style={{height: $('#scrollList').height() / 5}}/>
                        {i + 1 < ROOMS.length && <Room key={ROOMS[i + 1].roomId + "_" + (i + 1)} roomName={ROOMS[i + 1]?.displayName}
                               date={displayDate} activity={activities[ROOMS[i + 1].intraName][0] ?? undefined} state={getState(date, activities[ROOMS[i + 1].intraName][0]?.start)} style={{height: $('#scrollList').height() / 5}}/>}
                        <div id={"scroll_" + i} />
                      </div>
                    );
                  }
                })
              }
            </div>
          </div>

          {/*<div style={{width: '100%', height: '90%'}}>*/}
          {/*  {*/}
          {/*    Array.from(Array(SCHOOL_SIZE.height)).map((e, i) => {*/}
          {/*      let width = (100 / SCHOOL_SIZE.width - 1) + '%';*/}
          {/*      return (*/}
          {/*          <div key={'row' + i} style={{display: "flex", justifyContent: "space-around", height: (100 / SCHOOL_SIZE.height - 1) + '%', marginBottom: 10}}>*/}
          {/*            {*/}
          {/*              Array.from(
          Array(SCHOOL_SIZE.width)).map((f, j) => {*/}
          {/*                if (j === 0 && i === 0) {*/}
          {/*                  return (*/}
          {/*                      <div key={'' + i + ',' + j} style={{width: width, height: '100%', justifyContent: "center", display: "flex", flexDirection: "column"}}>*/}
          {/*                        <Caption color={STATES['free']} text={'Libre'} />*/}
          {/*                        <Caption color={STATES['soonTaken']} text={'Bientôt occupé (< 2h)'} />*/}
          {/*                        <Caption color={STATES['taken']} text={'Occupé'} />*/}
          {/*                      </div>*/}
          {/*                  )*/}
          {/*                }*/}

          {/*                let room = ROOMS.get('' + j + ',' + i);*/}
          {/*                let a = activities && room ? activities[room][0] : undefined;*/}
          {/*                return <Room key={"room" + j + ',' + i} fakeRoom={room === undefined} state={getState(date, a?.start)} activity={a} roomName={room} date={date} style={{width: width, height: room === 'Knuth' ? '204%' : '100%'}} />;*/}
          {/*              })*/}
          {/*            }*/}
          {/*          </div>*/}
          {/*      )*/}
          {/*    })*/}
          {/*  }*/}
          {/*</div>*/}

          <div className={styles.qrcode} style={{position: "absolute", left: 0, bottom: 0, flexDirection: "row", alignItems: "flex-end"}}>
            <QRCode value={"lroger.alwaysdata.net"} size={128}/>
            <p style={{color: "white", fontSize: 10}}>(eh, viens sur mobile, c'est mieux !)</p>
          </div>
        </main>
      </div>
  )
}

export default App;
