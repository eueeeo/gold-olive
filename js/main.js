var productNamesMap = {
    'Classic Bottle 0.5L': 'Классическое в стекле 0.5 л',
    'Traditional Mild 0.5L': 'Мягкое традиционное 0.5 л',
    'Siena Herbs 0.5L': 'Сиена с пряными травами 0.5 л',
    'Early Green Harvest 0.5L': 'Зелёный сбор ранний 0.5 л',
    'Early Harvest Can 5L': 'Ранний урожай канистра 5 л',
    'Early Harvest 5L': 'Ранний урожай канистра 5 л',
    'Sizma Unfiltered 2.5L': 'Сызма нефильтрованное 2.5 л',
    'Riviera Bag-in-Box 3L': 'Ривьера в боксе с краном 3 л',
    'Tasting Mini-Set': 'Дегустационный мини-сет',
    'Wooden Gift Box': 'Набор в деревянной шкатулке',
    'Gift Trio Box': 'Подарочный бокс трёх вкусов',
    'Premium Glass Bottle': 'Премиальная стеклянная бутылка'
};

var catalogPrices = {
    'Классическое в стекле 0.5 л': 180,
    'Мягкое традиционное 0.5 л': 190,
    'Сиена с пряными травами 0.5 л': 210,
    'Зелёный сбор ранний 0.5 л': 220,
    'Ранний урожай канистра 5 л': 690,
    'Сызма нефильтрованное 2.5 л': 430,
    'Ривьера в боксе с краном 3 л': 470,
    'Дегустационный мини-сет': 350,
    'Набор в деревянной шкатулке': 590,
    'Подарочный бокс трёх вкусов': 420,
    'Премиальная стеклянная бутылка': 480
};

var productImagesMap = {
    'Классическое в стекле 0.5 л': 'img/core1.png',
    'Мягкое традиционное 0.5 л': 'img/core2.png',
    'Сиена с пряными травами 0.5 л': 'img/core3.png',
    'Зелёный сбор ранний 0.5 л': 'img/core4.png',
    'Ранний урожай канистра 5 л': 'img/family1.png',
    'Сызма нефильтрованное 2.5 л': 'img/family2.png',
    'Ривьера в боксе с краном 3 л': 'img/family3.png',
    'Дегустационный мини-сет': 'img/core-set.png',
    'Набор в деревянной шкатулке': 'img/gift1.png',
    'Подарочный бокс трёх вкусов': 'img/gift2.png',
    'Премиальная стеклянная бутылка': 'img/gift3.png'
};

function toggleMenu() {
    var menu = document.getElementById('menu');
    var btn = document.querySelector('.burger');
    if (!menu) return;
    menu.classList.toggle('active');
    var isOpen = menu.classList.contains('active');
    if (btn) {
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
}

function toggleTheme() {
    var isDark = document.body.classList.toggle('dark');
    document.documentElement.classList.toggle('dark', isDark);
    try {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {}
}

function loadTheme() {
    try {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
        } else if (theme === 'light') {
            document.body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
        }
    } catch (e) {}
}

function getCart() {
    try {
        var data = localStorage.getItem('gold_olive_cart');
        if (!data) return [];
        var parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
            var valid = [];
            for (var i = 0; i < parsed.length; i++) {
                var it = parsed[i];
                if (it && typeof it.name === 'string' && typeof it.qty === 'number' && it.qty > 0) {
                    valid.push({
                        name: it.name,
                        price: typeof it.price === 'number' ? it.price : (catalogPrices[it.name] || 180),
                        qty: it.qty
                    });
                }
            }
            return valid;
        }
    } catch (e) {}
    return [];
}

function saveCart(cart) {
    try {
        localStorage.setItem('gold_olive_cart', JSON.stringify(cart));
    } catch (e) {}
}

function addToCart(productName, count) {
    if (!productName) return;
    var mapped = productNamesMap[productName] || productName;
    var cart = getCart();
    var price = catalogPrices[mapped] || 180;
    var addCount = (typeof count === 'number' && count > 0) ? count : 1;
    var found = false;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === mapped) {
            cart[i].qty += addCount;
            found = true;
            break;
        }
    }

    if (!found) {
        cart.push({
            name: mapped,
            price: price,
            qty: addCount
        });
    }

    saveCart(cart);
    renderOrderCart();
}

function changeOrderQty(productName, delta) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === productName) {
            cart[i].qty += delta;
            if (cart[i].qty <= 0) {
                cart.splice(i, 1);
            }
            break;
        }
    }
    saveCart(cart);
    renderOrderCart();
    syncProductSelectWithCart();
}

function removeOrderItem(productName) {
    var cart = getCart();
    var updated = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name !== productName) {
            updated.push(cart[i]);
        }
    }
    saveCart(updated);
    renderOrderCart();
    syncProductSelectWithCart();
}

function syncProductSelectWithCart() {
    var select = document.getElementById('product');
    if (!select) return;
    var cart = getCart();
    if (cart.length > 0) {
        select.value = cart[0].name;
    } else {
        select.value = '';
    }
}

function addProductFromSelect() {
    var select = document.getElementById('product');
    if (!select || !select.value) return;
    addToCart(select.value, 1);
}

function renderOrderCart() {
    var cartBox = document.getElementById('orderCart');
    if (!cartBox) return;

    var cart = getCart();
    cartBox.textContent = '';

    if (cart.length === 0) {
        var emptyDiv = document.createElement('div');
        emptyDiv.className = 'cart-empty-state';
        var p = document.createElement('p');
        p.textContent = 'В заказе пока нет выбранных товаров.';
        emptyDiv.appendChild(p);
        var link = document.createElement('a');
        link.href = 'catalog.html';
        link.className = 'btn btn-sm';
        link.textContent = 'Перейти в каталог';
        emptyDiv.appendChild(link);
        cartBox.appendChild(emptyDiv);
        return;
    }

    var list = document.createElement('div');
    list.className = 'cart-items-list';

    var totalSum = 0;

    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.qty;
        totalSum += itemTotal;

        var row = document.createElement('div');
        row.className = 'checkout-cart-item';

        var img = document.createElement('img');
        img.src = productImagesMap[item.name] || 'img/core1.png';
        img.alt = item.name;
        img.className = 'checkout-cart-thumb';
        row.appendChild(img);

        var details = document.createElement('div');
        details.className = 'checkout-cart-details';
        var nameSpan = document.createElement('div');
        nameSpan.className = 'checkout-cart-name';
        nameSpan.textContent = item.name;
        var unitPriceSpan = document.createElement('div');
        unitPriceSpan.className = 'checkout-cart-price';
        unitPriceSpan.textContent = '₺' + item.price + ' / шт.';
        details.appendChild(nameSpan);
        details.appendChild(unitPriceSpan);
        row.appendChild(details);

        var stepper = document.createElement('div');
        stepper.className = 'checkout-cart-stepper';

        var minusBtn = document.createElement('button');
        minusBtn.type = 'button';
        minusBtn.className = 'cart-qty-btn';
        minusBtn.textContent = '-';
        (function (n) {
            minusBtn.onclick = function () { changeOrderQty(n, -1); };
        })(item.name);
        stepper.appendChild(minusBtn);

        var qtySpan = document.createElement('span');
        qtySpan.className = 'cart-qty-val';
        qtySpan.textContent = String(item.qty);
        stepper.appendChild(qtySpan);

        var plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.className = 'cart-qty-btn';
        plusBtn.textContent = '+';
        (function (n) {
            plusBtn.onclick = function () { changeOrderQty(n, 1); };
        })(item.name);
        stepper.appendChild(plusBtn);

        row.appendChild(stepper);

        var sumSpan = document.createElement('div');
        sumSpan.className = 'checkout-cart-sum';
        sumSpan.textContent = '₺' + itemTotal;
        row.appendChild(sumSpan);

        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'checkout-cart-del';
        delBtn.textContent = 'Удалить';
        (function (n) {
            delBtn.onclick = function () { removeOrderItem(n); };
        })(item.name);
        row.appendChild(delBtn);

        list.appendChild(row);
    }

    cartBox.appendChild(list);

    var totals = document.createElement('div');
    totals.className = 'checkout-totals-box';

    var row1 = document.createElement('div');
    row1.className = 'checkout-totals-row';
    var r1Label = document.createElement('span');
    r1Label.textContent = 'Товары:';
    var r1Val = document.createElement('span');
    r1Val.textContent = '₺' + totalSum;
    row1.appendChild(r1Label);
    row1.appendChild(r1Val);
    totals.appendChild(row1);

    var row2 = document.createElement('div');
    row2.className = 'checkout-totals-row';
    var r2Label = document.createElement('span');
    r2Label.textContent = 'Доставка:';
    var r2Val = document.createElement('span');
    r2Val.className = 'checkout-free-badge';
    r2Val.textContent = 'Бесплатно';
    row2.appendChild(r2Label);
    row2.appendChild(r2Val);
    totals.appendChild(row2);

    var finalRow = document.createElement('div');
    finalRow.className = 'checkout-totals-final';
    var fLabel = document.createElement('span');
    fLabel.textContent = 'Итого к оплате:';
    var fVal = document.createElement('strong');
    fVal.textContent = '₺' + totalSum;
    finalRow.appendChild(fLabel);
    finalRow.appendChild(fVal);
    totals.appendChild(finalRow);

    cartBox.appendChild(totals);
}

function orderProduct(name) {
    try {
        localStorage.setItem('orderProduct', name);
    } catch (e) {}
    var mapped = productNamesMap[name] || name;
    addToCart(mapped, 1);
    location.href = 'contacts.html#order';
}

function loadOrder() {
    try {
        var product = localStorage.getItem('orderProduct');
        var select = document.getElementById('product');
        if (product) {
            var mapped = productNamesMap[product] || product;
            if (select) {
                var matched = false;
                if (select.options && select.options.length) {
                    for (var i = 0; i < select.options.length; i++) {
                        var optVal = select.options[i].value;
                        if (optVal === mapped || optVal === product) {
                            select.value = optVal;
                            matched = true;
                            break;
                        }
                    }
                }
                if (!matched) {
                    select.value = product;
                }
            }
            var cart = getCart();
            var alreadyInCart = false;
            for (var c = 0; c < cart.length; c++) {
                if (cart[c].name === mapped) {
                    alreadyInCart = true;
                    break;
                }
            }
            if (!alreadyInCart) {
                addToCart(mapped, 1);
            }
        }
        renderOrderCart();
    } catch (e) {}
}

function checkForm(name, phone, email) {
    if (name.length < 2) return 'Введите имя';
    if (phone.length < 6) return 'Введите телефон';
    if (email.indexOf('@') === -1) return 'Введите правильный email';
    return '';
}

function sendOrder() {
    var nameInput = document.getElementById('orderName');
    var phoneInput = document.getElementById('orderPhone');
    var emailInput = document.getElementById('orderEmail');
    var productSelect = document.getElementById('product');
    var msg = document.getElementById('orderMsg');
    var addressInput = document.getElementById('orderAddress');

    if (!nameInput || !phoneInput || !emailInput || !productSelect || !msg) return false;

    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var email = emailInput.value.trim();
    var product = productSelect.value;
    var cart = getCart();

    var error = '';
    if (name.length < 2) {
        error = 'Введите имя';
    } else if (phone.length < 6) {
        error = 'Введите телефон';
    } else if (email.indexOf('@') === -1) {
        error = 'Введите правильный email';
    } else if (cart.length === 0 && (!product || product === '')) {
        error = 'Выберите товар';
    }

    if (error) {
        msg.className = 'message error';
        msg.textContent = error;
    } else {
        msg.className = 'message';
        msg.textContent = 'Спасибо за заказ!';
        nameInput.value = '';
        phoneInput.value = '';
        emailInput.value = '';
        productSelect.value = '';
        if (addressInput) addressInput.value = '';
        saveCart([]);
        try {
            localStorage.removeItem('orderProduct');
        } catch (e) {}
        renderOrderCart();
    }
    return false;
}

function sendContact() {
    var nameInput = document.getElementById('contactName');
    var phoneInput = document.getElementById('contactPhone');
    var emailInput = document.getElementById('contactEmail');
    var messageInput = document.getElementById('contactMessage');
    var msg = document.getElementById('contactMsg');

    if (!nameInput || !phoneInput || !emailInput || !messageInput || !msg) return false;

    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var email = emailInput.value.trim();
    var message = messageInput.value.trim();

    var error = '';
    if (name.length < 2) {
        error = 'Введите имя';
    } else if (phone.length < 6) {
        error = 'Введите телефон';
    } else if (email.indexOf('@') === -1) {
        error = 'Введите правильный email';
    } else if (message.length < 3) {
        error = 'Введите сообщение';
    }

    if (error) {
        msg.className = 'message error';
        msg.textContent = error;
    } else {
        msg.className = 'message';
        msg.textContent = 'Сообщение отправлено!';
        nameInput.value = '';
        phoneInput.value = '';
        emailInput.value = '';
        messageInput.value = '';
    }
    return false;
}

function getStoredReviews() {
    try {
        var data = localStorage.getItem('reviews');
        if (!data) return [];
        var parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
            var valid = [];
            var cleaned = false;
            for (var i = 0; i < parsed.length; i++) {
                var item = parsed[i];
                if (item && typeof item.name === 'string' && typeof item.text === 'string') {
                    if (item.name.indexOf('<') !== -1 || item.text.indexOf('<') !== -1 ||
                        item.name.indexOf('alert(') !== -1 || item.text.indexOf('alert(') !== -1) {
                        cleaned = true;
                        continue;
                    }
                    valid.push({
                        name: item.name,
                        text: item.text,
                        date: typeof item.date === 'string' ? item.date : 'Недавно',
                        tag: typeof item.tag === 'string' ? item.tag : 'Покупатель'
                    });
                }
            }
            if (cleaned) {
                try {
                    localStorage.setItem('reviews', JSON.stringify(valid));
                } catch (e) {}
            }
            return valid;
        }
    } catch (e) {}
    return [];
}

function getInitials(name) {
    if (!name) return 'ОП';
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase();
}

function addReview() {
    var nameInput = document.getElementById('reviewName');
    var textInput = document.getElementById('reviewText');
    var msg = document.getElementById('reviewMsg');

    if (!nameInput || !textInput || !msg) return false;

    var name = nameInput.value.trim();
    var text = textInput.value.trim();

    if (name.length < 2 || text.length < 3) {
        msg.className = 'message error';
        msg.textContent = 'Заполните имя и отзыв';
        return false;
    }

    if (name.indexOf('<') !== -1 || text.indexOf('<') !== -1 ||
        name.indexOf('alert(') !== -1 || text.indexOf('alert(') !== -1 ||
        /<[a-z/][\s\S]*>/i.test(name) || /<[a-z/][\s\S]*>/i.test(text)) {
        msg.className = 'message error';
        msg.textContent = 'Текст не должен содержать HTML-теги или программный код';
        return false;
    }

    var reviews = getStoredReviews();
    reviews.push({
        name: name,
        text: text,
        date: 'Сегодня',
        tag: 'Покупатель'
    });

    try {
        localStorage.setItem('reviews', JSON.stringify(reviews));
    } catch (e) {
        msg.className = 'message error';
        msg.textContent = 'Не удалось сохранить отзыв';
        return false;
    }

    nameInput.value = '';
    textInput.value = '';
    msg.className = 'message';
    msg.textContent = 'Отзыв добавлен';
    showReviews();
    return false;
}

function showReviews() {
    var block = document.getElementById('reviewsList');
    if (!block) return;

    block.textContent = '';

    var initialReviews = [
        {
            name: 'Анна Михайлова',
            text: 'Заказываю масло уже третий раз. У масла очень мягкий и свежий травяной вкус, идеальный баланс кислотности (0.4%). Заправляем салаты и делаем соусы — семья в восторге.',
            date: '12 ноября 2026',
            tag: 'Проверенная покупка'
        },
        {
            name: 'Илья Сергеев',
            text: 'Взяли жестяную канистру 5 л для большой кухни. Удобный выдвижной носик, масло не капает мимо. Доставка до Москвы заняла всего 3 дня, упаковка надёжная в толстый крафт.',
            date: '28 октября 2026',
            tag: 'Проверенная покупка'
        },
        {
            name: 'Елена Воронина',
            text: 'Подарочный бокс трёх вкусов превзошёл ожидания: оформление очень эстетичное, бутылки из тёмного стекла сохраняют аромат. Отличный подарок коллегам и близким!',
            date: '15 октября 2026',
            tag: 'Проверенная покупка'
        },
        {
            name: 'Дмитрий Ковалёв',
            text: 'Настоящее эгейское оливковое масло первого отжима. Отчётливый аромат свежескошенной травы и приятное миндальное послевкусие. Рекомендую всем ценителям качества.',
            date: '3 октября 2026',
            tag: 'Проверенная покупка'
        }
    ];

    var userReviews = getStoredReviews();
    var allReviews = initialReviews.concat(userReviews);

    for (var i = 0; i < allReviews.length; i++) {
        var item = allReviews[i];
        var card = document.createElement('article');
        card.className = 'review-card';

        var header = document.createElement('div');
        header.className = 'review-card-header';

        var avatar = document.createElement('div');
        avatar.className = 'review-avatar';
        avatar.textContent = getInitials(item.name);
        header.appendChild(avatar);

        var info = document.createElement('div');
        info.className = 'review-author-info';

        var nameDiv = document.createElement('div');
        nameDiv.className = 'review-author-name';
        nameDiv.textContent = item.name;
        info.appendChild(nameDiv);

        var meta = document.createElement('div');
        meta.className = 'review-meta';

        var verified = document.createElement('span');
        verified.className = 'review-verified';
        verified.textContent = item.tag || 'Покупатель';
        meta.appendChild(verified);

        var sep = document.createElement('span');
        sep.textContent = ', ';
        meta.appendChild(sep);

        var dateSpan = document.createElement('span');
        dateSpan.textContent = item.date || 'Недавно';
        meta.appendChild(dateSpan);

        info.appendChild(meta);
        header.appendChild(info);
        card.appendChild(header);

        var stars = document.createElement('div');
        stars.className = 'review-stars';
        stars.setAttribute('aria-label', 'Оценка 5 из 5');
        stars.textContent = 'Оценка 5 из 5';
        card.appendChild(stars);

        var textP = document.createElement('p');
        textP.className = 'review-text';
        textP.textContent = item.text;
        card.appendChild(textP);

        block.appendChild(card);
    }
}

function showClimate(event, title, type, summer, winter, text) {
    var aside = document.getElementById('climateInfo');
    if (!aside) return;

    var safeTitle = document.createElement('h3');
    safeTitle.textContent = title;

    var p1 = document.createElement('p');
    var b1 = document.createElement('b');
    b1.textContent = 'Тип климата: ';
    p1.appendChild(b1);
    p1.appendChild(document.createTextNode(type));

    var p2 = document.createElement('p');
    var b2 = document.createElement('b');
    b2.textContent = 'Температура летом: ';
    p2.appendChild(b2);
    p2.appendChild(document.createTextNode(summer));

    var p3 = document.createElement('p');
    var b3 = document.createElement('b');
    b3.textContent = 'Температура зимой: ';
    p3.appendChild(b3);
    p3.appendChild(document.createTextNode(winter));

    var p4 = document.createElement('p');
    var b4 = document.createElement('b');
    b4.textContent = 'Значение для оливководства: ';
    p4.appendChild(b4);
    p4.appendChild(document.createTextNode(text));

    aside.textContent = '';
    aside.appendChild(safeTitle);
    aside.appendChild(p1);
    aside.appendChild(p2);
    aside.appendChild(p3);
    aside.appendChild(p4);

    aside.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    var tip = document.getElementById('mapTip');
    if (tip && event && event.type === 'click') {
        tip.textContent = title + ': ' + type;
        tip.style.display = 'block';
        moveTip(event);
    }
}

function moveTip(event) {
    var tip = document.getElementById('mapTip');
    if (!tip || !event) return;
    var x = event.clientX + 14;
    var y = event.clientY + 14;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
}

function hideTip() {
    var tip = document.getElementById('mapTip');
    if (tip) {
        tip.style.display = 'none';
    }
}

function showFaq(btn) {
    if (!btn) return;
    var item = btn.closest('.faq-item');
    var answer = item ? item.querySelector('.faq-answer') : null;
    if (!answer) return;

    var isActive = btn.classList.contains('active');
    btn.classList.toggle('active', !isActive);
    btn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    answer.style.display = !isActive ? 'block' : 'none';
}

function filterCatalog(type, activeBtn) {
    var products = document.querySelectorAll('.product');
    var buttons = document.querySelectorAll('.filter-btn');

    for (var b = 0; b < buttons.length; b++) {
        buttons[b].classList.remove('active');
    }
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    for (var i = 0; i < products.length; i++) {
        var card = products[i];
        if (type === 'all' || card.getAttribute('data-type') === type) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    }
}

var galleryImages = [
    { src: 'img/hero.jpg', alt: 'Оливковые рощи в лучах утреннего солнца в районе Измира' },
    { src: 'img/harvest.jpg', alt: 'Традиционный ручной сбор спелых оливок в саду' },
    { src: 'img/gallery_bread_oil.jpg', alt: 'Свежее оливковое масло, наливаемое на ломоть хрустящего хлеба' },
    { src: 'img/gallery_spoon_tasting.jpg', alt: 'Дегустация свежего оливкового масла деревянной ложкой над керамической пиалой' },
    { src: 'img/gallery_harvest_net.jpg', alt: 'Раскладка сборочных сетей под вековыми оливковыми деревьями' },
    { src: 'img/gallery_branch_olives.jpg', alt: 'Созревающие зелёные оливки на ветвях деревьев в лучах солнца' },
    { src: 'img/gallery_planting_sapling.jpg', alt: 'Бережная высадка молодого оливкового саженца в плодородную почву' },
    { src: 'img/gallery_crate_inspect.jpg', alt: 'Проверка свежесобранных оливок в деревянном ящике перед холодным отжимом' },
    { src: 'img/gallery_mountain_groves.jpg', alt: 'Живописные оливковые сады на холмах у подножия горных хребтов' },
    { src: 'img/gallery_harvest_crates.jpg', alt: 'Сортировочные ящики со свежесобранными зелёными и спелыми оливками' },
    { src: 'img/gallery_farmer_hands.jpg', alt: 'Пригоршня отборных свежесобранных оливок в руках садовода' },
    { src: 'img/mountain_grove.jpg', alt: 'Вековые оливковые сады у подножия горных склонов' }
];

var currentImageIndex = 0;

function openLightbox(index) {
    var lightbox = document.getElementById('lightbox');
    var bigImage = document.getElementById('bigImage');
    if (!lightbox || !bigImage) return;

    if (typeof index === 'number' && index >= 0 && index < galleryImages.length) {
        currentImageIndex = index;
    } else {
        currentImageIndex = 0;
    }

    bigImage.src = galleryImages[currentImageIndex].src;
    bigImage.alt = galleryImages[currentImageIndex].alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    var bigImage = document.getElementById('bigImage');
    if (bigImage) {
        bigImage.src = galleryImages[currentImageIndex].src;
        bigImage.alt = galleryImages[currentImageIndex].alt;
    }
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    var bigImage = document.getElementById('bigImage');
    if (bigImage) {
        bigImage.src = galleryImages[currentImageIndex].src;
        bigImage.alt = galleryImages[currentImageIndex].alt;
    }
}

function toTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('scroll', function () {
        var topBtn = document.getElementById('topBtn');
        if (!topBtn) return;
        if (window.scrollY > 300) {
            topBtn.style.display = 'inline-flex';
        } else {
            topBtn.style.display = 'none';
        }
    });
}

document.addEventListener('keydown', function (e) {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox || lightbox.style.display !== 'flex') return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    loadTheme();
    loadOrder();
    showReviews();

    var lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
});
