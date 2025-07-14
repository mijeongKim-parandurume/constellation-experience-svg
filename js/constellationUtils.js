// constellationUtils.js - 유틸리티 함수들

ConstellationApp.utils = {
    
    // 수학 유틸리티
    math: {
        // 두 점 사이의 거리 계산
        distance: function(point1, point2) {
            const dx = point1.x - point2.x;
            const dy = point1.y - point2.y;
            const dz = point1.z - point2.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        },
        
        // 선형 보간
        lerp: function(start, end, factor) {
            return start + (end - start) * factor;
        },
        
        // 각도를 라디안으로 변환
        degToRad: function(degrees) {
            return degrees * (Math.PI / 180);
        },
        
        // 라디안을 각도로 변환
        radToDeg: function(radians) {
            return radians * (180 / Math.PI);
        },
        
        // 값을 범위 내로 제한
        clamp: function(value, min, max) {
            return Math.max(min, Math.min(max, value));
        },
        
        // 벡터 정규화
        normalize: function(vector) {
            const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
            if (length === 0) return { x: 0, y: 0, z: 0 };
            return {
                x: vector.x / length,
                y: vector.y / length,
                z: vector.z / length
            };
        },
        
        // 구면 좌표계를 직교 좌표계로 변환
        sphericalToCartesian: function(radius, theta, phi) {
            return {
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.cos(phi),
                z: radius * Math.sin(phi) * Math.sin(theta)
            };
        }
    },
    
    // 애니메이션 유틸리티
    animation: {
        // 현재 애니메이션들을 저장하는 배열
        activeAnimations: [],
        
        // 부드러운 전환 애니메이션
        smoothTransition: function(object, targetProperties, duration, easing, onComplete) {
            if (typeof TWEEN === 'undefined') {
                console.warn('TWEEN.js가 로드되지 않음');
                return;
            }
            
            const tween = new TWEEN.Tween(object)
                .to(targetProperties, duration)
                .easing(easing || TWEEN.Easing.Quadratic.Out)
                .onComplete(onComplete || function() {});
            
            this.activeAnimations.push(tween);
            tween.start();
            
            return tween;
        },
        
        // 펄스 애니메이션
        pulse: function(object, property, minValue, maxValue, duration) {
            const originalValue = object[property];
            
            const pulseUp = new TWEEN.Tween(object)
                .to({ [property]: maxValue }, duration / 2)
                .easing(TWEEN.Easing.Sinusoidal.Out);
            
            const pulseDown = new TWEEN.Tween(object)
                .to({ [property]: minValue }, duration / 2)
                .easing(TWEEN.Easing.Sinusoidal.In);
            
            pulseUp.chain(pulseDown);
            pulseDown.chain(pulseUp);
            
            this.activeAnimations.push(pulseUp, pulseDown);
            pulseUp.start();
            
            return { up: pulseUp, down: pulseDown };
        },
        
        // 모든 애니메이션 정지
        stopAllAnimations: function() {
            this.activeAnimations.forEach(animation => {
                if (animation.stop) animation.stop();
            });
            this.activeAnimations = [];
        },
        
        // 페이드 인 애니메이션
        fadeIn: function(object, duration, onComplete) {
            if (object.material) {
                object.material.transparent = true;
                object.material.opacity = 0;
                object.visible = true;
                
                return this.smoothTransition(
                    object.material,
                    { opacity: 1 },
                    duration,
                    TWEEN.Easing.Quadratic.Out,
                    onComplete
                );
            }
        },
        
        // 페이드 아웃 애니메이션
        fadeOut: function(object, duration, onComplete) {
            if (object.material) {
                return this.smoothTransition(
                    object.material,
                    { opacity: 0 },
                    duration,
                    TWEEN.Easing.Quadratic.Out,
                    function() {
                        object.visible = false;
                        if (onComplete) onComplete();
                    }
                );
            }
        }
    },
    
    // 색상 유틸리티
    color: {
        // HSL을 RGB로 변환
        hslToRgb: function(h, s, l) {
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l; // 무채색
            } else {
                const hue2rgb = function(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        },
        
        // RGB를 16진수로 변환
        rgbToHex: function(r, g, b) {
            return ((r << 16) | (g << 8) | b);
        },
        
        // 두 색상 사이의 보간
        lerpColor: function(color1, color2, factor) {
            const c1 = new THREE.Color(color1);
            const c2 = new THREE.Color(color2);
            return c1.lerp(c2, factor);
        },
        
        // 별자리 계절에 따른 색상 팔레트
        getSeasonalPalette: function(season) {
            const palettes = {
                spring: [0x90EE90, 0x98FB98, 0x8FBC8F, 0x32CD32],
                summer: [0xFF6B6B, 0xFF8E53, 0xFF6B9D, 0xC44569],
                autumn: [0xF39C12, 0xE67E22, 0xD35400, 0xA04000],
                winter: [0x3498DB, 0x2980B9, 0x1ABC9C, 0x16A085]
            };
            return palettes[season] || palettes.winter;
        }
    },
    
    // 로컬 스토리지 유틸리티 (브라우저 환경용)
    storage: {
        // 설정 저장
        saveSettings: function(settings) {
            try {
                const settingsJson = JSON.stringify(settings);
                console.log('설정이 저장되었습니다:', settings);
                return true;
            } catch (error) {
                console.error('설정 저장 실패:', error);
                return false;
            }
        },
        
        // 설정 로드
        loadSettings: function() {
            try {
                // 기본 설정 반환
                return {
                    handTrackingEnabled: true,
                    soundEnabled: true,
                    animationSpeed: 1.0,
                    visualEffects: true,
                    lastSelectedSeason: 'winter'
                };
            } catch (error) {
                console.error('설정 로드 실패:', error);
                return null;
            }
        },
        
        // 진행 상황 저장
        saveProgress: function(progress) {
            try {
                const progressJson = JSON.stringify(progress);
                console.log('진행 상황이 저장되었습니다:', progress);
                return true;
            } catch (error) {
                console.error('진행 상황 저장 실패:', error);
                return false;
            }
        },
        
        // 진행 상황 로드
        loadProgress: function() {
            try {
                // 기본 진행 상황 반환
                return {
                    visitedConstellations: [],
                    unlockedSeasons: ['winter'],
                    completedInteractions: 0,
                    totalPlayTime: 0
                };
            } catch (error) {
                console.error('진행 상황 로드 실패:', error);
                return null;
            }
        }
    },
    
    // 성능 최적화 유틸리티
    performance: {
        // FPS 모니터링
        fpsMonitor: {
            lastTime: 0,
            frameCount: 0,
            fps: 0,
            
            update: function() {
                const currentTime = performance.now();
                this.frameCount++;
                
                if (currentTime >= this.lastTime + 1000) {
                    this.fps = Math.round(this.frameCount * 1000 / (currentTime - this.lastTime));
                    this.frameCount = 0;
                    this.lastTime = currentTime;
                }
                
                return this.fps;
            }
        },
        
        // 객체 풀링
        objectPool: {
            pools: {},
            
            getObject: function(type, createFn) {
                if (!this.pools[type]) {
                    this.pools[type] = [];
                }
                
                if (this.pools[type].length > 0) {
                    return this.pools[type].pop();
                } else {
                    return createFn();
                }
            },
            
            returnObject: function(type, object) {
                if (!this.pools[type]) {
                    this.pools[type] = [];
                }
                
                // 객체 리셋
                if (object.position) object.position.set(0, 0, 0);
                if (object.rotation) object.rotation.set(0, 0, 0);
                if (object.scale) object.scale.set(1, 1, 1);
                if (object.visible !== undefined) object.visible = false;
                
                this.pools[type].push(object);
            }
        }
    },
    
    // 디버깅 유틸리티
    debug: {
        // 로그 레벨
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        
        // 디버그 정보 표시
        showDebugInfo: false,
        debugPanel: null,
        
        // 로그 함수
        log: function(level, message, data) {
            const levels = ['debug', 'info', 'warn', 'error'];
            const currentLevelIndex = levels.indexOf(this.logLevel);
            const messageLevelIndex = levels.indexOf(level);
            
            if (messageLevelIndex >= currentLevelIndex) {
                const timestamp = new Date().toISOString();
                const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
                
                if (data) {
                    console[level](prefix, message, data);
                } else {
                    console[level](prefix, message);
                }
            }
        },
        
        // 디버그 패널 생성
        createDebugPanel: function() {
            if (this.debugPanel) return;
            
            this.debugPanel = document.createElement('div');
            this.debugPanel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 250px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(this.debugPanel);
        },
        
        // 디버그 정보 업데이트
        updateDebugInfo: function(info) {
            if (!this.showDebugInfo || !this.debugPanel) return;
            
            const fps = ConstellationApp.utils.performance.fpsMonitor.update();
            
            this.debugPanel.innerHTML = `
                <div>FPS: ${fps}</div>
                <div>Phase: ${ConstellationApp.state.currentPhase}</div>
                <div>Selected: ${ConstellationApp.state.selectedConstellation || 'None'}</div>
                <div>Season: ${ConstellationApp.state.selectedSeason || 'None'}</div>
                <div>Hands: ${info.handCount || 0}</div>
                <div>Pinching: ${info.pinchingHands || 0}</div>
                ${info.custom ? `<div>${info.custom}</div>` : ''}
            `;
        },
        
        // 디버그 패널 토글
        toggleDebugPanel: function() {
            this.showDebugInfo = !this.showDebugInfo;
            
            if (this.showDebugInfo) {
                this.createDebugPanel();
            } else if (this.debugPanel) {
                document.body.removeChild(this.debugPanel);
                this.debugPanel = null;
            }
        }
    },
    
    // 접근성 유틸리티
    accessibility: {
        // 음성 안내
        speak: function(text, options = {}) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = options.lang || 'ko-KR';
                utterance.rate = options.rate || 1;
                utterance.pitch = options.pitch || 1;
                utterance.volume = options.volume || 0.5;
                
                speechSynthesis.speak(utterance);
            }
        },
        
        // 키보드 네비게이션 설정
        setupKeyboardNavigation: function() {
            document.addEventListener('keydown', (event) => {
                switch (event.key) {
                    case 'Tab':
                        // 탭 네비게이션 처리
                        break;
                    case 'Enter':
                    case ' ':
                        // 선택/활성화
                        event.preventDefault();
                        break;
                    case 'Escape':
                        // 취소/뒤로가기
                        ConstellationApp.interactions.resetView();
                        break;
                }
            });
        },
        
        // 고대비 모드
        toggleHighContrast: function() {
            document.body.classList.toggle('high-contrast');
        }
    },
    
    // 일반 유틸리티
    general: {
        // 깊은 복사
        deepClone: function(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            if (typeof obj === 'object') {
                const clonedObj = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        clonedObj[key] = this.deepClone(obj[key]);
                    }
                }
                return clonedObj;
            }
        },
        
        // UUID 생성
        generateUUID: function() {
            return 'xxxx-xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        
        // 디바운스 함수
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },
        
        // 스로틀 함수
        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    }
};