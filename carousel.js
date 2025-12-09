document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    // Получаем оригинальные элементы
    const originalItems = Array.from(document.querySelectorAll('.carousel-item'));
    const totalItems = originalItems.length;
    
    // Клонируем все элементы несколько раз для бесконечности
    function setupInfiniteCarousel() {
        // Очищаем track
        track.innerHTML = '';
        
        // Добавляем элементы: клоны + оригиналы + клоны
        // Добавляем клоны в начало (последние 5 элементов)
        for (let i = totalItems - 5; i < totalItems; i++) {
            const clone = originalItems[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
        
        // Добавляем все оригинальные элементы
        originalItems.forEach(item => {
            track.appendChild(item);
        });
        
        // Добавляем клоны в конец (первые 5 элементов)
        for (let i = 0; i < 5; i++) {
            const clone = originalItems[i].cloneNode(true);
            clone.classList.add('clone');
            track.appendChild(clone);
        }
    }
    
    setupInfiniteCarousel();
    
    const allItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 5; // Начинаем с первого оригинального (после 5 клонов)
    let isTransitioning = false;
    
    function getItemWidth() {
        return allItems[0].offsetWidth + 20; // ширина + gap
    }
    
    function updateCenterItem() {
        allItems.forEach((item, index) => {
            item.classList.remove('center', 'near-center', 'edge');
            
            const centerIndex = currentIndex + 2; // Центральный элемент (средний из 5)
            const diff = Math.abs(index - centerIndex);
            
            if (diff === 0) {
                item.classList.add('center');
            } else if (diff === 1) {
                item.classList.add('near-center');
            } else if (diff === 2) {
                item.classList.add('edge');
            }
        });
    }
    
    function moveCarousel(animate = true) {
        const offset = -(currentIndex * getItemWidth());
        
        if (animate) {
            track.style.transition = 'transform 0.5s ease';
        } else {
            track.style.transition = 'none';
        }
        
        track.style.transform = `translateX(${offset}px)`;
        updateCenterItem();
    }
    
    function handleTransitionEnd() {
        isTransitioning = false;
        
        // Если дошли до клонов в конце - прыгаем в начало
        if (currentIndex >= totalItems + 5) {
            currentIndex = 5;
            moveCarousel(false);
        }
        
        // Если дошли до клонов в начале - прыгаем в конец
        if (currentIndex < 5) {
            currentIndex = totalItems + 5 - 1;
            moveCarousel(false);
        }
    }
    
    track.addEventListener('transitionend', handleTransitionEnd);
    
    function nextSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        moveCarousel();
    }
    
    function prevSlide() {
        if (isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        moveCarousel();
    }
    
    // Обработчики кнопок
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Автопрокрутка
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Инициализация
    moveCarousel(false);
    startAutoPlay();
    
    // Ресайз
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            moveCarousel(false);
        }, 250);
    });
    
    // Свайпы
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoPlay();
    });
    
    // Обработка иконок
    document.querySelectorAll('.carousel-btn .btn-icon').forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const fallback = this.nextElementSibling;
            if (fallback) fallback.style.display = 'block';
        });
        
        img.addEventListener('load', function() {
            this.style.display = 'block';
            const fallback = this.nextElementSibling;
            if (fallback) fallback.style.display = 'none';
        });
    });
});
