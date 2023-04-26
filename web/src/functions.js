import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";

export const handleDownloadPdf = async (printRef, name) => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${name}.pdf`);
}
export async function updateProducts() {
    const authToken = localStorage.getItem('authToken');
    const productsResponse = await axios.get("http://localhost:8082/product", {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    const arr1 = productsResponse.data.map(({ id, name }) => ({ id, name }));

    const storeResponse = await axios.get(
        "http://localhost:8082/product/store",
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }
    );
    const arr2 = storeResponse.data.map(({ id, product_id, price }) => ({
        upc: id,
        id: product_id,
        product_price: price
    }));

    const result = [];
    arr1.forEach(item1 => {
        const matches = arr2.filter(item2 => item2.id === item1.id);
        if (matches.length === 0) {
            result.push({
                name: item1.name,
                upc: null,
                product_price: null
            });
        } else {
            matches.forEach(match => {
                result.push({
                    name: item1.name,
                    upc: match.upc,
                    product_price: match.product_price
                });
            });
        }
    });

    localStorage.setItem("products", JSON.stringify(result));
}
