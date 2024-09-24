import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userDetails: localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))
    : null,
  airports: localStorage.getItem('airports')
    ? JSON.parse(localStorage.getItem('airports'))
    : [],
  airlines: localStorage.getItem('airlines')
    ? JSON.parse(localStorage.getItem('airlines'))
    : [],
  flights: localStorage.getItem('flights')
    ? JSON.parse(localStorage.getItem('flights'))
    : [],
  schedules: localStorage.getItem('schedules')
    ? JSON.parse(localStorage.getItem('schedules'))
    : [],
  activities: localStorage.getItem('activities')
    ? JSON.parse(localStorage.getItem('activities'))
    : [],
  allActivities: localStorage.getItem('allActivities')
    ? JSON.parse(localStorage.getItem('allActivities'))
    : [],

  search: { isSearched: false, searchSchedules: [] },
  searchBookings: { isSearched: false, searchSchedules: [] },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_UP':
      return { ...state, userDetails: action.payload };
    case 'SIGN_IN':
      return { ...state, userDetails: action.payload };
    case 'SIGN_OUT':
      return {
        ...state,
        userDetails: null,
        airports: [],
        airlines: [],
        flights: [],
        schedules: [],
        activities: [],
      };
    case 'ADD_AIRPORT':
      return { ...state, airports: action.payload };
    case 'ADD_AIRLINES':
      return { ...state, airlines: action.payload };
    case 'ADD_FLIGHTS':
      return { ...state, flights: action.payload };
    case 'ADD_SCHEDULES':
      return { ...state, schedules: action.payload };
    case 'ADD_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'ADD_ALL_ACTIVITIES':
      return { ...state, allActivities: action.payload };

    case 'SEARCH':
      return {
        ...state,
        search: {
          isSearched: action.payload.isSearch,
          searchSchedules: action.payload.searchSchedules,
        },
      };
    case 'SEARCH_BOOKINGS':
      return {
        ...state,
        searchBookings: {
          isSearched: action.payload.isSearch,
          searchSchedules: action.payload.searchSchedules,
        },
      };
    default:
      return state;
  }
};

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}> {props.children} </Store.Provider>;
}
