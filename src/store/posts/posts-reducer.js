import * as actionType from "./posts-types";
import {host} from "../utils";

const initialState = {
  host,
  selectedItem: undefined,
  errorMessage: "",
  isLoading: false,
  likes: [],
  comments: []
};

export default function reducer (state, action) {
  state = state || initialState;
  switch (action.type) {
    case actionType.requestType: {
      return {
        ...state,
        errorMessage: "",
        isLoading: true
      };
    }
    case actionType.requestFailedType: {
      return {
        ...state,
        errorMessage: action.errorMessage || 'error.common',
        isLoading: false
      };
    }
    case actionType.receivedItemType: {
      const newItem = action.response;
      return {
        ...state,
        selectedItem: {...newItem, date: newItem.date.slice(0, -9)},
        isLoading: false
      };
    }
    case actionType.receivedCommentsType: {
      return {
        ...state,
        comments: action.response.content,
        isLoading: false
      };
    }
    case actionType.receivedLikesType: {
      return {
        ...state,
        likes: action.response.content,
        isLoading: false
      };
    }
    default: {
      return state;
    }
  }
};
