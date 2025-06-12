// KOPIS API 설정
const KOPIS_API_KEY = '4e1f7b2e0c5a4f2e9b8d7c6a3f2e1d0b'; // KOPIS API 키
const AREA_CODE = '26'; // 부산시 지역코드
const BASE_URL = 'http://kopis.or.kr/openApi/restful';

// 날짜 포맷팅 함수 (YYYYMMDD)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// 표시용 날짜 포맷팅 함수 (YYYY.MM.DD)
function formatDisplayDate(dateStr) {
    return dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
}

// XML에서 특정 태그의 텍스트 내용 가져오기
function getElementText(parent, tagName) {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent : '';
}

// 공연 목록 가져오기
async function fetchPerformances() {
    const today = new Date();
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);

    const stdate = formatDate(today);
    const eddate = formatDate(oneMonthLater);

    try {
        const response = await fetch(
            `${BASE_URL}/pblprfr?service=${KOPIS_API_KEY}&stdate=${stdate}&eddate=${eddate}&cpage=1&rows=6&signgucode=${AREA_CODE}&prfstate=01&signgucodesub=&kidstate=&newsql=Y`
        );
        
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const xmlText = await response.text();
        const performances = parseKopisXml(xmlText);
        updatePerformanceGrid(performances);
    } catch (error) {
        console.error('공연 정보 로드 실패:', error);
        showErrorMessage();
    }
}

// XML 파싱 함수
function parseKopisXml(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const items = xmlDoc.getElementsByTagName('db');
    const performances = [];

    for (let item of items) {
        performances.push({
            id: getElementText(item, 'mt20id'),
            name: getElementText(item, 'prfnm'),
            startDate: getElementText(item, 'prfpdfrom'),
            endDate: getElementText(item, 'prfpdto'),
            place: getElementText(item, 'fcltynm'),
            poster: getElementText(item, 'poster'),
            genre: getElementText(item, 'genrenm'),
            state: getElementText(item, 'prfstate')
        });
    }

    return performances;
}

// 공연 상세 정보 가져오기
async function fetchPerformanceDetail(performanceId) {
    try {
        const response = await fetch(
            `${BASE_URL}/pblprfr/${performanceId}?service=${KOPIS_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        return {
            poster: getElementText(xmlDoc, 'poster'),
            contents: getElementText(xmlDoc, 'sty'),
            ticketingUrl: getElementText(xmlDoc, 'tiket')
        };
    } catch (error) {
        console.error('공연 상세 정보 로드 실패:', error);
        return null;
    }
}

// 공연 그리드 업데이트
async function updatePerformanceGrid(performances) {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = ''; // 기존 내용 삭제

    for (const performance of performances) {
        const detail = await fetchPerformanceDetail(performance.id);
        
        const card = document.createElement('div');
        card.className = 'event-card';
        card.setAttribute('data-category', performance.genre.toLowerCase());

        card.innerHTML = `
            <div class="event-image">
                <img src="${detail?.poster || performance.poster}" alt="${performance.name} 포스터">
            </div>
            <div class="event-content">
                <div class="event-date">${formatDisplayDate(performance.startDate)} - ${formatDisplayDate(performance.endDate)}</div>
                <h3 class="event-title">${performance.name}</h3>
                <div class="event-location">
                    <a href="#" target="_blank">${performance.place}</a>
                </div>
                ${detail?.ticketingUrl ? 
                    `<a href="${detail.ticketingUrl}" class="btn" target="_blank">예매하기</a>` :
                    '<button class="btn" disabled>예매준비중</button>'}
            </div>
        `;

        eventsGrid.appendChild(card);
    }
}

// 에러 메시지 표시
function showErrorMessage() {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;

    eventsGrid.innerHTML = `
        <div class="error-message">
            <p>공연 정보를 불러오는데 실패했습니다.</p>
            <p>잠시 후 다시 시도해주세요.</p>
        </div>
    `;
}

// 필터링 기능 추가
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 활성화된 버튼 스타일 변경
            filterButtons.forEach(btn => btn.classList.remove('active1'));
            button.classList.add('active1');

            const filter = button.getAttribute('data-filter');
            filterPerformances(filter);
        });
    });
}

// 공연 필터링
function filterPerformances(filter) {
    const cards = document.querySelectorAll('.event-card');
    
    cards.forEach(card => {
        const genre = card.getAttribute('data-category').toLowerCase();
        if (filter === 'all' || genre === filter.toLowerCase()) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// 초기 로드 및 주기적 업데이트
document.addEventListener('DOMContentLoaded', () => {
    fetchPerformances();
    initializeFilters();
    // 6시간마다 공연 정보 업데이트
    setInterval(fetchPerformances, 6 * 60 * 60 * 1000);
}); 