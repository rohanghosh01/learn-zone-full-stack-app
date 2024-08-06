import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Feed {
  id: string;
  [key: string]: any; // Dynamic key-value pairs
}

export interface sliceState {
  user: Object | null;
  profileId: any | null;
  feeds: Feed[];
}

const initialState: sliceState = {
  user: null,
  profileId: null,
  feeds: [],
};

export const nextSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Object | null>) => {
      state.user = action.payload;
    },
    setProfileInfo: (state, action: PayloadAction<any | null>) => {
      state.profileId = action.payload;
    },
    createFeed: (state, action: PayloadAction<Feed>) => {
      state.feeds.push(action.payload);
    },
    updateFeed: (state, action: PayloadAction<Feed>) => {
      const index = state.feeds.findIndex(
        (feed) => feed.id === action.payload.id
      );
      if (index !== -1) {
        state.feeds[index] = action.payload;
      }
    },
    deleteFeed: (state, action: PayloadAction<string>) => {
      state.feeds = state.feeds.filter((feed) => feed.id !== action.payload);
    },
    SetFeeds: (state, action: PayloadAction<any | null>) => {
      state.feeds = action.payload;
    },
    addFeed: (state, action: PayloadAction<any | null>) => {
      state.feeds = [...state.feeds, action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUser,
  setProfileInfo,
  createFeed,
  updateFeed,
  deleteFeed,
  SetFeeds,
  addFeed,
} = nextSlice.actions;

export default nextSlice.reducer;
