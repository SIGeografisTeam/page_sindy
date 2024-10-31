import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/api.js';
import { onClick } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/element.js';

onClick('buttonsimpaninfouser', saveUserInfo);

document.addEventListener('DOMContentLoaded', function() {
    checkCookies();
    fetch('./data/menu.json')
        .then(response => response.json())
        .then(data => {
            renderMenu(data);
        })
        .catch(error => console.error('Gagal memuat menu:', error));
});

function checkCookies() {
    const userName = getCookie("name");
    const userWhatsapp = getCookie("whatsapp");
    const userAddress = getCookie("address");

    if (!userName || !userWhatsapp || !userAddress) {
        document.getElementById('userModal').style.display = 'flex';
    } else {
        document.getElementById('userModal').style.display = 'none';
    }
}

function saveUserInfo() {
    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const address = document.getElementById('address').value;

    if (name && whatsapp && address) {
        setCookie("name", name, 365);
        setCookie("whatsapp", whatsapp, 365);
        setCookie("address", address, 365);
        document.getElementById('userModal').style.display = 'none';
    } else {
        alert("Silakan masukkan semua informasi.");
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function renderMenu(menuItems) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';

    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';

        menuItem.innerHTML = `
            <img src="./menu/${item.image}" alt="${item.name}" class="menu-image">
            <div class="menu-info">
                <h3>${item.name}</h3>
                <p class="price">Rp ${item.price.toLocaleString()}</p>
            </div>
            <button class="tambah-btn" onclick="tambahPesanan('${item.id}', '${item.name}', ${item.price})">Tambah</button>
        `;

        menuGrid.appendChild(menuItem);
    });
}

// Fungsi untuk menambahkan item ke pesanan
function tambahPesanan(id, name, price) {
    const qtyInput = document.getElementById(`qty${id}`);
    if (qtyInput) {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    } else {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `qty${id}`;
        input.name = `qty${id}`;
        input.value = 1;
        input.setAttribute('data-price', price);
        input.setAttribute('data-name', name);
        input.style.display = 'none';
        document.body.appendChild(input);
    }
    hitungTotal();
}

function hitungTotal() {
    const inputs = document.querySelectorAll('input[type="number"]');
    let total = 0;
    let pesanan = [];
    const rek = "Pembayaran akan dilakukan dengan transfer ke rekening\nBCA 7750878347\nNedi Sopian";
    const userName = getCookie("name");
    const userWhatsapp = getCookie("whatsapp");
    const userAddress = getCookie("address");

    inputs.forEach(input => {
        const quantity = parseInt(input.value);
        const price = parseInt(input.getAttribute('data-price'));
        const name = input.getAttribute('data-name');

        if (quantity > 0) {
            total += quantity * price;
            pesanan.push(`${name} x${quantity} - Rp ${(quantity * price).toLocaleString()}`);
        }
    });

    document.getElementById('totalPrice').innerText = total.toLocaleString();

    const orderList = document.getElementById('orderList');
    orderList.innerHTML = '';
    pesanan.forEach(order => {
        const li = document.createElement('li');
        li.innerText = order;
        orderList.appendChild(li);
    });

    const whatsappLink = document.getElementById('whatsappLink');
    const message = `Saya ingin memesan:\n${pesanan.join('\n')}\n\nTotal: Rp ${total.toLocaleString()}\n\n${rek}\n\nNama: ${userName}\nNomor WhatsApp: ${userWhatsapp}\nAlamat: ${userAddress}`;
    whatsappLink.href = `https://wa.me/628111269691?text=${encodeURIComponent(message)}`;
}

// Fungsi lain tetap sama

// Event listener untuk pencarian menu
document.getElementById("searchInput").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase();
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach((item) => {
        const itemName = item.querySelector(".item-name").textContent.toLowerCase();
        
        // Tampilkan hanya menu yang cocok dengan kata kunci pencarian
        if (itemName.includes(searchValue)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
});
