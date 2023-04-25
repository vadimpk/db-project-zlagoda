import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 2,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableColHeader: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderBottomWidth: 2,
        backgroundColor: "#000000",
        color: "#ffffff"
    },
    tableCol: {
        width: "25%",
        borderStyle: "solid",
        borderWidth: 1,
        borderBottomWidth: 1
    }
});

const data = [
    { name: 'John', age: 30 },
    { name: 'Mary', age: 25 },
    { name: 'Peter', age: 45 },
];

const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text>Table example</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableColHeader}><Text>Name</Text></View>
                        <View style={styles.tableColHeader}><Text>Age</Text></View>
                    </View>
                    {data.map((row, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.tableCol}><Text>{row.name}</Text></View>
                            <View style={styles.tableCol}><Text>{row.age}</Text></View>
                        </View>
                    ))}
                </View>
            </View>
        </Page>
    </Document>
);

export default MyDocument;
