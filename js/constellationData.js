// constellationData.js - 천상열차분야지도 별자리 데이터 정의

// 전역 네임스페이스
window.ConstellationApp = window.ConstellationApp || {};

// 별자리 데이터 정의
ConstellationApp.constellationData = {
    // 북방 7수 (북쪽)
    northernConstellations: {
        season: 'winter',
        color: 0x4a90e2, // 파란색 계열
        constellations: [
            {
                name: '각수', 
                koreanName: '각',
                description: '용의 뿔을 나타내는 별자리',
                stars: [
                    { x: -2, y: 1.5, z: 0, brightness: 0.8 },
                    { x: -1.8, y: 1.2, z: 0, brightness: 0.6 },
                    { x: -1.6, y: 0.9, z: 0, brightness: 0.7 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '항수',
                koreanName: '항',
                description: '용의 목을 나타내는 별자리',
                stars: [
                    { x: -1.4, y: 1.8, z: 0, brightness: 0.9 },
                    { x: -1.2, y: 1.5, z: 0, brightness: 0.7 },
                    { x: -1.0, y: 1.2, z: 0, brightness: 0.8 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '저수',
                koreanName: '저',
                description: '용의 가슴을 나타내는 별자리',
                stars: [
                    { x: -0.8, y: 1.6, z: 0, brightness: 0.8 },
                    { x: -0.6, y: 1.3, z: 0, brightness: 0.6 },
                    { x: -0.4, y: 1.0, z: 0, brightness: 0.7 },
                    { x: -0.2, y: 1.4, z: 0, brightness: 0.9 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            },
            {
                name: '방수',
                koreanName: '방',
                description: '용의 배를 나타내는 별자리',
                stars: [
                    { x: 0, y: 1.7, z: 0, brightness: 1.0 },
                    { x: 0.2, y: 1.4, z: 0, brightness: 0.8 },
                    { x: 0.4, y: 1.1, z: 0, brightness: 0.7 },
                    { x: 0.6, y: 1.5, z: 0, brightness: 0.6 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            },
            {
                name: '심수',
                koreanName: '심',
                description: '용의 심장을 나타내는 별자리',
                stars: [
                    { x: 0.8, y: 1.8, z: 0, brightness: 1.0 },
                    { x: 1.0, y: 1.5, z: 0, brightness: 0.9 },
                    { x: 1.2, y: 1.2, z: 0, brightness: 0.8 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '미수',
                koreanName: '미',
                description: '용의 꼬리를 나타내는 별자리',
                stars: [
                    { x: 1.4, y: 1.6, z: 0, brightness: 0.7 },
                    { x: 1.6, y: 1.3, z: 0, brightness: 0.8 },
                    { x: 1.8, y: 1.0, z: 0, brightness: 0.6 },
                    { x: 2.0, y: 1.4, z: 0, brightness: 0.9 }
                ],
                connections: [[0, 1], [1, 2], [2, 3]]
            },
            {
                name: '기수',
                koreanName: '기',
                description: '용의 몸을 나타내는 별자리',
                stars: [
                    { x: 2.2, y: 1.7, z: 0, brightness: 0.8 },
                    { x: 2.4, y: 1.4, z: 0, brightness: 0.7 },
                    { x: 2.6, y: 1.1, z: 0, brightness: 0.6 },
                    { x: 2.8, y: 1.5, z: 0, brightness: 0.8 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            }
        ]
    },

    // 서방 7수 (서쪽)
    westernConstellations: {
        season: 'autumn',
        color: 0xe2a54a, // 주황색 계열
        constellations: [
            {
                name: '규수',
                koreanName: '규',
                description: '백호의 머리를 나타내는 별자리',
                stars: [
                    { x: -2.5, y: 0.5, z: 0, brightness: 0.9 },
                    { x: -2.3, y: 0.2, z: 0, brightness: 0.7 },
                    { x: -2.1, y: -0.1, z: 0, brightness: 0.8 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '루수',
                koreanName: '루',
                description: '백호의 이마를 나타내는 별자리',
                stars: [
                    { x: -1.9, y: 0.4, z: 0, brightness: 0.8 },
                    { x: -1.7, y: 0.1, z: 0, brightness: 0.6 },
                    { x: -1.5, y: -0.2, z: 0, brightness: 0.7 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '위수',
                koreanName: '위',
                description: '백호의 배를 나타내는 별자리',
                stars: [
                    { x: -1.3, y: 0.3, z: 0, brightness: 1.0 },
                    { x: -1.1, y: 0, z: 0, brightness: 0.8 },
                    { x: -0.9, y: -0.3, z: 0, brightness: 0.9 },
                    { x: -0.7, y: 0.1, z: 0, brightness: 0.7 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            },
            {
                name: '묘수',
                koreanName: '묘',
                description: '백호의 발톱을 나타내는 별자리',
                stars: [
                    { x: -0.5, y: 0.2, z: 0, brightness: 0.8 },
                    { x: -0.3, y: -0.1, z: 0, brightness: 0.9 },
                    { x: -0.1, y: -0.4, z: 0, brightness: 0.6 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '필수',
                koreanName: '필',
                description: '백호의 꼬리를 나타내는 별자리',
                stars: [
                    { x: 0.1, y: 0.3, z: 0, brightness: 0.7 },
                    { x: 0.3, y: 0, z: 0, brightness: 0.8 },
                    { x: 0.5, y: -0.3, z: 0, brightness: 0.9 },
                    { x: 0.7, y: 0.2, z: 0, brightness: 0.6 }
                ],
                connections: [[0, 1], [1, 2], [2, 3]]
            },
            {
                name: '자수',
                koreanName: '자',
                description: '백호의 부리를 나타내는 별자리',
                stars: [
                    { x: 0.9, y: 0.4, z: 0, brightness: 0.8 },
                    { x: 1.1, y: 0.1, z: 0, brightness: 0.7 },
                    { x: 1.3, y: -0.2, z: 0, brightness: 0.9 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '삼수',
                koreanName: '삼',
                description: '백호의 몸을 나타내는 별자리',
                stars: [
                    { x: 1.5, y: 0.3, z: 0, brightness: 1.0 },
                    { x: 1.7, y: 0, z: 0, brightness: 0.8 },
                    { x: 1.9, y: -0.3, z: 0, brightness: 0.7 },
                    { x: 2.1, y: 0.1, z: 0, brightness: 0.9 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            }
        ]
    },

    // 남방 7수 (남쪽)
    southernConstellations: {
        season: 'summer',
        color: 0xe24a4a, // 빨간색 계열
        constellations: [
            {
                name: '정수',
                koreanName: '정',
                description: '주작의 머리를 나타내는 별자리',
                stars: [
                    { x: -2, y: -0.5, z: 0, brightness: 0.9 },
                    { x: -1.8, y: -0.8, z: 0, brightness: 0.8 },
                    { x: -1.6, y: -1.1, z: 0, brightness: 0.7 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '귀수',
                koreanName: '귀',
                description: '주작의 목을 나타내는 별자리',
                stars: [
                    { x: -1.4, y: -0.6, z: 0, brightness: 1.0 },
                    { x: -1.2, y: -0.9, z: 0, brightness: 0.8 },
                    { x: -1.0, y: -1.2, z: 0, brightness: 0.9 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '류수',
                koreanName: '류',
                description: '주작의 가슴을 나타내는 별자리',
                stars: [
                    { x: -0.8, y: -0.7, z: 0, brightness: 0.8 },
                    { x: -0.6, y: -1.0, z: 0, brightness: 0.7 },
                    { x: -0.4, y: -1.3, z: 0, brightness: 0.6 },
                    { x: -0.2, y: -0.9, z: 0, brightness: 0.9 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            },
            {
                name: '성수',
                koreanName: '성',
                description: '주작의 심장을 나타내는 별자리',
                stars: [
                    { x: 0, y: -0.8, z: 0, brightness: 1.0 },
                    { x: 0.2, y: -1.1, z: 0, brightness: 0.9 },
                    { x: 0.4, y: -1.4, z: 0, brightness: 0.8 },
                    { x: 0.6, y: -1.0, z: 0, brightness: 0.7 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            },
            {
                name: '장수',
                koreanName: '장',
                description: '주작의 날개를 나타내는 별자리',
                stars: [
                    { x: 0.8, y: -0.9, z: 0, brightness: 0.8 },
                    { x: 1.0, y: -1.2, z: 0, brightness: 0.7 },
                    { x: 1.2, y: -1.5, z: 0, brightness: 0.9 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '익수',
                koreanName: '익',
                description: '주작의 날개 끝을 나타내는 별자리',
                stars: [
                    { x: 1.4, y: -1.0, z: 0, brightness: 0.9 },
                    { x: 1.6, y: -1.3, z: 0, brightness: 0.8 },
                    { x: 1.8, y: -1.6, z: 0, brightness: 0.6 },
                    { x: 2.0, y: -1.2, z: 0, brightness: 0.7 }
                ],
                connections: [[0, 1], [1, 2], [2, 3]]
            },
            {
                name: '진수',
                koreanName: '진',
                description: '주작의 꼬리를 나타내는 별자리',
                stars: [
                    { x: 2.2, y: -1.1, z: 0, brightness: 1.0 },
                    { x: 2.4, y: -1.4, z: 0, brightness: 0.9 },
                    { x: 2.6, y: -1.7, z: 0, brightness: 0.8 },
                    { x: 2.8, y: -1.3, z: 0, brightness: 0.7 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            }
        ]
    },

    // 동방 7수 (동쪽)
    easternConstellations: {
        season: 'spring',
        color: 0x4ae24a, // 초록색 계열
        constellations: [
            {
                name: '두수',
                koreanName: '두',
                description: '현무의 머리를 나타내는 별자리',
                stars: [
                    { x: -2.5, y: -1.5, z: 0, brightness: 0.9 },
                    { x: -2.3, y: -1.8, z: 0, brightness: 0.8 },
                    { x: -2.1, y: -2.1, z: 0, brightness: 0.7 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '우수',
                koreanName: '우',
                description: '현무의 목을 나타내는 별자리',
                stars: [
                    { x: -1.9, y: -1.6, z: 0, brightness: 1.0 },
                    { x: -1.7, y: -1.9, z: 0, brightness: 0.9 },
                    { x: -1.5, y: -2.2, z: 0, brightness: 0.8 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '여수',
                koreanName: '여',
                description: '현무의 가슴을 나타내는 별자리',
                stars: [
                    { x: -1.3, y: -1.7, z: 0, brightness: 0.8 },
                    { x: -1.1, y: -2.0, z: 0, brightness: 0.7 },
                    { x: -0.9, y: -2.3, z: 0, brightness: 0.9 },
                    { x: -0.7, y: -1.9, z: 0, brightness: 0.6 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            },
            {
                name: '허수',
                koreanName: '허',
                description: '현무의 배를 나타내는 별자리',
                stars: [
                    { x: -0.5, y: -1.8, z: 0, brightness: 0.9 },
                    { x: -0.3, y: -2.1, z: 0, brightness: 0.8 },
                    { x: -0.1, y: -2.4, z: 0, brightness: 0.7 },
                    { x: 0.1, y: -2.0, z: 0, brightness: 1.0 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            },
            {
                name: '위수',
                koreanName: '위',
                description: '현무의 등을 나타내는 별자리',
                stars: [
                    { x: 0.3, y: -1.9, z: 0, brightness: 0.8 },
                    { x: 0.5, y: -2.2, z: 0, brightness: 0.7 },
                    { x: 0.7, y: -2.5, z: 0, brightness: 0.9 }
                ],
                connections: [[0, 1], [1, 2]]
            },
            {
                name: '실수',
                koreanName: '실',
                description: '현무의 다리를 나타내는 별자리',
                stars: [
                    { x: 0.9, y: -2.0, z: 0, brightness: 0.7 },
                    { x: 1.1, y: -2.3, z: 0, brightness: 0.8 },
                    { x: 1.3, y: -2.6, z: 0, brightness: 0.6 },
                    { x: 1.5, y: -2.2, z: 0, brightness: 0.9 }
                ],
                connections: [[0, 1], [1, 2], [2, 3]]
            },
            {
                name: '벽수',
                koreanName: '벽',
                description: '현무의 꼬리를 나타내는 별자리',
                stars: [
                    { x: 1.7, y: -2.1, z: 0, brightness: 1.0 },
                    { x: 1.9, y: -2.4, z: 0, brightness: 0.9 },
                    { x: 2.1, y: -2.7, z: 0, brightness: 0.8 },
                    { x: 2.3, y: -2.3, z: 0, brightness: 0.7 }
                ],
                connections: [[0, 1], [1, 2], [2, 3], [3, 0]]
            }
        ]
    }
};

// 계절별 환경 설정
ConstellationApp.seasonalSettings = {
    spring: {
        skyColor: 0x87ceeb, // 연한 하늘색
        fogColor: 0xb6e0f0,
        ambientLight: 0x4a7c59,
        directionalLight: 0xffeaa7,
        environmentTexture: 'textures/spring_sky.jpg'
    },
    summer: {
        skyColor: 0x191970, // 미드나이트 블루
        fogColor: 0x2c3e50,
        ambientLight: 0x8b4513,
        directionalLight: 0xff7675,
        environmentTexture: 'textures/summer_sky.jpg'
    },
    autumn: {
        skyColor: 0x2f1b14, // 어두운 갈색
        fogColor: 0x654321,
        ambientLight: 0xd63031,
        directionalLight: 0xfab1a0,
        environmentTexture: 'textures/autumn_sky.jpg'
    },
    winter: {
        skyColor: 0x0f0f23, // 어두운 보라
        fogColor: 0x2d3436,
        ambientLight: 0x74b9ff,
        directionalLight: 0xa29bfe,
        environmentTexture: 'textures/winter_sky.jpg'
    }
};

// 별자리 상태 관리
ConstellationApp.state = {
    selectedConstellation: null,
    selectedSeason: null,
    currentPhase: 'initial', // 'initial', 'seasonSelected', 'expanded'
    isAnimating: false,
    expandedConstellation: null
};

// 상호작용 상태
ConstellationApp.interaction = {
    isPinching: [false, false], // [왼손, 오른손]
    lastPinchState: [false, false],
    handPositions: [new THREE.Vector3(), new THREE.Vector3()],
    isHandTracked: [false, false]
};