import CoreController from "./coreController.ts";
import {$} from "../constants/main.ts";
import Chart from 'chart.js/auto'
import flatpickr from "flatpickr";
import "flatpickr/dist/themes/airbnb.css";
// import categoryModel from '../models/categoriesModel.ts';
// import productsModel from '../models/productsModel.ts';
// import UsersModel from '../models/usersModel.ts';
// import form from "../form/form.ts";
// import confirm from "../form/confirm.ts";
// import ProductsModel from "../models/productsModel.ts";
// import VouchersModel from '../models/vouchersModel.ts';
// import DeliveriesModel from '../models/deliveriesModel.ts';
// import notification from "../form/notification.ts";
// import ordersModel from "../models/ordersModel.ts";

const options: flatpickr.Options.Options = {
    enableTime: true,           // Cho phép chọn giờ
    dateFormat: "m/d/Y H:i",    // Hiển thị theo kiểu mm/dd/yyyy hh:mm
    time_24hr: false,           // Hiển thị AM/PM như hình
    allowInput: true,           // Cho phép nhập tay
    defaultHour: 12,            // Giờ mặc định (ví dụ 11:00 AM)
};

let temperatureEM = 25; // Nhiệt độ
let humidityEM = 60; // Độ ẩm
let rainfallEM = 12; // Lượng mưa
let NITROGENEM = 45; // Chỉ số Nitơ
let PHOSPHORUSEM = 35; // Chỉ số Phốt Pho
let POTASSIUMEM = 50; // Chỉ số Kali
let PHEM = 6.5; // Chỉ số pH

function generateRecommendation(
    temperatureEM: number,
    humidityEM: number,
    rainfallEM: number,
    NITROGENEM: number,
    PHOSPHORUSEM: number,
    POTASSIUMEM: number,
    PHEM: number
) {
    let recommendation: string[] = [];

    // Khuyến nghị dựa trên nhiệt độ
    if (temperatureEM > 30) {
        recommendation.push("Giảm nhiệt độ, có thể bằng cách tăng cường thông gió.");
    } else if (temperatureEM < 15) {
        recommendation.push("Tăng nhiệt độ, có thể bằng cách sử dụng thiết bị sưởi.");
    }

    // Khuyến nghị dựa trên độ ẩm
    if (humidityEM > 70) {
        recommendation.push("Cần giảm độ ẩm, có thể bằng cách sử dụng máy hút ẩm.");
    } else if (humidityEM < 40) {
        recommendation.push("Tăng cường độ ẩm, có thể bằng cách tưới nước.");
    }

    // Khuyến nghị dựa trên lượng mưa
    if (rainfallEM < 20) {
        recommendation.push("Lượng mưa thấp, cần tưới cây thường xuyên.");
    } else if (rainfallEM > 50) {
        recommendation.push("Lượng mưa cao, cần kiểm tra hệ thống thoát nước.");
    }

    // Khuyến nghị dựa trên các chỉ số dinh dưỡng
    if (NITROGENEM < 30) {
        recommendation.push("Thiếu Nitơ, cân nhắc bón phân chứa Nitơ.");
    }
    if (PHOSPHORUSEM < 20) {
        recommendation.push("Thiếu Phốt Pho, cân nhắc bón phân chứa Phốt Pho.");
    }
    if (POTASSIUMEM < 40) {
        recommendation.push("Thiếu Kali, cân nhắc bón phân chứa Kali.");
    }

    if (PHEM < 6.0) {
        recommendation.push("pH thấp, cần điều chỉnh pH bằng vôi.");
    } else if (PHEM > 7.0) {
        recommendation.push("pH cao, cần điều chỉnh pH bằng lưu huỳnh.");
    }

    return recommendation.length > 0 ? `Khuyến nghị thay đổi: ${recommendation.join(" ")}` : "Khuyến nghị thay đổi: Tình trạng môi trường ổn định.";
}

export default class adminController extends CoreController {
    constructor() {
        super();
        this.loadLayouts("admin");
        const linkStyle = $('link[data-style="style"]') as HTMLElement;
        if (linkStyle) linkStyle.remove();
        ($('head') as HTMLElement).innerHTML += `<link rel='stylesheet' href='./style/admin.css'>`;
    }

    loadCss(name: string) {
        ($('head') as HTMLElement).innerHTML += `<link rel='stylesheet' href='./style/admin/${name}.css'>`;
    }

    async index(): Promise<void> {
        this.loadCss('index');
        this.loadViewAdmin('home', () => {
            ($('#indexLink') as HTMLElement).classList.add('active');
            const line = (document.getElementById('lineChart') as HTMLCanvasElement).getContext('2d');
            if (line) new Chart(line, {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: 'My Dataset',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: '#4FD1C5',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true, // Tự động thích ứng với kích thước của phần tử chứa (mặc định: true)
                    maintainAspectRatio: true, // Không giữ tỷ lệ khung nhìn (mặc định: true)
                }
            });
            const pie = (document.getElementById('pieChart') as HTMLCanvasElement).getContext('2d');
            if (pie) new Chart(pie, {
                type: 'pie', // Loại biểu đồ (ví dụ: bar, line, pie, ...)
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: 'My Dataset',
                        data: [10, 2, 5, 3, 3, 3],
                        backgroundColor: '#4FD1C5',
                        borderColor: 'rgba(150, 100, 200, 0.5)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true, // Tự động thích ứng với kích thước của phần tử chứa (mặc định: true)
                    maintainAspectRatio: true, // Không giữ tỷ lệ khung nhìn (mặc định: true)
                }
            });
        })
    }

    async charts(): Promise<void> {
        this.loadCss('charts');
        this.loadCss('flatpickr-custom');
        this.loadViewAdmin('charts', () => {
            ($('#chartsLink') as HTMLElement).classList.add('active');
            const fromPicker = flatpickr("#fromDate", options) as flatpickr.Instance;
            const toPicker = flatpickr("#toDate", options) as flatpickr.Instance;

            document.getElementById("filterBtn")?.addEventListener("click", () => {
                const fromDate = fromPicker.input.value;
                const toDate = toPicker.input.value;
                console.log("Từ ngày:", fromDate, "Đến ngày:", toDate);
            });

            ($('#container .content .chart-container .time .timer button') as HTMLButtonElement).onclick = () => {
                const timeInput = ($('#container .content .chart-container .time .timer input#timer') as HTMLInputElement).value;
                alert(`Hẹn giờ đã được thiết lập cho ${timeInput}`);
            }

            const temperature = (document.getElementById('temperature') as HTMLCanvasElement).getContext('2d');
            let temperatureChart: Chart<"line", number[], string>;
            if (temperature) {
                temperatureChart = new Chart(temperature, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Nhiệt độ (°C)',
                            data: [30, 25, 28, 32, 35, 30],
                            backgroundColor: 'rgba(255, 99, 71, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            fill: true,
                        }],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Nhiệt độ (°C)',
                                    font: {
                                        size: 16,
                                        weight: 'bold',
                                    },
                                },
                                ticks: {
                                    color: '#333',
                                },
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Tháng',
                                    font: {
                                        size: 16,
                                        weight: 'bold',
                                    },
                                },
                                ticks: {
                                    color: '#333',
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: 'rgb(255, 99, 132)',
                                    font: {
                                        weight: 'bold',
                                    },
                                }
                            }
                        }
                    },
                });
            }

            const humidity = (document.getElementById('humidity') as HTMLCanvasElement).getContext('2d');
            if (humidity) new Chart(humidity, {
                type: 'line', // Loại biểu đồ là đường
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Nhãn cho các tháng
                    datasets: [{
                        label: 'Biểu đồ độ ẩm (%)', // Nhãn cho biểu đồ
                        data: [60, 55, 65, 70, 75, 80], // Dữ liệu độ ẩm
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Màu nền
                        borderColor: 'rgba(54, 162, 235, 1)', // Màu đường
                        fill: true, // Đổ màu dưới đường biểu đồ
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true, // Bắt đầu từ 0
                            title: {
                                display: true,
                                text: 'Độ ẩm (%)', // Tiêu đề cho trục Y
                                color: '#333',
                                font: {
                                    size: 16, // Kích thước chữ cho tiêu đề
                                    weight: 'bold', // Làm chữ đậm
                                },
                            },
                            ticks: {
                                color: '#333', // Màu chữ cho ticks
                                font: {
                                    size: 14, // Kích thước chữ cho ticks
                                    weight: 'bold', // Làm chữ đậm
                                },
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Tháng', // Tiêu đề cho trục X
                                color: '#333',
                                font: {
                                    size: 16, // Kích thước chữ cho tiêu đề
                                    weight: 'bold', // Làm chữ đậm
                                },
                            },
                            ticks: {
                                color: '#333', // Màu chữ cho ticks
                                font: {
                                    size: 14, // Kích thước chữ cho ticks
                                    weight: 'bold', // Làm chữ đậm
                                },
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#333', // Màu chữ cho legend
                                font: {
                                    size: 14, // Kích thước chữ cho legend
                                    weight: 'bold', // Làm chữ đậm
                                },
                            },
                        },
                    },
                }
            });

            const rainfall = (document.getElementById('rainfall') as HTMLCanvasElement).getContext('2d');
            if (rainfall) new Chart(rainfall, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Nhãn cho các tháng
                    datasets: [{
                        label: 'Biểu đồ lượng mưa (mm)', // Nhãn cho biểu đồ
                        data: [10, 20, 15, 25, 30, 12], // Dữ liệu lượng mưa
                        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Màu nền
                        borderColor: 'rgba(75, 192, 192, 1)', // Màu đường viền
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Lượng mưa (mm)', // Tiêu đề cho trục Y
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Tháng', // Tiêu đề cho trục X
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                }
            })

            const nitrogen = (document.getElementById('nitrogen') as HTMLCanvasElement).getContext('2d');
            if (nitrogen) new Chart(nitrogen, {
                type: 'bar', // Loại biểu đồ là cột
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Nhãn cho các tháng
                    datasets: [{
                        label: 'Biểu đồ Nitrogen (ppm)', // Nhãn cho biểu đồ
                        data: [5, 8, 6, 9, 7, 4], // Dữ liệu nitrogen
                        backgroundColor: 'rgba(255, 206, 86, 0.6)', // Màu nền
                        borderColor: 'rgba(255, 206, 86, 1)', // Màu đường viền
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Nitrogen (ppm)', // Tiêu đề cho trục Y
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Tháng', // Tiêu đề cho trục X
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                }
            })

            const phosphorus = (document.getElementById('phosphorus') as HTMLCanvasElement).getContext('2d');
            if (phosphorus) new Chart(phosphorus, {
                type: 'bar', // Loại biểu đồ là cột
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Nhãn cho các tháng
                    datasets: [{
                        label: 'Biểu đồ Phosphorus (ppm)', // Nhãn cho biểu đồ
                        data: [3, 2, 5, 4, 6, 3], // Dữ liệu phosphorus
                        backgroundColor: 'rgba(153, 102, 255, 0.6)', // Màu nền
                        borderColor: 'rgba(153, 102, 255, 1)', // Màu đường viền
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Phosphorus (ppm)', // Tiêu đề cho trục Y
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Tháng', // Tiêu đề cho trục X
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                }
            })

            const potassium = (document.getElementById('potassium') as HTMLCanvasElement).getContext('2d');
            if (potassium) new Chart(potassium, {
                type: 'bar', // Loại biểu đồ là cột
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Nhãn cho các tháng
                    datasets: [{
                        label: 'Biểu đồ Potassium (ppm)', // Nhãn cho biểu đồ
                        data: [1, 4, 3, 2, 5, 6], // Dữ liệu potassium
                        backgroundColor: 'rgba(255, 159, 64, 0.6)', // Màu nền
                        borderColor: 'rgba(255, 159, 64, 1)', // Màu đường viền
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Potassium (ppm)', // Tiêu đề cho trục Y
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Tháng', // Tiêu đề cho trục X
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                }
            })

            const ph = (document.getElementById('ph') as HTMLCanvasElement).getContext('2d');
            if (ph) new Chart(ph, {
                type: 'line', // Loại biểu đồ là đường
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Nhãn cho các tháng
                    datasets: [{
                        label: 'Biểu đồ pH', // Nhãn cho biểu đồ
                        data: [6.5, 6.8, 7.0, 6.3, 6.9, 6.7], // Dữ liệu pH
                        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Màu nền
                        borderColor: 'rgba(255, 99, 132, 1)', // Màu đường
                        fill: true, // Đổ màu dưới đường biểu đồ
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'pH', // Tiêu đề cho trục Y
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Tháng', // Tiêu đề cho trục X
                                color: '#333',
                                font: {
                                    size: 16,
                                    weight: 'bold',
                                },
                            },
                            ticks: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14,
                                    weight: 'bold',
                                },
                            },
                        },
                    },
                }
            });

            ($('#container .content .chart-container #dataForm') as HTMLFormElement).addEventListener('submit', function (e) {
                e.preventDefault();
                const month = (document.getElementById('month') as HTMLInputElement).value;
                const value = parseInt((document.getElementById('value') as HTMLInputElement).value);

                if (temperature && temperatureChart && temperatureChart.data.labels) {
                    const monthIndex = temperatureChart.data.labels.indexOf(month);
                    if (monthIndex !== -1) {
                        temperatureChart.data.datasets[0].data[monthIndex] = value; // Cập nhật dữ liệu
                    } else {
                        alert('Tháng không hợp lệ! Vui lòng chọn tháng.');
                        return;
                    }

                    temperatureChart.update();
                }
            });

            ($('#container .content .chart-container .environments #result') as HTMLElement).innerHTML = generateRecommendation(temperatureEM, humidityEM, rainfallEM, NITROGENEM, PHOSPHORUSEM, POTASSIUMEM, PHEM);

            const temperatureElement = $('#container .content .chart-container .environments #environment-temperature') as HTMLElement;
            const humidityElement = $('#container .content .chart-container .environments #environment-humidity') as HTMLElement;
            const rainfallElement = $('#container .content .chart-container .environments #environment-rainfall') as HTMLElement;
            const NITROGENElement = $('#container .content .chart-container .environments #environment-NITROGEN') as HTMLElement;
            const PHOSPHORUSElement = $('#container .content .chart-container .environments #environment-PHOSPHORUS') as HTMLElement;
            const POTASSIUMElement = $('#container .content .chart-container .environments #environment-POTASSIUM') as HTMLElement;
            const PHElement = $('#container .content .chart-container .environments #environment-PH') as HTMLElement;

            temperatureElement.innerHTML = `Nhiệt độ: ${temperatureEM} °C`;
            humidityElement.innerHTML = `Độ ẩm: ${humidityEM} %`;
            rainfallElement.innerHTML = `lượng mưa: ${rainfallEM} mm`;
            NITROGENElement.innerHTML = `NITROGEN: ${NITROGENEM} ppm`;
            PHOSPHORUSElement.innerHTML = `PHOSPHORUS: ${PHOSPHORUSEM} ppm`;
            POTASSIUMElement.innerHTML = `POTASSIUM: ${POTASSIUMEM} ppm`;
            PHElement.innerHTML = `PH: ${PHEM} pH`;

            ($('#container .content .chart-container .environments button') as HTMLButtonElement).onclick = function () {
                console.log(rainfallEM);
                if (temperatureEM > 30) {
                    temperatureEM -= 1; // Giảm nhiệt độ nếu quá cao
                } else if (temperatureEM < 20) {
                    temperatureEM += 1; // Tăng nhiệt nếu quá thấp
                }

                if (humidityEM > 70) {
                    humidityEM -= 5; // Giảm độ ẩm nếu quá cao
                } else if (humidityEM < 40) {
                    humidityEM += 5; // Tăng độ ẩm nếu quá thấp
                }

                if (rainfallEM < 20) {
                    rainfallEM += 3; // Tăng lượng mưa nếu quá thấp
                } else if (rainfallEM > 50) {
                    rainfallEM -= 3; // Giảm lượng mưa nếu quá cao
                }

                if (NITROGENEM < 30) {
                    NITROGENEM += 2; // Tăng nitơ nếu thiếu
                } else if (NITROGENEM > 60) {
                    NITROGENEM -= 2; // Giảm nitơ nếu quá cao
                }

                if (PHOSPHORUSEM < 20) {
                    PHOSPHORUSEM += 1; // Tăng phốt pho nếu thiếu
                } else if (PHOSPHORUSEM > 40) {
                    PHOSPHORUSEM -= 1; // Giảm phốt pho nếu quá cao
                }

                if (POTASSIUMEM < 40) {
                    POTASSIUMEM += 3; // Tăng kali nếu thiếu
                } else if (POTASSIUMEM > 60) {
                    POTASSIUMEM -= 3; // Giảm kali nếu quá cao
                }

                if (PHEM < 6.0) {
                    PHEM += 0.1; // Tăng pH nếu quá thấp
                } else if (PHEM > 7.5) {
                    PHEM -= 0.1; // Giảm pH nếu quá cao
                }

                temperatureElement.innerHTML = `Nhiệt độ: ${temperatureEM} °C`;
                humidityElement.innerHTML = `Độ ẩm: ${humidityEM} %`;
                rainfallElement.innerHTML = `lượng mưa: ${rainfallEM} mm`;
                NITROGENElement.innerHTML = `NITROGEN: ${NITROGENEM} ppm`;
                PHOSPHORUSElement.innerHTML = `PHOSPHORUS: ${PHOSPHORUSEM} ppm`;
                POTASSIUMElement.innerHTML = `POTASSIUM: ${POTASSIUMEM} ppm`;
                PHElement.innerHTML = `PH: ${PHEM} pH`;

                const result = generateRecommendation(temperatureEM, humidityEM, rainfallEM, NITROGENEM, PHOSPHORUSEM, POTASSIUMEM, PHEM);
                ($('#container .content .chart-container .environments #result') as HTMLElement).innerHTML = result;
                if (result === 'Khuyến nghị thay đổi: Tình trạng môi trường ổn định.') alert('Môi trường đã ổn định, không cần điều chỉnh nữa');
            }
        })
    }

    // async categories(): Promise<void> {
    //     let test : string = "1";
    //     console.log(test);
    //     this.loadCss('categories');
    //     const categoriesModel = this.loadModel('categories') as categoryModel;
    //     const categories = await categoriesModel.findAllCategories();
    //     const productModel = this.loadModel('products') as productsModel;
    //     const renderCategories = async (categories: Category[]) => {
    //         const blockContainer = $('#container .content .table .tbody') as HTMLElement;
    //         const status: Record<number, string> = {
    //             0: 'hidden',
    //             1: 'show'
    //         }
    //         let html = '';
    //         for (const category of categories) {
    //             const quantity = await productModel.getQuantityProductByIdCategories(category._id);
    //             if (!category || Object.keys(category).length === 0) {
    //                 continue;
    //             }
    //             html += `
    //                <div id="row-order-${category._id}" class="row">
    //                     <div>${category._id}</div>
    //                     <div>${category.name}</div>
    //                     <div>${quantity}</div>
    //                     <div class="status-${category._id}">${status[category.status]}</div>
    //                     <div>
    //                         <a href="#" class="update" data-id="${category._id}">Update</a>
    //                     </div>
    //                </div>
    //         `;
    //         }
    //         blockContainer.innerHTML = html;
    //     }
    //
    //     this.loadViewAdmin('categories', async () => {
    //         ($('#categoriesLink') as HTMLElement).classList.add('active');
    //         await renderCategories(categories);
    //         ($('#container .content .addBtn') as HTMLElement).addEventListener('click', () => {
    //             form('addCategory');
    //         })
    //     })
    // }
    //
    // async products() {
    //     this.loadCss('products');
    //     this.loadTitle('Products - Dashboard');
    //     const productsModel = this.loadModel('products') as ProductsModel;
    //     const categoriesModel = this.loadModel('categories') as categoryModel;
    //     const [products, categories] = await Promise.all([
    //         productsModel.findProductsQuantityPage(1, 6),
    //         categoriesModel.findAllCategories()
    //     ]);
    //     let categoryName: Record<string, string> = {};
    //     (categories).forEach((category: Category) => {
    //         categoryName[category._id] = category.name;
    //     });
    //     const renderListProducts = (products: Product[]) => {
    //         const listBoxProduct: HTMLElement = $('#container .content .table .tbody') as HTMLElement;
    //         Promise.all(products.map(async product => {
    //             if (!product || Object.keys(product).length === 0) {
    //                 return;
    //             }
    //             return `
    //                 <div class="row">
    //                   <div>${product._id}</div>
    //                   <div>${product.name}</div>
    //                   <div class="img"><img loading="lazy" src="${API.endPoint}images/uploads/${product.image}" alt=""></div>
    //                   <div>${categoryName[product.id_category]}</div>
    //                   <div>${product.designer}</div>
    //                   <div>${product.properties[0].price}$</div>
    //                   <div>
    //                     <span style="background: ${product.color}"></span>
    //                   </div>
    //                   <div><a data-id="${product._id}" class="detailProduct" href="#">Detail</a></div>
    //                 </div>
    //             `;
    //         })).then(htmlArray => {
    //             const html = htmlArray.join('');
    //             listBoxProduct.innerHTML += html;
    //         }).catch(error => {
    //             console.log(error);
    //         });
    //
    //     };
    //     this.loadViewAdmin('products', () => {
    //         ($('#productsLink') as HTMLElement).classList.add('active');
    //         renderListProducts(products);
    //     })
    // }
    //
    // async users(): Promise<void> {
    //     this.loadTitle('Users - Dashboard');
    //     this.loadCss('users');
    //     const usersModel = this.loadModel('users') as UsersModel;
    //     const users = await usersModel.findAllUsers();
    //     const renderUsers = async (users: User[]) => {
    //         const blockContainer = $('#container .content .table .tbody') as HTMLElement;
    //         const role: Record<number, string> = {
    //             0: 'user',
    //             1: 'admin',
    //         };
    //         let html = '';
    //         for (const user of users) {
    //             if (!user || Object.keys(user).length === 0) {
    //                 continue;
    //             }
    //             let image = '';
    //             if (user.image !== '') {
    //                 image = API.endPoint + 'images/uploads/' + user.image;
    //             } else {
    //                 image = './images/logo/icon.png';
    //             }
    //             html += `
    //                <div id="row-user-${user._id}" class="row">
    //                 <div>${user._id}</div>
    //                 <div class="name-user-${user._id}">${user.name}</div>
    //                 <a class="img"><img class="img-user-${user._id}" data-img="${user.image}" src="${image}" alt="" /></a>
    //                 <div class="email-user-${user._id}">${user.email}</div>
    //                 <div class="address-user-${user._id}">${user.address}</div>
    //                 <div class="phone-user-${user._id}">${user.phone}</div>
    //                 <div class="role-user-${user._id}">${role[parseInt(user.role)]}</div>
    //                 <div><a data-id-user="${user._id}" class="edit-user" href="admin/users">Edit</a> / <a data-id-user="${user._id}" class="remove-user" href="#">Remove</a></div>
    //                 <div class="password-user-${user._id}" style="display: none">${user.password}</div>
    //                </div>
    //         `;
    //         }
    //         blockContainer.innerHTML = html;
    //
    //         const edit = $$('.edit-user') as NodeListOf<HTMLElement>;
    //         edit.forEach((btn) => {
    //             const id = btn.getAttribute('data-id-user') as string;
    //             btn.addEventListener('click', (e) => {
    //                 e.preventDefault();
    //                 form('editUsers', id);
    //             });
    //         });
    //
    //         const remove = $$('.remove-user') as NodeListOf<HTMLElement>;
    //         remove.forEach((btn) => {
    //             const id = btn.getAttribute('data-id-user') as string;
    //             btn.addEventListener('click', (e) => {
    //                 e.preventDefault();
    //                 if (id === JSON.parse(localStorage.getItem('user') as string)._id) {
    //                     console.log('this is admin now');
    //                     notification('you cannot remove yourself from the system !', () => {
    //                         ($('#notification') as HTMLElement).remove();
    //                     })
    //                 } else {
    //                     confirm('removeUser', id);
    //                 }
    //             });
    //         })
    //     }
    //
    //     this.loadViewAdmin('users', async () => {
    //         ($('#usersLink') as HTMLElement).classList.add('active');
    //         ($('.addBtn') as HTMLElement).addEventListener('click', () => form('addUsers'));
    //         await renderUsers(users);
    //     })
    // }
    //
    // async orders() {
    //     this.loadCss('orders');
    //     this.loadTitle('Orders - Dashboard');
    //     const ordersModel = this.loadModel('orders') as ordersModel;
    //     const ordersList = await ordersModel.findAllOrders();
    //
    //     const renderOrder = async (orders : Order[]) => {
    //         const container = ($('#container .content .table .tbody') as HTMLElement);
    //         let html = '';
    //         for(let order of orders) {
    //             html += `
    //                 <dv class="row">
    //                     <div>${order._id}</div>
    //                     <div>
    //                         <div>Wrap : ${order.wrap}</div>
    //                         <div>Name : ${order.name}</div>
    //                         <div>Ship Fee : ${order.ship_fee}$</div>
    //                         <div>Distance : ${order.distance}km</div>
    //                         <div>Adress : ${order.address}</div>
    //                         <div>Phone number : ${order.phone}</div>
    //                         <div>Email : ${order.email}</div>
    //                     </div>
    //                     <div>${order.order_date}</div>
    //                     <div>${order.total}$</div>
    //                     <div>${order_status[order.order_status]}</div>
    //                     <div>
    //                         <a class="detail" data-id="${order._id}" href="#">Detail</a>
    //                             -
    //                          <a class="update" data-id="${order._id}" href="#">Update</a>
    //                     </div>
    //                 </dv>
    //             `;
    //         }
    //         container.innerHTML = html;
    //         ($$('#container .content .table .tbody .row a.detail') as NodeListOf<HTMLElement>).forEach(detail => {
    //             detail.addEventListener('click', (e) => {
    //                 e.preventDefault();
    //                 form('detailOrder', detail.getAttribute('data-id'));
    //             })
    //         });
    //         ($$('#container .content .table .tbody .row a.update') as NodeListOf<HTMLElement>).forEach(update => {
    //             update.addEventListener('click', (e) => {
    //                 e.preventDefault();
    //                 form('detailOrder', update.getAttribute('data-id'));
    //             })
    //         })
    //     }
    //     this.loadViewAdmin('orders', async () => {
    //         ($('#ordersLink') as HTMLElement).classList.add('active');
    //         await renderOrder(ordersList);
    //     })
    // }
    //
    // async vouchers(): Promise<void> {
    //     this.loadCss('voucher');
    //     this.loadTitle('Vouchers- Dashboard');
    //     const voucherModel = this.loadModel('vouchers') as VouchersModel;
    //     const vouchersList = await voucherModel.getAllVouchersByPage(1, 10);
    //
    //     const renderVoucher = (vouchers: Voucher[]): void => {
    //         const container = $('#container .content .table .tbody') as HTMLElement;
    //         let html: string = '';
    //         vouchers.map((voucher) => {
    //             html += `
    //                 <div class="row" id="row-${voucher._id}">
    //                     <div class="id-${voucher._id}">${voucher._id}</div>
    //                     <div class="code-${voucher._id}">${voucher.code}</div>
    //                     <div class="discount-${voucher._id}">${voucher.discount}%</div>
    //                     <div class="date_end-${voucher._id}">${voucher.date_end}</div>
    //                     <div class="min_amount-${voucher._id}">${voucher.min_amount}$</div>
    //                     <div class="expired-${voucher._id}">${voucher.expired}</div>
    //                     <div>
    //                         <a data-id="${voucher._id}" class="edit" href="#">Edit</a>
    //                         /
    //                         <a data-id="${voucher._id}" class="remove" href="#">Remove</a>
    //                     </div>
    //                 </div>
    //             `;
    //         })
    //         container.innerHTML = html;
    //         ($$('.remove') as NodeListOf<HTMLElement>).forEach(remove => {
    //             remove.addEventListener('click', (e: MouseEvent) => {
    //                 e.preventDefault();
    //                 const id = (e.target as HTMLElement).getAttribute('data-id') as string;
    //                 confirm('removeVoucher', id);
    //             })
    //         });
    //         ($$('.edit') as NodeListOf<HTMLElement>).forEach(edit => {
    //             edit.addEventListener('click', (e: MouseEvent) => {
    //                 e.preventDefault();
    //                 const id = (e.target as HTMLElement).getAttribute('data-id') as string;
    //                 form('editVoucher', id);
    //             })
    //         })
    //     }
    //
    //     this.loadViewAdmin('voucher', () => {
    //         ($('#vouchersLink') as HTMLElement).classList.add('active');
    //         ($('.addBtn') as HTMLElement).addEventListener('click', () => form('addVoucher'));
    //         renderVoucher(vouchersList);
    //     })
    // }
    //
    // async delivery(): Promise<void> {
    //     this.loadCss('delivery');
    //     this.loadTitle('Delivery - Dashboard');
    //     const deliveriesModel = this.loadModel('deliveries') as DeliveriesModel;
    //
    //     const renderDeliveries = (deliveries: Delivery[]) => {
    //         const container = $('#container .content .table .tbody') as HTMLElement;
    //         let convertStatus: Record<number, string> = {
    //             0: 'suspended',
    //             1: 'active'
    //         }
    //         let html = '';
    //         deliveries.map(delivery => {
    //             html += `
    //                 <div class="row ">
    //                     <div>${delivery._id}</div>
    //                     <div>${delivery.name}</div>
    //                     <div>${delivery.price}</div>
    //                     <div>${delivery.speed}</div>
    //                     <div>${convertStatus[delivery.status]}</div>
    //                     <div>
    //                         <a href="#" class="edit" data-id="${delivery._id}">edit</a> / <a href="#" class="remove" data-id="${delivery._id}">remove</a>
    //                     </div>
    //                 </div>
    //             `;
    //         })
    //         container.innerHTML = html;
    //
    //         ($$('.edit') as NodeListOf<HTMLElement>).forEach(edit => {
    //             edit.addEventListener('click', (e: Event) => {
    //                 e.preventDefault();
    //                 console.log(12)
    //             })
    //         });
    //         ($$('.remove') as NodeListOf<HTMLElement>).forEach(remove => {
    //             remove.addEventListener('click', (e: Event) => {
    //                 e.preventDefault();
    //                 confirm('removeDelivery', remove.getAttribute('data-id') as string);
    //             })
    //         })
    //     }
    //
    //     this.loadViewAdmin('delivery', async () => {
    //         ($('#deliveryLink') as HTMLElement).classList.add('active');
    //         ($('#container .content .addBtn') as HTMLElement).addEventListener('click', () => {
    //             form('addDelivery')
    //         });
    //         const deliveryList = await deliveriesModel.findDeliveriesByPage(1, 10);
    //         console.log(deliveryList)
    //         renderDeliveries(deliveryList);
    //
    //     })
    // }
}
