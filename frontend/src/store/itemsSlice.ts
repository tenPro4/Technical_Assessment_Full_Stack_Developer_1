import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { itemsApi } from '../services/api';
import { Item, CreateItemDto, UpdateItemDto } from '../types';
import { RootState } from './index';

export const itemsAdapter = createEntityAdapter<Item>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

interface ItemsState {
  loading: boolean;
  error: string | null;
}

const initialState = itemsAdapter.getInitialState<ItemsState>({
  loading: false,
  error: null,
});

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
        itemsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      .addCase(createItem.fulfilled, (state, action) => {
        itemsAdapter.addOne(state, action.payload);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        itemsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        itemsAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteMany.fulfilled, (state, action) => {
        itemsAdapter.removeMany(state, action.payload);
      });
  },
});

export const {
  selectAll: selectAllItems,
  selectById: selectItemById,
  selectIds: selectItemIds,
} = itemsAdapter.getSelectors<RootState>((state) => state.items);

export default itemsSlice.reducer; 