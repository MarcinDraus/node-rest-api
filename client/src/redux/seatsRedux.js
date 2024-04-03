import axios from 'axios';
import { API_URL } from '../config';

/* SELECTORS */
export const getSeats = ({ seats }) => seats.data;
export const getRequests = ({ seats }) => seats.requests;

/* ACTIONS */

// action name creator
const reducerName = 'seats';
const createActionName = name => `app/${reducerName}/${name}`;

const START_REQUEST = createActionName('START_REQUEST');
const END_REQUEST = createActionName('END_REQUEST');
const ERROR_REQUEST = createActionName('ERROR_REQUEST');

const LOAD_SEATS = createActionName('LOAD_SEATS');
const ADD_SEAT = createActionName('ADD_SEAT');

export const startRequest = payload => ({ payload, type: START_REQUEST });
export const endRequest = payload => ({ payload, type: END_REQUEST });
export const errorRequest = payload => ({ payload, type: ERROR_REQUEST });

export const loadSeats = payload => ({ payload, type: LOAD_SEATS });
export const addSeat = payload => ({ payload, type: ADD_SEAT });

/* THUNKS */

export const loadSeatsRequest = () => {
  return async dispatch => {

    dispatch(startRequest({ name: 'LOAD_SEATS' }));
    try {

      let res = await axios.get(`${API_URL}/seats`);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      dispatch(loadSeats(res.data));
      dispatch(endRequest({ name: 'LOAD_SEATS' }));

    } catch(e) {
      dispatch(errorRequest({ name: 'LOAD_SEATS', error: e.message }));
    }

  };
};
export const addSeatRequest = (seat) => {
  return async dispatch => {
    dispatch(startRequest({ name: 'ADD_SEAT' }));
    try {
      const res = await axios.post(`${API_URL}/seats`, seat);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(addSeat(res));
      dispatch(endRequest({ name: 'ADD_SEAT' }));
      return { error: null }; // Zwracamy pusty obiekt w przypadku sukcesu
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data && error.response.data.message === "The slot is already taken...") {
        dispatch(errorRequest({ name: 'ADD_SEAT', error: "The slot is already taken..." }));
        return { error: "The slot is already taken..." }; // Zwracamy błąd w przypadku zajętego miejsca
      } else {
        dispatch(errorRequest({ name: 'ADD_SEAT', error: error.message }));
        return { error: error.message }; // Zwracamy inny błąd w przypadku innej sytuacji
      }
    }
  };
};



/* INITIAL STATE */

const initialState = {
  data: [],
  requests: {},
};

/* REDUCER */

export default function reducer(statePart = initialState, action = {}) {
  switch (action.type) {
    case LOAD_SEATS: 
      return { ...statePart, data: [...action.payload] };
    case ADD_SEAT: 
      return { ...statePart, data: [...statePart.data, action.payload] }
    case START_REQUEST:
      return { ...statePart, requests: {...statePart.requests, [action.payload.name]: { pending: true, error: null, success: false }} };
    case END_REQUEST:
      return { ...statePart, requests: { ...statePart.requests, [action.payload.name]: { pending: false, error: null, success: true }} };
    case ERROR_REQUEST:
      return { ...statePart, requests: { ...statePart.requests, [action.payload.name]: { pending: false, error: action.payload.error, success: false }} };
    default:
      return statePart;
  }
}
