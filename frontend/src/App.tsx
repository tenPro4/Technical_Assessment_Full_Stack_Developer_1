import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, InputNumber, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { AppDispatch, RootState } from './store';
import { fetchItems, createItem, updateItem, deleteItem, deleteMany, selectAllItems } from './store/itemsSlice';
import { CreateItemDto, Item, UpdateItemDto } from './types';
import type { TableProps } from 'antd';
import { SorterResult } from 'antd/es/table/interface';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectAllItems);
  const loading = useSelector((state: RootState) => state.items.loading);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [sortedInfo, setSortedInfo] = useState<SorterResult<Item>>({});
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const handleCreate = async (values: CreateItemDto) => {
    try {
      await dispatch(createItem(values)).unwrap();
      message.success('Item created successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to create item');
    }
  };

  const handleUpdate = async (values: UpdateItemDto) => {
    if (!editingItem) return;
    try {
      await dispatch(updateItem({ id: editingItem.id, data: values })).unwrap();
      message.success('Item updated successfully');
      setIsModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    } catch (error) {
      message.error('Failed to update item');
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this item?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await dispatch(deleteItem(id)).unwrap();
          message.success('Item deleted successfully');
        } catch (error) {
          message.error('Failed to delete item');
        }
      },
    });
  };

  const handleDeleteMany = async () => {
    Modal.confirm({
      title: 'Are you sure you want to delete these items?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await dispatch(deleteMany(selectedRowKeys as number[])).unwrap();
          message.success('Items deleted successfully');
          setSelectedRowKeys([]);
        } catch (error) {
          message.error('Failed to delete items');
        }
      },
    });
  };

  const handleChange: TableProps<Item>['onChange'] = (pagination, filters, sorter) => {
    setSortedInfo(sorter as SorterResult<Item>);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const getFilteredItems = () => {
    if (!searchText) return items;
    
    const searchLower = searchText.toLowerCase();
    return items.filter((item) => 
      item.name.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.price.toString().includes(searchLower)
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Item, b: Item) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a: Item, b: Item) => a.price - b.price,
      sortOrder: sortedInfo.columnKey === 'price' ? sortedInfo.order : null,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Item) => (
        <div className="space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingItem(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Items Management</h1>
        <div className="space-x-2">
          {selectedRowKeys.length > 0 && (
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDeleteMany}
            >
              Delete Selected ({selectedRowKeys.length})
            </Button>
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingItem(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
          >
            Add Item
          </Button>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <Input
          placeholder="Search items by name, description, or price..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="max-w-md"
        />
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={getFilteredItems()}
        loading={loading}
        rowKey="id"
        className="shadow-lg"
        onChange={handleChange}
      />

      <Modal
        title={editingItem ? 'Edit Item' : 'Create Item'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingItem ? handleUpdate : handleCreate}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input the price!' }]}
          >
            <InputNumber
              className="w-full"
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined): number => Number(value?.replace(/\$\s?|(,*)/g, '') || 0)}
              min={0}
              step={0.01}
              precision={2}
            />
          </Form.Item>

          <div className="flex justify-end space-x-2">
            <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default App;