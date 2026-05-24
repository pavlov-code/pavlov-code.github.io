// js/components.js

document.addEventListener('DOMContentLoaded', function() {
    // Определяем язык из пути (ru, en, es) или берём по умолчанию
    let currentLang = 'ru';
    const pathParts = window.location.pathname.split('/');
    if (pathParts.includes('ru')) currentLang = 'ru';
    else if (pathParts.includes('en')) currentLang = 'en';
    else if (pathParts.includes('es')) currentLang = 'es';

    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');

    // Загружаем header
    fetch('/template/header.html')
        .then(response => response.text())
        .then(html => {
            // Заменяем активные классы и язык
            let processed = html
                .replace(/data-lang/g, currentLang)
                .replace(/href="(\..\/)?index\.html"/g, `href="${currentLang === 'ru' ? 'index.html' : '../' + currentLang + '/index.html'}"`)
                .replace(/href="(\..\/)?about\.html"/g, `href="${currentLang === 'ru' ? 'about.html' : '../' + currentLang + '/about.html'}"`)
                .replace(/href="(\..\/)?projects\.html"/g, `href="${currentLang === 'ru' ? 'projects.html' : '../' + currentLang + '/projects.html'}"`)
                .replace(/href="(\..\/)?contact\.html"/g, `href="${currentLang === 'ru' ? 'contact.html' : '../' + currentLang + '/contact.html'}"`)
                .replace(/href="(\..\/)?bio\.html"/g, `href="${currentLang === 'ru' ? 'bio.html' : '../' + currentLang + '/bio.html'}"`);
            
            // Устанавливаем активный пункт меню
            if (currentPage === 'index' || currentPage === '') {
                processed = processed.replace(/<a href="[^"]*index\.html"[^>]*>/, match => match.replace('class="', 'class="active '));
            } else if (currentPage === 'about') {
                processed = processed.replace(/<a href="[^"]*about\.html"[^>]*>/, match => match.replace('class="', 'class="active '));
            } else if (currentPage === 'projects') {
                processed = processed.replace(/<a href="[^"]*projects\.html"[^>]*>/, match => match.replace('class="', 'class="active '));
            } else if (currentPage === 'contact') {
                processed = processed.replace(/<a href="[^"]*contact\.html"[^>]*>/, match => match.replace('class="', 'class="active '));
            } else if (currentPage === 'bio') {
                processed = processed.replace(/<a href="[^"]*bio\.html"[^>]*>/, match => match.replace('class="', 'class="active '));
            }
            
            // Устанавливаем активный язык в переключателе
            processed = processed.replace(/class="lang-(ru|en|es)"/g, (match, lang) => {
                if (lang === currentLang) return match + ' active';
                return match;
            });
            
            document.querySelector('header').innerHTML = processed;
        });

    // Загружаем footer
    fetch('/template/footer.html')
        .then(response => response.text())
        .then(html => {
            document.querySelector('footer').innerHTML = html;
        });

    // Вставляем реальное фото вместо плейсхолдера
    const photoContainers = document.querySelectorAll('.profile-photo');
    photoContainers.forEach(container => {
        container.innerHTML = `<img src="/img/pavlov-pavel.jpg" alt="Pavel Pavlov" style="width:100%; height:100%; object-fit:cover;">`;
    });
});