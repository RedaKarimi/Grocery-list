import React, { useState } from 'react';
import { Table, Button } from 'antd';
import html2canvas from 'html2canvas';
const columns = [
  {
    title: 'Prodotto',
    dataIndex: 'prodotto',
  },
  {
    title: 'Quantità',
    dataIndex: 'quantity',
  },
  {
    title: 'Prezzo',
    dataIndex: 'prezzo',
    render: (text, record) => (
      <span>
        {text}
        {record.unit && `${record.unit}`}
      </span>
    ),
  },
];
const Tabella = ({ data, setData }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const handleRemoveSelected = () => {
    setData((prevState) => {
      const updatedData = prevState.filter((item) => !selectedRowKeys.includes(item.key));
      setSelectedRowKeys([]); // Clear selected row keys
      return updatedData;
    });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_NONE,
      {
        key: 'removeSelected',
        text: 'Rimuovi selezionati',
        onSelect: () => handleRemoveSelected(),
      },
    ],
  };
  const totalQuantity = data.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = data.reduce((total, item) => total + item.prezzo, 0);
  const dataWithTotal = [
    ...data,
    {
      key: 'total',
      prodotto: 'Totale',
      quantity: totalQuantity,
      prezzo: totalPrice + "€",
    },
  ];
  
  
  const exportToPNG = async () => {
    const tableElement = document.querySelector('.ant-table-wrapper');
    const canvas = await html2canvas(tableElement);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'table_data.png';
    link.click();
  };
  
  return <>
    <Table rowSelection={rowSelection} columns={columns} dataSource={dataWithTotal} pagination={false}  />
    <Button type="primary" onClick={exportToPNG} style={{ marginTop: '10px', width: "160px" }}>
      Esporta l'immagine
    </Button>
  </>;
};
export default Tabella;