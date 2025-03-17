import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk<{ users: User[]; keyword: string }, string>(
    "user/fetchUsers",
    async (query) => {
        const res = await fetch(`https://api.github.com/search/users?q=${query}`);
        const data = await res.json();
        return { users: data.items.slice(0, 5) as User[], keyword: query };
    }
);


export const fetchUserDetail = createAsyncThunk("user/fetchUserDetail", async (username: string) => {
    const res = await fetch(`https://api.github.com/users/${username}/repos`);
    return res.json();
});

interface User {
    id: number;
    login: string;
}

interface Repository {
    id: number;
    name: string;
    description: string;
    stargazers_count: number;
}

interface UserState {
    keyword     : string | "";
    users       : User[];
    repositories: Repository[];
    loading     : boolean;
    error       : string | null;
}

const initialState: UserState = {
    keyword     : "",
    users       : [],
    repositories: [],
    loading     : false,
    error       : null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserDetail: (state) => {
            state.repositories = [];
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<{ keyword: string, users: User[] }>) => {
            state.loading = false;
            state.keyword = action.payload.keyword;
            state.users = action.payload.users;
        })
        .addCase(fetchUsers.rejected, (state) => {
            state.loading = false;
            state.error = "Failed to fetch users";
        })

        // detail user
        .addCase(fetchUserDetail.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchUserDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.repositories = action.payload;
        })
        .addCase(fetchUserDetail.rejected, (state) => {
            state.loading = false;
            state.error = "Failed to fetch user detail";
        });
    },
});

export const { clearUserDetail } = userSlice.actions;
export default userSlice.reducer;
