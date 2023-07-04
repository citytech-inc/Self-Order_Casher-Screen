import React, { useState } from 'react';
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
        console.log(`Table number: ${tableNumber}`);
        navigate('/please-wait'); // navigate to PleaseWaitScreen after submitting table number
    };

    return (
        <div className="table-number-container">
            <h1 className="title">Enter your seat number</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={tableNumber} 
                    onChange={handleTableNumberChange}
                    className="table-number-input"
                    placeholder="Seat number"
                />
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default TableNumberScreen;
