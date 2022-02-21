import moment from "moment";

export const STATES = {
  free: '#1faf1f',
  soonTaken: '#dfdf1f',
  taken: '#df1f1f',
};

export const ROOMS = [
  {
    displayName: 'Babbage',
    intraName: 'Babbage',
    roomId: 'Babbage',
    mapName: 'Babbage',
  },
  {
    displayName: 'Byron',
    intraName: 'Byron',
    roomId: 'Byron',
    mapName: 'Byron',
  },
  {
    displayName: 'Cray',
    intraName: 'Cray',
    roomId: 'Cray',
    mapName: 'Cray',
  },
  {
    displayName: 'Hamilton',
    intraName: 'Hamilton',
    roomId: 'Hamilton',
    mapName: 'Hamilton',
  },
  {
    displayName: 'Pascal',
    intraName: 'Pascal',
    roomId: 'Pascal',
    mapName: 'Pascal',
  },
  {
    displayName: 'Tesla/HUB',
    intraName: 'Tesla',
    roomId: 'Tesla',
  },
  {
    displayName: 'Turing',
    intraName: 'Turing',
    roomId: 'Turing',
    mapName: 'Turing',
  },
  {
    displayName: 'Salle sur demande',
    intraName: 'Salle-sur-demande',
    roomId: 'SsD',
    mapName: 'SsD',
  },
  {
    displayName: 'Alcoves',
    intraName: 'Alcove-Carre',
    roomId: 'Alcove1',
    mapName: '1',
  },
  {
    displayName: undefined,
    intraName: 'Alcove-Carre',
    roomId: 'Alcove2',
    mapName: '2',
  },
  {
    displayName: 'Knuth',
    intraName: 'Knuth',
    roomId: 'Knuth',
    mapName: 'Knuth',
  },
];
// export const ROOMS = new Map([
//   // 'Alcove-Carre',
//   // 'Annexe-Hopper',
//   // 'Annexe-Quaynor',
//   // 'Annexe-Recoque',
//   // 'Aqua',
//   // 'Aqua-Rium',
//   ['Babbage', 'Babbage', ],
//   ['Byron', 'Byron'],
//   ['Cray', 'Cray'],
//   ['Hamiton', 'Hamilton'],
//   // 'ISEG-Lille',
//   ['Knuth', 'Knuth'],
//   ['Pascal', 'Pascal'],
//   // 'Rium',
//   // 'Salle-sur-demande',
//   ['Tesla/HUB', 'Tesla'],
//   ['2,3', 'Turing'],
//   // 'Unknown',
//   // 'exterieur',
//   // 'tout-le-batiment'
// ]);


const getLocation = (activity) => {
  if (activity.location) {
    console.log("a: " + activity?.location)
    return activity?.location?.split('/')?.pop() ?? 'Unknown';
  } else {
    console.log("b: " + activity?.room?.code)
    return activity?.room?.code?.split('/')?.pop() ?? 'Unknown';
  }
}

const getTitle = (activity) => {
  if (activity.calendar_type === "asso") {
    return 'Réservation Pédago/EpiClub';
  } else {
    return activity.acti_title ?? 'Untitled'
  }
}

const isLil = (activity) => {
  return activity.instance_location === 'FR/LIL' || activity?.location?.toString()?.startsWith('FR/LIL');
}

const getModule = (activity) => {
  return activity.titlemodule ?? 'No name';
}

const createActivity = (activity) => {
  return {
    title: getTitle(activity),
    end: moment(activity.end).valueOf(),
    start: moment(activity.start).valueOf(),
    titlemodule: getModule(activity),
    codemodule: activity.codemodule,
  };
}

export const fetchPlanning = (date) => {
  let d = moment(date).format('YYYY-MM-DD');

  return fetch(`https://epiroom-max.alwaysdata.net/?date=${d}`)
    .then(async (r) => {
      let planning = await r.json();
      console.log(planning)
      return planning;
    })
    .catch((e) => {
      throw e;
    });
};

export const getDate = () => {
  return moment(
      /*
      '2021-10-18 07:20:00'
      //*/
  )//.add(8, 'hours')
    .valueOf();
};

export const formatActivities = (activities, date) => {
  if (activities.length === undefined) return [];
  let newList = activities.filter(isLil)

  let acts = {};
  for (let i = 0; i < newList.length; i++) {
    let room = getLocation(newList[i]);
    console.log("room: " + room);
    if (!Array.from(ROOMS.values(), (item) => item.intraName).includes(room)) continue;
    if (!acts[room]) {
      acts[room] = [];
    }

    acts[room].push(createActivity(newList[i]));
  }

  let ordered = {};

  Array.from(ROOMS.values(), (item) => item.intraName).forEach((item) => {
    ordered[item] = !acts[item] ? [] : acts[item].sort((a, b) => {
      return a.start - b.start;
    }).filter((i) => {
      return date < i.end;
    });
  });

  // console.log(ordered);

  return ordered;
}

export const getState = (date, start = undefined) => {
  if (start === undefined || moment(date).add(2, 'hours').valueOf() < start) {
    return 'free';
  } else if (date > start) {
    return 'taken';
  } else {
    return 'soonTaken';
  }
}
