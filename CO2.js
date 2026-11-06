window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(calculateCO2);
    } else {
        setTimeout(calculateCO2, 1000);
    }
});

function calculateCO2() {
    let totalBytes = 0;
    const navEntries = window.performance.getEntriesByType("navigation");
    if (navEntries.length > 0 && navEntries[0].transferSize) {
        totalBytes += navEntries[0].transferSize;
    }
    const resources = window.performance.getEntriesByType("resource");
    resources.forEach(res => {
        if (res.transferSize) {
            totalBytes += res.transferSize;
        } else if (res.decodedBodySize) {
            totalBytes += res.decodedBodySize;
        }
    });
    const totalMB = totalBytes / (1024 * 1024);
    const totalGB = totalBytes / (1024 * 1024 * 1024);
    const energyPerGB = 0.81;
    const carbonIntensity = 442;
    const estimatedEnergy_kWh = totalGB * energyPerGB;
    const totalCO2_grams = estimatedEnergy_kWh * carbonIntensity;
    console.log("%c --- Fenntarthatósági Jelentés (CO2.js) --- ", "color: #16a34a; font-weight: bold; font-size: 14px;");
    console.log(` Teljes adatforgalom: ${totalMB.toFixed(2)} MB`);
    console.log(` Becsült energiaigény: ${estimatedEnergy_kWh.toFixed(5)} kWh`);
    console.log(` CO₂ kibocsátás: ${totalCO2_grams.toFixed(3)} gramm CO2e / letöltés`);

    const resultContainer = document.getElementById('co2-result');
    if (resultContainer) {
        resultContainer.innerHTML = `
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 15px; text-align: center; font-size: 13px; font-weight: 600; margin-top: 30px;">
                <i class="fa-solid fa-leaf"></i> Ezen oldal betöltése mindössze <strong>${totalMB.toFixed(2)} MB</strong> adatforgalmat generált, karbonlábnyoma: <strong>${totalCO2_grams.toFixed(3)} g CO₂</strong>.
            </div>
        `;
    }
}