# 천상열차분야지도 인터랙티브 별자리 체험 (Cheongsang Yeolcha Bunyajido Interactive Constellation Experience)

🌟 **An immersive 3D constellation experience based on Korea's ancient star map using hand gesture interactions**

![Korean Traditional Astronomy](https://img.shields.io/badge/Culture-Korean%20Traditional%20Astronomy-blue)
![Technology](https://img.shields.io/badge/Technology-WebGL%20%7C%20MediaPipe%20%7C%20Three.js-green)
![Interaction](https://img.shields.io/badge/Interaction-Hand%20Tracking-orange)

## 📖 Overview

This project brings Korea's historical star map "천상열차분야지도 (Cheongsang Yeolcha Bunyajido)" to life through modern web technologies. Users can explore traditional Korean constellations using intuitive hand gestures captured through their webcam.

### 🎯 Key Features

- **Hand Gesture Control**: Navigate and interact with constellations using pinch gestures
- **Traditional Korean Astronomy**: Explore the 28 lunar mansions (28수) divided into four seasonal groups
- **Immersive 3D Experience**: Real-time 3D rendering with seasonal environments
- **Educational Content**: Learn about Korean traditional constellation names and their meanings
- **Responsive Design**: Works on modern web browsers with webcam support

## 🏛️ Cultural Background

The **천상열차분야지도** is Korea's oldest surviving star map, created during the Joseon Dynasty. It represents:

- **동방 7수 (Eastern 7 Mansions)**: Spring constellations (Azure Dragon)
- **남방 7수 (Southern 7 Mansions)**: Summer constellations (Vermillion Bird)
- **서방 7수 (Western 7 Mansions)**: Autumn constellations (White Tiger)
- **북방 7수 (Northern 7 Mansions)**: Winter constellations (Black Tortoise)

## 🚀 Technology Stack

### Frontend Technologies

- **Three.js**: 3D graphics rendering and scene management
- **MediaPipe**: Real-time hand tracking and gesture recognition
- **GSAP**: Smooth animations and transitions
- **SVGLoader**: Loading and rendering traditional star map SVG files

### Core Components

- **Hand Tracking**: Real-time gesture recognition using MediaPipe Hands
- **3D Scene Management**: Dynamic constellation rendering and interaction
- **Seasonal Environments**: Atmospheric changes based on selected constellations
- **Gesture Recognition**: Pinch gestures for constellation selection and expansion

## 📁 Project Structure

```text
constellation-experience-svg/
├── index.html                     # Main application entry point
├── js/
│   ├── constellationMain.js       # Core application class and initialization
│   ├── constellationData.js       # Traditional Korean constellation data
│   ├── constellationScene.js      # 3D scene setup and management
│   ├── constellationHandTracking.js # MediaPipe hand tracking integration
│   ├── constellationInteractions.js # Gesture-based interactions
│   ├── constellationUtils.js      # Utility functions and helpers
│   └── seasonalEnvironments.js    # Environmental effects and animations
└── models/
    ├── ChonSangYolChaBunYaJiDo_Plat_Center.svg
    ├── ChonSangYolChaBunYaJiDo_Plat_East_28.svg
    ├── ChonSangYolChaBunYaJiDo_Plat_North_28.svg
    ├── ChonSangYolChaBunYaJiDo_Plat_South_28.svg
    ├── ChonSangYolChaBunYaJiDo_Plat_West_28.svg
    └── ... (additional SVG star map segments)
```

## 🎮 How to Use

### 1. Initial Setup

- Open the application in a modern web browser
- Allow camera access when prompted
- Position your hands in front of the camera

### 2. Interaction Methods

#### **Pinch Gesture Navigation**

- **First Pinch**: Select a seasonal constellation group
  - Highlights all constellations in that season (Spring/Summer/Autumn/Winter)
  - Changes environmental atmosphere
  
- **Second Pinch**: Expand individual constellation
  - Zooms into specific constellation details
  - Shows constellation information panel

#### **Two-Hand Zoom**

- **Double Fist Gesture**: Use both hands in fist position
- **Move Apart/Together**: Zoom in/out of the star map

#### **Reset View**

- **Open Palm**: Return to main star map view

### 3. Visual Feedback

- **Hand Cursors**: Real-time hand position indicators
- **Glowing Effects**: Selected constellations glow with seasonal colors
- **Environmental Changes**: Background adapts to selected season
- **Information Panels**: Contextual constellation details

## 🌟 Constellation Groups

### 🐉 동방 7수 (Eastern Azure Dragon) - Spring

- **각수** (Gaksu) - Dragon's Horn
- **항수** (Hangsu) - Dragon's Neck
- **저수** (Jeosu) - Dragon's Throat
- **방수** (Bangsu) - Dragon's Room
- **심수** (Simsu) - Dragon's Heart
- **미수** (Misu) - Dragon's Tail
- **기수** (Gisu) - Dragon's Winnowing Basket

### 🦅 남방 7수 (Southern Vermillion Bird) - Summer

- **정수** (Jeongsu) - Bird's Well
- **귀수** (Gwisu) - Bird's Ghost
- **류수** (Ryusu) - Bird's Willow
- **성수** (Seongsu) - Bird's Star
- **장수** (Jangsu) - Bird's Bow
- **익수** (Iksu) - Bird's Wings
- **진수** (Jinsu) - Bird's Chariot

### 🐅 서방 7수 (Western White Tiger) - Autumn

- **규수** (Gyusu) - Tiger's Leg
- **루수** (Rusu) - Tiger's Bond
- **위수** (Wisu) - Tiger's Stomach
- **묘수** (Myosu) - Tiger's Hairy Head
- **자수** (Jasu) - Tiger's Net
- **삼수** (Samsu) - Tiger's Participation
- **입수** (Ipsu) - Tiger's Beak

### 🐢 북방 7수 (Northern Black Tortoise) - Winter

- **두수** (Dusu) - Tortoise's Dipper
- **우수** (Usu) - Tortoise's Ox
- **여수** (Yeosu) - Tortoise's Girl
- **허수** (Heosu) - Tortoise's Emptiness
- **위수** (Wisu) - Tortoise's Rooftop
- **실수** (Silsu) - Tortoise's Encampment
- **벽수** (Byeoksu) - Tortoise's Wall

## ⚙️ Installation & Setup

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam access
- Local web server (for development)

### Development Setup

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd constellation-experience-svg
   ```

2. **Serve the files**

   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the application**

   ```text
   http://localhost:8000
   ```

### Browser Requirements

- **Chrome 88+** (Recommended)
- **Firefox 78+**
- **Safari 14+**
- **Edge 88+**

## 🔧 Configuration

### Hand Tracking Settings

```javascript
// In constellationHandTracking.js
this.hands.setOptions({
    selfieMode: true,
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});
```

### Gesture Sensitivity

```javascript
// Pinch threshold adjustment
const PINCH_THRESHOLD = 0.05;
const FIST_THRESHOLD = 0.7;
```

## 🎨 Visual Design

### Color Scheme

- **Spring (동방)**: Green tones (`#4ae24a`)
- **Summer (남방)**: Red tones (`#e24a4a`)
- **Autumn (서방)**: Orange tones (`#e2a54a`)
- **Winter (북방)**: Blue tones (`#4a90e2`)

### Animation System

- **GSAP-powered transitions**: Smooth scaling and color changes
- **Real-time effects**: Particle systems and glowing animations
- **Responsive feedback**: Visual confirmation of gestures

## 🚧 Known Issues & Limitations

### Current Limitations

- Requires adequate lighting for hand tracking
- Performance may vary on older devices
- SVG loading depends on local server configuration

### Browser Compatibility

- MediaPipe hand tracking requires HTTPS in production
- Some mobile browsers may have limited support

## 🛠️ Development

### Key Classes

- **ConstellationExperience**: Main application controller
- **ConstellationScene**: 3D scene management
- **HandTracking**: MediaPipe integration
- **SeasonalEnvironments**: Atmospheric effects

### Adding New Constellations

1. Update `constellationData.js` with star positions
2. Add SVG assets to `/models` directory
3. Configure seasonal mappings

### Customizing Interactions

- Modify gesture thresholds in `constellationHandTracking.js`
- Add new interaction patterns in `constellationInteractions.js`

## 📚 Educational Resources

### Learning Objectives

- Understanding traditional Korean astronomy
- Exploring cultural significance of constellation mapping
- Interactive learning through gesture-based technology

### Cultural Context

- Historical importance of 천상열차분야지도
- Connection to Korean traditional calendar systems
- Relationship to Chinese astronomical traditions

## 🤝 Contributing

Contributions are welcome! Please consider:

- **Cultural Accuracy**: Respect for traditional astronomical knowledge
- **Accessibility**: Ensuring broad device compatibility
- **Performance**: Maintaining smooth real-time interactions
- **Documentation**: Clear explanations of cultural context

## 📄 License

This project celebrates Korean cultural heritage and traditional astronomy. Please respect the cultural significance when using or modifying this code.

## 🙏 Acknowledgments

- **Korean Traditional Astronomy**: Historical star map references
- **MediaPipe Team**: Hand tracking technology
- **Three.js Community**: 3D graphics framework
- **GSAP**: Animation library

---

**Experience the beauty of Korean traditional astronomy through modern interactive technology** ✨

*Built with passion for preserving and sharing Korean cultural heritage*
