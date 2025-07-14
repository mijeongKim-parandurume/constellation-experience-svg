// constellationScene.js - 3D 씬 및 시각적 요소 관리

ConstellationApp.scene = {
    // Three.js 기본 요소
    scene: null,
    camera: null,
    renderer: null,
    
    // 천상열차분야지도 모델
    starMap: null,
    starMapLoaded: false,
    
    // 별자리 요소들
    constellationGroups: {},
    starMeshes: {},
    connectionLines: {},
    
    // 환경 요소
    skybox: null,
    ambientLight: null,
    directionalLight: null,
    fog: null,
    
    // 애니메이션 요소
    particleSystem: null,
    expandedStars: null,
    
    // 초기화
    init: function() {
        this.createScene();
        this.setupLights();
        this.createStarMap();
        this.createConstellations();
        this.createParticleSystem();
        this.setupEnvironment();
        this.startRenderLoop();
    },
    
    // 기본 씬 생성
    createScene: function() {
        // 씬 생성
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0f0f23);
        
        // 카메라 생성
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        // 🔧 카메라 위치를 더 멀리 이동
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        // 렌더러 생성
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.6;
        
        document.body.appendChild(this.renderer.domElement);
        
        // 리사이즈 이벤트
        window.addEventListener('resize', () => this.onWindowResize(), false);
    },
    
    // 조명 설정
    setupLights: function() {
        // 주변광
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(this.ambientLight);
        
        // 방향광
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(10, 10, 5);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(this.directionalLight);
        
        // 포인트 라이트 (별빛 효과)
        const pointLight = new THREE.PointLight(0xffd700, 0.5, 50);
        pointLight.position.set(0, 5, 0);
        this.scene.add(pointLight);
    },
    
    // 천상열차분야지도 모델 생성
    createStarMap: function() {
        const loader = new THREE.GLTFLoader();
        
        // 메인 중앙 모델 로드
        loader.load(
            'models/ChonSangYolChaBunYaJiDo_Plat_Center.glb',
            (gltf) => {
                this.starMap = gltf.scene;
                
                // 🔧 모델 크기 및 위치 조정 (필요시 수정하세요)
                this.starMap.scale.set(0.01, 0.01, 0.01);   // 매우 작게 시작
                this.starMap.position.set(0, 0, 0);         // 중앙 위치
                this.starMap.rotation.x = 0;                // 회전
                
                // 메인 모델 경계 상자 계산해서 크기 확인
                const box = new THREE.Box3().setFromObject(this.starMap);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                console.log('메인 모델 원본 크기:', size);
                console.log('메인 모델 중심점:', center);
                
                // 모델을 화면에 맞는 크기로 자동 조정
                const maxDimension = Math.max(size.x, size.y, size.z);
                let targetScale = 2.0 / maxDimension; // 화면에 적당히 보이도록
                
                // 최소/최대 스케일 제한
                targetScale = Math.max(0.001, Math.min(10, targetScale));
                
                this.starMap.scale.set(targetScale, targetScale, targetScale);
                
                // 모델 중심을 원점으로 이동
                this.starMap.position.sub(center.multiplyScalar(targetScale));
                
                console.log('적용된 스케일:', targetScale);
                console.log('조정된 위치:', this.starMap.position);
                
                // 재질 설정
                this.starMap.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // 기본 재질을 금속성 재질로 변경
                        if (child.material) {
                            child.material = new THREE.MeshPhysicalMaterial({
                                color: child.material.color || 0x8B7355,
                                metalness: 0.3,
                                roughness: 0.7,
                                clearcoat: 0.1
                            });
                        }
                    }
                });
                
                this.scene.add(this.starMap);
                console.log('메인 천상열차분야지도 모델 로딩 완료');
                
                // 로딩 화면 숨기기
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            },
            (progress) => {
                console.log('메인 모델 로딩 진행률:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('메인 천상열차분야지도 모델 로딩 실패:', error);
                this.createFallbackStarMap();
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) {
                    loadingScreen.classList.add('hidden');
                }
            }
        );
        
        // 계절별 모델들도 로드
        this.loadSeasonalModels();
    },
    
    // 계절별 모델 로딩 함수 추가
    loadSeasonalModels: function() {
        const loader = new THREE.GLTFLoader();
        
        // 계절별 모델 파일 매핑
        const seasonalModels = {
            spring: 'models/ChonSangYolChaBunYaJiDo_Plat_East.glb',   // 동방 = 봄
            summer: 'models/ChonSangYolChaBunYaJiDo_Plat_South.glb',  // 남방 = 여름
            autumn: 'models/ChonSangYolChaBunYaJiDo_Plat_West.glb',   // 서방 = 가을
            winter: 'models/ChonSangYolChaBunYaJiDo_Plat_North.glb'   // 북방 = 겨울
        };
        
        // 계절별 모델 저장소 초기화
        this.seasonalModels = {};
        
        // 각 계절별 모델 로드
        Object.keys(seasonalModels).forEach(season => {
            const modelPath = seasonalModels[season];
            
            loader.load(
                modelPath,
                (gltf) => {
                    const seasonModel = gltf.scene;
                    
                    // 🔧 계절별 모델 크기 및 위치 조정 (필요시 수정하세요)
                    seasonModel.scale.set(0.01, 0.01, 0.01); // 매우 작게 시작
                    seasonModel.position.set(0, 0, 0);
                    seasonModel.rotation.set(0, 0, 0);
                    seasonModel.visible = false; // 처음에는 숨김
                    
                    // 모델 경계 상자 계산해서 크기 확인
                    const box = new THREE.Box3().setFromObject(seasonModel);
                    const size = box.getSize(new THREE.Vector3());
                    const center = box.getCenter(new THREE.Vector3());
                    
                    console.log(`${season} 모델 원본 크기:`, size);
                    console.log(`${season} 모델 중심점:`, center);
                    
                    // 모델을 화면에 맞는 크기로 자동 조정
                    const maxDimension = Math.max(size.x, size.y, size.z);
                    let targetScale = 2.0 / maxDimension; // 화면에 적당히 보이도록
                    
                    // 최소/최대 스케일 제한
                    targetScale = Math.max(0.001, Math.min(10, targetScale));
                    
                    seasonModel.scale.set(targetScale, targetScale, targetScale);
                    
                    // 모델 중심을 원점으로 이동
                    seasonModel.position.sub(center.multiplyScalar(targetScale));
                    
                    console.log(`${season} 적용된 스케일:`, targetScale);
                    
                    // 재질 설정
                    seasonModel.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            if (child.material) {
                                child.material = new THREE.MeshPhysicalMaterial({
                                    color: child.material.color || 0x8B7355,
                                    metalness: 0.3,
                                    roughness: 0.7,
                                    clearcoat: 0.1
                                });
                            }
                        }
                    });
                    
                    // 씬에 추가
                    this.scene.add(seasonModel);
                    
                    // 계절별 모델 저장
                    this.seasonalModels[season] = seasonModel;
                    
                    console.log(`${season} 계절 모델 로딩 완료: ${modelPath}`);
                },
                (progress) => {
                    console.log(`${season} 모델 로딩 진행률:`, (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error(`${season} 모델 로딩 실패:`, error);
                }
            );
        });
    },
    
    // 대체 천상열차분야지도 생성 (모델 로딩 실패 시)
    createFallbackStarMap: function() {
        const geometry = new THREE.CylinderGeometry(3, 3, 0.1, 32);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x8B7355,
            metalness: 0.3,
            roughness: 0.7
        });
        
        this.starMap = new THREE.Mesh(geometry, material);
        this.starMap.position.set(0, 0, 0);
        this.scene.add(this.starMap);
        this.starMapLoaded = true;
        
        console.log('대체 천상열차분야지도 생성 완료');
    },
    
    // 별자리 생성
    createConstellations: function() {
        const data = ConstellationApp.constellationData;
        
        // 각 방향별 별자리 그룹 생성
        Object.keys(data).forEach(directionKey => {
            const direction = data[directionKey];
            const group = new THREE.Group();
            group.name = directionKey;
            
            this.constellationGroups[directionKey] = group;
            this.starMeshes[directionKey] = [];
            this.connectionLines[directionKey] = [];
            
            // 각 별자리 생성
            direction.constellations.forEach((constellation, constIndex) => {
                const constGroup = new THREE.Group();
                constGroup.name = constellation.name;
                constGroup.userData = {
                    constellation: constellation,
                    direction: directionKey,
                    season: direction.season
                };
                
                const stars = [];
                const lines = [];
                
                // 별 생성
                constellation.stars.forEach((starData, starIndex) => {
                    const star = this.createStar(starData, direction.color);
                    star.userData = {
                        constellation: constellation.name,
                        direction: directionKey,
                        starIndex: starIndex
                    };
                    
                    constGroup.add(star);
                    stars.push(star);
                });
                
                // 연결선 생성
                constellation.connections.forEach(connection => {
                    const line = this.createConnection(
                        stars[connection[0]].position,
                        stars[connection[1]].position,
                        direction.color
                    );
                    line.userData = {
                        constellation: constellation.name,
                        direction: directionKey
                    };
                    
                    constGroup.add(line);
                    lines.push(line);
                });
                
                this.starMeshes[directionKey].push(stars);
                this.connectionLines[directionKey].push(lines);
                
                group.add(constGroup);
            });
            
            this.scene.add(group);
        });
    },
    
    // 개별 별 생성
    createStar: function(starData, baseColor) {
        const geometry = new THREE.SphereGeometry(0.03 * starData.brightness, 16, 16);
        
        // 별의 재질 - 발광 효과
        const material = new THREE.MeshBasicMaterial({
            color: baseColor,
            transparent: true,
            opacity: 0.8
        });
        
        // 발광 효과를 위한 추가 구체
        const glowGeometry = new THREE.SphereGeometry(0.05 * starData.brightness, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: baseColor,
            transparent: true,
            opacity: 0.3
        });
        
        const star = new THREE.Mesh(geometry, material);
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        
        star.position.set(starData.x, starData.y, starData.z);
        glow.position.copy(star.position);
        
        // 그룹으로 묶어서 반환
        const starGroup = new THREE.Group();
        starGroup.add(star);
        starGroup.add(glow);
        starGroup.position.set(starData.x, starData.y, starData.z);
        
        return starGroup;
    },
    
    // 별자리 연결선 생성
    createConnection: function(start, end, color) {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6,
            linewidth: 2
        });
        
        return new THREE.Line(geometry, material);
    },
    
    // 파티클 시스템 생성 (배경 별들)
    createParticleSystem: function() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // 구면 좌표계에서 랜덤 위치 생성
            const radius = 20 + Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.cos(phi);
            positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
            
            // 별의 색상 (흰색 ~ 노란색)
            const intensity = 0.5 + Math.random() * 0.5;
            colors[i * 3] = intensity;
            colors[i * 3 + 1] = intensity;
            colors[i * 3 + 2] = intensity * (0.8 + Math.random() * 0.2);
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: false
        });
        
        this.particleSystem = new THREE.Points(geometry, material);
        this.scene.add(this.particleSystem);
    },
    
    // 환경 설정
    setupEnvironment: function() {
        // 안개 효과
        this.fog = new THREE.FogExp2(0x0f0f23, 0.02);
        this.scene.fog = this.fog;
    },
    
    // 계절별 환경 전환
    changeSeasonalEnvironment: function(season) {
        const settings = ConstellationApp.seasonalSettings[season];
        if (!settings) return;
        
        console.log(`계절 환경 전환: ${season}`);
        
        // 배경색 변경 (setHex 대신 set 사용)
        if (this.scene.background) {
            this.scene.background.set(settings.skyColor);
        }
        
        // 안개 색상 변경
        if (this.fog) {
            this.fog.color.set(settings.fogColor);
        }
        
        // 조명 색상 변경
        if (this.ambientLight) {
            this.ambientLight.color.set(settings.ambientLight);
        }
        
        if (this.directionalLight) {
            this.directionalLight.color.set(settings.directionalLight);
        }
        
        // 계절별 모델 전환
        this.switchSeasonalModel(season);
    },
    
    // 계절별 모델 전환
    switchSeasonalModel: function(season) {
        console.log(`모델 전환 시도: ${season}`);
        console.log('사용 가능한 계절 모델들:', this.seasonalModels);
        
        if (!this.seasonalModels) {
            console.log('계절 모델들이 아직 로드되지 않음');
            return;
        }
        
        // 모든 계절 모델 숨기기
        Object.keys(this.seasonalModels).forEach(key => {
            if (this.seasonalModels[key]) {
                this.seasonalModels[key].visible = false;
                console.log(`${key} 모델 숨김`);
            }
        });
        
        // 메인 모델 숨기기
        if (this.starMap) {
            this.starMap.visible = false;
            console.log('메인 모델 숨김');
        }
        
        // 선택된 계절 모델 보이기
        if (this.seasonalModels[season]) {
            this.seasonalModels[season].visible = true;
            console.log(`${season} 모델 활성화 성공`);
            
            // 모델이 실제로 보이는지 확인
            const model = this.seasonalModels[season];
            console.log(`${season} 모델 정보:`, {
                visible: model.visible,
                position: model.position,
                scale: model.scale,
                children: model.children.length
            });
        } else {
            // 계절 모델이 없으면 메인 모델 보이기
            if (this.starMap) {
                this.starMap.visible = true;
                console.log(`${season} 모델이 없어 메인 모델 사용`);
            }
        }
    },
    
    // 메인 모델로 돌아가기
    showMainModel: function() {
        // 모든 계절 모델 숨기기
        if (this.seasonalModels) {
            Object.keys(this.seasonalModels).forEach(key => {
                if (this.seasonalModels[key]) {
                    this.seasonalModels[key].visible = false;
                }
            });
        }
        
        // 메인 모델 보이기
        if (this.starMap) {
            this.starMap.visible = true;
        }
        
        console.log('메인 모델로 전환');
    },
    
    // 별자리 하이라이트
    highlightConstellationGroup: function(direction) {
        // 모든 별자리 그룹이 존재하는지 확인
        if (!this.constellationGroups || Object.keys(this.constellationGroups).length === 0) {
            console.log('별자리 그룹이 아직 생성되지 않음');
            return;
        }
        
        // 모든 별자리 원래대로
        Object.keys(this.constellationGroups).forEach(key => {
            const group = this.constellationGroups[key];
            if (group) {
                group.traverse((child) => {
                    if (child.material && typeof child.material.emissive !== 'undefined') {
                        child.material.emissive.setHex(0x000000);
                        child.material.opacity = 0.8;
                    }
                });
            }
        });
        
        // 선택된 그룹 하이라이트
        if (direction && this.constellationGroups[direction]) {
            const group = this.constellationGroups[direction];
            group.traverse((child) => {
                if (child.material && typeof child.material.emissive !== 'undefined') {
                    child.material.emissive.setHex(0xffff00);
                    child.material.opacity = 1.0;
                }
            });
        }
    },
    
    // 별자리 확장 애니메이션
    expandConstellation: function(constellation) {
        if (!constellation) return;
        
        // 확장될 별자리 데이터 찾기
        let targetConstellation = null;
        let targetDirection = null;
        
        Object.keys(ConstellationApp.constellationData).forEach(directionKey => {
            const direction = ConstellationApp.constellationData[directionKey];
            direction.constellations.forEach(constData => {
                if (constData.name === constellation) {
                    targetConstellation = constData;
                    targetDirection = directionKey;
                }
            });
        });
        
        if (!targetConstellation) return;
        
        // 확장 애니메이션 실행
        this.performExpansionAnimation(targetConstellation, targetDirection);
    },
    
    // 확장 애니메이션 실행
    performExpansionAnimation: function(constellation, direction) {
        ConstellationApp.state.isAnimating = true;
        
        // 카메라 애니메이션
        const targetPosition = new THREE.Vector3(0, 0, 1);
        const targetLookAt = new THREE.Vector3(0, 0, 0);
        
        // 기존 별자리들 페이드아웃 (간단한 방식)
        Object.keys(this.constellationGroups).forEach(key => {
            if (key !== direction) {
                const group = this.constellationGroups[key];
                group.traverse((child) => {
                    if (child.material) {
                        child.material.transparent = true;
                        // 간단한 페이드아웃
                        const fadeStep = () => {
                            child.material.opacity -= 0.02;
                            if (child.material.opacity > 0) {
                                requestAnimationFrame(fadeStep);
                            }
                        };
                        fadeStep();
                    }
                });
            }
        });
        
        // 선택된 별자리 확대 (간단한 방식)
        const targetGroup = this.constellationGroups[direction];
        if (targetGroup) {
            const scaleStep = () => {
                if (targetGroup.scale.x < 5) {
                    targetGroup.scale.x += 0.1;
                    targetGroup.scale.y += 0.1;
                    targetGroup.scale.z += 0.1;
                    requestAnimationFrame(scaleStep);
                }
            };
            scaleStep();
        }
        
        // 배경색 변경 (간단한 방식)
        const currentColor = this.scene.background;
        const targetColor = new THREE.Color(0.02, 0.02, 0.05);
        const colorStep = () => {
            currentColor.lerp(targetColor, 0.02);
            if (currentColor.distanceTo(targetColor) > 0.01) {
                requestAnimationFrame(colorStep);
            }
        };
        colorStep();
        
        // 애니메이션 완료 후 상태 업데이트
        setTimeout(() => {
            ConstellationApp.state.isAnimating = false;
            ConstellationApp.state.currentPhase = 'expanded';
            ConstellationApp.state.expandedConstellation = constellation.name;
        }, 2000);
    },
    
    // 렌더링 루프
    startRenderLoop: function() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // 파티클 시스템 회전
            if (this.particleSystem) {
                this.particleSystem.rotation.y += 0.0002;
            }
            
            this.renderer.render(this.scene, this.camera);
        };
        
        animate();
    },
    
    // 윈도우 리사이즈 처리
    onWindowResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    
    // 별자리 충돌 감지
    getIntersectedConstellation: function(position, radius = 0.2) {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(
            new THREE.Vector2(
                (position.x / window.innerWidth) * 2 - 1,
                -(position.y / window.innerHeight) * 2 + 1
            ),
            this.camera
        );
        
        const intersects = [];
        
        // 모든 별자리 그룹에서 교차점 찾기
        Object.keys(this.constellationGroups).forEach(directionKey => {
            const group = this.constellationGroups[directionKey];
            const groupIntersects = raycaster.intersectObjects(group.children, true);
            intersects.push(...groupIntersects);
        });
        
        // 가장 가까운 교차점 반환
        if (intersects.length > 0) {
            return intersects[0].object.userData;
        }
        
        return null;
    }
};