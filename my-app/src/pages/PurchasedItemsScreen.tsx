import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./PurchasedItemsScreen.css";
import SettingBar from "../header/SettingBar";
import ArrowIcon from "../../src/components/images/arrowhead-thin-outline-to-the-left.png";

/*{
interface Item {
  name: string;
  price: number;
}

/*{
interface Order {
  tableNumber: number;
  items: Item[];
}
}*/

/*{
interface MenuItem {
  name: string;
  price: number;
  image: string;
  settings: {
    [key: string]: {
      name: string;
      options: {
        [key: string]: [string, number];
      }[];
      default: number;
    };
  };
  itemNumber: number;
}

interface Id {
  restaurantId: number;
  tableId: number;
}

interface OrderData {
  items: MenuItem[];
  ids: Id[];
}
}*/

interface MenuItem {
  name: string;
  price: number;
  image: string;
  settings: {
    [key: string]: {
      name: string;
      options: {
        [key: string]: [string, number];
      }[];
      default: number;
      selected: number;
      values: {
        [key: string]: [string, number] ;
      };
      type: number;
    };
  };
  itemNumber: number;
}

interface Id {
  restaurantId: number;
  tableId: number;
}

interface Time {
  yearTime: number;
  monthTime: number;
  dayTime: number;
  dateTime: number;
  hourTime: number;
  minuteTime: number;
}

interface OrderData {
  items: MenuItem[];
  ids: Id[];
  timestamp: Time[];
}

/*{
//テーブルごとの合計金額を計算する関数
const calculateTotalPriceForTable = (tableNumber: number, tableOrders: OrderData[]): number => {
  const order = tableOrders.find((order) => order.ids[0].tableId === tableNumber);
  if (!order) {
    return 0;
  }
  return order.items.reduce((total, item) => total + item.price, 0)
};
}*/

const PurchasedItemsScreen: React.FC = () => {
  const { restaurantId } = useParams();
  const cleanedRestaurantId = restaurantId?.replace(":", "");
  const navigate = useNavigate();
  const location = useLocation();
  const [tableNumber, setTableNumber] = useState(0);
  const [tableOrders, setTableOrders] = useState<OrderData[]>([]);
  const [focusButton, setFocusButton] = useState<string | null>(null);

  useEffect(() => {
    if (location.state && location.state.tableNumber) {
      setTableNumber(location.state.tableNumber);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchTableOrders = async () => {
      try {
        console.log("リクエストを送信しました");
        console.log("cleanedRestaurantId:", cleanedRestaurantId);
        const response = await fetch(
          `http://localhost:3003/api/orders/${cleanedRestaurantId}`,
        );
        console.log("リクエストを受信しました");
        const data = await response.json();
        console.log("受信したデータ:", JSON.stringify(data));
        setTableOrders(data);
      } catch (error: any) {
        console.log("エラー", error.message);
      }
    };
    fetchTableOrders();
  }, [restaurantId]);

  /*{
    const tableOrders = [
    {
      tableNumber: 1,
      items: [
        { name: "醤油ラーメン", price: 800 },
        { name: "唐揚げ", price: 300 },
        { name: "抹茶アイス", price: 200 },
      ],
    },
    {
      tableNumber: 2,
      items: [
        { name: "カレーライス", price: 700 },
        { name: "日本酒", price: 500 },
      ],
    },
  ];
}*/

  const handleConfirm = async () => {
    console.log("Confirm button clicked");
    try {
      await fetch(
        `http://localhost:3003/api/orders/${cleanedRestaurantId}/${tableNumber}`,
        {
          method: "DELETE",
        },
      );
      console.log(`テーブル番号${tableNumber}の注文情報を削除しました`);
      navigate(`/${cleanedRestaurantId}/table-number`);
    } catch (error) {
      console.log("エラー", error);
    }
  };

  const handleReturn = () => {
    navigate(`/${cleanedRestaurantId}/table-number`);
  };

  const currentOrders = tableOrders.filter(
    (order) => order.ids[0].tableId === tableNumber,
  );

  console.log("currentOrder:", currentOrders);
  console.log("tableOrders:", tableOrders);
  console.log("tableNumber:", tableNumber);

  let items: MenuItem[] = [];
  //let totalPrice = 0;

  // 注文データを処理してトッピング情報を取得する関数
  function extractToppingsFromOrder(orderData: OrderData): string {
    let toppingsInfo = '';

    //console.log("func-orderData.items", JSON.stringify(orderData.items));

    for (const order of orderData.items) {
      //console.log("func-order", JSON.stringify(order));
      for (const settingsKey in order.settings) {
        const settings = order.settings[settingsKey];
        if (settings.options) {
          for (const option of settings.options) {
            if (typeof option.selected === 'number' && typeof option.type === 'number'  && option.selected !== option.default) {
              if (option.type === 1) {
                const value = option.values[option.selected]
                toppingsInfo += `${value}, 0 \n`;
              }
              else if (option.type === 2) {
                const value = option.values[option.selected];
                toppingsInfo += `${value} \n`;
              }
              else if (option.type === 3 && typeof option.price === 'number') {
                const name = option.name;
                const selected = option.selected;
                const measureWord = option.measureWord || '';
                const price = option.price * selected;
                toppingsInfo += `${name} × ${selected} ${measureWord} (${price})\n`;
              }
            }
          }
        }
      }
      toppingsInfo += '\n';
    }

    return toppingsInfo;
  }

  // 注文データを処理してトッピングの合計金額を計算する関数
  function calculateToppingsPrice(orderData: OrderData): number {
    console.log("func");
    let toppingsPrice = 0;
    for (const order of orderData.items) {
      for (const settingsKey in order.settings) {
        const settings = order.settings[settingsKey];
        if (settings.options) {
          for (const option of settings.options) {
            if (typeof option.selected === 'number' && typeof option.type === 'number' && option.selected !== option.default) {
              if (option.type === 2) {
                const selectedOption = option.values[option.selected];
                if (Array.isArray(selectedOption) && typeof selectedOption[1] === 'number') {
                  toppingsPrice += selectedOption[1];
                }
              } else if (option.type === 3 && typeof option.price === 'number') {
                // オプションの価格をトッピング合計に加算
                toppingsPrice += (option.price * option.selected);
              }
            }
          }
        }
      }
    }
    return toppingsPrice;
  }



  items = currentOrders.flatMap(order => order.items).flat();
  const totalPriceMainMenu = items.reduce((total, item) => total + item.price, 0);
  let totalPriceSettings = 0;
  for (const currentOrder of currentOrders) {
    totalPriceSettings += calculateToppingsPrice(currentOrder)    
  }
  const totalPrice = totalPriceMainMenu + totalPriceSettings

  console.log("items", items);

  return (
    <div>
    <SettingBar focusButton="payment" />
    <div className="purchased-items-container">
      <button onClick={handleReturn} className="return-button">
        <img src={ArrowIcon} alt="Arrow Icon" className="payment__icon" />
        QRコード番号: {tableNumber}
      </button>
      <h1 className="title">商品内容をお確かめください（税込）</h1>
      <div className="payment__itemBox">
        {currentOrders.map((item, index) => (
        <div key={index} className="item">
          <p className="item-name">{item.items[0].name}</p>
          <p className="item-settings">{extractToppingsFromOrder(item)}</p>
          <p className="item-price">{item.items[0].price}</p>
        </div>
      ))}
      </div>
      
      <div className="payment__priceArea">
        <span>
          <span className="payment__tax">合計金額</span>
          <span className="payment__totalPrice">{totalPrice}円</span>
          <span className="payment__tax">(税込)</span>
        </span>
      </div>
      <div className="payment__buttons">
        <button onClick={handleConfirm} className="change-button">
          変更
        </button>
        <button onClick={handleConfirm} className="confirm-button">
          次へ
        </button>
      </div>
    </div>
    </div>
  );
};

export default PurchasedItemsScreen;
