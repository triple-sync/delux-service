function changeText(elementId, message, buttonElement) {
    const parent = document.getElementById(elementId);
    if (!parent) return;

    const textElement = parent.querySelector('.text-content');
    const glow = parent.querySelector('.glass-glow');
    const status = parent.querySelector('.info-status');

    // Активная кнопка
    const buttons = buttonElement.parentElement.querySelectorAll('.btn-blue');
    buttons.forEach(btn => btn.classList.remove('active-btn'));
    buttonElement.classList.add('active-btn');

    // Анимация блика
    if (glow) {
        glow.style.transition = 'none';
        glow.style.left = '-100%';
        setTimeout(() => {
            glow.style.transition = 'left 0.6s ease';
            glow.style.left = '100%';
        }, 10);
    }

    // Анимация текста
    if (textElement) {
        textElement.style.opacity = '0';
        textElement.style.transform = 'translateX(15px)';
        setTimeout(() => {
            textElement.textContent = message;
            textElement.style.opacity = '1';
            textElement.style.transform = 'translateX(0)';
        }, 300);
    }
}
// Добавь это в script.js
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('reveal-hidden');
    observer.observe(section);
});


window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.full-width-block');
    const faqSection = document.querySelector('.section-faq');
    
    // Получаем положение FAQ один раз для всех
    let faqRect = faqSection ? faqSection.getBoundingClientRect() : null;
    const startFadeFAQ = 500; // Когда FAQ на этом расстоянии от верха, всё начинает таять
    const endFadeFAQ = 350;   // Когда FAQ доехал сюда, всё исчезло

    sections.forEach((section, index) => {
        const content = section.querySelector('.services-display');
        const buttons = section.querySelector('.button-list');
        const nextSection = sections[index + 1];

        if (!content || section === faqSection) return;

        // 1. ПРОВЕРКА НА FAQ (Глобальное исчезновение всей стопки)
        if (faqRect && faqRect.top < startFadeFAQ) {
            let globalOpacity = (faqRect.top - endFadeFAQ) / (startFadeFAQ - endFadeFAQ);
            globalOpacity = Math.max(0, Math.min(1, globalOpacity));

            // Исчезает вся секция целиком (вместе с прилипшим заголовком)
            section.style.opacity = globalOpacity;
            section.style.transform = `translateY(${(1 - globalOpacity) * -30}px)`;
            return; // Прерываем итерацию, так как FAQ приоритетнее
        }

        // 2. ОБЫЧНОЕ ПОВЕДЕНИЕ (Смена контента внутри стопки)
        if (nextSection) {
            const nextRect = nextSection.getBoundingClientRect();
            const startFade = 400; 
            const endFade = 300; 

            if (nextRect.top < startFade) {
                let opacity = (nextRect.top - endFade) / (startFade - endFade);
                opacity = Math.max(0, Math.min(1, opacity));

                content.style.opacity = opacity;
                if (buttons) buttons.style.opacity = opacity;
                content.style.transform = `translateY(${(1 - opacity) * -15}px)`;
                
                // Сама секция (заголовок) при этом остается видимой (opacity 1)
                section.style.opacity = 1; 
            } else {
                content.style.opacity = 1;
                content.style.transform = `translateY(0)`;
                if (buttons) buttons.style.opacity = 1;
                section.style.opacity = 1;
            }
        }
    });
});


function goToSection(sectionClass) {
    const targetElement = document.querySelector('.' + sectionClass);
    const headerHeight = 70; // Высота твоей шапки в пикселях

    if (targetElement) {
        // Вычисляем текущую позицию элемента относительно всей страницы
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        // Если идем в услуги, возвращаем им видимость
        if (sectionClass === 'section-1') {
            const allBlocks = document.querySelectorAll('.full-width-block');
            allBlocks.forEach(block => {
                block.style.opacity = '1';
                block.style.transform = 'translateY(0)';
                const content = block.querySelector('.services-display');
                if (content) content.style.opacity = '1';
            });
        }

        // Сама прокрутка
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Чистим URL
        if (history.replaceState) {
            history.replaceState(null, null, window.location.pathname);
        }
    }
}
function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });

    // Опционально: закрыть мобильное меню после клика
    const navLinks = document.getElementById('mobile-nav-links');
    if (navLinks) {
        navLinks.classList.remove('open');
    }
}

window.addEventListener('scroll', function() {
    const nav = document.getElementById('main-nav');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
});
document.addEventListener('DOMContentLoaded', function() {
    // 1. Находим все наши карточки
    const cards = document.querySelectorAll('.feature-card');

    // 2. Настраиваем "глаз", который будет следить за ними
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Добавляем небольшую задержку для каждой следующей карточки (каскад)
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, index * 150); // 150ms между карточками
                
                // Перестаем следить за карточкой, когда она уже появилась
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Сработает, когда 10% карточки показалось на экране
    });

    // 3. Запускаем наблюдение
    cards.forEach(card => observer.observe(card));
});

const processObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const wrapper = entry.target.querySelector('.process-wrapper');
            const steps = entry.target.querySelectorAll('.process-step');

            // 1. Запускаем линию
            wrapper.classList.add('active');

            // 2. Запускаем шаги по очереди
            steps.forEach((step, index) => {
                // Ждем 0.4с (пока линия немного проедет) + задержка для каждого шага
                setTimeout(() => {
                    step.classList.add('active');
                    console.log(`Шаг ${index + 1} активирован`);
                }, 400 + (index * 500)); 
            });

            processObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.full-width-block');
    
    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const info = section.querySelector('.info-square');
        
        // Когда секция начинает уходить за верхний край (rect.top < 0)
        if (rect.top <= 0) {
            // Вычисляем, насколько сильно мы проскроллили именно эту секцию
            // Чем дальше rect.top уходит в минус, тем прозрачнее текст
            let progress = Math.abs(rect.top) / 300; // 300 - это скорость исчезновения
            if (progress > 1) progress = 1;

            if (info) {
                info.style.opacity = 1 - progress;
                info.style.transform = `translateY(${rect.top * 0.1}px)`; // Легкий параллакс
            }
        } else if (info) {
            info.style.opacity = 1;
            info.style.transform = `translateY(0)`;
        }
    });
});

function updateText(newText, btn, targetId) {
    const display = document.getElementById(targetId);
    
    // 1. Анимация смены текста
    if (display) {
        display.style.opacity = 0;
        setTimeout(() => {
            display.innerText = newText;
            display.style.opacity = 1;
        }, 200);
    }

    // 2. Переключаем активную кнопку ТОЛЬКО в текущем списке
    const parent = btn.closest('.button-list');
    if (parent) {
        parent.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    // Чистим URL от возможных решеток
    if (history.replaceState) {
        history.replaceState(null, null, window.location.pathname);
    }
    
    // Если было открыто мобильное меню — закрываем его
    const navLinks = document.getElementById('mobile-nav-links');
    if (navLinks) {
        navLinks.classList.remove('open');
    }
}
function toggleMobileMenu() {
    const navLinks = document.getElementById('mobile-nav-links');
    navLinks.classList.toggle('open');
}

// Закрываем меню при клике на пункт
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const navLinks = document.getElementById('mobile-nav-links');
        if (navLinks) navLinks.classList.remove('open');
    });
});



processObserver.observe(document.querySelector('.workflow-section'));   

const legalData = {
    impressum: `
        <h2>Impressum</h2>
        <p><strong>Angaben gemäß § 5 TMG:</strong></p>
        <p>Delux Pass<br>Oststraße 122, Eingang C<br>22844 Norderstedt, Deutschland</p>
        <p><strong>Kontakt:</strong><br>Telefon: +49 172 249 27 57<br>E-Mail: deluxpass@mail.ru</p>
        <p><strong>Vertreten durch:</strong><br>[Имя Фамилия владельца из документов]</p>
        <p><strong>Umsatzsteuer-ID:</strong><br>Gemäß § 27 a Umsatzsteuergesetz: [Номер если есть]</p>
    `,
    privacy: `
        <h2>Datenschutzerklärung</h2>
        <p>Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Мы обрабатываем персональные данные в соответствии с GDPR (DSGVO).</p>
        <p><strong>1. Datenerfassung на нашем сайте:</strong> Мы не передаем ваши данные третьим лицам без вашего согласия.</p>
        <p><strong>2. Cookies:</strong> Мы используем только необходимые технические файлы cookie для работы сайта.</p>
        <p><strong>3. Ваши права:</strong> Вы имеете право на получение информации о ваших сохраненных данных в любое время.</p>
    `
}

function openModal(type) {
    document.getElementById('modalText').innerHTML = legalData[type];
    document.getElementById('legalModal').style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById('legalModal').style.display = "none";
    document.body.style.overflow = "auto";
}

window.onclick = function(event) {
    if (event.target == document.getElementById('legalModal')) closeModal();
};

function toggleFaq(element) {
    const item = element.parentElement;
    item.classList.toggle('active');
}