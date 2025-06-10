const filterBtns = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active1'));
        // Add active class to clicked button
        btn.classList.add('active1');

        const filter = btn.dataset.filter;

        // Filter cards
        eventCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 뉴스레터 구독
function handleSubscribe(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input');
    const email = emailInput.value;
    
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('유효한 이메일 주소를 입력해주세요.', 'error');
        return;
    }

    showNotification(`${email}로 구독이 완료되었습니다!`, 'success');
    event.target.reset();
}

// 알림 표시 함수
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 스타일 적용
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '5px';
    notification.style.color = '#fff';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.5s ease';

    document.body.appendChild(notification);

    // 3초 후 알림 제거
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// 스크롤 이벤트 최적화
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 스크롤 효과
const header = document.querySelector('header');
window.addEventListener('scroll', debounce(() => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
}, 100));

// Animation for cards
const cards = document.querySelectorAll('.category-card, .event-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Page load animation
window.addEventListener('load', () => {
    const elements = document.querySelectorAll('.category-card, .event-card');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// 알림 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// YouTube API 설정
const API_KEY = 'AIzaSyBH9j7EaldMF3jqhoY-V938DsKc0zUUolg';
const CHANNEL_ID = 'UChlgI3UHCOnwUGzWzbJ3H5w';  // 부산문화재단 채널 ID
const MAX_RESULTS = 4;  // 표시할 동영상 수

// YouTube API 초기화 및 동영상 로드
function initYouTubeAPI() {
    gapi.client.init({
        'apiKey': API_KEY,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
    }).then(function() {
        loadYouTubeVideos();
    }).catch(function(error) {
        console.error('Error initializing YouTube API:', error);
    });
}

// YouTube 동영상 로드
function loadYouTubeVideos() {
    gapi.client.youtube.search.list({
        part: 'snippet',
        channelId: CHANNEL_ID,
        maxResults: MAX_RESULTS,
        order: 'date',
        type: 'video'
    }).then(function(response) {
        const videos = response.result.items;
        updateVideoGrid(videos);
    }).catch(function(error) {
        console.error('Error loading videos:', error);
    });
}

// 비디오 그리드 업데이트
function updateVideoGrid(videos) {
    const videoGrid = document.querySelector('.events-grid2');
    videoGrid.innerHTML = '';  // 기존 콘텐츠 삭제

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString();
        
        const videoCard = document.createElement('div');
        videoCard.className = 'event-card2';
        videoCard.setAttribute('data-category', 'performance');
        
        videoCard.innerHTML = `
            <div class="event-image2">
                <iframe width="560" height="315" 
                    src="https://www.youtube.com/embed/${videoId}" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" 
                    allowfullscreen>
                </iframe>
            </div>
            <div class="event-content2">
                <div class="event-date">${publishedAt}</div>
                <h3 class="event-title">${videoTitle}</h3>
                <div class="event-location">
                    <a href="https://www.bscf.or.kr/" target="_blank">부산문화재단</a>
                </div>
                <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="btn">시청하기</a>
            </div>
        `;
        
        videoGrid.appendChild(videoCard);
    });
}

// YouTube API 로드
gapi.load('client', initYouTubeAPI);

// 24시간마다 동영상 새로고침
setInterval(loadYouTubeVideos, 24 * 60 * 60 * 1000);