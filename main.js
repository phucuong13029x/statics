document.addEventListener('DOMContentLoaded', function () {
    var menuLinks = document.querySelectorAll('.list-group-flush li a');
    menuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            var activeLink = document.querySelector('.list-group-flush li a.text-primary');
            if (activeLink) {
                activeLink.classList.remove('text-primary');
                activeLink.classList.add('text-reset');
            };
            this.classList.remove('text-reset');
            this.classList.add('text-primary');
        });

        if (window.location.href.indexOf(link.getAttribute('href').trim()) > -1) {
            link.classList.remove('text-reset');
            link.classList.add('text-primary');
        }
    });
});

function callService(method, url, data = {}) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: method,
            url: url,
            contentType: "application/json; charset=utf8",
            data: method === "GET" ? null : JSON.stringify(data),
            success: function (response) {
                resolve(response);
            },
            error: function (response) {
                reject(response);
            },
            timeout: 120000
        });
    });
}

function _(e) {
    return document.getElementById(e);
};

function rmmodel(className) {
    var elements = document.querySelectorAll('.' + className);
    elements.forEach(function(element) { element.remove(); });
};

// POPUP ACCESS
function createPopup() {
    try {
        const popupHTML = `
            <div class="modal fade" id="modalaccept" tabindex="-1" data-mdb-backdrop="static" data-mdb-keyboard="false" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content text-center">
                        <div class="modal-header bg-danger text-white d-flex justify-content-center">
                            <h5 class="modal-title"></h5>
                        </div>
                        <div class="modal-body"><i class="fas fa-times fa-3x text-danger"></i></div>
                        <div class="modal-footer d-flex justify-content-center">
                            <button type="button" class="btn btn-danger" data-mdb-ripple-init data-mdb-dismiss="modal">Không</button>
                            <button type="button" class="btn btn-outline-danger" data-mdb-ripple-init data-mdb-dismiss="modal">Có</button>
                        </div>
                    </div>
                </div>
            </div>`;
        const temp = document.createElement('div');
        temp.innerHTML = popupHTML;
        const popup = temp.firstElementChild;
        document.body.appendChild(popup);
        const popups = _('modalaccept');
        if (popups) {
            popups.addEventListener('show.mdb.modal', (e) => {
                const button = e.relatedTarget;
                const recipient = button.getAttribute('data-mdb-title');
                const modalTitle = popups.querySelector('.modal-title');
                modalTitle.textContent = recipient;
                const step = button.getAttribute('data-mdb-step');
                if (step) {
                    const modal_bt_done = popups.querySelector('.modal-footer button.btn-outline-danger');
                    modal_bt_done.onclick = () => {
                        if (typeof window[step] === 'function') {
                            const meta = button.getAttribute('data-mdb-meta');
                            window[step](meta);
                        }
                    };
                }
            });
        }
    } catch (e) {
        showAlert('alert-warning', 'Hệ thống đang tải. Vui lòng thao tác lại.');
    };
};
createPopup();

function editPopup() {
    const popupedithtml = `
    <div class="modal fade" id="modaledit" tabindex="-1" data-mdb-keyboard="false" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="col-form-label">Phone:</label>
                        <input name="phone" type="number" class="form-control" disable /></div>
                    <div class="mb-3">
                        <label class="col-form-label">Email:</label>
                        <input name="email" type="text" class="form-control" /></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-mdb-ripple-init data-mdb-dismiss="modal">Không</button>
                    <button class="btn btn-primary" data-mdb-ripple-init data-mdb-dismiss="modal">Thực hiện</button>
                </div>
            </div>
        </div>
    </div>`;
    const temp = document.createElement('div');
    temp.innerHTML = popupedithtml;
    const popupedit = temp.firstElementChild;
    document.body.appendChild(popupedit);
    const popupedits = _('modaledit');
    if (popupedits) {
        try {
            popupedits.addEventListener('show.mdb.modal', (e) => {
                const button = e.relatedTarget;
                const recipient = button.getAttribute('data-mdb-title');
                const modalTitle = popupedits.querySelector('.modal-title');
                modalTitle.textContent = `Thay đổi thông tin ${recipient}`;
                const meta = button.getAttribute('data-mdb-meta');
                let meta_new = meta.split("|");
                popupedits.querySelector('input[name="phone"]').value = meta_new[0];
                popupedits.querySelector('input[name="email"]').value = meta_new[1];
                const step = button.getAttribute('data-mdb-step');
                if (step) {
                    const modal_bt_done = popupedits.querySelector('.modal-footer button.btn-primary');
                    modal_bt_done.onclick = () => {
                        if (typeof window[step] === 'function') {
                            let p = popupedits.querySelector('input[name="phone"]').value;
                            let e = popupedits.querySelector('input[name="email"]').value;
                            window[step]({'item':'account','control':'update','email':e,'phone':p});
                        }
                    };
                }
            });
        } catch (e) {
            console.log(e);
            showAlert('alert-warning', 'Hệ thống đang tải. Vui lòng thao tác lại.');
        };
    }
};

// function showAlert(t, m) {
//     rmmodel('alert');
//     if (!m) {return;}
//     const alert = document.createElement('div');
//     alert.innerHTML = `
//         <div class="d-flex justify-content-between">
//             <p class="mb-0">${m}</p>
//             <button type="button" class="ms-2 btn-close" data-mdb-dismiss="alert" aria-label="Close"></button>
//         </div>
//     `;
//     alert.classList.add('alert', 'fade', t);
//     document.body.appendChild(alert);
//     const alertInstance = new mdb.Alert(alert, {
//         stacking: true,
//         hidden: true,
//         position: 'top-right',
//         autohide: true,
//         delay: 3000,
//     });
//     alertInstance.show();
// }
// setInterval(rmmodel('alert'), 10000);

function showAlert(t, m) {
    rmmodel('alert');
    if (!m) return;

    const alert = document.createElement('div');
    alert.innerHTML = `
        <div class="d-flex justify-content-between">
            <p class="mb-0">${m}</p>
            <button type="button" class="ms-2 btn-close" data-mdb-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Tách class nếu t là chuỗi nhiều class
    if (t) {
        const classes = t.trim().split(/\s+/);
        alert.classList.add('alert', 'fade', ...classes);
    } else {
        alert.classList.add('alert', 'fade');
    }

    document.body.appendChild(alert);

    const alertInstance = new mdb.Alert(alert, {
        stacking: true,
        hidden: true,
        position: 'top-right',
        autohide: true,
        delay: 3000,
    });

    alertInstance.show();
}
// Đúng cách dùng setInterval
setInterval(() => rmmodel('alert'), 10000);

function fdate(dateString) {
    let date = new Date(dateString);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function export_to_excel(tableid, sheetname, filename = 'data-export') {
    let table = document.getElementById(tableid);
    if (table) {
        try {
            const wb = XLSX.utils.book_new();
            let tableData = XLSX.utils.table_to_sheet(table, {dateNF:'dd/mm/yyyy;@', cellDates:true, raw:true});
            let data = XLSX.utils.sheet_to_json(tableData, { header: 1 });
            let data_style = data.map(row => row.map(cell => {
                let c = {};
                if (data.indexOf(row) == 0) {
                    c = {
                        v: cell,
                        t: 's',
                        s: {
                            font: {
                                name: 'Arial',
                                bold: true,
                                color: {
                                    rgb: 'FFFFFF'
                                },
                                sz: 11
                            },
                            alignment: {
                                vertical: 'center',
                                horizontal: 'center'
                            },
                            fill: {
                                fgColor: {
                                    rgb: '696969'
                                }
                            },
                            border: {
                                top: {
                                    style: 'thin',
                                    color: '000000'
                                },
                                bottom: {
                                    style: 'thin',
                                    color: '000000'
                                },
                                left: {
                                    style: 'thin',
                                    color: '000000'
                                },
                                right: {
                                    style: 'thin',
                                    color: '000000'
                                }
                            }
                        }
                    }
                } else {
                    c = {
                        v: cell,
                        t: 's',
                        s: {
                            font: {
                                name: 'Arial',
                                sz: 11
                            },
                            alignment: {
                                vertical: 'center',
                                horizontal: 'center'
                            },
                            border: {
                                top: {
                                    style: 'thin',
                                    color: '000000'
                                },
                                bottom: {
                                    style: 'thin',
                                    color: '000000'
                                },
                                left: {
                                    style: 'thin',
                                    color: '000000'
                                },
                                right: {
                                    style: 'thin',
                                    color: '000000'
                                }
                            }
                        }
                    }
                }
                return c;
            }));
            let redata = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
            let max_width = redata.map(column => {
                let max_item = column.reduce((a, b) => {
                    if (b !== undefined) {
                        return a.toString().length > b.toString().length ? a : b;
                    } else {
                        return a
                    }
                });
                return { width: max_item.toString().length + 5 };
            });
            const ws = XLSX.utils.aoa_to_sheet(data_style);
            ws['!cols'] = max_width;
            XLSX.utils.book_append_sheet(wb, ws, sheetname);
            XLSX.writeFile(wb, filename + ".xlsx");
        } catch (e) {
            console.log(e);
            showAlert('alert-danger', 'Xuất dữ liệu bị lỗi');
        };
    } else {
        showAlert('alert-danger', 'Không tìm thấy dữ liệu');
    };
};

// document.querySelector('input[name="customerno"]').addEventListener('keyup', val, false);
// function val() {
//     if (this.value.includes("004") === false) {
//         this.value = "004" + this.value.substr(this.value.indexOf(' ') + 1);
//         this.value = this.value.replace("004004", "004");
//     }
// };

function btD(e, name) {
    let bts = document.querySelectorAll('button');
    if (name != "") { bts = document.querySelectorAll(`button[name="${name}"]`);}
    if (e === true) { bts.forEach(button => button.setAttribute('disabled', ''));
    } else { bts.forEach(button => button.removeAttribute('disabled')); }
}

function fetchData(url, method = "GET", body = null, callback, retries = 1) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, `https://${window.location.hostname}${url}`, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        callback(data);
      }
      else if (xhr.status === 504 && retries > 0) {
        showAlert("alert-warning", `Gateway Timeout. Retrying...`);
        setTimeout(() => {
          fetchData(`https://${window.location.hostname}${url}`, method, body, callback, retries - 1);
        }, 10000);
      } else {
        showAlert("alert-danger", `Error: ${xhr.statusText || "Unknown error"}`);
      };
      callback(null);
    }
  };
  xhr.send(body); // Send the body (if any)
}
