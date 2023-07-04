import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TableNumberScreen.css';

interface TableNumberScreenProps {}

const TableNumberScreen: React.FC<TableNumberScreenProps> = () => {
    const [tableNumber, setTableNumber] = useState<string>('');
    const navigate = useNavigate();

    const handleTableNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTableNumber(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate('/purchased-items', { state: { tableNumber: parseInt(tableNumber) } }); 
};


    return (
        <div className="table-number-container">
            <h1 className="title">座席番号を入力してください</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={tableNumber} 
                    onChange={handleTableNumberChange}
                    className="table-number-input"
                    placeholder="Table number"
                />
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default TableNumberScreen;
