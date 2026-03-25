let subscribers = [];
let currentDevices = [];
let selectedUserId = null;
let selectedDeviceId = null;
let usageChart = null;

function badgeClass(value) {
    const v = (value || "").toLowerCase();

    if (["active", "online", "normal"].includes(v)) return "badge status-active";
    if (["paused", "standby"].includes(v)) return "badge status-paused";
    if (["expired", "error", "warning"].includes(v)) return "badge status-expired";
    if (v === "offline") return "badge status-offline";
    if (["on", "cleaning"].includes(v)) return "badge status-on";
    if (v === "off") return "badge status-off";
    return "badge";
}

async function fetchSubscribers() {
    const res = await fetch("/api/subscribers");
    subscribers = await res.json();
    renderSubscribers();
}

function renderSubscribers() {
    const tbody = document.getElementById("subscriber-body");
    const search = document.getElementById("subscriber-search").value.toLowerCase();
    const statusFilter = document.getElementById("subscriber-status-filter").value;

    const filtered = subscribers.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search) ||
            user.plan.toLowerCase().includes(search) ||
            user.status.toLowerCase().includes(search) ||
            user.userId.toLowerCase().includes(search);

        const matchesStatus = !statusFilter || user.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    tbody.innerHTML = "";

    filtered.forEach((user) => {
        const tr = document.createElement("tr");
        tr.className = "clickable";
        tr.dataset.userId = user.userId;

        if (user.userId === selectedUserId) {
            tr.classList.add("selected");
        }

        tr.innerHTML = `
            <td>${user.userId}</td>
            <td>${user.name}</td>
            <td>${user.plan}</td>
            <td><span class="${badgeClass(user.status)}">${user.status}</span></td>
            <td>${user.deviceCount}</td>
        `;

        tr.onclick = () => selectSubscriber(user.userId);
        tbody.appendChild(tr);
    });
}

async function selectSubscriber(userId) {
    selectedUserId = userId;
    selectedDeviceId = null;
    renderSubscribers();

    document.getElementById("usage-empty").classList.remove("hidden");
    document.getElementById("usage-detail").classList.add("hidden");
    document.getElementById("usage-info").innerHTML = "";

    const res = await fetch(`/api/subscribers/${userId}/devices`);
    currentDevices = await res.json();
    renderDevices();
}

function renderDevices() {
    const emptyEl = document.getElementById("device-empty");
    const tableEl = document.getElementById("device-table");
    const tbody = document.getElementById("device-body");

    const search = document.getElementById("device-search").value.toLowerCase();
    const statusFilter = document.getElementById("device-status-filter").value;

    const filtered = currentDevices.filter((device) => {
        const matchesSearch =
            device.type.toLowerCase().includes(search) ||
            device.model.toLowerCase().includes(search) ||
            device.status.toLowerCase().includes(search) ||
            device.deviceId.toLowerCase().includes(search) ||
            device.location.toLowerCase().includes(search);

        const matchesStatus = !statusFilter || device.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    tbody.innerHTML = "";

    if (!currentDevices.length) {
        emptyEl.textContent = "No registered devices for this subscriber.";
        emptyEl.classList.remove("hidden");
        tableEl.classList.add("hidden");
        return;
    }

    if (!filtered.length) {
        emptyEl.textContent = "No devices matched your filter.";
        emptyEl.classList.remove("hidden");
        tableEl.classList.add("hidden");
        return;
    }

    emptyEl.classList.add("hidden");
    tableEl.classList.remove("hidden");

    filtered.forEach((device) => {
        const tr = document.createElement("tr");
        tr.className = "clickable";
        tr.dataset.deviceId = device.deviceId;

        if (device.deviceId === selectedDeviceId) {
            tr.classList.add("selected");
        }

        tr.innerHTML = `
            <td>${device.deviceId}</td>
            <td>${device.type}</td>
            <td>${device.model}</td>
            <td>${device.location}</td>
            <td><span class="${badgeClass(device.status)}">${device.status}</span></td>
        `;

        tr.onclick = () => selectDevice(device.deviceId);
        tbody.appendChild(tr);
    });
}

async function selectDevice(deviceId) {
    selectedDeviceId = deviceId;
    renderDevices();

    const res = await fetch(`/api/devices/${deviceId}/usage`);
    const data = await res.json();

    document.getElementById("usage-empty").classList.add("hidden");
    document.getElementById("usage-detail").classList.remove("hidden");

    const usageInfo = document.getElementById("usage-info");
    usageInfo.innerHTML = `
        <div class="label">Device ID</div><div class="value">${data.deviceId}</div>
        <div class="label">Device Name</div><div class="value">${data.deviceName}</div>
        <div class="label">Power Status</div><div class="value"><span class="${badgeClass(data.powerStatus)}">${data.powerStatus}</span></div>
        <div class="label">Last Used</div><div class="value">${data.lastUsedAt}</div>
        <div class="label">Total Usage Hours</div><div class="value">${data.totalUsageHours}</div>
        <div class="label">Weekly Usage Count</div><div class="value">${data.weeklyUsageCount}</div>
        <div class="label">Health Status</div><div class="value"><span class="${badgeClass(data.healthStatus)}">${data.healthStatus}</span></div>
        <div class="label">Remark</div><div class="value">${data.remark}</div>
    `;

    renderUsageChart(data.weeklyUsageTrend || []);
}

function renderUsageChart(trend) {
    const ctx = document.getElementById("usageChart");

    if (usageChart) {
        usageChart.destroy();
    }

    usageChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    label: "Weekly Usage Trend",
                    data: trend,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function bindEvents() {
    document.getElementById("subscriber-search").addEventListener("input", renderSubscribers);
    document.getElementById("subscriber-status-filter").addEventListener("change", renderSubscribers);

    document.getElementById("device-search").addEventListener("input", renderDevices);
    document.getElementById("device-status-filter").addEventListener("change", renderDevices);
}

bindEvents();
fetchSubscribers();