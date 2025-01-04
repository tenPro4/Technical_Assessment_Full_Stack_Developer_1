import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { itemsApi } from '../services/api';
import { Item, CreateItemDto, UpdateItemDto } from '../types';

interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchItems = createAsyncThunk('items/fetchAll', async () => {
  return await itemsApi.getAll();
});

export const createItem = createAsyncThunk(
  'items/create',
  async (data: CreateItemDto) => {
    return await itemsApi.create(data);
  }
);

export const updateItem = createAsyncThunk(
  'items/update',
  async ({ id, data }: { id: number; data: UpdateItemDto }) => {
    return await itemsApi.update(id, data);
  }
);

export const deleteItem = createAsyncThunk(
  'items/delete',
  async (id: number) => {
    await itemsApi.delete(id);
    return id;
  }
);

export const deleteMany = createAsyncThunk(
  'items/deleteMany',
  async (ids: number[]) => {
    await itemsApi.deleteMany(ids);
    return ids;
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteMany.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => !action.payload.includes(item.id));
      });
  },
});

export default itemsSlice.reducer; 