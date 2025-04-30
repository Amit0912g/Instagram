import { createSlice } from "@reduxjs/toolkit";

const postSlice= createSlice({
    name:"post",
    initialState:{
        posts:[],
        selecetedPost:null,
        bookmark:[]
    },
    reducers:{
        setPosts:(state,action)=>{
            state.posts=action.payload
        },
        setSelectedPost:(state,action)=>{
            state.selecetedPost=action.payload
        },
        setSelectedBookmark:(state,action)=>{
            state.bookmark=action.payload
        }
    }
})

 export const {setPosts,setSelectedPost,setSelectedBookmark} = postSlice.actions

 export default postSlice.reducer