// constellationInteractions.js - 별자리 선택 및 확장 상호작용 로직

// ConstellationExperience 클래스에 상호작용 메서드 추가
Object.assign(window.ConstellationApp.ConstellationExperience.prototype, {
    
    // 계절 별자리 선택 (1차 상호작용)
    selectSeason(season, constellationInfo) {
        this.selectedSeason = season;
        this.updateSelectedSeason(season);
        this.updateInteractionMode('season_selected');
        
        // 계절별 별자리 하이라이트 (노란색 emissive 효과)
        this.highlightSeasonConstellations(season);
        
        // 계절별 배경 환경 변경
        this.changeSeasonEnvironment(season);
        
        // UI 업데이트
        this.updateConstellationInfo(constellationInfo);
        
        // 계절 표시
        this.showSeasonIndicator(season);
        
        console.log(`${season} 계절 별자리 선택됨`);
    },

    // 계절 별자리 하이라이트
    highlightSeasonConstellations(season) {
        // 모든 계절의 별자리 초기화
        Object.keys(this.constellationGroups).forEach(s => {
            const group = this.constellationGroups[s];
            group.children.forEach(constellation => {
                constellation.children.forEach(child => {
                    if (child.material && child.material.emissive) {
                        child.material.emissive.setHex(0x000000);
                    }
                });
            });
        });
        
        // 선택된 계절의 별자리만 노란색으로 발광
        const selectedGroup = this.constellationGroups[season];
        selectedGroup.children.forEach(constellation => {
            constellation.children.forEach(child => {
                if (child.material && child.material.emissive) {
                    // GSAP로 부드러운 발광 애니메이션
                    gsap.to(child.material.emissive, {
                        r: 1.0,
                        g: 0.8,
                        b: 0.0,
                        duration: 0.5,
                        ease: "power2.out"
                    });
                }
            });
        });
    },

    // 특정 별자리 확장 (2차 상호작용)
    expandConstellation(constellationInfo) {
        if (this.isExpanded) return;
        
        this.isExpanded = true;
        this.selectedConstellation = constellationInfo;
        this.updateInteractionMode('expanded');
        
        // 선택된 별자리를 밤하늘 전체로 확장하는 시네마틱 연출
        const targetConstellation = this.findConstellationGroup(constellationInfo);
        
        if (targetConstellation) {
            this.performExpansionAnimation(targetConstellation, constellationInfo);
        }
        
        console.log(`${constellationInfo.constellation} 확장 연출 시작`);
    },

    // 별자리 그룹 찾기
    findConstellationGroup(constellationInfo) {
        const seasonGroup = this.constellationGroups[constellationInfo.season];
        
        for (let constellation of seasonGroup.children) {
            if (constellation.userData.name === constellationInfo.constellation) {
                return constellation;
            }
        }
        return null;
    },

    // 확장 애니메이션 실행
    performExpansionAnimation(targetConstellation, constellationInfo) {
        // 1단계: 별자리 확대
        gsap.to(targetConstellation.scale, {
            x: 15,
            y: 15,
            z: 15,
            duration: 2,
            ease: "power2.out"
        });
        
        // 2단계: 카메라 줌인 및 위치 이동
        const constellationPosition = targetConstellation.position;
        gsap.to(this.camera.position, {
            x: constellationPosition.x,
            y: constellationPosition.y,
            z: constellationPosition.z + 2,
            duration: 2,
            ease: "power2.out"
        });
        
        // 3단계: 배경을 밤하늘로 변경
        this.transitionToNightSky();
        
        // 4단계: 천상열차분야지도 페이드아웃
        if (this.starMap) {
            gsap.to(this.starMap.material, {
                opacity: 0.1,
                duration: 1.5
            });
        }
        
        // 5단계: 다른 별자리들 페이드아웃
        this.fadeOutOtherConstellations(constellationInfo.season);
        
        // UI 업데이트
        setTimeout(() => {
            this.updateUI(`${constellationInfo.constellation} 확장 완료! 클릭하여 되돌아가기`);
        }, 2000);
    },

    // 밤하늘로 전환
    transitionToNightSky() {
        if (this.backgroundModel) {
            // GLB 모델인 경우
            if (this.backgroundModel.traverse) {
                this.backgroundModel.traverse((child) => {
                    if (child.isMesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                if (mat.color) {
                                    gsap.to(mat.color, {
                                        r: 0.05,
                                        g: 0.05,
                                        b: 0.15,
                                        duration: 1.5
                                    });
                                }
                            });
                        } else {
                            if (child.material.color) {
                                gsap.to(child.material.color, {
                                    r: 0.05,
                                    g: 0.05,
                                    b: 0.15,
                                    duration: 1.5
                                });
                            }
                        }
                    }
                });
            }
            // 점들로 이루어진 폴백 배경인 경우
            else if (this.backgroundModel.material) {
                gsap.to(this.backgroundModel.material.color, {
                    r: 1,
                    g: 1,
                    b: 1,
                    duration: 1.5
                });
            }
        }
    },

    // 다른 별자리들 페이드아웃
    fadeOutOtherConstellations(selectedSeason) {
        Object.keys(this.constellationGroups).forEach(season => {
            if (season !== selectedSeason) {
                const group = this.constellationGroups[season];
                gsap.to(group, {
                    opacity: 0.1,
                    duration: 1,
                    onUpdate: function() {
                        group.children.forEach(constellation => {
                            constellation.children.forEach(child => {
                                if (child.material) {
                                    child.material.opacity = group.opacity;
                                    child.material.transparent = true;
                                }
                            });
                        });
                    }
                });
            }
        });
    },

    // 뷰 리셋 (전체 초기화)
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
        
        // 배경 리셋
        this.resetBackground();
        
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
    },

    // 계절 선택만 리셋
    resetSeasonSelection() {
        if (this.selectedSeason) {
            // 기존 하이라이트 제거
            const group = this.constellationGroups[this.selectedSeason];
            group.children.forEach(constellation => {
                constellation.children.forEach(child => {
                    if (child.material && child.material.emissive) {
                        gsap.to(child.material.emissive, {
                            r: 0,
                            g: 0,
                            b: 0,
                            duration: 0.3
                        });
                    }
                });
            });
        }
        
        this.selectedSeason = null;
        this.updateSelectedSeason(null);
        this.hideSeasonIndicator();
    },

    // 배경 리셋
    resetBackground() {
        if (this.backgroundModel) {
            // GLB 모델인 경우
            if (this.backgroundModel.traverse) {
                this.backgroundModel.traverse((child) => {
                    if (child.isMesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach(mat => {
                                if (mat.color) {
                                    gsap.to(mat.color, {
                                        r: 0.2,
                                        g: 0.2,
                                        b: 0.4,
                                        duration: 1
                                    });
                                }
                            });
                        } else {
                            if (child.material.color) {
                                gsap.to(child.material.color, {
                                    r: 0.2,
                                    g: 0.2,
                                    b: 0.4,
                                    duration: 1
                                });
                            }
                        }
                    }
                });
            }
            // 점들로 이루어진 폴백 배경인 경우
            else if (this.backgroundModel.material) {
                gsap.to(this.backgroundModel.material.color, {
                    r: 1,
                    g: 1,
                    b: 1,
                    duration: 1
                });
            }
        }
    },

    // UI 업데이트 메서드들
    updateConstellationInfo(constellationInfo) {
        const panel = document.getElementById('info-panel');
        document.getElementById('constellation-name').textContent = constellationInfo.constellation;
        document.getElementById('constellation-description').textContent = constellationInfo.description;
        document.getElementById('constellation-season').textContent = `${this.selectedSeason} 계절에 관찰되는 별자리`;
        
        panel.classList.add('visible');
    },

    hideConstellationInfo() {
        document.getElementById('info-panel').classList.remove('visible');
    },

    showSeasonIndicator(season) {
        const seasonNames = {
            spring: '🌸 봄',
            summer: '☀️ 여름', 
            autumn: '🍂 가을',
            winter: '❄️ 겨울'
        };
        
        const indicator = document.getElementById('season-indicator');
        indicator.textContent = seasonNames[season];
        indicator.classList.add('visible');
    },

    hideSeasonIndicator() {
        document.getElementById('season-indicator').classList.remove('visible');
    }
});