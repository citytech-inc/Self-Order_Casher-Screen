import React, { useState, SetStateAction, Dispatch } from "react";
import CustomizeSection from "./CustomizeSection";
import "./AddMenu.css";

type CustomizeType1 = {
  type: "Type1";
  name: string;
  options: string[];
  default: string;
};

type CustomizeType2 = {
  type: "Type2";
  name: string;
  options: Array<{ optionName: string; price: number }>;
  default: string;
};

type CustomizeType3 = {
  type: "Type3";
  name: string;
  price: number;
  measureWord: string;
  default: string;
};

type MenuSettings = {
  customizations?: (CustomizeType1 | CustomizeType2 | CustomizeType3)[];
};

type MenuType = {
  category: string;
  name: string;
  picture: string;
  price: number;
  settings: MenuSettings[];
};

type AddMenuProps = {
  menuCategoryList: string[];
  customize: string;
  setCustomize: Dispatch<SetStateAction<string>>;
};

const AddMenu: React.FC<AddMenuProps> = ({
  menuCategoryList,
  customize,
  setCustomize,
}) => {
  const [menu, setMenu] = useState<MenuType>({
    category: "",
    name: "",
    picture: "",
    price: 0,
    settings: [],
  });

  return (
    <div className="add-menu__container">
      <h2>メニューを追加</h2>
      <div className="box">
        <div className="box__text">名前</div>
        <input
          className="input__name"
          type="text"
          placeholder="Menu Name"
          onChange={(e) =>
            setMenu((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>
      <div className="box">
        <div className="box__text">カテゴリー</div>
        <select
          className="select"
          value={menu.category}
          onChange={(e) =>
            setMenu((prev) => ({ ...prev, category: e.target.value }))
          }
        >
          {menuCategoryList.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="box">
        <div className="box__text">値段</div>
        <input
          className="input__price"
          type="number"
          placeholder="Price"
          onChange={(e) => {
            const newPrice = parseFloat(e.target.value);
            setMenu((prev) => ({ ...prev, price: newPrice }));
          }}
        />
      </div>
      <div className="box">
        <div className="box__text">画像</div>
        <input
          className="input__picture"
          type="text"
          placeholder="Picture Link"
          onChange={(e) =>
            setMenu((prev) => ({ ...prev, picture: e.target.value }))
          }
        />
      </div>
      <div className="box">
        <div className="box__text">カスタマイズ</div>
        <select
          className="select"
          value={customize}
          onChange={(e) => setCustomize(e.target.value)}
        >
          <option value="あり">あり</option>
          <option value="なし">なし</option>
        </select>
      </div>
    </div>
  );
};

export default AddMenu;