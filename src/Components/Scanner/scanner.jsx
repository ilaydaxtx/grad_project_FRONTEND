import React, { useState } from "react";
import axios from "axios";
import "./scanner.scss";

const Scanner = () => {
  const [ip, setIp] = useState("");
  const [scanType, setScanType] = useState("icmp");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startPort, setStartPort] = useState("");
  const [endPort, setEndPort] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [osInfo, setOsInfo] = useState("");
  const [analysisDetails, setAnalysisDetails] = useState(null);

  const handleScan = async () => {
    setLoading(true);
    setError("");
    setDevices([]);
    setOsInfo("");

    try {
      const response = await axios.post("http://localhost:8000/api/scan/", {
        ip: ip,
        open_ports: scanType === "both" ? ["icmp", "arp"] : [scanType],
        start_port: startPort,
        end_port: endPort,
      });

      setDevices(response.data.devices || []);
    } catch (err) {
      setError(err.response?.data?.error || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceSelection = async (deviceId) => {
    setLoading(true);
    setSelectedDeviceId(deviceId);
    try {
      const response = await axios.post("http://localhost:8000/api/analyze_device/", {
        ip: ip,
        device_id: deviceId,
      });

      const analysis = response.data.analysis;
      setOsInfo(analysis.tcp_ip?.os || "Bilinmiyor");
      setAnalysisDetails(analysis);
    } catch (err) {
      setError(err.response?.data?.error || "Detaylı analizde hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-container">
      <h1 className="scanner-title">🟣 Ağ Tarama Aracı</h1>

      <div className="scanner-card">
        <label>
          IP Aralığı:
          <input
            type="text"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="scanner-input"
            placeholder="Örn: 192.168.1.0/24"
          />
        </label>

        <label>
          Tarama Türü:
          <select
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            className="scanner-input"
          >
            <option value="icmp">ICMP</option>
            <option value="arp">ARP</option>
            <option value="both">Her İkisi</option>
          </select>
        </label>

        <label>
          Başlangıç Portu:
          <input
            type="number"
            value={startPort}
            onChange={(e) => setStartPort(e.target.value)}
            className="scanner-input"
            placeholder="Örn: 20"
          />
        </label>

        <label>
          Bitiş Portu:
          <input
            type="number"
            value={endPort}
            onChange={(e) => setEndPort(e.target.value)}
            className="scanner-input"
            placeholder="Örn: 1000"
          />
        </label>

        <button onClick={handleScan} className="scanner-button" disabled={loading}>
          {loading ? "Taranıyor..." : "Taramayı Başlat"}
        </button>

        {error && <p className="scanner-error">{error}</p>}
      </div>

      {devices.length > 0 && (
        <div>
          <h2 className="scanner-subtitle">Aktif Cihazlar:</h2>
          {devices.map((device) => (
            <div key={device.id} className="scanner-card">
              <p><strong>IP:</strong> {device.ip}</p>
              <p><strong>MAC:</strong> {device.mac || "Bilinmiyor"}</p>
              <p><strong>Vendor:</strong> {device.vendor}</p>
              <p><strong>Açık Portlar:</strong> {device.open_ports?.join(", ") || "Yok"}</p>
              <button
                onClick={() => handleDeviceSelection(device.id)}
                className={
                  selectedDeviceId === device.id
                    ? "scanner-button-selected"
                    : "scanner-button-secondary"
                }
              >
                {selectedDeviceId === device.id ? "Seçildi" : "Seç"}
              </button>
            </div>
          ))}
        </div>
      )}

      {analysisDetails && (
        <div className="scanner-card">
          <h2 className="scanner-subtitle">Detaylı Cihaz Analizi</h2>
          {Object.entries(analysisDetails).map(([key, value]) => (
            <div key={key} className="scanner-analysis-block">
              <strong>{key.replace("_", " ").toUpperCase()}:</strong>
              {typeof value === "object" ? (
                <pre className="scanner-pre">{JSON.stringify(value, null, 2)}</pre>
              ) : (
                <p>{value?.toString() || "YOK"}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Scanner;
