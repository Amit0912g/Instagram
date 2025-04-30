import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookmarks: [], 
};

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    setBookmarks: (state, action) => {
      state.bookmarks = action.payload;
    },
    toggleBookmark: (state, action) => {
      const postId = action.payload;
      if (state.bookmarks.includes(postId)) {
        state.bookmarks = state.bookmarks.filter(id => id !== postId);
      } else {
        state.bookmarks.push(postId);
      }
    }
  },
});

export const { setBookmarks, toggleBookmark } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
