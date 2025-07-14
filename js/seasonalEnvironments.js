// constellationUtils.js - 유틸리티 함수들

// 전역 네임스페이스 초기화
window.ConstellationApp = window.ConstellationApp || {};

// 유틸리티 클래스
window.ConstellationApp.Utils = {
    
    // 벡터 계산 유틸리티
    Vector: {
        // 두 점 사이의 거리 계산
        distance(point1, point2) {
            return Math.sqrt(
                Math.pow(point2.x - point1.x, 2) +
                Math.pow(point2.y - point1.y, 2) +
                Math.pow(point2.z - point1.z, 2)
            );
        },
        
        // 두 벡터의 내적
        dot(v1, v2) {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        },
        
        // 벡터 정규화
        normalize(vector) {
            const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
            if (length === 0) return { x: 0, y: 0, z: 0 };
            return {
                x: vector.x / length,
                y: vector.y / length,
                z: vector.z / length
            };
        },
        
        // 선형 보간
        lerp(start, end, t) {
            return {
                x: start.x + (end.x - start.x) * t,
                y: start.y + (end.y - start.y) * t,
                z: start.z + (end.z - start.z) * t
            };
        }
    },
    
    // 애니메이션 유틸리티
    Animation: {
        // 이징 함수들
        easing: {
            easeInOut(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            },
            
            easeOut(t) {
                return 1 - Math.pow(1 - t, 3);
            },
            
            easeIn(t) {
                return t * t * t;
            },
            
            elastic(t) {
                return Math.sin(-13 * Math.PI * 0.5 * (t + 1)) * Math.pow(2, -10 * t) + 1;
            }
        },
        
        // 부드러운 카메라 이동
        smoothCameraTransition(camera, targetPosition, duration = 1000, callback = null) {
            const startPosition = camera.position.clone();
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = this.easing.easeInOut(progress);
                
                camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else if (callback) {
                    callback();
                }
            };
            
            animate();
        }
    },
    
    // 색상 유틸리티
    Color: {
        // HEX를 RGB로 변환
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16) / 255,
                g: parseInt(result[2], 16) / 255,
                b: parseInt(result[3], 16) / 255
            } : null;
        },
        
        // RGB를 HEX로 변환
        rgbToHex(r, g, b) {
            return "#" + [r, g, b].map(x => {
                const hex = Math.round(x * 255).toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            }).join("");
        },
        
        // 색상 보간
        lerpColors(color1, color2, t) {
            return {
                r: color1.r + (color2.r - color1.r) * t,
                g: color1.g + (color2.g - color1.g) * t,
                b: color1.b + (color2.b - color1.b) * t
            };
        }
    },
    
    // 수학 유틸리티
    Math: {
        // 각도를 라디안으로 변환
        degToRad(degrees) {
            return degrees * (Math.PI / 180);
        },
        
        // 라디안을 각도로 변환
        radToDeg(radians) {
            return radians * (180 / Math.PI);
        },
        
        // 값을 범위 내로 제한
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        },
        
        // 값을 한 범위에서 다른 범위로 매핑
        map(value, inMin, inMax, outMin, outMax) {
            return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        },
        
        // 랜덤 범위 값
        randomRange(min, max) {
            return Math.random() * (max - min) + min;
        }
    },
    
    // DOM 유틸리티
    DOM: {
        // 요소가 존재하는지 확인
        exists(selector) {
            return document.querySelector(selector) !== null;
        },
        
        // 요소에 클래스 토글
        toggleClass(element, className) {
            if (element.classList.contains(className)) {
                element.classList.remove(className);
            } else {
                element.classList.add(className);
            }
        },
        
        // 부드러운 텍스트 변경
        animateText(element, newText, duration = 300) {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.textContent = newText;
                element.style.opacity = '1';
            }, duration / 2);
        }
    },
    
    // 성능 유틸리티
    Performance: {
        // FPS 계산기
        fpsCounter: {
            frames: 0,
            lastTime: Date.now(),
            fps: 0,
            
            update() {
                this.frames++;
                const currentTime = Date.now();
                
                if (currentTime >= this.lastTime + 1000) {
                    this.fps = this.frames;
                    this.frames = 0;
                    this.lastTime = currentTime;
                }
                
                return this.fps;
            }
        },
        
        // 성능 측정
        measure(name, fn) {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${name}: ${(end - start).toFixed(2)}ms`);
            return result;
        }
    },
    
    // 디버그 유틸리티
    Debug: {
        // 3D 객체 정보 출력
        logObjectInfo(object) {
            console.log('Object Info:', {
                name: object.name || 'Unnamed',
                position: object.position,
                rotation: object.rotation,
                scale: object.scale,
                type: object.type || object.constructor.name
            });
        },
        
        // 씬 정보 출력
        logSceneInfo(scene) {
            console.log('Scene Info:', {
                children: scene.children.length,
                objects: scene.children.map(child => ({
                    name: child.name || 'Unnamed',
                    type: child.type || child.constructor.name
                }))
            });
        }
    },
    
    // 로딩 유틸리티
    Loading: {
        // 진행률 표시
        showProgress(progress, message = 'Loading...') {
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.innerHTML = `
                    ${message}<br>
                    <div style="width: 200px; height: 4px; background: rgba(255,255,255,0.3); margin-top: 10px;">
                        <div style="width: ${progress * 100}%; height: 100%; background: #fff; transition: width 0.3s;"></div>
                    </div>
                `;
            }
        },
        
        // 로딩 숨기기
        hide() {
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }
    }
};

// ConstellationExperience 클래스에 유틸리티 메서드 추가
Object.assign(window.ConstellationApp.ConstellationExperience.prototype, {
    
    // 환경 리셋 메서드 수정 (seasonalEnvironments.js의 resetEnvironment 호출)
    resetView() {
        console.log('뷰 리셋 시작');
        
        // 상태 초기화
        this.isExpanded = false;
        this.selectedSeason = null;
        this.selectedConstellation = null;
        this.updateInteractionMode('waiting');
        this.updateSelectedSeason(null);
        
        // 카메라 원위치
        gsap.to(this.camera.position, {
            x: this.initialCameraPosition.x,
            y: this.initialCameraPosition.y,
            z: this.initialCameraPosition.z,
            duration: 1.5,
            ease: "power2.out"
        });
        
        // 모든 별자리 스케일 및 효과 리셋
        Object.keys(this.constellationGroups).forEach(season => {
            const group = this.constellationGroups[season];
            
            // 스케일 리셋
            group.children.forEach(constellation => {
                gsap.to(constellation.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 1
                });
                
                // 발광 효과 제거
                constellation.children.forEach(child => {
                    if (child.material) {
                        if (child.material.emissive) {
                            gsap.to(child.material.emissive, {
                                r: 0,
                                g: 0,
                                b: 0,
                                duration: 0.5
                            });
                        }
                        if (child.material.opacity !== undefined) {
                            gsap.to(child.material, {
                                opacity: 1,
                                duration: 1
                            });
                        }
                    }
                });
            });
            
            // 그룹 투명도 리셋
            gsap.to(group, {
                opacity: 1,
                duration: 1
            });
        });
        
        // 배경 및 환경 리셋
        this.resetBackground();
        if (typeof this.resetEnvironment === 'function') {
            this.resetEnvironment();
        }
        
        // 천상열차분야지도 복원
        if (this.starMap) {
            gsap.to(this.starMap.material, {
                opacity: this.initialStarMapOpacity,
                duration: 1
            });
        }
        
        // UI 리셋
        this.hideSeasonIndicator();
        this.hideConstellationInfo();
        this.updateUI('리셋 완료! 손을 카메라 앞에 위치시키세요.');
    }
});