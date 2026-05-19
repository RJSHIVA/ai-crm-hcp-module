import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://ai-crm-hcp-module-2cgd.onrender.com/api";

export const fetchInteractions = createAsyncThunk(
  "interactions/fetchAll",
  async () => {
    const response = await axios.get(`${API_URL}/interactions/`);
    return response.data;
  },
);

export const createInteraction = createAsyncThunk(
  "interactions/create",
  async (data) => {
    const response = await axios.post(`${API_URL}/interactions/`, data);
    return response.data;
  },
);

export const updateInteraction = createAsyncThunk(
  "interactions/update",
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/interactions/${id}`, data);
    return response.data;
  },
);

export const deleteInteraction = createAsyncThunk(
  "interactions/delete",
  async (id) => {
    await axios.delete(`${API_URL}/interactions/${id}`);
    return id;
  },
);

export const sendAgentMessage = createAsyncThunk(
  "interactions/agentChat",
  async ({ message, conversation_history }) => {
    const response = await axios.post(`${API_URL}/agent/chat`, {
      message,
      conversation_history,
    });
    return response.data;
  },
);

const interactionSlice = createSlice({
  name: "interactions",
  initialState: {
    list: [],
    loading: false,
    error: null,
    agentResponse: null,
    chatHistory: [],
  },
  reducers: {
    addChatMessage: (state, action) => {
      state.chatHistory.push(action.payload);
    },
    clearChat: (state) => {
      state.chatHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createInteraction.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateInteraction.fulfilled, (state, action) => {
        const index = state.list.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteInteraction.fulfilled, (state, action) => {
        state.list = state.list.filter((i) => i.id !== action.payload);
      })
      .addCase(sendAgentMessage.fulfilled, (state, action) => {
        state.agentResponse = action.payload.response;
      });
  },
});

export const { addChatMessage, clearChat } = interactionSlice.actions;
export default interactionSlice.reducer;
