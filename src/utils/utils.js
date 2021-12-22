import moment from "moment";

export const SCHOOL_SIZE = {
  width: 3,
  height: 4,
}

export const ROOMS = new Map([
  // 'Alcove-Carre',
  // 'Annexe-Hopper',
  // 'Annexe-Quaynor',
  // 'Annexe-Recoque',
  // 'Aqua',
  // 'Aqua-Rium',
  ['2,1', 'Babbage'],
  ['1,1', 'Byron'],
  ['0,2', 'Cray'],
  ['1,0', 'Hamilton'],
  // 'ISEG-Lille',
  ['1,2', 'Knuth'],
  ['2,2', 'Pascal'],
  // 'Rium',
  // 'Salle-sur-demande',
  ['0,3', 'Tesla'],
  ['2,3', 'Turing'],
  // 'Unknown',
  // 'exterieur',
  // 'tout-le-batiment'
]);


const getLocation = (activity) => {
  if (activity.location) {
    return activity?.location?.split('/')?.pop() ?? 'Unknown';
  } else {
    return activity?.room?.code?.split('/')?.pop() ?? 'Unknown';
  }
}

const getTitle = (activity) => {
  if (activity.calendar_type === "asso") {
    return 'Reservation Pédago/EpiClub';
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
  )//.add(40, 'minutes')
    .valueOf();
};

export const formatActivities = (activities, date) => {
  if (activities.length === undefined) return [];
  let newList = activities.filter(isLil)

  let acts = {};
  for (let i = 0; i < newList.length; i++) {
    let room = getLocation(newList[i]);
    if (!Array.from(ROOMS.values()).includes(room)) continue;
    if (!acts[room]) {
      acts[room] = [];
    }

    acts[room].push(createActivity(newList[i]));
  }

  let ordered = {};

  Array.from(ROOMS.values()).forEach((item) => {
    ordered[item] = !acts[item] ? [] : acts[item].sort((a, b) => {
      return a.start - b.start;
    }).filter((i) => {
      return date < i.end;
    });
  });

  console.log(ordered);

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
