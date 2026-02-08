import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import {
  createVoiceUI,
  initVoiceRecognition,
  toggleVoiceRecognition
} from './voice.js';
/* ===== Voice Recognition Setup ===== */

const container = document.getElementById('app');

/* ===== Hand Gesture State ===== */
let handX = 0;
let handY = 0;
let handZ = 0;
let handDistance = 0;
let isHandDetected = false;
let gestureType = 'none'; // 'wave', 'thumbsup', 'peace', 'fist'
let gestureHoldStart = 0; // Timestamp when gesture started
let gestureHoldDuration = 3000; // 3 seconds in milliseconds
let lastTriggeredGesture = 'none'; // Track which gesture was triggered

/* ===== Animation States ===== */
let currentAnimation = 'idle';
let animationMixer = null;
let animations = {};
let isWaving = false;
let waveStartTime = 0;
let armBones = {}; // Store arm/hand bones for animation

/* ===== Scene ===== */
const scene = new THREE.Scene();

/* ===== Camera ===== */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

/* ===== Renderer ===== */
const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Better quality
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

/* ===== Voice UI ===== */
const { voiceButton, statusDiv, transcriptDiv } = createVoiceUI();

/* ===== Initialize Voice Recognition ===== */
const recognition = initVoiceRecognition(
  statusDiv,
  transcriptDiv,
  voiceButton,
  handleVoiceCommand
);

/* ===== Voice Button Toggle ===== */
voiceButton.addEventListener('click', () => {
  toggleVoiceRecognition(recognition, statusDiv);
});



/* ===== Lighting (ENHANCED) ===== */
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(5, 10, 7);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// Add a front light to illuminate the model from camera direction
const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
frontLight.position.set(0, 0, 5);
scene.add(frontLight);

/* ===== Temporary Placeholder (so you see SOMETHING) ===== */
const placeholderGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const placeholderMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xff69b4,
  metalness: 0.3,
  roughness: 0.7
});
const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
placeholder.position.set(-5, -3.5, 0); // ⬅️ Far left corner
scene.add(placeholder);

/* ===== Load Bunny Robot (OBJ + MTL with Skin) ===== */
const mtlLoader = new MTLLoader();
const objLoader = new OBJLoader();

console.log('🔄 Loading bunny robot model with skin...');

mtlLoader.load('/bunny robot r 34.mtl', (materials) => {
  materials.preload();
  objLoader.setMaterials(materials);
  
  objLoader.load('/bunny robot r 34.obj', (obj) => {
    const robot = obj;

    // Remove placeholder once model loads
    scene.remove(placeholder);

    console.log('✅ Bunny robot loaded with skin!');
    console.log('Robot structure:', robot);

    // 🧭 Center the model
    const box = new THREE.Box3().setFromObject(robot);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    console.log('Model size:', size);

    // Move to origin
    robot.position.sub(center);

    // Auto-scale
    const maxAxis = Math.max(size.x, size.y, size.z);
    const scale = 4.5 / maxAxis;
    robot.scale.setScalar(scale);
    robot.userData.baseScale = scale;

    // 🎥 Position in CENTER of screen (lower)
    robot.position.set(0, -2, 0);
    
    // ⬅️ FACE FORWARD (OBJ models face right by default)
    robot.rotation.y = Math.PI / 2; // Rotate 90° to face camera
    robot.rotation.x = 0;
    robot.rotation.z = 0;
    // OBJ models don't have bones, but we can still traverse
    robot.traverse((child) => {
      if (child.isMesh) {
        // Ensure materials render properly
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    console.log('✅ Bunny robot ready for animation!');

    scene.add(robot);
    
    // Store reference for animation
    window.bunnyRobot = robot;
    
    // Load jump animation
    loadJumpAnimation();
    // Load dance animation
    loadDanceAnimation();
  },
  (xhr) => {
    const percent = (xhr.loaded / xhr.total * 100).toFixed(1);
    console.log(`📦 Loading bunny robot: ${percent}%`);
  },
  (error) => {
    console.error('❌ Failed to load bunny robot:', error);
  }
  );
},
(xhr) => {
  const percent = (xhr.loaded / xhr.total * 100).toFixed(1);
  console.log(`📦 Loading materials: ${percent}%`);
},
(error) => {
  console.error('❌ Failed to load materials:', error);
});

/* ===== Webcam as Scene Background ===== */
const video = document.createElement('video');
video.muted = true;
video.playsInline = true;
video.autoplay = false;
video.style.display = 'none'; // Hide the video element
document.body.appendChild(video);

navigator.mediaDevices.getUserMedia({ 
  video: { 
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: 'user',
    frameRate: { ideal: 30 }
  } 
})
  .then(stream => {
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.colorSpace = THREE.SRGBColorSpace;
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.needsUpdate = true;
      
      // Mirror the webcam
      videoTexture.repeat.x = -1;
      videoTexture.offset.x = 1;

      scene.background = videoTexture;
      console.log('📷 Webcam active');
      
      // Start hand tracking after webcam is ready
      initHandTracking();
    };
  })
  .catch(err => {
    console.error('Webcam error:', err);
  });

/* ===== Hand Tracking with MediaPipe ===== */
function initHandTracking() {
  const hands = new Hands({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });

  hands.onResults(onHandResults);

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 1280,
    height: 720
  });
  
  camera.start();
  console.log('👋 Hand tracking initialized');
}

function onHandResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const landmarks = results.multiHandLandmarks[0];
    
    // Get key landmarks
    const wrist = landmarks[0];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const thumb = landmarks[4];
    const pinky = landmarks[20];
    
    // Calculate hand position for exact movement (normalized)
    // Map to screen space coordinates for robot positioning
    handX = (wrist.x - 0.5) * 10; // Scale to scene coordinates
    handY = (0.5 - wrist.y) * 8; // Invert and scale Y axis
    handZ = wrist.z * 5; // Depth (for scale or forward/back movement)
    
    // Calculate distance between index and middle finger (pinch gesture)
    const dx = indexTip.x - middleTip.x;
    const dy = indexTip.y - middleTip.y;
    handDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Detect gesture types
    detectGesture(landmarks);
    
    isHandDetected = true;
  } else {
    isHandDetected = false;
  }
}

function detectGesture(landmarks) {
  const thumb = landmarks[4];
  const index = landmarks[8];
  const middle = landmarks[12];
  const ring = landmarks[16];
  const pinky = landmarks[20];
  const wrist = landmarks[0];
  const palmBase = landmarks[9];
  
  // More accurate finger extension detection
  const indexExtended = index.y < landmarks[6].y - 0.05;
  const middleExtended = middle.y < landmarks[10].y - 0.05;
  const ringExtended = ring.y < landmarks[14].y - 0.05;
  const pinkyExtended = pinky.y < landmarks[18].y - 0.05;
  const thumbExtended = Math.abs(thumb.x - palmBase.x) > 0.08;
  
  // Count extended fingers
  const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended, thumbExtended].filter(Boolean).length;
  
  // Peace sign (ONLY index and middle extended)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    gestureType = 'peace';
  }
  // Thumbs up (ONLY thumb extended, palm sideways)
  else if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    gestureType = 'thumbsup';
  }
  // Fist (NO fingers extended)
  else if (extendedCount === 0 || extendedCount === 1) {
    gestureType = 'fist';
  }
  // Open hand (all or most fingers extended)
  else if (extendedCount >= 4) {
    gestureType = 'open';
  }
  else {
    gestureType = 'neutral';
  }
}

/* ===== Load Jump Animation ===== */
function loadJumpAnimation() {
  const fbxLoader = new FBXLoader();
  
  fbxLoader.load(
    '/Standing Jump.fbx',
    (fbx) => {
      console.log('✅ Standing Jump animation loaded!');
      console.log('FBX animations:', fbx.animations);
      
      if (fbx.animations && fbx.animations.length > 0) {
        // Create animation mixer if not already exists
        if (!animationMixer && window.bunnyRobot) {
          animationMixer = new THREE.AnimationMixer(window.bunnyRobot);
          console.log('✅ Created new AnimationMixer for bunny robot');
        }
        
        // Store the jump animation
        const jumpClip = fbx.animations[0];
        if (animationMixer) {
          animations['standingJump'] = animationMixer.clipAction(jumpClip);
          animations['standingJump'].setLoop(THREE.LoopOnce);
          animations['standingJump'].clampWhenFinished = true;
          console.log('⬆️ Standing Jump ready! Duration:', jumpClip.duration, 'seconds');
          console.log('✅ Animation action created:', animations['standingJump']);
        } else {
          console.error('❌ AnimationMixer not available when creating jump action');
        }
      } else {
        console.error('❌ No animations found in Standing Jump.fbx');
      }
    },
    (xhr) => {
      const percent = (xhr.loaded / xhr.total * 100).toFixed(1);
      console.log(`📦 Loading jump: ${percent}%`);
    },
    (error) => {
      console.error('❌ Failed to load jump animation:', error);
    }
  );
}

/* ===== Load Dance Animation ===== */
function loadDanceAnimation() {
  const fbxLoader = new FBXLoader();
  
  fbxLoader.load(
    '/Hip Hop Dancing.fbx',
    (fbx) => {
      console.log('✅ Hip hop dance animation loaded!');
      
      if (fbx.animations && fbx.animations.length > 0) {
        // Create animation mixer if not already exists
        if (!animationMixer && window.bunnyRobot) {
          animationMixer = new THREE.AnimationMixer(window.bunnyRobot);
        }
        
        // Store the dance animation
        const danceClip = fbx.animations[0];
        animations['hipHopDance'] = animationMixer.clipAction(danceClip);
        animations['hipHopDance'].setLoop(THREE.LoopOnce);
        animations['hipHopDance'].clampWhenFinished = true;
        
        console.log('🕺 Hip hop dance ready! Duration:', danceClip.duration, 'seconds');
      }
    },
    (xhr) => {
      const percent = (xhr.loaded / xhr.total * 100).toFixed(1);
      console.log(`📦 Loading dance: ${percent}%`);
    },
    (error) => {
      console.error('❌ Failed to load dance animation:', error);
    }
  );
}

/* ===== Resize Handling ===== */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ===== Animate ===== */
const clock = new THREE.Clock();
let targetX = 0; // Centered
let targetY = -2; // Lower on screen
let targetZ = 0;
let targetRotationY = 0; // Face forward
let targetRotationX = 0;
let targetScale = 1;

function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = clock.getDelta();
  
  // Update animation mixer
  if (animationMixer) {
    animationMixer.update(deltaTime);
  }
  
  // Animate the robot if it exists
  if (window.bunnyRobot) {
    // Hand gesture control - EXACT POSITION TRACKING
    if (isHandDetected) {
      // Map hand position directly to robot position
      targetX = handX;
      targetY = handY;
      targetZ = handZ * 0.5; // Subtle depth movement
      
      // Rotation based on hand movement
      targetRotationY = -handX * 0.3; // Rotate based on X position
      targetRotationX = handY * 0.2; // Tilt based on Y position
      
      // Scale based on depth
      targetScale = window.bunnyRobot.userData.baseScale * (1 + handZ * 0.1);
      
      // Gesture detection - trigger actions after 3 second hold
      if (gestureType !== window.lastGestureType) {
        // New gesture started
        window.lastGestureType = gestureType;
        gestureHoldStart = Date.now();
        lastTriggeredGesture = 'none';
        console.log(`🤚 Gesture started: ${gestureType}`);
      } else if (gestureType !== 'none' && lastTriggeredGesture !== gestureType) {
        // Same gesture held - check if 3 seconds have passed
        const holdTime = Date.now() - gestureHoldStart;
        if (holdTime >= gestureHoldDuration) {
          // 3 seconds reached - trigger action
          switch(gestureType) {
            case 'peace':
              console.log('✌️ Peace gesture held 3 seconds - Dancing!');
              triggerDanceAnimation();
              break;
            case 'thumbsup':
              console.log('👍 Thumbs up held 3 seconds - Jumping!');
              triggerJumpAnimation();
              break;
            case 'fist':
              console.log('✊ Fist held 3 seconds - Spinning!');
              triggerSpinAnimation();
              break;
          }
          lastTriggeredGesture = gestureType; // Mark this gesture as triggered
        }
      }
    } else {
      // Return to default position when no hand detected
      targetX = 0; // Center
      targetY = -2; // Lower on screen
      targetZ = 0;
      targetRotationY = Math.sin(elapsedTime * 0.5) * 0.1; // Gentle rotation
      targetRotationX = 0;
      targetScale = window.bunnyRobot.userData.baseScale;
      playAnimation('idle');
      // Reset gesture tracking
      gestureType = 'none';
      gestureHoldStart = 0;
      lastTriggeredGesture = 'none';
    }
    
    // Smooth interpolation for all movements
    const smoothing = 0.15;
    window.bunnyRobot.position.x += (targetX - window.bunnyRobot.position.x) * smoothing;
    window.bunnyRobot.position.y += (targetY - window.bunnyRobot.position.y) * smoothing;
    window.bunnyRobot.position.z += (targetZ - window.bunnyRobot.position.z) * smoothing;
    
    window.bunnyRobot.rotation.y += (targetRotationY - window.bunnyRobot.rotation.y) * smoothing;
    window.bunnyRobot.rotation.x += (targetRotationX - window.bunnyRobot.rotation.x) * smoothing;
    
    const currentScale = window.bunnyRobot.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * smoothing;
    window.bunnyRobot.scale.setScalar(newScale);
    
    // Add subtle floating when in idle (REDUCED)
    if (!isHandDetected && !isWaving) {
      window.bunnyRobot.position.y += Math.sin(elapsedTime * 1.5) * 0.03; // Reduced from 0.1
      window.bunnyRobot.rotation.z = Math.sin(elapsedTime * 1) * 0.02; // Reduced from 0.05
    } else if (!isWaving) {
      window.bunnyRobot.rotation.z = 0;
    }
    
    // Wave animation
    if (isWaving) {
      const waveTime = elapsedTime - waveStartTime;
      if (waveTime < 2) { // 2 second wave
        // If we have arm bones, animate the arm
        if (armBones.rightUpperArm || armBones.leftUpperArm) {
          const waveAngle = Math.sin(waveTime * 8) * 0.8; // Wave motion
          
          // Animate right arm if available
          if (armBones.rightUpperArm) {
            armBones.rightUpperArm.rotation.z = -1.5 + waveAngle; // Raise and wave
            armBones.rightUpperArm.rotation.x = Math.sin(waveTime * 8) * 0.3;
          }
          if (armBones.rightLowerArm) {
            armBones.rightLowerArm.rotation.z = -0.5 + Math.sin(waveTime * 8) * 0.4;
          }
          if (armBones.rightHand) {
            armBones.rightHand.rotation.z = Math.sin(waveTime * 10) * 0.3;
          }
          
          // Slight body movement
          window.bunnyRobot.rotation.y = Math.sin(waveTime * 4) * 0.1;
        } else {
          // Fallback: whole body wave if no bones found
          window.bunnyRobot.rotation.z = Math.sin(waveTime * 8) * 0.4;
          window.bunnyRobot.rotation.x = Math.sin(waveTime * 8) * 0.2;
        }
      } else {
        isWaving = false;
        // Reset arm positions
        if (armBones.rightUpperArm) armBones.rightUpperArm.rotation.set(0, 0, 0);
        if (armBones.rightLowerArm) armBones.rightLowerArm.rotation.set(0, 0, 0);
        if (armBones.rightHand) armBones.rightHand.rotation.set(0, 0, 0);
        window.bunnyRobot.rotation.z = 0;
        window.bunnyRobot.rotation.x = 0;
      }
    }
  }
  
  renderer.render(scene, camera);
}
animate();

/* ===== Animation Triggers ===== */
function triggerWaveAnimation() {
  isWaving = true;
  waveStartTime = clock.getElapsedTime();
  console.log('👋 Waving!');
}

function triggerJumpAnimation() {
  if (!window.bunnyRobot) return;
  
  console.log('🔍 Attempting jump...');
  console.log('animations object:', animations);
  console.log('animations[standingJump]:', animations['standingJump']);
  console.log('animationMixer:', animationMixer);
  
  // If we have the standing jump animation, play it
  if (animations['standingJump']) {
    console.log('⬆️ Playing Standing Jump FBX animation!');
    
    try {
      // Stop any currently playing animation
      Object.keys(animations).forEach(key => {
        const action = animations[key];
        if (action && action.isRunning && action.isRunning()) {
          action.stop();
        }
      });
      
      // Play the standing jump
      animations['standingJump'].reset();
      animations['standingJump'].play();
      console.log('✅ Standing Jump animation started!');
    } catch(e) {
      console.error('❌ Error playing standing jump:', e);
      // Fall back to procedural
      performProceduralJump();
    }
    return;
  }
  
  console.log('⚠️ Standing Jump animation not loaded, using procedural jump');
  performProceduralJump();
}

function performProceduralJump() {
  if (!window.bunnyRobot) return;
  const startY = window.bunnyRobot.position.y;
  const jumpHeight = 3;
  const duration = 600;
  const startTime = Date.now();
  
  const jump = () => {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / duration;
    
    if (progress < 0.5) {
      // Jump up
      window.bunnyRobot.position.y = startY + (jumpHeight * progress * 2);
    } else if (progress < 1) {
      // Fall down
      window.bunnyRobot.position.y = startY + jumpHeight - (jumpHeight * (progress - 0.5) * 2);
    } else {
      window.bunnyRobot.position.y = startY;
      return;
    }
    requestAnimationFrame(jump);
  };
  jump();
  console.log('⬆️ Procedural jump started!');
}

function triggerSpinAnimation() {
  if (!window.bunnyRobot) return;
  const startRotation = window.bunnyRobot.rotation.y;
  const duration = 1000;
  const startTime = Date.now();
  
  const spin = () => {
    const elapsed = Date.now() - startTime;
    const progress = elapsed / duration;
    
    if (progress < 1) {
      window.bunnyRobot.rotation.y = startRotation + (Math.PI * 2 * progress);
      requestAnimationFrame(spin);
    } else {
      window.bunnyRobot.rotation.y = startRotation;
    }
  };
  spin();
  console.log('🌀 Spinning!');
}

function triggerDanceAnimation() {
  if (!window.bunnyRobot) return;
  
  console.log('🕺 Starting hip hop dance with limb animation!');
  
  const startTime = Date.now();
  const duration = 5000; // 5 second dance
  let isDancing = true;
  
  const dance = () => {
    if (!isDancing) return;
    
    const elapsed = Date.now() - startTime;
    const progress = elapsed / duration;
    const t = elapsed / 100; // Time scale for animations
    
    if (progress < 1) {
      // Body movements
      window.bunnyRobot.rotation.y = Math.sin(t * 0.5) * 0.6;
      window.bunnyRobot.rotation.z = Math.sin(t * 0.3) * 0.2;
      window.bunnyRobot.position.y = targetY + Math.abs(Math.sin(t * 0.8)) * 0.8;
      
      // Animate arms if bones exist
      if (armBones.rightUpperArm) {
        // Right arm hip hop moves
        armBones.rightUpperArm.rotation.z = -1.2 + Math.sin(t * 0.6) * 0.8;
        armBones.rightUpperArm.rotation.x = Math.sin(t * 0.4) * 0.6;
        
        if (armBones.rightLowerArm) {
          armBones.rightLowerArm.rotation.z = Math.sin(t * 0.8) * 1.0;
        }
        if (armBones.rightHand) {
          armBones.rightHand.rotation.z = Math.sin(t * 1.0) * 0.5;
        }
      }
      
      if (armBones.leftUpperArm) {
        // Left arm hip hop moves (opposite timing)
        armBones.leftUpperArm.rotation.z = 1.2 + Math.sin(t * 0.6 + Math.PI) * 0.8;
        armBones.leftUpperArm.rotation.x = Math.sin(t * 0.4 + Math.PI) * 0.6;
        
        if (armBones.leftLowerArm) {
          armBones.leftLowerArm.rotation.z = Math.sin(t * 0.8 + Math.PI) * 1.0;
        }
        if (armBones.leftHand) {
          armBones.leftHand.rotation.z = Math.sin(t * 1.0 + Math.PI) * 0.5;
        }
      }
      
      // Try to find and animate legs
      window.bunnyRobot.traverse((child) => {
        if (child.isBone) {
          const name = child.name.toLowerCase();
          // Animate leg bones if found
          if (name.includes('leg') || name.includes('thigh')) {
            if (name.includes('right')) {
              child.rotation.x = Math.sin(t * 0.7) * 0.5;
            } else if (name.includes('left')) {
              child.rotation.x = Math.sin(t * 0.7 + Math.PI) * 0.5;
            }
          }
        }
      });
      
      requestAnimationFrame(dance);
    } else {
      // Reset positions
      isDancing = false;
      window.bunnyRobot.rotation.z = 0;
      
      if (armBones.rightUpperArm) armBones.rightUpperArm.rotation.set(0, 0, 0);
      if (armBones.rightLowerArm) armBones.rightLowerArm.rotation.set(0, 0, 0);
      if (armBones.rightHand) armBones.rightHand.rotation.set(0, 0, 0);
      if (armBones.leftUpperArm) armBones.leftUpperArm.rotation.set(0, 0, 0);
      if (armBones.leftLowerArm) armBones.leftLowerArm.rotation.set(0, 0, 0);
      if (armBones.leftHand) armBones.leftHand.rotation.set(0, 0, 0);
      
      console.log('✅ Dance finished!');
    }
  };
  
  dance();
}

/* ===== Animation System ===== */
function playAnimation(name) {
  if (currentAnimation === name) return;
  currentAnimation = name;
  
  const robot = window.bunnyRobot;
  if (!robot) return;
  
  // Cancel any ongoing animations
  if (robot.userData.animationTimeout) {
    clearTimeout(robot.userData.animationTimeout);
  }
  
  const elapsedTime = clock.getElapsedTime();
  
  switch(name) {
    case 'wave':
      // Oscillating rotation for wave
      robot.userData.waveStart = elapsedTime;
      break;
    case 'jump':
      // Quick jump animation
      const jumpHeight = 2;
      const originalY = robot.position.y;
      robot.position.y += jumpHeight;
      robot.userData.animationTimeout = setTimeout(() => {
        // Land back
      }, 300);
      break;
    case 'spin':
      // Full 360 spin
      robot.rotation.y += Math.PI * 2;
      break;
    case 'peace':
      // Gentle sway
      robot.rotation.z = Math.sin(elapsedTime * 3) * 0.2;
      break;
    case 'follow':
      // Active following mode - more responsive
      break;
    case 'idle':
    default:
      // Gentle idle animation handled in main animate loop
      break;
  }
}

function handleVoiceCommand(command) {
  console.log('🎙️ Voice command received:', command);

  switch (command) {
    case 'hello':
      triggerWaveAnimation();
      break;

    case 'wave':
      triggerWaveAnimation();
      break;

    case 'jump':
      triggerJumpAnimation();
      break;

    case 'spin':
      triggerSpinAnimation();
      break;

    case 'dance':
      triggerDanceAnimation();
      break;

    default:
      console.log('🤷 Unknown command:', command);
  }
}
