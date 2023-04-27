import React, {useState} from 'react';
import classes from './Table.module.css'

function Table({tableData, rowData, setSelectedRow, ...props}) {
    const columns = rowData.length > 0 ? Object.keys(rowData[0]) : [];
    const handleRowClick = (row) => {
        setSelectedRow(row);
    };
    return (
        <table className={classes.table} {...props}>
            <thead>
            <tr>
                {tableData.map(column => (
                    <th key={column}>{column}</th>
                ))}
            </tr>
            </thead>
            <tbody className={classes.rows}>
            {rowData.map((row, index) => (
                <tr
                    key={index}
                    onClick={() => handleRowClick(row)}>
                    {columns.map((column) => (
                        <td key={`${index}-${column}`}>{row[column]}</td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default Table;
