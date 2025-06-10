// 공공데이터포털 API 설정
const API_KEY = '44lZXjszCpO67i1Oja7S93kCEpuhh%2BCf9rwMwPwuhBU%2BhmouOuIXskpRT544ayWYEXEFDJqeF9a9aiXV5iY59g%3D%3D';
const API_BASE_URL = 'http://api.data.go.kr/openapi';

// 문화 정보 검색 함수
async function searchCulturalContent(keyword, page = 1, rows = 10) {
    try {
        // 부산 지역 문화 행사 정보 조회
        const response = await fetch(`${API_BASE_URL}/tn_pubr_public_cltur_fstvl_api/v1/getPublicCulturalFestivalInfo?serviceKey=${API_KEY}&pageNo=${page}&numOfRows=${rows}&type=json&areaCd=26&keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        return processSearchResults(data);
    } catch (error) {
        console.error('문화 정보 검색 중 오류 발생:', error);
        return null;
    }
}

// 검색 결과 처리 함수
function processSearchResults(data) {
    if (!data || !data.response || !data.response.body || !data.response.body.items) {
        return [];
    }

    return data.response.body.items.map(item => ({
        title: item.fstvlNm || '제목 없음',
        startDate: item.fstvlStartDate || '',
        endDate: item.fstvlEndDate || '',
        location: item.opar || '',
        description: item.fstvlCo || '',
        mainImage: item.mainImage || '',
        phoneNumber: item.phoneNumber || '',
        homepageUrl: item.homepageUrl || ''
    }));
}

// 검색 결과 표시 함수
function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    if (!results || results.length === 0) {
        searchResultsContainer.innerHTML = '<p class="no-results">검색 결과가 없습니다.</p>';
        return;
    }

    const resultsHTML = results.map(result => `
        <div class="search-result-item">
            ${result.mainImage ? `<div class="result-image"><img src="${result.mainImage}" alt="${result.title}"></div>` : ''}
            <div class="result-content">
                <h3>${result.title}</h3>
                <p class="event-date">${formatDate(result.startDate)} - ${formatDate(result.endDate)}</p>
                <p class="event-location">${result.location}</p>
                <p class="event-description">${result.description}</p>
                <div class="event-contact">
                    ${result.phoneNumber ? `<p class="phone">📞 ${result.phoneNumber}</p>` : ''}
                    ${result.homepageUrl ? `<a href="${result.homepageUrl}" class="btn" target="_blank">상세정보</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    searchResultsContainer.innerHTML = resultsHTML;
}

// 날짜 포맷 함수
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// 검색 이벤트 핸들러
function handleSearch(event) {
    event.preventDefault();
    const searchInput = document.getElementById('culture-search-input');
    const keyword = searchInput.value.trim();
    
    if (keyword) {
        // 로딩 상태 표시
        const searchResultsContainer = document.getElementById('search-results');
        searchResultsContainer.innerHTML = '<div class="loading">검색 중...</div>';
        
        searchCulturalContent(keyword)
            .then(results => displaySearchResults(results))
            .catch(error => {
                console.error('검색 처리 중 오류 발생:', error);
                searchResultsContainer.innerHTML = '<p class="error">검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>';
            });
    }
}

// 페이지 로드 시 검색 기능 초기화
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('culture-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
}); 