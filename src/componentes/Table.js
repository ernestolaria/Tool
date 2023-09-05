import React, { useState, useEffect } from 'react';
import './table.css';

function Table() {
    const [cellData, setCellData] = useState([]);
    const columnNames = ["Current Base_$", "HC", "HC%", "Adj Base_$", "HC Input", "HC Adj", "Calculated Base_$", "Projected Base_$", "Projected HC%", "Projected HC"];
    const levels = ["L6", "L7", "L8", "L9", "L10", "Others"];

    const headerRow = (
        <tr>
            <th className="row-header">Job Level</th>
            {columnNames.map((name, index) => (
                <th className="cell" id="col-header" key={index}>
                    {name}
                </th>
            ))}
        </tr>
    );

    const rows = [];
    for (let i = 0; i < levels.length; i++) {
        const cells = [<td className="row-header" key={i}>{levels[i]}</td>];
        for (let j = 0; j < columnNames.length; j++) {
            const cellId = `${i}-${j}`;
            const cellText = cellData[cellId] || '';
            const isEditable = ![2, 5, 6, 7, 8, 9].includes(j); // Check if column is editable

            cells.push(
                <td className="cell" id={`${isEditable ? 'editable' : 'not-editable'}`}  key={cellId}>
                    {isEditable ? (
                        <input
                            type="number"
                            min={0}
                            value={cellText}
                            onChange={(e) => handleCellChange(cellId, e.target.value)}
                        />
                    ) : (
                        cellText
                    )}
                </td>
            );
        }
        rows.push(<tr key={`row-${i}`}>{cells}</tr>)
    }

    // Calculate column sums
    const columnSums = Array.from({ length: columnNames.length }, () => 0);
    for (let i = 0; i < levels.length; i++) {
        for (let j = 0; j < columnNames.length; j++) {
            const cellId = `${i}-${j}`;
            columnSums[j] += parseFloat(cellData[cellId] || 0);
        }
    }

    // Generate the final row for column sums
    const sumRow = (
        <tr>
            <td className="cell" id="col-footer">Total</td>
            {columnSums.map((sum, index) => (
                <td className="cell" id="col-footer" key={index}>
                    {index === 2 || index === 8 ? `${sum===0 ? 0 : parseInt(sum)}%` :
                        (index === 0 || index === 3 || index === 6 || index === 7 ? `$${sum}` : parseInt(sum))}
                </td>
            ))}
        </tr>
    );

    const handleCellChange = (cellId, value) => {      
        setCellData((prevCellData) => {
            const newCellData = { ...prevCellData };
            newCellData[cellId] = value;
            return newCellData;
        });
    };

    useEffect(() => {
        calculateColumnValues();
    }, [cellData]);

    const isCellDataEqual = (cellData1, cellData2) => {
        // Compare cellData1 and cellData2 and return true if they are equal, false otherwise
        return JSON.stringify(cellData1) === JSON.stringify(cellData2);
    };

    const calculateColumnValues = () => {
        const newCellData = { ...cellData }; // Create a new copy of cellData
        for (let i = 0; i < levels.length; i++) {
            const firstColumnId = `${i}-0`;
            const secondColumnId = `${i}-1`;
            const thirdColumnId = `${i}-2`;
            const fourthColumnId = `${i}-3`;
            const fifthColumnId = `${i}-4`;
            const sixthColumnId = `${i}-5`;
            const seventhColumnId = `${i}-6`;
            const eigthColumnId = `${i}-7`;
            const ninethColumnId = `${i}-8`;
            const lastColumnId = `${i}-${columnNames.length - 1}`;

            const firstColumnValue = parseFloat(newCellData[firstColumnId] || 0);
            const secondColumnValue = parseInt(newCellData[secondColumnId] || 0);
            const thirdColumnValue = `${secondColumnValue === 0 ? '0' : ((parseFloat(secondColumnValue / columnSums[1]) * 100)).toFixed(1)}%`;
            const fourthColumnValue = parseFloat(newCellData[fourthColumnId] || 0);
            const fifthColumnValue = parseInt(newCellData[fifthColumnId] || 0);
            const sixthColumnValue = fifthColumnValue;
            const seventhColumnValue = fourthColumnValue * fifthColumnValue;
            const eigthcolumnValue = firstColumnValue + seventhColumnValue;
            const ninethColumnValue = `${secondColumnValue === 0 ? '0' : ((parseFloat((secondColumnValue + fifthColumnValue) / columnSums[9]) * 100)).toFixed(1)}%`;;
            const lastColumnValue = secondColumnValue + fifthColumnValue;

            newCellData[firstColumnId] = firstColumnValue;
            newCellData[secondColumnId] = secondColumnValue;
            newCellData[thirdColumnId] = thirdColumnValue;
            newCellData[fourthColumnId] = fourthColumnValue;
            newCellData[fifthColumnId] = fifthColumnValue;
            newCellData[sixthColumnId] = sixthColumnValue;
            newCellData[seventhColumnId] = seventhColumnValue;
            newCellData[eigthColumnId] = eigthcolumnValue;
            newCellData[ninethColumnId] = ninethColumnValue;
            newCellData[lastColumnId] = lastColumnValue;
        }
        // Compare newCellData with the current cellData to see if they are different
        const isDifferent = !isCellDataEqual(cellData, newCellData);

        if (isDifferent) {
            // Update the state with the newCellData
            setCellData(newCellData);
        }
    };

    return (
        <div className="table-container">
            <table className="table">
                <thead>{headerRow}</thead>
                <tbody>{rows}</tbody>
                <tfoot>{sumRow}</tfoot>
            </table>
        </div>
    );
}

export default Table;