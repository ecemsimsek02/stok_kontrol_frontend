import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransactionPage.css";
const TransactionPage = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const token = localStorage.getItem("access_token");
  //const tableClass = "table-auto w-full text-left border-collapse"; // Tablo stil sınıfı
  //const thClass = "px-4 py-2 bg-gray-200 text-gray-700"; // Başlık hücreleri stil sınıfı
  //const tdClass = "px-4 py-2 border-b border-gray-200"; // Veri hücreleri stil sınıfı

  const fetchData = async () => {
    try {
      const headers = {
        Authorization: `Token ${token}`,
      };

      const [saleRes, invoiceRes, purchaseRes, billRes] = await Promise.all([
        axios.get("http://localhost:8000/transactions/sale-transactions/", {
          headers,
        }),
        axios.get("http://localhost:8000/invoice/api/invoices/", { headers }),
        axios.get("http://localhost:8000/transactions/purchase-transactions/", {
          headers,
        }),
        axios.get("http://localhost:8000/bills/api/bills/", { headers }),
      ]);

      const invoiceMap = {};
      invoiceRes.data.forEach((inv) => {
        invoiceMap[inv.id] = inv;
      });

      const billMap = {};
      billRes.data.forEach((bill) => {
        billMap[bill.id] = bill;
      });

      const combinedSales = saleRes.data.map((sale) => ({
        ...sale,
        invoice: invoiceMap[sale.invoice] || {},
      }));

      const combinedPurchases = purchaseRes.data.map((purchase) => ({
        ...purchase,
        bill: billMap[purchase.bill] || {},
      }));

      setSales(combinedSales);
      setPurchases(combinedPurchases);
    } catch (error) {
      console.error("Veriler alınırken hata oluştu:", error);
    }
  };

  const updateDeliveryStatus = async (type, id, newStatus) => {
    try {
      const url =
        type === "sale"
          ? `http://localhost:8000/transactions/sale-transactions/${id}/`
          : `http://localhost:8000/transactions/purchase-transactions/${id}/`;

      await axios.patch(
        url,
        { delivery_status: newStatus },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      fetchData();
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="transaction-container">
      <h2 className="transaction-title">Sales</h2>
      <div className="transaction-table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Invoice ID</th>
              <th>Total</th>
              <th>Delivery Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.invoice?.customer_name || "—"}</td>
                <td>{sale.invoice?.id}</td>
                <td>{sale.invoice?.grand_total} ₺</td>
                <td>{sale.delivery_status}</td>
                <td>
                  <select
                    className="status-select"
                    value={sale.delivery_status}
                    onChange={(e) =>
                      updateDeliveryStatus("sale", sale.id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="transaction-title">Purchases</h2>
      <div className="transaction-table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Institution</th>
              <th>Bill ID</th>
              <th>Amount</th>
              <th>Delivery Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.bill?.institution_name || "—"}</td>
                <td>{purchase.bill?.id}</td>
                <td>{purchase.bill?.amount} ₺</td>
                <td>{purchase.delivery_status}</td>
                <td>
                  <select
                    className="status-select"
                    value={purchase.delivery_status}
                    onChange={(e) =>
                      updateDeliveryStatus(
                        "purchase",
                        purchase.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionPage;
