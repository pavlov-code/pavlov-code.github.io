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

    // ========== ДОБАВЛЯЕМ ЛАЙТБОКС (увеличение фото по клику) ==========
    (function() {
        // Функция открытия затемнённого оверлея с увеличенным фото
        function openLightbox(imgSrc) {
            // Создаём затемнённый слой
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            
            // Создаём элемент изображения
            const fullImg = document.createElement('img');
            fullImg.src = imgSrc;
            fullImg.alt = 'Pavel Pavlov – увеличенное фото';
            
            overlay.appendChild(fullImg);
            document.body.appendChild(overlay);
            
            // Закрытие при клике на фон или на само изображение
            overlay.addEventListener('click', function(e) {
                // Если кликнули на оверлей (фон) или на картинку — закрываем
                if (e.target === overlay || e.target === fullImg) {
                    overlay.remove();
                }
            });
            
            // Закрытие по клавише Escape
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    if (document.body.contains(overlay)) overlay.remove();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        }
        
        // Навешиваем обработчик клика на все фото профиля
        function bindPhotoClick() {
            const photos = document.querySelectorAll('.profile-photo img');
            photos.forEach(photo => {
                // Удаляем старый обработчик, если есть
                if (photo._lightboxHandler) {
                    photo.removeEventListener('click', photo._lightboxHandler);
                }
                // Создаём новый обработчик
                const handler = function(e) {
                    e.stopPropagation();
                    openLightbox(photo.src);
                };
                photo.addEventListener('click', handler);
                photo._lightboxHandler = handler;
                
                // Добавляем визуальный эффект "pointer" (уже есть в CSS)
                photo.style.cursor = 'pointer';
            });
        }
        
        // Первоначальная привязка
        bindPhotoClick();
        
        // Следим за изменениями в DOM (т.к. фото могут подгружаться динамически через fetch header/footer)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Задержка, чтобы DOM успел обновиться после вставки шапки
                    setTimeout(bindPhotoClick, 100);
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    })();
})();
