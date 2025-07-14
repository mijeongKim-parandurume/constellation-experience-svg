// constellationHandTracking.js - MediaPipe 핸드 트래킹 설정 및 처리

// ConstellationExperience 클래스에 손 추적 메서드 추가
Object.assign(window.ConstellationApp.ConstellationExperience.prototype, {
    
    async setupCamera() {
        const video = document.getElementById('video');
        
        try {
            this.camera_stream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    width: 640, 
                    height: 480,
                    facingMode: 'user'
                }
            });
            video.srcObject = this.camera_stream;
            console.log('카메라 초기화 완료');
        } catch (error) {
            console.error('카메라 접근 실패:', error);
            this.updateUI('카메라 접근 실패: ' + error.message);
            throw error;
        }
    },

    async setupMediaPipe() {
        if (typeof Hands === 'undefined') {
            throw new Error('MediaPipe Hands 라이브러리가 로드되지 않았습니다.');
        }

        this.hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        this.hands.setOptions({
            selfieMode: true,  // 좌우반전 문제 해결
            maxNumHands: 2,    // 양손 인식
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.hands.onResults((results) => this.onHandResults(results));

        if (typeof Camera === 'undefined') {
            throw new Error('MediaPipe Camera 유틸리티가 로드되지 않았습니다.');
        }

        const camera = new Camera(document.getElementById('video'), {
            onFrame: async () => {
                await this.hands.send({ image: document.getElementById('video') });
            },
            width: 640,
            height: 480
        });

        camera.start();
        console.log('MediaPipe 초기화 완료');
    },

    onHandResults(results) {
        // 손이 감지되지 않은 경우
        if (!results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            this.virtualHand.visible = false;
            this.updateUI('손을 카메라 앞에 위치시키세요');
            return;
        }

        // 첫 번째 손 처리 (추후 양손 지원 확장 가능)
        const landmarks = results.multiHandLandmarks[0];
        const handedness = results.multiHandedness[0].label; // "Left" 또는 "Right"
        
        // 손바닥 중심 계산 (중지 MCP 관절 사용)
        const palmCenter = landmarks[9]; 
        
        // 좌우반전 문제 해결: selfieMode가 true이므로 x좌표 그대로 사용
        this.handPosition = {
            x: (palmCenter.x - 0.5) * 8,      // 좌우반전 해결
            y: -(palmCenter.y - 0.5) * 6,     // 상하는 반전 유지
            z: this.calculateDepthFromHand(landmarks)
        };
        
        // 가상 손 위치 업데이트
        this.virtualHand.position.set(
            this.handPosition.x,
            this.handPosition.y,
            this.handPosition.z + 1
        );
        this.virtualHand.visible = true;
        
        // 핀치 제스처 감지 개선
        const thumb = landmarks[4];
        const indexFinger = landmarks[8];
        const distance = Math.sqrt(
            Math.pow(thumb.x - indexFinger.x, 2) +
            Math.pow(thumb.y - indexFinger.y, 2) +
            Math.pow(thumb.z - indexFinger.z, 2)
        );
        
        this.lastPinchState = this.isPinching;
        this.isPinching = distance < 0.05; // 임계값 조정
        
        // 핀치 시작 감지
        if (this.isPinching && !this.lastPinchState) {
            this.onPinchStart();
        }
        
        // 손 방향 정보 업데이트
        this.updateHandOrientation(landmarks);
        
        // UI 업데이트
        const pinchStatus = this.isPinching ? '(핀치 중)' : '';
        this.updateUI(`${handedness} 손 감지됨 ${pinchStatus}`);
    },

    // 손의 깊이를 더 정확하게 계산하는 함수
    calculateDepthFromHand(landmarks) {
        // 주요 관절 사이의 거리로 깊이 추정
        const indexBase = landmarks[5];   // 검지 MCP
        const middleBase = landmarks[9];  // 중지 MCP
        const ringBase = landmarks[13];   // 약지 MCP
        const pinkyBase = landmarks[17];  // 소지 MCP
        
        // 각 관절 사이의 거리 계산
        const dist1 = Math.sqrt(
            Math.pow(indexBase.x - middleBase.x, 2) +
            Math.pow(indexBase.y - middleBase.y, 2)
        );
        
        const dist2 = Math.sqrt(
            Math.pow(middleBase.x - ringBase.x, 2) +
            Math.pow(middleBase.y - ringBase.y, 2)
        );
        
        const dist3 = Math.sqrt(
            Math.pow(ringBase.x - pinkyBase.x, 2) +
            Math.pow(ringBase.y - pinkyBase.y, 2)
        );
        
        // 평균 거리로 깊이 계산
        const avgDistance = (dist1 + dist2 + dist3) / 3;
        const depthFactor = 15.0; // 깊이 감도 조정
        let depth = -1 * (1.0 - avgDistance * depthFactor);
        
        // 범위 제한
        return Math.max(-2.0, Math.min(2.0, depth));
    },

    // 손의 방향 정보 업데이트
    updateHandOrientation(landmarks) {
        const wrist = landmarks[0];
        const middleMCP = landmarks[9];
        
        // 손가락 방향 벡터
        const fingerDirection = new THREE.Vector3(
            middleMCP.x - wrist.x,
            middleMCP.y - wrist.y,
            middleMCP.z - wrist.z
        ).normalize();
        
        // 가상 손의 회전 업데이트
        this.virtualHand.lookAt(
            this.virtualHand.position.x + fingerDirection.x,
            this.virtualHand.position.y + fingerDirection.y,
            this.virtualHand.position.z + fingerDirection.z
        );
    },

    // 핀치 제스처 시작 시 호출
    onPinchStart() {
        // 가상 손 위치에서 별자리 감지
        const handVector = new THREE.Vector3(
            this.handPosition.x,
            this.handPosition.y,
            this.handPosition.z
        );
        
        let closestConstellation = null;
        let minDistance = Infinity;
        
        // 모든 별자리 그룹에서 가장 가까운 별자리 찾기
        Object.keys(this.constellationGroups).forEach(season => {
            const group = this.constellationGroups[season];
            
            group.children.forEach(constellation => {
                constellation.children.forEach(child => {
                    if (child.userData && child.userData.constellation) {
                        const distance = handVector.distanceTo(child.position);
                        if (distance < minDistance && distance < 1.0) {
                            minDistance = distance;
                            closestConstellation = {
                                season: season,
                                constellation: child.userData.constellation,
                                description: child.userData.description,
                                element: child
                            };
                        }
                    }
                });
            });
        });
        
        if (closestConstellation) {
            if (!this.selectedSeason) {
                // 첫 번째 선택: 계절 별자리 하이라이트
                this.selectSeason(closestConstellation.season, closestConstellation);
            } else if (this.selectedSeason === closestConstellation.season) {
                // 두 번째 선택: 별자리 확장
                this.expandConstellation(closestConstellation);
            } else {
                // 다른 계절 선택: 기존 선택 해제 후 새 계절 선택
                this.resetSeasonSelection();
                this.selectSeason(closestConstellation.season, closestConstellation);
            }
        }
    }
});