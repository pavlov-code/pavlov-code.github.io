(function() {
    // Определяем текущий язык из URL или из атрибута html
    let currentLang = document.documentElement.lang || 'ru';
    const pathParts = window.location.pathname.split('/');
    if (pathParts.includes('ru')) currentLang = 'ru';
    else if (pathParts.includes('en')) currentLang = 'en';
    else if (pathParts.includes('es')) currentLang = 'es';

    // Загружаем переводы
    fetch(`/locales/${currentLang}.json`)
        .then(response => response.json())
        .then(translations => {
            // Заменяем текст у всех элементов с data-i18n
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[key]) {
                    el.textContent = translations[key];
                }
            });
            // Устанавливаем активный язык в переключателе
            const switcherLinks = document.querySelectorAll('.language-switcher a');
            switcherLinks.forEach(link => {
                const langAttr = link.getAttribute('data-lang');
                if (langAttr === currentLang) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            // Активируем пункт меню текущей страницы
            const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `${currentPage}.html` || 
                    (currentPage === '' && link.getAttribute('href') === 'index.html')) {
                    link.classList.add('active');
                }
            });
        })
        .catch(err => console.error('Ошибка загрузки переводов:', err));

    // Вставляем реальное фото
    const photoContainers = document.querySelectorAll('.profile-photo');
    photoContainers.forEach(container => {
        container.innerHTML = `<img src="/img/pavlov-pavel.jpg" alt="Pavel Pavlov">`;
    });
})();