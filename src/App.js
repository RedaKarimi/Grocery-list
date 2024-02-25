import React, { useState } from 'react';
import { Flex, Input, Select, Space, Typography, Statistic, Button, Modal } from 'antd';
import { Products } from './constants/lista';
import Tabella from './components/tabella';
const { Text } = Typography;

const generateOptions = () => {
  return Products.map((element) => ({
    value: element.product,
    label: element.product,
  }));
};

const App = () => {
  const options = generateOptions();

  const [selectedProduct, setSelectedProduct] = useState('');
  const [product, setProduct] = useState({
    product: '',
    price: 0,
    unit: "",
  });
  const [data, setData] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const [showWarning, setShowWarning] = useState(false);

  React.useEffect(() => {
    const foundProduct = Products.find((p) => p.product === selectedProduct);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [selectedProduct, quantity]);

  const inserisciData = () => {

    const totalPrice = data.reduce((total, item) => total + item.prezzo, 0);
    if (selectedProduct && totalPrice+product.price < 130) {
      setData((prevState) => {
        const totalPrice = parseFloat(product.price) || 0;
        const newQuantity = quantity;
        const existingItemIndex = prevState.findIndex((item) => item.prodotto === selectedProduct);

        if (existingItemIndex !== -1) {
          const updatedItem = { ...prevState[existingItemIndex] };
          updatedItem.quantity += newQuantity;
          updatedItem.prezzo += totalPrice*newQuantity;
          return [
            ...prevState.slice(0, existingItemIndex),
            updatedItem,
            ...prevState.slice(existingItemIndex + 1),
          ];
        } else {
          return [
            ...prevState,
            {
              key: prevState.length + 1,
              prodotto: selectedProduct,
              prezzo: totalPrice*newQuantity,
              quantity: newQuantity,
              unit: product.unit,
            },
          ];
        }
      });
    } else if (totalPrice+product.price >= 130) {
      setShowWarning(true);
    }
  };

  const handleOk = () => {
    setShowWarning(false);
  };

  return (
    <Flex gap="middle" style={{ padding: '1%', overflowX: "hidden" }} vertical>
      <Space style={{ width: '400px', marginTop: '1%' }}>
        <Space.Compact direction="vertical">
          <Text style={{ fontSize: 20 }} strong>
            Prodotto
          </Text>
          <Select
            showSearch
            style={{ marginTop: '7%', width: '140px' }}
            placeholder="Seleziona il prodotto"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label?.split(' ')[0] || '')
                .toLowerCase()
                .localeCompare(
                  (optionB?.label?.split(' ')[0] || '').toLowerCase()
                )
            }
            options={options}
            onChange={(value) => setSelectedProduct(value)}
          />
        </Space.Compact>
        <Space.Compact direction="vertical">
          <Text style={{ fontSize: 20 }} strong>
            Quantità
          </Text>
          <Input
            style={{ marginLeft: '10%', marginTop: '15%', width: '40px' }}
            placeholder="1"
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </Space.Compact>
        <Space.Compact direction="vertical">
          <Statistic style={{ marginTop: "40px" }} value={(product.price * quantity) + product.unit} />
        </Space.Compact>
      </Space>
      <Button type="primary" style={{ width: "100px" }} onClick={inserisciData}>Inserisci</Button>
      <Tabella data={data} setData={setData} />
      <Modal
        title="Attenzione"
        visible={showWarning}
        onOk={handleOk}
      >
        <p>Il totale hai raggiunto il limite di 130 euro. Non è possibile aggiungere più prodotti.</p>
      </Modal>
    </Flex>
  );
};

export default App;
